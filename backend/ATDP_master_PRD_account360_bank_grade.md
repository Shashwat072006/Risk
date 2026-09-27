# ATDP — Adaptive Financial Crime & Transaction Defense Platform
## Master PRD — Bank-Grade Account Intelligence + Real-Time Risk

**Version:** 3.0  
**Purpose:** Convert the existing fraud-risk prototype into a coherent bank-oriented financial-risk operating platform.

---

## 1. Product Definition

ATDP is a real-time financial-risk platform that combines **consented account information, passbook/transaction history, cash-flow intelligence, behavioral baselines, entity graphs, ML risk models, deterministic rules, coordinated-fraud detection, adaptive intervention, investigations, cases, audit, model governance, and simulation**.

The product should answer:

> What happened in this account, what is unusual, what is connected, what is the financial risk, and what should the institution do next?

It is not merely a fraud classifier.

```text
BANK / CONSENTED DATA / PAYMENT EVENTS
                    ↓
              ACCOUNT 360
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    PASSBOOK    CASH FLOW    ENTITY GRAPH
        └───────────┼───────────┘
                    ↓
             FEATURE ENGINE
                    ↓
      ┌─────────────┼─────────────┐
      ↓             ↓             ↓
    RULES        ML MODELS      ANOMALY
      │             │             │
      └─────────────┼─────────────┘
                    ↓
             CAMPAIGN ENGINE
                    ↓
           DECISION OPTIMIZER
                    ↓
      APPROVE / STEP-UP / REVIEW / BLOCK
                    ↓
        INVESTIGATION / CASE / AUDIT
                    ↓
              OUTCOME FEEDBACK
```

---

# 2. Existing Product to Preserve

Current application modules:

```text
/                       Frontend
/risk-console           Real-time evaluation
/command-center         Executive + system telemetry
/investigate            Deep investigation
/attack-lab             Attack simulations
/campaigns              Coordinated cluster detection
/cases                  Case management
:8000                   FastAPI + HybridScorer
```

These modules must become one connected product rather than independent demos.

---

# 3. Product Users

### Fraud Analyst
Investigates suspicious transactions and accounts.

### Fraud Investigator
Follows relationships, timelines, evidence, and campaigns.

### Fraud Manager
Monitors exposure, fraud losses, campaigns, queues, and policy effectiveness.

### Model Risk / ML Team
Manages models, drift, replay, challengers, and evaluation.

### Compliance / Audit
Reviews decisions, data provenance, consent, access, and configuration changes.

### Executive
Monitors prevented loss, fraud capture, customer friction, active threats, and availability.

---

# 4. Final Navigation

```text
COMMAND CENTER

ACCOUNT 360
  ├── Overview
  ├── Passbook
  ├── Cash Flow
  ├── Cards
  ├── Beneficiaries
  ├── Devices
  ├── Risk
  ├── Network
  ├── Cases
  └── Consent

TRANSACTIONS
CAMPAIGNS
ENTITY GRAPH
INVESTIGATIONS
CASES

ATTACK LAB
RULES
MODELS
POLICY SIMULATOR
REPLAY

MONITORING
EVIDENCE
AUDIT
REPORTS
SETTINGS
```

---

# 5. Account 360

## Goal

Give an authorized analyst a complete customer/account context.

### Header

```text
ACCOUNT 360

Customer: Rahul Sharma
Account: ••••4821
Status: ACTIVE
Account age: 6Y 4M
Segment: PREMIUM
Risk tier: MEDIUM

Available: ₹1,84,240
Current:   ₹2,14,820
```

### Account tabs

```text
OVERVIEW | PASSBOOK | CASH FLOW | CARDS |
BENEFICIARIES | DEVICES | RISK | NETWORK |
CASES | AUDIT | CONSENT
```

### Overview contents

- Customer profile
- Account status
- Account age
- KYC status where available through approved integration
- Linked cards
- Devices
- Beneficiaries
- Known locations
- Open cases
- Alerts
- Current risk signals

