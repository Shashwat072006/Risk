"""
risk_engine.py — TransactionGuard
Feature extraction + rules-based scoring + ML scoring (hybrid approach).

Architecture:
  1. FeatureExtractor  → computes derived signals from raw transaction data
  2. RulesEngine       → deterministic rule hits (fast, explainable)
  3. MLScorer          → XGBoost trained on labeled data
  4. HybridScorer      → combines rule score + ML probability → final risk score [0-1]
"""

import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from dataclasses import dataclass, field
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler

# ── Feature names used by the ML model ────────────────────────────────────────
ML_FEATURES = [
    "amount_log",
    "merchant_risk_tier",
    "account_age_days",
    "device_age_days",
    "prior_declines_1h",
    "txn_count_1h",
    "txn_count_24h",
    "cards_on_device_7d",
    "accounts_on_ip_24h",
    "is_vpn_or_proxy",
    "failed_then_success",
    "is_new_device",
    "hour_of_day",
    "geo_mismatch",          # derived
    "amount_zscore",         # derived
    "velocity_score",        # derived
]

HIGH_RISK_COUNTRIES = {"NG", "PK", "BD", "RU", "CN"}

# ── Rule definitions ───────────────────────────────────────────────────────────

@dataclass
class RuleHit:
    rule_id: str
    description: str
    weight: float            # contribution to rule_risk_score [0-1]
    triggered: bool = False


RULE_CATALOG = [
    ("R01", "Velocity abuse: >5 txn in 1h",         0.35),
    ("R02", "High declines: >3 fails in 1h",         0.30),
    ("R03", "Device fanout: >3 cards on device 7d",  0.25),
    ("R04", "IP fanout: >4 accounts on IP 24h",      0.25),
    ("R05", "Geo mismatch: billing ≠ IP country",    0.20),
    ("R06", "High-risk IP country",                  0.20),
    ("R07", "VPN/proxy detected",                    0.15),
    ("R08", "New device + high value (>$500)",       0.30),
    ("R09", "Card-testing pattern: amount < $10",    0.20),
    ("R10", "Odd hour (1–5am) transaction",          0.10),
    ("R11", "New account (<7 days)",                 0.15),
    ("R12", "Failed-then-success pattern",           0.20),
    ("R13", "High merchant risk tier (3)",           0.10),
]


# ── Feature Extractor ──────────────────────────────────────────────────────────

class FeatureExtractor:
    """Derives additional signals from raw transaction fields."""

    def __init__(self, amount_mean: float = None, amount_std: float = None):
        self.amount_mean = amount_mean
        self.amount_std = amount_std

    def fit(self, df: pd.DataFrame) -> "FeatureExtractor":
        legit = df[df["is_fraud"] == 0]["amount"]
        self.amount_mean = legit.mean()
        self.amount_std = legit.std()
        return self

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        out = df.copy()
        out["amount_log"] = np.log1p(out["amount"])
        out["geo_mismatch"] = (out["billing_country"] != out["ip_country"]).astype(int)
        mean = self.amount_mean or df["amount"].mean()
        std = self.amount_std or df["amount"].std()
        out["amount_zscore"] = (out["amount"] - mean) / (std + 1e-6)
        out["velocity_score"] = (
            out["txn_count_1h"] * 0.5
            + out["prior_declines_1h"] * 0.3
            + out["cards_on_device_7d"] * 0.2
        )
        out["high_risk_country"] = out["ip_country"].isin(HIGH_RISK_COUNTRIES).astype(int)
        return out

    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        return self.fit(df).transform(df)


# ── Rules Engine ───────────────────────────────────────────────────────────────

class RulesEngine:
    """Evaluates deterministic rules and returns a list of hits + aggregate score."""

    def evaluate(self, row: dict) -> tuple[list[RuleHit], float]:
        hits = []

        checks = [
            ("R01", row.get("txn_count_1h", 0) > 5),
            ("R02", row.get("prior_declines_1h", 0) > 3),
            ("R03", row.get("cards_on_device_7d", 0) > 3),
            ("R04", row.get("accounts_on_ip_24h", 0) > 4),
            ("R05", row.get("billing_country", "") != row.get("ip_country", "")),
            ("R06", row.get("ip_country", "") in HIGH_RISK_COUNTRIES),
            ("R07", bool(row.get("is_vpn_or_proxy", 0))),
            ("R08", bool(row.get("is_new_device", 0)) and row.get("amount", 0) > 500),
            ("R09", row.get("amount", 0) < 10),
            ("R10", row.get("hour_of_day", 12) in {0, 1, 2, 3, 4, 23}),
            ("R11", row.get("account_age_days", 999) < 7),
            ("R12", bool(row.get("failed_then_success", 0))),
            ("R13", row.get("merchant_risk_tier", 1) >= 3),
        ]

        rule_map = {r[0]: r for r in RULE_CATALOG}
        for rule_id, triggered in checks:
            rid, desc, weight = rule_map[rule_id]
            hits.append(RuleHit(rule_id=rid, description=desc, weight=weight, triggered=triggered))

        triggered_weight = sum(h.weight for h in hits if h.triggered)
        max_weight = sum(h.weight for h in hits)
        rule_score = min(triggered_weight / max_weight, 1.0) if max_weight > 0 else 0.0

        return hits, rule_score

    def evaluate_batch(self, df: pd.DataFrame) -> tuple[list[list[RuleHit]], np.ndarray]:
        all_hits, all_scores = [], []
        for _, row in df.iterrows():
            hits, score = self.evaluate(row.to_dict())
            all_hits.append(hits)
            all_scores.append(score)
        return all_hits, np.array(all_scores)


