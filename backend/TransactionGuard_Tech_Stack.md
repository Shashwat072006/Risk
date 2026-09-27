# Full Tech Stack: TransactionGuard

**Real-Time Transaction Risk Middleware — End-to-End Technology Reference**

Companion to: `TransactionGuard_PRD.md` + `real_time_transaction_risk_middleware_design.docx`

---

## 1. Visual / UI Direction

The design doc calls for a **modern fintech/security command-center aesthetic** — the reference point is the same visual language as [nexttechlab.in](https://nexttechlab.in/): bold oversized typography, high-contrast dark surfaces, minimal decoration, confident whitespace, and content that reads as engineered rather than decorated. Translated into this project's risk console:

| Design element | Direction |
|---|---|
| Background | Near-black / deep-navy base, not pure white dashboards |
| Typography | Large, bold display headings for section titles; tight, technical sans-serif for data |
| Accent color | One restrained accent (teal or green) + semantic red/amber/green for BLOCK/REVIEW/ALLOW |
| Motion | Minimal — subtle hover/transition states only, no decorative animation |
| Layout | Big confident hero-style section headers (like nexttechlab.in's stacked lab names), then dense, calm data tables underneath |
| Imagery | None/abstract — no stock photography; let typography and data carry the page |
| Overall tone | Technical, minimal, trustworthy — a security surface, not a marketing site |

This is a styling direction for the **Risk Console (frontend)** layer only — it does not affect backend architecture.

---

## 2. Architecture Layers at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend: Risk Console (nexttechlab.in-styled)              │
├─────────────────────────────────────────────────────────────┤
│  API Gateway → Risk Scoring API → Orchestrator               │
├─────────────────────────────────────────────────────────────┤
│  Feature Service │ Rules Engine │ ML Scoring Adapter          │
├─────────────────────────────────────────────────────────────┤
│  Redis (hot state) │ Postgres (policy/decisions) │ Model Reg. │
├─────────────────────────────────────────────────────────────┤
│  Decision Engine → Decision API (sync) + Event Bus (async)   │
├─────────────────────────────────────────────────────────────┤
│  Evidence Store │ Data Warehouse │ Observability Stack        │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Full Stack by Layer

### 3.1 Frontend — Risk Console

| Component | Choice | Notes |
|---|---|---|
| Framework | React (Vite) | Fast local dev, matches Streamlit-free production path |
| Styling | Tailwind CSS | Utility-first, easy to hit the nexttechlab.in-style dark/bold aesthetic quickly |
| Charts | Recharts or D3 | Risk timeline, decision distribution, volume charts |
| State | React Query + lightweight local state | Live decision feed polling/streaming |
| Component patterns | Metric cards, data-dense tables, right-side evidence drawer | Per design doc §13/§14 |
| Demo-only alt | Streamlit | Faster to ship for a 1-day buildathon demo if full React build is too slow |

### 3.2 API / Orchestration Layer

| Component | Choice | Alternative |
|---|---|---|
| API framework | Python FastAPI | Go (for stricter latency budgets) |
| Sync decision API | `POST /v1/risk/score` | REST, JSON, idempotency-key enforced |
| Async event emission | Event bus producer | Decouples decision response from analytics/evidence writes |
| Auth | Bearer token / service identity | Per-merchant scoping |

### 3.3 Risk Scoring Core

| Component | Choice | Alternative |
|---|---|---|
| Deterministic rules engine | Custom declarative rules service (Postgres-backed) | Drools / Open Policy Agent |
| ML model | XGBoost / LightGBM | ONNX Runtime for portable inference |
| Model objective | Rank transactions by fraud/chargeback likelihood (not final action) | — |
| Calibration | Score + model version + feature snapshot stored per decision | — |
| Decision logic | `final_risk = policy_weight(ML_score, rules_risk, merchant_profile)` → ALLOW / REVIEW / BLOCK | Hybrid stack per design doc §7 |

### 3.4 Data & State

| Component | Choice | Purpose |
|---|---|---|
| Hot state / velocity counters | Redis Cluster | Sub-10ms feature lookups (txn/minute, device fanout, IP velocity) |
| Operational metadata | Postgres | Transactions, decisions, policy versions (system of record) |
| Evidence archive | Object store (S3-compatible) | Rule hits, top features, feature versions — access-controlled |
| Event bus | Kafka (or managed equivalent: Pulsar / SQS+SNS) | At-least-once decision event delivery |
| Data warehouse | Cloud warehouse (BigQuery/Snowflake-class) | Outcome joins, model evaluation, analytics |
| For the buildathon build | Local Postgres/SQLite + in-memory dict as Redis stand-in | Enough to demonstrate the same architecture at small scale |

### 3.5 Feature & Signal Model

| Signal family | Example features | Storage |
|---|---|---|
| Identity | account age, email/phone age, password reset recency | Redis + profile DB |
| Payment | BIN/issuer country, card token age, retry count | Redis |
| Device | device age, device-to-account fanout, emulator/root signals | Redis |
| Network | IP reputation, ASN, proxy/VPN, geo distance | Redis + external intel adapter |
| Behavior | amount deviation, time-of-day deviation, SKU novelty | Feature store |
| Velocity | txn/minute, cards/device, accounts/IP, declines/hour | Redis counters |
| Outcome history | prior chargeback/dispute rate, confirmed fraud feedback | Warehouse/feature pipeline |

### 3.6 Observability

| Component | Choice |
|---|---|
| Metrics/tracing | OpenTelemetry + Prometheus + Grafana |
| Golden metrics | Request rate, p50/p95/p99 latency, error rate, decision mix, fallback rate |
| Risk-quality metrics | Fraud capture rate, false-positive proxy, chargeback rate, precision/recall by segment |
| Tracing | Propagate `transaction_id` and `decision_id` across every hop |

### 3.7 Security & Privacy

| Concern | Approach |
|---|---|
| Card data | No raw PAN/CVV storage — payment tokens / vault references only |
| Encryption | In transit and at rest; private networking + service identities |
| Access control | Least-privilege for evidence/operator tools; every override audited |
| Identifier privacy | Hash/tokenize stable identifiers for analytics |
| Abuse resistance | Rate-limit scoring API; verify timestamps/nonces; guard against feature poisoning |

### 3.8 Deployment & Infra

| Component | Choice | Alternative |
|---|---|---|
| Compute | Kubernetes or managed container platform | Serverless for low-throughput paths |
| Topology | Stateless sync scoring services, multi-AZ | — |
| CI/CD | GitHub Actions | — |
| Local dev (buildathon) | Docker Compose (API + Postgres + Redis) | Single-process demo if time-constrained |

### 3.9 Evaluation / ML Ops (buildathon-scoped)

| Component | Choice |
|---|---|
| Synthetic data generator | Python script, labeled fraud injection |
| Train/test split | 70–80/20–30, stratified by fraud label |
| Metrics reported | Precision, recall, F1, false-positive rate on held-out set |
| Explainability | Top contributing features/rule hits returned per decision |
| Failure logging | Documented exception list of false positives/negatives |

---

## 4. Buildathon-Scoped Minimal Stack (what to actually build in 1 day)

To keep this achievable on the compressed timeline, the full production stack above collapses to:

| Full-stack layer | 1-day equivalent |
|---|---|
| React + Tailwind console | Streamlit demo app (or minimal React if time allows) |
| FastAPI orchestration | Single FastAPI app, no separate services |
| Redis cluster | In-memory Python dict / SQLite |
| Kafka event bus | Skip — write decisions directly to a local log/CSV |
| Kubernetes | Skip — run locally |
| Data warehouse | Skip — pandas DataFrame + CSV export |
| Full observability stack | Simple structured logging + printed metrics summary |

This keeps the **architecture story identical** to the full production design (so the panel sees a legitimate systems-thinking approach) while making the actual deliverable buildable and demoable today.

---

## 5. File/Repo Structure

```
transactionguard/
├── README.md
├── PRD.md
├── TECH_STACK.md
├── requirements.txt
├── data_generator.py       # synthetic labeled transaction data
├── risk_engine.py          # feature extraction + rules + ML scorer
├── decision_engine.py      # policy thresholds → ALLOW/REVIEW/BLOCK
├── evaluator.py            # precision/recall/F1 on held-out set
├── app.py                  # Streamlit demo UI (nexttechlab.in-inspired dark theme)
└── evidence_log.csv        # decision audit trail output
```

---

## 6. Source References

- Uploaded design doc: `real_time_transaction_risk_middleware_design.docx`
- Visual reference: [nexttechlab.in](https://nexttechlab.in/) — SRM Next Tech Lab, student-led org spanning AI, blockchain, cybersecurity, software, cloud, and UI/UX