---

# 6. Customer Risk Profile

Never use one opaque “customer score.”

Show independent dimensions:

```text
Fraud Risk              28
ATO Risk                12
APP Risk                19
Chargeback Risk         19
Mule / Pass-through     63
Behavior Anomaly        71
Campaign Exposure       42
Device Risk             35
Network Risk            42
```

These are risk signals, not proof of criminal behavior.

---

# 7. Passbook / Bank Statement Experience

The product should include a **bank-style transaction/passbook view**, but it should do more than display rows.

```text
05 SEP 2026

14:42
-₹84,000
INSTANT TRANSFER
NEW BENEFICIARY
RISK 84 ⚠

11:20
-₹2,450
GROCERY
NORMAL

04 SEP 2026

18:22
+₹1,48,000
SALARY
NORMAL
```

Every transaction should be clickable.

```text
PASSBOOK
   ↓
TRANSACTION
   ↓
RISK
   ↓
ENTITY GRAPH
   ↓
CAMPAIGN
   ↓
CASE
   ↓
AUDIT
```

### Filters

- Date
- Amount
- Credit/debit
- Channel
- Merchant
- Beneficiary
- Location
- Transaction type
- Risk level
- Status

---

# 8. Transaction Detail

Display:

```text
TX-92831

Amount: ₹84,000
Rail: Instant Payment
Channel: Mobile

Fraud Risk        82
ATO Risk          67
APP Risk          74
Chargeback Risk    8
Novelty Risk      92
Campaign Risk     88

Decision:
STEP-UP AUTHENTICATION
```

### Reasons

```text
+23 New beneficiary
+19 New device
+16 Unusual amount
+13 Unusual time
+11 Geographic deviation
```

---

# 9. Behavioral Baseline

The engine should learn what is normal for an account.

```text
NORMAL BEHAVIOR

Typical payment      ₹1.5k–₹8k
Typical transfer     ₹2k–₹12k
Typical hours        09:00–22:30
Typical locations    Delhi / Gurgaon
Known devices        iPhone / MacBook
```

Current event:

```text
₹84,000
03:14 AM
Dubai
New Windows device
New beneficiary
```

Output:

```text
BEHAVIOR DEVIATION
94 / 100
```

---

# 10. Cash-Flow Intelligence

Show how money enters, leaves, and moves through the account.

```text
INCOME              ₹1,48,000
EXPENSES               ₹91,400
TRANSFERS IN           ₹42,000
TRANSFERS OUT          ₹88,000
NET CASH FLOW           ₹10,600
```

Categorize:

```text
Salary
Rent
Utilities
Food
Travel
Subscription
Shopping
EMI
Transfers
Cash
Investment
```

---

# 11. Money-Flow Anomaly Detection

Identify patterns such as:

### Rapid pass-through

```text
₹50,000 received
      ↓ 4 min
₹48,500 sent
```

### Funnel behavior

```text
A ─₹50k─┐
B ─₹70k─┼→ CUSTOMER → ₹220k → Beneficiary X
C ─₹100k┘
```

### Structuring-like behavior

Multiple events that collectively create an unusual pattern.

The platform should flag these for review rather than automatically declaring criminal activity.

---

# 12. Beneficiary Intelligence

Critical for bank-transfer environments.

```text
BENEFICIARY

Created: 2 minutes ago
Prior interactions: 0

Connected customers: 7
Shared devices: 3
Shared IPs: 2

Risk: 91
```

Possible action:

```text
FORCE STEP-UP
```

---

# 13. Device Intelligence

For every device:

```text
Device ID
First seen
Last seen
Customers
Accounts
Fraud-linked accounts
OS / browser
Risk
```

Example:

```text
DEVICE-991

Accounts connected: 12
Customers: 9
Confirmed fraud links: 3
Risk: 94
```

A shared device is a signal, not proof of fraud.

---

# 14. Network Intelligence

For IP/network context:

