"""
decision_engine.py — TransactionGuard
Policy thresholds → ALLOW / REVIEW / BLOCK decisions with full explanations.
All decisions are logged to evidence_log.csv for auditability.
"""

import csv
import json
import uuid
from datetime import datetime
from dataclasses import dataclass, asdict
from pathlib import Path
from risk_engine import HybridScorer, RuleHit

# ── Thresholds (tunable per merchant category) ─────────────────────────────────
DEFAULT_THRESHOLDS = {
    "allow_below":  0.35,   # score < 0.35  → ALLOW
    "block_above":  0.70,   # score > 0.70  → BLOCK
    # between 0.35–0.70     → REVIEW
}

MERCHANT_THRESHOLD_OVERRIDES = {
    # Higher-risk categories get tighter thresholds
    "gaming":       {"allow_below": 0.30, "block_above": 0.60},
    "electronics":  {"allow_below": 0.30, "block_above": 0.65},
    "travel":       {"allow_below": 0.32, "block_above": 0.65},
}

DECISION_COLORS = {
    "ALLOW":  "green",
    "REVIEW": "amber",
    "BLOCK":  "red",
}


# ── Decision dataclass ─────────────────────────────────────────────────────────

@dataclass
class Decision:
    decision_id: str
    transaction_id: str
    timestamp: str
    decision: str                 # ALLOW | REVIEW | BLOCK
    risk_score: float
    rule_score: float
    ml_prob: float
    triggered_rules: list[str]   # rule descriptions that fired
    top_features: list[str]      # "feature=value" strings
    reason_summary: str          # human-readable explanation
    merchant_category: str
    amount: float

    def to_dict(self) -> dict:
        return asdict(self)


# ── Decision Engine ────────────────────────────────────────────────────────────

class DecisionEngine:
    def __init__(self,
                 scorer: HybridScorer,
                 log_path: str = "evidence_log.csv",
                 thresholds: dict = None):
        self.scorer = scorer
        self.log_path = log_path
        self.thresholds = thresholds or DEFAULT_THRESHOLDS
        self._ensure_log()

    def _ensure_log(self):
        path = Path(self.log_path)
        if not path.exists():
            with open(path, "w", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=[
                    "decision_id", "transaction_id", "timestamp",
                    "decision", "risk_score", "rule_score", "ml_prob",
                    "triggered_rules", "top_features", "reason_summary",
                    "merchant_category", "amount",
                ])
                writer.writeheader()

    def _get_thresholds(self, merchant_category: str) -> dict:
        return MERCHANT_THRESHOLD_OVERRIDES.get(merchant_category, self.thresholds)

    def _make_decision(self, risk_score: float, merchant_category: str) -> str:
        t = self._get_thresholds(merchant_category)
        if risk_score < t["allow_below"]:
            return "ALLOW"
        elif risk_score > t["block_above"]:
            return "BLOCK"
        return "REVIEW"

    def _build_reason(self, decision: str, risk_score: float,
                      triggered_rules: list[RuleHit],
                      top_features: list[tuple[str, float]]) -> str:
        if decision == "ALLOW":
            return f"Risk score {risk_score:.2f} is below threshold. No critical signals detected."

        rule_descs = [r.description for r in triggered_rules]
        feat_strs = [f"{f} ({v:.2f})" for f, v in top_features[:3]]

        if decision == "BLOCK":
            lines = [f"HIGH RISK — score {risk_score:.2f} exceeds block threshold."]
        else:
            lines = [f"ELEVATED RISK — score {risk_score:.2f} requires manual review."]

        if rule_descs:
            lines.append(f"Rules triggered: {'; '.join(rule_descs[:4])}")
        if feat_strs:
            lines.append(f"Top ML signals: {', '.join(feat_strs)}")

        return " | ".join(lines)

    def decide(self, txn: dict) -> Decision:
        """Score a single transaction and return a Decision."""
        result = self.scorer.score_single(txn)
        risk_score = result["risk_score"]
        decision_label = self._make_decision(risk_score, txn.get("merchant_category", ""))

        triggered_rules = result["triggered_rules"]
        top_features = result["top_features"]

        reason = self._build_reason(
            decision_label, risk_score, triggered_rules, top_features
        )

        d = Decision(
            decision_id=str(uuid.uuid4()),
            transaction_id=txn.get("transaction_id", str(uuid.uuid4())),
            timestamp=datetime.utcnow().isoformat(),
            decision=decision_label,
            risk_score=risk_score,
            rule_score=result["rule_score"],
            ml_prob=result["ml_prob"],
            triggered_rules=[r.description for r in triggered_rules],
            top_features=[f"{f}={v:.3f}" for f, v in top_features],
            reason_summary=reason,
            merchant_category=txn.get("merchant_category", ""),
            amount=txn.get("amount", 0.0),
        )

        self._log(d)
        return d

    def decide_batch(self, df, return_df: bool = True):
        """Score a DataFrame and append ALLOW/REVIEW/BLOCK columns."""
        import pandas as pd
        scored = self.scorer.score_batch(df)
        decisions = []
        for _, row in scored.iterrows():
            d = self._make_decision(row["risk_score"], row.get("merchant_category", ""))
            decisions.append(d)
        scored["decision"] = decisions
        return scored

    def _log(self, d: Decision):
        with open(self.log_path, "a", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=list(d.to_dict().keys()))
            row = d.to_dict()
            row["triggered_rules"] = json.dumps(row["triggered_rules"])
            row["top_features"] = json.dumps(row["top_features"])
            writer.writerow(row)


# ── Factory helper ─────────────────────────────────────────────────────────────

def load_engine(model_path: str = "hybrid_scorer.joblib",
                log_path: str = "evidence_log.csv") -> DecisionEngine:
    scorer = HybridScorer.load(model_path)
    return DecisionEngine(scorer=scorer, log_path=log_path)


# ── Demo ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    engine = load_engine()

    sample_fraud = {
        "transaction_id": "demo-fraud-001",
        "amount": 4.99,
        "merchant_category": "gaming",
        "merchant_risk_tier": 3,
        "billing_country": "US",
        "ip_country": "NG",
        "account_age_days": 1,
        "device_age_days": 0,
        "prior_declines_1h": 7,
        "txn_count_1h": 9,
        "txn_count_24h": 12,
        "cards_on_device_7d": 5,
        "accounts_on_ip_24h": 8,
        "is_vpn_or_proxy": 1,
        "failed_then_success": 1,
        "is_new_device": 1,
        "hour_of_day": 3,
    }

    d = engine.decide(sample_fraud)
    print(f"\n{'='*60}")
    print(f"Decision: {d.decision}  (risk_score={d.risk_score:.3f})")
    print(f"Reason:   {d.reason_summary}")
    print(f"{'='*60}\n")
