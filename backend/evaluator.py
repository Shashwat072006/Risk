"""
evaluator.py — TransactionGuard
Train/test split, precision/recall/F1 computation, confusion matrix,
exception log (documented false positives/negatives).

Usage:
    python evaluator.py
"""

import json
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics import (
    precision_score, recall_score, f1_score,
    confusion_matrix, classification_report,
    roc_auc_score, average_precision_score,
)
from data_generator import generate_dataset
from risk_engine import HybridScorer, FeatureExtractor, ML_FEATURES


# ── Evaluation runner ──────────────────────────────────────────────────────────

def run_evaluation(csv_path: str = "transactions.csv",
                   model_save_path: str = "hybrid_scorer.joblib",
                   test_size: float = 0.20,
                   decision_threshold: float = 0.50) -> dict:
    """
    Full train/eval pipeline:
      1. Generate data if not present
      2. Stratified 80/20 split
      3. Train HybridScorer on train set
      4. Score test set → binary predictions at threshold
      5. Compute and print metrics
      6. Save exception log
    """

    # ── 1. Data ────────────────────────────────────────────────────────────────
    if not Path(csv_path).exists():
        print("Generating synthetic dataset...")
        generate_dataset(save_path=csv_path)

    df = pd.read_csv(csv_path)
    print(f"Dataset: {len(df)} rows, {df['is_fraud'].sum()} fraud ({df['is_fraud'].mean():.1%})")

    # ── 2. Split ───────────────────────────────────────────────────────────────
    train_df, test_df = train_test_split(
        df, test_size=test_size, stratify=df["is_fraud"], random_state=42
    )
    print(f"Train: {len(train_df)}  |  Test: {len(test_df)}")

    # ── 3. Train ───────────────────────────────────────────────────────────────
    scorer = HybridScorer()
    scorer.fit(train_df)
    scorer.save(model_save_path)

    # ── 4. Score test set ──────────────────────────────────────────────────────
    scored = scorer.score_batch(test_df)
    y_true = scored["is_fraud"].values
    y_prob = scored["risk_score"].values
    y_pred = (y_prob >= decision_threshold).astype(int)

    # ── 5. Metrics ─────────────────────────────────────────────────────────────
    precision = precision_score(y_true, y_pred, zero_division=0)
    recall    = recall_score(y_true, y_pred, zero_division=0)
    f1        = f1_score(y_true, y_pred, zero_division=0)
    roc_auc   = roc_auc_score(y_true, y_prob)
    pr_auc    = average_precision_score(y_true, y_prob)

    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0   # false positive rate

    results = {
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "pr_auc": round(pr_auc, 4),
        "false_positive_rate": round(fpr, 4),
        "true_positives": int(tp),
        "true_negatives": int(tn),
        "false_positives": int(fp),
        "false_negatives": int(fn),
        "decision_threshold": decision_threshold,
        "test_size": len(test_df),
    }

    _print_results(results)

    # ── 6. Exception log ───────────────────────────────────────────────────────
    fp_cases = scored[(y_pred == 1) & (y_true == 0)].copy()
    fn_cases = scored[(y_pred == 0) & (y_true == 1)].copy()
    _save_exception_log(fp_cases, fn_cases)

    # ── 7. Per-fraud-type breakdown ────────────────────────────────────────────
    if "fraud_type" in scored.columns:
        _print_fraud_type_breakdown(scored, y_pred, y_true)

    # ── 8. Save results ────────────────────────────────────────────────────────
    with open("eval_results.json", "w") as f:
        json.dump(results, f, indent=2)
    print("\n[OK] Results saved -> eval_results.json")
    print("[OK] Exception log saved -> exception_log.csv")

    return results