```text
IP reputation
ASN
VPN / proxy
Approximate geography
Account count
Fraud-linked count
Velocity
```

Do not block solely on IP.

---

# 15. Entity / Fraud Graph

Entities:

```text
Customer
Account
Card
Device
IP
Phone
Email
Address
Beneficiary
Merchant
Session
Transaction
```

Example:

```text
       DEVICE-991
       /    |        User A User B User C
       |     |     |
     Card  Account Card
        \    |    /
          IP-17
             |
       FRAUD CAMPAIGN
```

Graph features:

```text
shared_device_count
shared_ip_count
shared_beneficiary_count
fraud_neighbors
graph_distance
community_risk
new_edge_rate
graph_growth
```

---

# 16. Fraud Campaign Engine

Move beyond isolated transaction alerts.

Example:

```text
CAMPAIGN #1842

17 Accounts
6 Devices
3 IP clusters
31 Cards
3 Beneficiaries

Exposure: ₹18.4L
Confidence: 94%
Status: ACTIVE
```

### Actions

```text
View graph
View affected accounts
View transactions
Create case
Escalate
Add monitoring policy
Increase friction
Export approved evidence
```

---

# 17. Fraud & Financial Crime Signal Coverage

The platform should support signals for:

```text
Card Fraud
Card Testing
Credential Stuffing
Account Takeover
SIM-Swap Indicators
New Beneficiary Fraud
APP / Social Engineering
Mule / Pass-through behavior
Synthetic Identity Signals
Promo / Refund Abuse
Merchant Collusion Signals
Chargeback / Friendly Fraud
Coordinated Campaigns
```

The product should integrate with specialist KYC/AML/sanctions systems where required instead of pretending to replace them.

---

# 18. Real-Time Risk Engine

The current `HybridScorer` evolves into a multi-model scoring layer.

Outputs:

```text
Fraud
ATO
APP
Chargeback
Mule
Novelty
Campaign
```

Example:

```json
{
  "fraud_score": 82,
  "ato_score": 67,
  "app_score": 74,
  "chargeback_score": 8,
  "mule_score": 63,
  "novelty_score": 92,
  "campaign_score": 88
}
```

---

# 19. Adaptive Decision Engine

Do not use only:

```text
risk > 70 → block
```

Available actions:

```text
APPROVE
APPROVE + MONITOR
3DS
OTP
BIOMETRIC
TEMPORARY HOLD
MANUAL REVIEW
BLOCK
```

Conceptual objective:

```text
Expected Loss(action)
=
Fraud Loss
+
Chargeback Loss
+
Customer Friction Cost
+
Operational Cost
```

Choose the safest permitted action with the lowest expected loss.

---

# 20. Adaptive Authentication

Example:

```text
LOW
→ normal transaction

MEDIUM
→ 3DS / OTP / biometric

HIGH
→ strong step-up

CRITICAL
→ block / investigation
```

The platform integrates with existing authentication infrastructure.

---

# 21. APP / Social-Engineering Fraud

The engine must distinguish:

```text
UNAUTHORIZED FRAUD
```

from:

```text
POSSIBLE AUTHORIZED SCAM
```

Signals:

```text
New beneficiary
First-time large payment
Novel device
Unusual amount
Unusual timing
Unusual recipient
Session anomalies
Remote-access indicators
```

---

# 22. Account Takeover Detection

Sequence:

```text
LOGIN
 ↓
NEW DEVICE
 ↓
PASSWORD RESET
 ↓
PROFILE CHANGE
 ↓
NEW BENEFICIARY
 ↓
LARGE TRANSFER
```

Output:

```text
ATO RISK 91

Sequence anomaly detected.
```

---

# 23. Mule Detection

Potential indicators:

```text
many unrelated inbound transfers
short holding periods
rapid outbound transfers
new beneficiaries
high relationship connectivity
abnormal velocity
```

Example:

```text
POSSIBLE MULE ACCOUNT

Inbound relationships: 28
Outbound relationships: 17
Median hold time: 11m
Graph risk: 93
```

