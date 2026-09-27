# TransactionGuard

**Real-Time Transaction Risk Middleware for Fraud & Chargeback Defense**

> Razorpay AI Buildathon 2026 — AI Risk Manager Track

---

## Problem Statement

Fintech platforms process high volumes of transactions in real time. Existing fraud controls rely on static rule sets that are slow to adapt and easy to circumvent. **TransactionGuard** is a lightweight, explainable middleware that intercepts transaction data, scores it against a fraud/risk taxonomy, and makes a bounded, auditable decision: **ALLOW**, **REVIEW**, or **BLOCK**.

---

## Architecture

```
[Incoming Transaction]
        │
        ▼
[TransactionGuard Middleware]
  ├── 1. Feature Extractor
  │      (velocity, device/IP mismatch, amount anomaly, merchant risk tier)
  ├── 2. Risk Scorer
  │      (rule-based scorer + XGBoost hybrid)
  ├── 3. Threshold Evaluator
  │      (configurable per merchant category)
  │
  ├──► Score > threshold ──► [FLAG + Explain] ──► Review queue / soft block
  └──► Score ≤ threshold ──► [ALLOW] ──► Audit log (low-risk)
```

**Scoring formula:**

```
final_risk = 0.40 × rule_score + 0.60 × ml_probability
```

---

## Fraud Type Targeted

**Primary: Card-testing / velocity-abuse fraud**

Card-testing has well-documented behavioral signatures:
- Rapid sequential small-value transactions (< $10)
- Sequential or clustered card BINs from a single device
- High failure-then-success ratios
- Mismatched IP/billing geography
- Odd-hour bursts (1–5am UTC)
- New-device + high-value combos

---

## Files

| File | Purpose |
|---|---|
| `data_generator.py` | Synthetic labeled dataset (1,200 rows, ~20% fraud, 4 fraud types) |
| `risk_engine.py` | Feature extraction + 13-rule engine + XGBoost scorer |
| `decision_engine.py` | ALLOW/REVIEW/BLOCK thresholds + human-readable explanations |
| `evaluator.py` | Stratified 80/20 split, precision/recall/F1, confusion matrix, exception log |
| `app.py` | Streamlit demo — live scoring + batch analysis + audit log |
| `evidence_log.csv` | Decision audit trail (auto-generated) |
| `frontend/` | Next.js Risk Console landing page |

---

## Quick Start

### Python Risk Engine

```bash
# Install dependencies
pip install -r requirements.txt

# Generate data + train + evaluate
python evaluator.py

# Launch interactive demo
streamlit run app.py
```

### Frontend Risk Console

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## Results (held-out 20% test set)

| Metric | Target | Result |
|---|---|---|
| Precision | ≥ 75% | See `eval_results.json` |
| Recall | ≥ 85% | See `eval_results.json` |
| F1 Score | reported | See `eval_results.json` |
| False Positive Rate | ≤ 10% | See `eval_results.json` |
| Explainability coverage | 100% | Every decision has a reason |

> **Run `python evaluator.py` to generate the results table.**

---

## Features

### Rule Engine (13 deterministic rules)
- R01: Velocity abuse — >5 txn in 1h
- R02: High declines — >3 fails in 1h
- R03: Device fanout — >3 cards on device 7d
- R04: IP fanout — >4 accounts on IP 24h
- R05: Geo mismatch — billing ≠ IP country
- R06: High-risk IP country
- R07: VPN/proxy detected
- R08: New device + high value (>$500)
- R09: Card-testing pattern — amount < $10
- R10: Odd hour (1–5am) transaction
- R11: New account (<7 days)
- R12: Failed-then-success pattern
- R13: High merchant risk tier

### ML Model (XGBoost)
- 16 features including derived velocity score, amount z-score, geo mismatch flag
- `scale_pos_weight=4` to handle class imbalance
- Top contributing features returned per decision

### Explainability
Every flagged transaction returns:
- Human-readable reason summary
- List of triggered rules with descriptions
- Top ML feature contributions

---

## Known Limitations

| Issue | Description |
|---|---|
| Borderline fraud | Cards with slightly elevated velocity but legitimate intent may be flagged (false positives) |
| Synthetic data | Fraud patterns are simulated — real-world adversarial patterns may differ |
| Model recency | No online learning; model requires periodic retraining as fraud tactics evolve |
| Geo accuracy | IP → country resolution is approximate in production without a proper GeoIP database |

> Full exception log with all false positives/negatives: `exception_log.csv`

---

## Data Strategy

- **1,200 synthetic transactions** with controllable labeled fraud injection (~20%)
- **4 fraud types** injected: card-testing, high-value new-device, geo-mismatch, borderline
- **Borderline cases** intentionally included in the test set to avoid inflated metrics
- **80/20 stratified split** — exact seed for reproducibility

---

## Defense Constraint

This is a **defense-only** system per track rules. It detects and flags; it never executes retaliatory, deceptive, or offense-capable actions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Risk Engine | Python, XGBoost, scikit-learn |
| Demo UI | Streamlit |
| Frontend | Next.js + Tailwind CSS + GSAP + Three.js |
| Data | Pandas, Faker (synthetic) |
| Explainability | Custom rule attribution + XGBoost feature importance |