# ── ML Scorer ─────────────────────────────────────────────────────────────────

class MLScorer:
    """XGBoost classifier trained on extracted features."""

    def __init__(self):
        self.model = XGBClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            scale_pos_weight=4,    # account for class imbalance (~20% fraud)
            use_label_encoder=False,
            eval_metric="logloss",
            random_state=42,
        )
        self.scaler = StandardScaler()
        self.feature_importances_ = None

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "MLScorer":
        X_scaled = self.scaler.fit_transform(X[ML_FEATURES])
        self.model.fit(X_scaled, y)
        self.feature_importances_ = dict(zip(ML_FEATURES, self.model.feature_importances_))
        return self

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X[ML_FEATURES])
        return self.model.predict_proba(X_scaled)[:, 1]

    def top_features(self, row: pd.DataFrame, n: int = 5) -> list[tuple[str, float]]:
        """Return top contributing features for a single row (simple importance × value)."""
        if self.feature_importances_ is None:
            return []
        contributions = {}
        for feat in ML_FEATURES:
            val = row[feat].values[0] if hasattr(row[feat], 'values') else row[feat]
            imp = self.feature_importances_.get(feat, 0)
            contributions[feat] = float(imp * abs(val))
        return sorted(contributions.items(), key=lambda x: x[1], reverse=True)[:n]

    def save(self, path: str = "ml_scorer.joblib"):
        joblib.dump({"model": self.model, "scaler": self.scaler,
                     "importances": self.feature_importances_}, path)

    @classmethod
    def load(cls, path: str = "ml_scorer.joblib") -> "MLScorer":
        obj = cls()
        data = joblib.load(path)
        obj.model = data["model"]
        obj.scaler = data["scaler"]
        obj.feature_importances_ = data["importances"]
        return obj


# ── Hybrid Scorer ──────────────────────────────────────────────────────────────

class HybridScorer:
    """
    Combines rule-based risk and ML probability into a final risk score.

    final_risk = rule_weight * rule_score + ml_weight * ml_prob
    """

    def __init__(self, rule_weight: float = 0.40, ml_weight: float = 0.60):
        self.rule_weight = rule_weight
        self.ml_weight = ml_weight
        self.extractor = FeatureExtractor()
        self.rules_engine = RulesEngine()
        self.ml_scorer = MLScorer()
        self._trained = False

    def fit(self, df: pd.DataFrame) -> "HybridScorer":
        df_feat = self.extractor.fit_transform(df)
        self.ml_scorer.fit(df_feat, df_feat["is_fraud"])
        self._trained = True
        return self

    def score_batch(self, df: pd.DataFrame) -> pd.DataFrame:
        df_feat = self.extractor.transform(df)
        _, rule_scores = self.rules_engine.evaluate_batch(df_feat)
        ml_probs = self.ml_scorer.predict_proba(df_feat)
        df_feat = df_feat.copy()
        df_feat["rule_score"] = rule_scores
        df_feat["ml_prob"] = ml_probs
        df_feat["risk_score"] = (
            self.rule_weight * rule_scores + self.ml_weight * ml_probs
        )
        return df_feat

    def score_single(self, txn: dict) -> dict:
        """Score one transaction dict and return enriched result."""
        df = pd.DataFrame([txn])
        df_feat = self.extractor.transform(df)
        rule_hits, rule_score = self.rules_engine.evaluate(txn)
        ml_prob = float(self.ml_scorer.predict_proba(df_feat)[0])
        risk_score = self.rule_weight * rule_score + self.ml_weight * ml_prob

        triggered_rules = [h for h in rule_hits if h.triggered]
        top_ml_feats = self.ml_scorer.top_features(df_feat, n=5)

        return {
            "risk_score": round(risk_score, 4),
            "rule_score": round(rule_score, 4),
            "ml_prob": round(ml_prob, 4),
            "triggered_rules": triggered_rules,
            "top_features": top_ml_feats,
        }

    def save(self, path: str = "hybrid_scorer.joblib"):
        joblib.dump({
            "extractor": self.extractor,
            "ml_scorer": self.ml_scorer,
            "rule_weight": self.rule_weight,
            "ml_weight": self.ml_weight,
        }, path)
        print(f"[OK] Model saved -> {path}")

    @classmethod
    def load(cls, path: str = "hybrid_scorer.joblib") -> "HybridScorer":
        obj = cls()
        data = joblib.load(path)
        obj.extractor = data["extractor"]
        obj.ml_scorer = data["ml_scorer"]
        obj.rule_weight = data["rule_weight"]
        obj.ml_weight = data["ml_weight"]
        obj._trained = True
        return obj


# ── Train entry point ──────────────────────────────────────────────────────────

def train(csv_path: str = "transactions.csv",
          model_path: str = "hybrid_scorer.joblib") -> HybridScorer:
    print(f"Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)
    scorer = HybridScorer()
    scorer.fit(df)
    scorer.save(model_path)
    return scorer


if __name__ == "__main__":
    from data_generator import generate_dataset
    df = generate_dataset()
    scorer = train()
    print("[OK] Risk engine trained and saved.")