---

# 24. Chargeback Intelligence

Keep chargeback risk separate from fraud.

```text
Fraud Risk:       31
Chargeback Risk:  78
```

Signals:

```text
Prior disputes
Merchant history
Refund behavior
Authentication
Customer purchase history
Delivery evidence
Transaction type
```

---

# 25. Evidence Vault

Maintain structured evidence:

```text
Transaction
Authentication
3DS
Device metadata
Network metadata
Account timeline
Merchant information
Delivery evidence
Refund history
Analyst notes
Decision history
```

Use tokenization/minimization for sensitive payment data.

---

# 26. Deep Investigation

Existing `/investigate` becomes the central investigator workspace.

```text
TRANSACTION #TX-92831

RISK 84
DECISION STEP-UP
CAMPAIGN #1842

WHY?
+23 new beneficiary
+19 new device
+16 amount deviation
+13 geo deviation

TIMELINE
LOGIN → DEVICE → BENEFICIARY → PAYMENT

GRAPH
CUSTOMER ↔ DEVICE ↔ IP ↔ BENEFICIARY
```

---

# 27. Counterfactual Analysis

Provide:

```text
CURRENT
Risk 84 → STEP-UP

Without new-device:
Risk 63 → REVIEW

Without network anomaly:
Risk 54 → 3DS

Without velocity:
Risk 47 → APPROVE
```

This is more useful to investigators than only displaying feature importance.

---

# 28. Case Management

Existing `/cases` remains.

Workflow:

```text
OPEN
 ↓
TRIAGED
 ↓
INVESTIGATING
 ↓
ESCALATED
 ↓
RESOLVED
```

Each case contains:

```text
Owner
Severity
Customer
Accounts
Transactions
Campaigns
Evidence
Timeline
Notes
Decisions
Audit
```

---

# 29. Attack Lab

Existing `/attack-lab` becomes an adversarial test environment.

Scenarios:

```text
Card Testing
Credential Stuffing
Account Takeover
Velocity Attack
Mule Network
Coordinated Campaign
APP / Social Engineering
New Beneficiary Attack
Device Farm
Synthetic Identity
```

Flow:

```text
SELECT SCENARIO
 ↓
GENERATE SYNTHETIC EVENTS
 ↓
RISK ENGINE
 ↓
ENTITY GRAPH
 ↓
CAMPAIGN DETECTION
 ↓
ADAPTIVE POLICY
 ↓
RESULTS
```

Never perform uncontrolled attacks against real financial systems.

---

# 30. Attack Lab Benchmark

Example:

```text
ACCOUNT TAKEOVER

10,000 synthetic events
500 accounts
125 devices

Baseline model:
Detection 61%

+ Entity graph:
Detection 82%

+ Campaign engine:
Detection 91%

+ Adaptive policy:
Expected loss -37%
```

---

# 31. Replay Engine

A risk manager can replay historical/synthetic transactions against:

```text
new model
new rule set
new threshold
new policy
```

Compare:

```text
Fraud capture
False positives
Approval rate
Step-up rate
Expected loss
Latency
```

Example:

```text
CURRENT
Fraud capture 81%
False positives 4.3%

PROPOSED
Fraud capture 88%
False positives 3.1%

Estimated loss reduction:
₹X
```

---

# 32. Policy Simulator

Allow controlled “what if” testing.

```text
fraud threshold
70 → 80

new-device score
+15 → +25

high-risk beneficiary
→ force step-up
```

Calculate impact before deployment.

---

# 33. Rules

Rule categories:

```text
Velocity
Geo
Device
Account
Payment
Beneficiary
Graph
Campaign
Merchant
Customer
Channel
```

Actions:

```text
Increase Risk
Approve
Force Step-up
Block
Create Case
Watch
Alert
```

---

# 34. Rule Governance

Every production rule has:

```text
ID
Version
Owner
Reason
Created
Approved
Effective
Expiry
Previous version
Performance
```

