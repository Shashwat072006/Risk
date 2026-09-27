# Product Requirements Document: TransactionGuard

**A Real-Time Transaction Risk Middleware for Fraud & Chargeback Defense**

Track: AI Risk Manager — Razorpay AI Buildathon 2026
Status: Draft v1.0
Owner: [Your Name]

---

## 1. Problem Statement

Fintech platforms process high volumes of transactions in real time, and existing fraud controls typically rely on static rule sets that are slow to adapt and easy to circumvent. Risk teams need a layer that can:

- Score every transaction for risk *before* it settles, not after a chargeback occurs
- Explain *why* a transaction was flagged, not just output a black-box score
- Prove its effectiveness with measurable accuracy, not a demo that only looks convincing

This project builds a lightweight, explainable middleware — **TransactionGuard** — that intercepts transaction data, scores it against a fraud/risk taxonomy, and makes a bounded, auditable decision: allow, flag for review, or block.

**Explicit scope constraint (per track rules):** This is a **defense-only** system. It detects and flags; it never executes retaliatory, deceptive, or offense-capable actions.

---

## 2. Goals

| Goal | Success Metric |
|---|---|
| Detect fraudulent transactions in real time | ≥ 85% recall on held-out synthetic test set |
| Minimize false positives (avoid blocking legit users) | ≤ 10% false positive rate |
| Full explainability | Every flagged transaction returns a human-readable reason and contributing feature list |
| Deterministic, reproducible evaluation | Precision/recall/F1 reported on a fixed, versioned held-out split |
| Honest failure reporting | Documented list of known false negatives/positives and why they occurred |

## 3. Non-Goals

- Not a general-purpose fraud platform for production deployment
- Not attempting to cover every fraud type (returns abuse, account takeover, etc.) — scoped to **one primary loss class** (see §5)
- Not using live/PII transaction data — synthetic data only
- Not a black-box deep learning model — prioritizing interpretability over marginal accuracy gains

---

## 4. Target Loss Class (pick one, lock scope early)

**Primary: Card-testing / velocity-abuse fraud**
*(Alternative if preferred: chargeback-prone transaction patterns — same architecture applies)*

Rationale: card-testing has well-documented behavioral signatures (rapid small-value transactions, sequential card numbers, high failure-then-success ratios) that are straightforward to simulate synthetically and score deterministically — ideal for a 1-day build with measurable ground truth.

---

## 5. User & Use Case

**Primary user:** A risk analyst / automated risk pipeline at a payments platform.

**Use case flow:**
1. A transaction event arrives (amount, merchant category, device fingerprint, IP geolocation, timestamp, velocity metadata).
2. TransactionGuard scores it against known fraud-pattern features.
3. If risk score exceeds threshold → transaction is flagged with a reason and contributing factors; routed to manual review or soft-blocked.
4. If below threshold → passed through, with a low-risk audit log entry.
5. All decisions are logged with full reasoning for auditability.

---

## 6. System Architecture

```
[Incoming Transaction]
        │
        ▼
[TransactionGuard Middleware]
  ├── 1. Feature Extractor
  │      (velocity, device/IP mismatch, amount anomaly, merchant risk tier)
  ├── 2. Risk Scorer
  │      (rule-based scorer + lightweight classifier, e.g. logistic regression / gradient boosting)
  ├── 3. Threshold Evaluator
  │      (configurable risk threshold, tunable per merchant category)
  │
  ├──► Score > threshold ──► [FLAG + Explain] ──► Review queue / soft block
  └──► Score ≤ threshold ──► [ALLOW] ──► Audit log (low-risk)
```

**Components to build:**
- `data_generator.py` — synthetic transaction dataset generator with controllable, labeled fraud injection rate
- `risk_engine.py` — feature extraction + scoring logic (rule-based + ML model)
- `evaluator.py` — train/test split, precision/recall/F1 computation, confusion matrix, exception log
- `app.py` (Streamlit or CLI) — demo interface showing a transaction being scored live with explanation output
- `README.md` — problem framing, architecture, results, and honest failure analysis

---

## 7. Data Strategy

Since no real transaction data is available or appropriate to use:

- Generate synthetic transactions with labeled ground truth (fraud / not fraud)
- Inject realistic fraud patterns: rapid sequential small-value charges, mismatched IP/billing geography, odd-hour bursts, new-device + high-value combos
- Target dataset size: 800–1,500 rows (enough for a meaningful held-out split, small enough to generate and iterate on quickly)
- 70/30 or 80/20 train/test split, stratified by fraud label

---

## 8. Success Metrics (what the panel will see)

| Metric | Target | Reported Where |
|---|---|---|
| Precision | ≥ 75% | README results table |
| Recall | ≥ 85% | README results table |
| F1 Score | reported | README results table |
| False Positive Rate | ≤ 10% | README results table |
| Explainability coverage | 100% of flagged transactions have a reason | Demo walkthrough |
| Exception log | Documented list of missed/incorrect cases | README "Known Limitations" section |

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Synthetic data too easy/unrealistic, inflating metrics | Include borderline/ambiguous cases in test set, not just obvious fraud |
| Overfitting to synthetic patterns | Keep model simple (rules + shallow classifier); avoid deep models that memorize synthetic noise |
| Scope creep (trying to cover multiple fraud types) | Hard lock to one loss class (§4) before writing code |
| Running out of time before polishing README | Write README skeleton first, fill in results last |

---

## 10. Deliverables (per Razorpay submission requirements)

1. Public GitHub repository
2. Architecture documentation (this PRD + README)
3. Working code: data generator, scorer, evaluator, demo
4. Precision/recall results on a held-out test set
5. 5-minute pitch covering: problem → approach → results → limitations

---

## 11. Timeline (compressed, 1-day build)

| Time block | Task |
|---|---|
| Hour 1 | Lock scope (fraud type), scaffold repo structure |
| Hour 2–3 | Build data generator with labeled fraud injection |
| Hour 4–5 | Build feature extraction + risk scorer |
| Hour 6 | Build evaluator, compute precision/recall on held-out set |
| Hour 7 | Build minimal demo (Streamlit or CLI) showing live scoring + explanation |
| Hour 8 | Write README, document limitations, prep 5-min pitch |

---

## 12. Open Questions

- Final choice of loss class: card-testing vs. chargeback pattern (recommend locking to card-testing for simplicity)
- Model choice: pure rule-based vs. rule-based + shallow ML hybrid (recommend hybrid for stronger metrics without sacrificing explainability)