def _print_results(r: dict):
    print("\n" + "=" * 55)
    print("  TRANSACTIONGUARD - EVALUATION RESULTS")
    print("=" * 55)
    print(f"  Precision          : {r['precision']:.2%}")
    print(f"  Recall             : {r['recall']:.2%}")
    print(f"  F1 Score           : {r['f1']:.2%}")
    print(f"  ROC-AUC            : {r['roc_auc']:.4f}")
    print(f"  PR-AUC             : {r['pr_auc']:.4f}")
    print(f"  False Positive Rate: {r['false_positive_rate']:.2%}")
    print("-" * 55)
    print(f"  TP: {r['true_positives']}  TN: {r['true_negatives']}  "
          f"FP: {r['false_positives']}  FN: {r['false_negatives']}")
    print("=" * 55)

    # Goal check
    goals = {
        "Precision >= 75%":  r["precision"] >= 0.75,
        "Recall >= 85%":     r["recall"] >= 0.85,
        "FPR <= 10%":        r["false_positive_rate"] <= 0.10,
    }
    print("\n  Goal Check:")
    for goal, met in goals.items():
        mark = "[PASS]" if met else "[FAIL]"
        print(f"  {mark}  {goal}")
    print()


def _save_exception_log(fp_cases: pd.DataFrame, fn_cases: pd.DataFrame):
    """Document all misclassified transactions for the README Known Limitations."""
    cols = ["transaction_id", "amount", "merchant_category", "fraud_type",
            "risk_score", "rule_score", "ml_prob"]

    available_cols_fp = [c for c in cols if c in fp_cases.columns]
    available_cols_fn = [c for c in cols if c in fn_cases.columns]

    fp_out = fp_cases[available_cols_fp].copy() if not fp_cases.empty else pd.DataFrame()
    fn_out = fn_cases[available_cols_fn].copy() if not fn_cases.empty else pd.DataFrame()

    fp_out["error_type"] = "FALSE_POSITIVE"
    fn_out["error_type"] = "FALSE_NEGATIVE"

    exception_log = pd.concat([fp_out, fn_out], ignore_index=True)
    exception_log.to_csv("exception_log.csv", index=False)

    print(f"\nException log: {len(fp_out)} false positives, {len(fn_out)} false negatives")

    # Analysis of false negatives by fraud type
    if "fraud_type" in fn_out.columns and not fn_out.empty:
        print("\nFalse negatives by fraud type:")
        print(fn_out["fraud_type"].value_counts().to_string())


def _print_fraud_type_breakdown(scored: pd.DataFrame, y_pred: np.ndarray, y_true: np.ndarray):
    scored = scored.copy()
    scored["_pred"] = y_pred
    scored["_true"] = y_true
    fraud_only = scored[scored["_true"] == 1]
    print("\n  Detection Rate by Fraud Type:")
    print("  " + "-" * 45)
    for ft, group in fraud_only.groupby("fraud_type"):
        detected = group["_pred"].sum()
        total = len(group)
        rate = detected / total if total > 0 else 0.0
        bar = "#" * int(rate * 20) + "-" * (20 - int(rate * 20))
        print(f"  {ft:<25} [{bar}] {rate:.1%} ({detected}/{total})")
    print()


# ── Cross-validation (optional, for deeper confidence) ─────────────────────────

def cross_validate(csv_path: str = "transactions.csv", n_splits: int = 5) -> dict:
    df = pd.read_csv(csv_path)
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
    X = df.drop(columns=["is_fraud", "fraud_type", "transaction_id", "timestamp",
                          "account_id", "device_id", "currency"], errors="ignore")
    y = df["is_fraud"]

    fold_metrics = []
    for fold, (train_idx, test_idx) in enumerate(skf.split(df, y)):
        train_df = df.iloc[train_idx]
        test_df = df.iloc[test_idx]
        scorer = HybridScorer()
        scorer.fit(train_df)
        scored = scorer.score_batch(test_df)
        y_true = scored["is_fraud"].values
        y_pred = (scored["risk_score"].values >= 0.50).astype(int)
        fold_metrics.append({
            "fold": fold + 1,
            "precision": precision_score(y_true, y_pred, zero_division=0),
            "recall":    recall_score(y_true, y_pred, zero_division=0),
            "f1":        f1_score(y_true, y_pred, zero_division=0),
        })
        print(f"  Fold {fold+1}: P={fold_metrics[-1]['precision']:.2%}  "
              f"R={fold_metrics[-1]['recall']:.2%}  F1={fold_metrics[-1]['f1']:.2%}")

    avg = {
        k: round(float(np.mean([m[k] for m in fold_metrics])), 4)
        for k in ["precision", "recall", "f1"]
    }
    print(f"\n  CV Average: P={avg['precision']:.2%}  R={avg['recall']:.2%}  F1={avg['f1']:.2%}")
    return avg


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    results = run_evaluation()