Workflow:

```text
DRAFT
 ↓
REVIEW
 ↓
SHADOW
 ↓
CANARY
 ↓
PRODUCTION
 ↓
MONITOR
```

Use maker-checker separation for important production changes.

---

# 35. Model Center

Models:

```text
Fraud
ATO
APP
Chargeback
Mule
Novelty
Campaign
```

Track:

```text
Version
Features
Training data
Precision
Recall
AUC
False positives
Latency
Drift
Approval state
Rollback
```

---

# 36. Champion / Challenger

```text
CHAMPION
fraud-v23
LIVE

CHALLENGER
fraud-v24
SHADOW
```

Promote only after governed evaluation.

---

# 37. Threat Drift

Monitor:

```text
Feature drift
Prediction drift
Fraud-rate shift
False-positive shift
New attack clusters
Rule firing spikes
Device anomalies
Network anomalies
```

Example:

```text
⚠ THREAT SHIFT

Shared-device activity +41%
last 2 hours.

Potential new campaign detected.
```

---

# 38. Consent Center / Bank Connectivity

The platform must **not** ask users for arbitrary bank passwords and scrape their accounts.

Use:

```text
Approved bank connector
Sandbox / mock FIP
Consent-based financial-data integration
Institution-controlled APIs
```

For India-oriented designs, the Account Aggregator ecosystem is the natural architecture to investigate for consent-based financial-information sharing.

Consent UI:

```text
DATA CONNECTION

Institution: Example Bank
Account: ••••4821

Data requested:
Transactions
Balance
Account details

Purpose:
Fraud Investigation

Duration:
90 days

STATUS: ACTIVE

[VIEW CONSENT]
[REVOKE]
```

For the portfolio build, use synthetic data or a sandbox.

---

# 39. Data Provenance

Every financial-data item should show:

```text
SOURCE
Example Bank

CONNECTOR
Approved FIP / sandbox

CONSENT
CONS-92831

RECEIVED
05 Sep 2026 14:42

PROCESSED
Account Intelligence
Risk Engine

ACCESSED BY
Investigator 018
```

---

# 40. Audit Center

Record all material actions:

```text
Login
Account access
Transaction access
Risk decision
Rule creation
Rule publication
Model deployment
Policy changes
Case updates
Evidence export
Consent access
Consent revocation
Admin actions
```

Every event:

```text
WHO
WHAT
WHEN
WHY
BEFORE
AFTER
SOURCE
REQUEST ID
```

---

# 41. Data Security

Requirements:

```text
TLS
Encryption at rest
Secrets management
MFA
SSO
RBAC
ABAC where required
Least privilege
Tenant isolation
PII masking
Data minimization
Secure logging
Network segmentation
```

Payment-card data must follow the applicable payment-security controls.

---

# 42. Privacy

Support:

```text
purpose limitation
consent records
data minimization
retention policies
field masking
regional controls
access logs
deletion workflows where legally applicable
```

Default display:

```text
PAN → ••••4921
Email → a***@example.com
Phone → ******8212
```

---

# 43. Investigator Copilot

Controlled AI assistant.

Useful prompts:

```text
Why is this transaction risky?
Show linked accounts.
Summarize the last 24 hours.
Compare with normal behavior.
Find similar historical cases.
Explain the policy decision.
Draft investigation notes.
```

The copilot can recommend actions.

It should not autonomously:

```text
freeze accounts
permanently block customers
submit regulatory filings
override risk policy
```

without authorized workflows.

---

# 44. Command Center

Existing `/command-center` should show:

```text
TRANSACTIONS
1.42M

FRAUD PREVENTED
₹4.8Cr

FRAUD CAPTURE
87.4%

FALSE POSITIVE
2.1%

APPROVAL RATE
96.8%

MEDIAN DECISION
42ms
```

Also:

```text
Active campaigns
System latency
Feature-store health
Model health
Queue depth
Open cases
```

---

# 45. Executive Threat View

Show:

```text
ACTIVE CAMPAIGNS

#1842  Account Takeover
#1839  Card Testing
#1830  Mule Network
```

and:

```text
TOP RISK MOVERS
new devices
beneficiaries
IP clusters
merchant spikes
```

---

# 46. Global Search

Search:

```text
Customer
Account
Transaction
Card token
Device
IP
Merchant
Beneficiary
Campaign
Case
Rule
Model
Consent
```

Example:

```text
device_991

17 accounts
6 transactions
2 campaigns
1 case
```

---

# 47. Timeline

Every customer/account should have a unified event stream:

```text
LOGIN
 ↓
PASSWORD CHANGE
 ↓
DEVICE ADDED
 ↓
BENEFICIARY ADDED
 ↓
PAYMENT
 ↓
STEP-UP
 ↓
FAILED AUTHENTICATION
 ↓
CASE
```

This becomes the fastest investigator view.

---

# 48. Banking Integrations

Potential integration boundaries:

```text
Core Banking
Card Processor
Payment Gateway
Instant Payment Rail
KYC / Identity
Authentication / 3DS
Device Intelligence
IP Intelligence
Case Management
SIEM
Data Warehouse
Notification
Financial-data consent/connectivity layer
```

Protocols:

```text
REST
gRPC
Webhooks
Kafka / Pub/Sub
Batch interfaces
ISO 20022 adapters where applicable
```

ATDP should be an intelligence/decisioning layer, not a replacement for the bank's entire core.

---

# 49. Technical Architecture

```text
                     BANK / PSP
                         │
                 Event + Consent Data
                         ↓
                 API / Event Gateway
                         ↓
                 Data Normalization
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   PostgreSQL          Redis            Graph DB
   historical          hot state        relationships
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                  Feature Engine
                         ↓
        ┌────────────────┼───────────────────┐
        ↓                ↓                   ↓
     Rules           ML Models           Anomaly
        │                │                   │
        └────────────────┼───────────────────┘
                         ↓
                  Campaign Engine
                         ↓
                  Decision Optimizer
                         ↓
            Payment / Auth / Case Systems
                         ↓
                Outcomes + Audit Events
                         ↓
               Analytics / Model Loop
```

---

# 50. Suggested Technology Stack

### Frontend

```text
Next.js
TypeScript
Tailwind
GSAP
React Three Fiber / Three.js
```

### Backend

```text
FastAPI or Go
REST / gRPC
Kafka / Pub/Sub
Redis
PostgreSQL
```

### ML

```text
Python
XGBoost / LightGBM
scikit-learn
PyTorch where justified
MLflow
Feature store
```

### Graph

```text
Neo4j or equivalent graph database
```

### Observability

```text
OpenTelemetry
Prometheus
Grafana
SIEM integration
```

---

# 51. Performance Requirements

Initial target:

```text
5,000 TPS
```

Scale target:

```text
50,000+ TPS
```

Decision latency target:

```text
p50 < 50ms
p95 < 100ms
p99 < 200ms
```

Actual production targets must be validated per payment rail and institution.

---

# 52. Resilience

### Model unavailable

```text
Rules + cached features
```

### Feature store unavailable

```text
Cached / degraded feature set
```

### Graph unavailable

```text
Proceed without graph features
```

### Risk service unavailable

```text
Institution-defined fail-open / fail-closed policy
```

Fallbacks must be logged and monitored.

---

# 53. Availability

Target:

```text
99.95%+
```

Enterprise direction:

```text
Multi-AZ
Multi-region where required
Automatic failover
Disaster recovery
Backup
Restore testing
Circuit breakers
```

---

# 54. Multi-Tenant Architecture

Each institution needs:

```text
tenant isolation
tenant-specific rules
tenant-specific policies
tenant-specific model configuration
tenant data access controls
tenant audit scope
```

Large institutions may require isolated deployments.

---

# 55. Demo Data

Never use real customer financial data for the portfolio prototype.

Generate:

```text
10,000 customers
25,000 accounts
40,000 devices
80,000 transactions
15,000 beneficiaries
1,000 merchants
50 synthetic campaigns
```

Generate:

```text
normal behavior
legitimate anomalies
false positives
card testing
ATO
APP
mule patterns
device farms
coordinated fraud
chargeback cases
```

---

# 56. End-to-End Golden Demo

This should be the main demonstration.

```text
1. Open Account 360
2. View passbook
3. Observe normal behavior
4. New ₹84,000 transfer appears
5. New beneficiary is detected
6. New device is detected
7. Behavioral deviation rises
8. Entity graph finds connected entities
9. Campaign engine links 17 accounts
10. Fraud/ATO/APP/novelty scores update
11. Expected-loss optimizer chooses STEP-UP
12. Authentication fails
13. Transaction becomes BLOCK
14. Case is created
15. Evidence is attached
16. Audit event is recorded
17. Campaign exposure updates
18. Replay shows policy alternative
19. Attack Lab reproduces similar pattern
20. Model/rule dashboard measures impact
```

This one flow should prove that the modules are actually connected.

---

# 57. MVP

Implement first:

```text
Account 360
Passbook
Behavioral baseline
Risk Console
Entity Graph
Campaign Detection
Adaptive Decisioning
Investigation
Cases
Attack Lab
Replay
Audit
```

---

# 58. Phase 2

Add:

```text
Cash-flow intelligence
Beneficiary intelligence
Device intelligence
APP detection
ATO detection
Mule detection
Chargeback model
Novelty detection
Drift monitoring
Policy simulator
Champion/challenger
Evidence vault
Consent center
Investigator copilot
```

---

# 59. Phase 3 — Bank Enterprise

Add:

```text
Institution integrations
Core-banking adapters
Payment-rail adapters
Approved consent/data-connectivity integrations
ISO 20022 adapters
Multi-region
Multi-tenancy
Enterprise SSO
SIEM
Advanced ABAC
Data residency
DR validation
Immutable audit storage
Enterprise reporting
Formal model-risk processes
```

---

# 60. What the Product Must NOT Claim

Do not claim the prototype:

```text
can access arbitrary people's bank accounts
can scrape bank credentials
is PCI-certified
is RBI-approved
is a production AML replacement
makes legal determinations of criminal activity
is production-ready for a major bank
```

Instead:

> **Bank-oriented prototype / reference architecture for adaptive transaction defense.**

Real connectivity should use institution-approved APIs, sandboxes, consent mechanisms, and appropriate security/compliance processes.

---

# 61. Success Metrics

### Security

```text
Fraud capture ↑
Fraud loss ↓
Campaign detection time ↓
ATO loss ↓
Mule detection ↑
Chargeback loss ↓
```

### Customer

```text
False positives ↓
Approval rate ↑
Step-up success ↑
Customer friction ↓
```

### Operations

```text
Investigation time ↓
Cases per analyst ↑
Time to resolve ↓
```

### Engineering

```text
Latency ↓
Availability ↑
Error rate ↓
Recovery time ↓
```

---

# 62. North-Star Metric

> **Minimize expected financial loss per transaction while preserving legitimate customer conversion.**

Do not optimize for the number of blocked transactions.

A system that blocks everything is not a successful bank risk system.

---

# 63. Final Product Definition

> **ATDP is an adaptive financial-risk operating platform that understands the account, the transaction, the customer's behavioral baseline, the financial flow, the entities connected to the event, the coordinated campaign behind suspicious activity, and the expected cost of each intervention. It gives financial institutions one system for real-time decisions, investigations, cases, simulation, governance, and audit.**

---

# 64. Recommended Product Name

### ATDP
**Adaptive Transaction Defense Platform**

Possible public-facing names:

```text
RISK//01
ATDP
Sentinel Risk
VectorShield
SignalBank
DefendX
```

For a technical portfolio, **ATDP** is the clearest because it communicates that the platform is more than fraud detection.
