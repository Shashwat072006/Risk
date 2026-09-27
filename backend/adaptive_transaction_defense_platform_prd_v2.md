# Product Requirements Document
# Adaptive Transaction Defense Platform (ATDP)

**Version:** 2.0  
**Status:** Product definition / build blueprint  
**Audience:** Product, ML, backend, security, risk operations, banking/fintech stakeholders  
**Primary outcome:** Build a bank-grade real-time risk decisioning platform that can evaluate transactions, detect coordinated fraud, choose the least-cost intervention, support investigations, and continuously improve from outcomes.

---

# 1. Executive Summary

**Adaptive Transaction Defense Platform (ATDP)** is a real-time transaction risk and fraud-defense platform designed for banks, payment service providers, fintechs, card issuers, acquirers, wallets, and large merchants.

ATDP sits in the payment decision path and evaluates each event using real-time behavioral signals, customer/account history, device and network intelligence, an entity/fraud graph, deterministic rules, multiple ML models, novelty detection, fraud-campaign detection, chargeback-risk prediction, expected-loss optimization, and adaptive authentication policies.

The output is not simply `fraud=true/false`. It is an explainable action:

```text
                    TRANSACTION
                         ↓
                  RISK INTELLIGENCE
                         ↓
        ┌────────────────┼─────────────────┐
        ↓                ↓                 ↓
    FRAUD RISK      CHARGEBACK RISK    NOVELTY RISK
        ↓                ↓                 ↓
        └────────────────┼─────────────────┘
                         ↓
                    ENTITY GRAPH
                         ↓
                POLICY / DECISION ENGINE
                         ↓
      ┌─────────┬─────────┬─────────┬─────────┐
      ↓         ↓         ↓         ↓
   APPROVE     3DS      REVIEW     BLOCK
      │         │         │         │
      └─────────┴─────────┴─────────┘
                         ↓
                    OUTCOME LOOP
                         ↓
                  LEARNING / MONITORING
```

---

# 2. Why This Product Is Different

A normal student fraud project usually does:

```text
Transaction → ML model → fraud probability
```

ATDP does:

```text
Transaction
    ↓
Entity + behavior context
    ↓
Multiple risk models
    ↓
Coordinated-attack intelligence
    ↓
Expected-loss optimization
    ↓
Adaptive intervention
    ↓
Investigation + feedback
    ↓
Continuous model/rule improvement
```

The platform is therefore an **adaptive financial-risk decision platform**, not merely a fraud classifier.

---

# 3. Product Vision

> **Protect every payment without treating every customer like a criminal.**

The platform should help a financial institution answer five questions in real time:

1. Is this transaction risky?
2. Why is it risky?
3. Is it part of a larger attack?
4. What intervention minimizes expected loss?
5. What did we learn after the transaction completed?

---

# 4. Target Customers

## Primary

- Retail banks
- Digital banks / neobanks
- Credit-card issuers
- Payment service providers
- Payment gateways
- Wallet providers
- Acquirers
- Large marketplaces

## Secondary

- BNPL providers
- E-commerce platforms
- Remittance platforms
- Digital lenders
- Fintech infrastructure providers
- Insurance payment platforms

---

# 5. Supported Fraud Domains

### Card fraud

```text
Card-not-present
Counterfeit
Stolen card
Card testing
Enumeration
Velocity attacks
```

### Account takeover

```text
Credential compromise
New-device login
Password-reset abuse
SIM-swap indicators
Session anomaly
Impossible travel
```

### Payment fraud

```text
Unauthorized transfers
Beneficiary abuse
New-beneficiary fraud
Instant-payment scams
Account-to-account fraud
```

### Authorized Push Payment / social engineering

The customer may intentionally authorize the transfer while being manipulated.

Signals include:

```text
New beneficiary
Unusual amount
Unusual timing
Novel recipient
Rapid account behavior change
High-risk destination
Session anomalies
```

### Merchant / refund abuse

```text
Refund fraud
Friendly fraud
Promo abuse
Return abuse
Collusive merchants
```

### Mule-account behavior

Detect accounts that receive and rapidly redistribute suspicious funds.

---

# 6. Product Modules

```text
01  Transaction Gateway
02  Real-Time Feature Engine
03  Entity / Fraud Graph
04  Rule & Policy Engine
05  ML Risk Engine
06  Novelty Detector
07  Attack Campaign Engine
08  Adaptive Intervention Engine
09  Chargeback Intelligence
10  Case Management
11  Investigation Workbench
12  Model Governance
13  Rule Governance
14  Risk Simulation Lab
15  Real-Time Monitoring
16  Audit & Compliance
17  Data / Integration Layer
```

---

# 7. Core Module: Transaction Gateway

Provide a reliable, low-latency entry point for every transaction or risk event.

### APIs

```http
POST /v1/risk/evaluate
POST /v1/risk/events
POST /v1/authentication/step-up
POST /v1/transactions/replay
GET  /v1/transactions/{id}
```

### Supported event types

```text
payment_attempt
payment_authorized
payment_failed
payment_reversed
refund
login
password_reset
beneficiary_added
beneficiary_modified
device_registered
cash_withdrawal
card_issued
chargeback_opened
chargeback_resolved
```

This makes the platform useful beyond a single card-payment use case.

---

# 8. Payment-Rail Abstraction

The platform should normalize different payment rails into a common event model.

Examples:

```text
Cards
UPI
ACH
SEPA
RTP / instant payments
Domestic bank transfers
Wire transfers
Wallet transactions
Merchant payments
```

For bank deployments, the architecture should support structured financial messages such as ISO 20022 where applicable. ISO describes ISO 20022 as a common framework for structured financial messaging used by banks and payment systems.

Reference: https://www.iso.org/standard/20022-1

### Normalized transaction model

```json
{
  "event_type": "payment_attempt",
  "transaction_id": "tx_123",
  "customer_id": "cust_001",
  "account_id": "acct_091",
  "merchant_id": "m_883",
  "channel": "mobile",
  "rail": "instant_payment",
  "amount": 8400,
  "currency": "INR",
  "device_id": "dev_81",
  "ip": "tokenized",
  "beneficiary_id": "ben_22",
  "timestamp": "..."
}
```

---

# 9. Real-Time Feature Engine

Create contextual signals without making synchronous risk requests perform expensive historical queries.

### Feature families

**Velocity**
```text
tx_count_1m
tx_count_5m
amount_sum_1h
decline_count_10m
beneficiary_add_count_24h
```

**Customer behavior**
```text
usual_amount
usual_time_of_day
usual_geo
usual_device
merchant_affinity
channel_affinity
```

**Device**
```text
device_age
device_account_count
device_customer_count
emulator_signal
root_jailbreak_signal
browser_fingerprint
```

**Network**
```text
ip_reputation
asn_risk
vpn_proxy_signal
geo_distance
ip_account_count
```

**Identity**
```text
account_age
kyc_age
email_age
phone_age
recent_profile_changes
```

**Payment**
```text
bin_country
card_age
3ds_result
avs_result
cvv_result
previous_declines
previous_chargebacks
```

---

# 10. Entity / Fraud Graph

This is one of the platform's core differentiators.

## Graph entities

```text
Customer
Account
Card
Device
IP
Phone
Email
Address
Merchant
Beneficiary
Payment Instrument
Session
```

## Example

```text
                 DEVICE-991
                /    |     \
               /     |      \
          Customer A B      C
             |       |       |
           Card A   Card B  Card C
               \      |      /
                    IP-17
                     |
               FRAUD CAMPAIGN
```

### Graph features

```text
connected_fraud_count
device_account_count
shared_ip_count
shared_beneficiary_count
graph_distance_to_known_fraud
community_fraud_rate
new_edge_count
sudden_graph_growth
```

---

# 11. Fraud-Campaign Detection

Instead of treating fraud as isolated transactions, ATDP groups related events into campaigns.

### Example

```text
Campaign #1842

17 accounts
6 devices
42 IPs
31 cards
₹18.4L exposure
```

### Campaign detection

Use:

```text
Graph clustering
Community detection
Temporal correlation
Shared infrastructure signals
Behavioral similarity
```

### Alert

```text
[ALERT] COORDINATED ATTACK

17 accounts linked through 6 devices.

Confidence: 94%

Recommended:
Increase friction for linked entities.
```

---

# 12. Multi-Model Risk Engine

Do not force every risk problem into one model.

## Models

```text
Fraud Model
Account-Takeover Model
Chargeback Model
APP / Social-Engineering Model
Mule-Account Model
Novelty / Anomaly Detector
```

### Example

```text
Fraud           81
ATO             17
Chargeback      63
Novelty         92
Campaign        88
```

---

# 13. Novelty Detection

Supervised fraud models depend on historical labels. Attackers can change tactics.

ATDP therefore includes an unsupervised / semi-supervised layer that asks:

> Does this transaction look substantially different from the customer's normal behavior and from known transaction populations?

Possible techniques:

```text
Isolation Forest
Autoencoders
Clustering
Distance-based anomaly detection
Population drift detection
```

Output:

```text
novelty_score = 92
```

Novelty should increase investigation or friction, but should not automatically mean fraud.

---

# 14. Adaptive Intervention Engine

This is the core decision differentiator.

Do not use:

```text
risk > 70 → block
```

Instead evaluate the cost of each intervention.

### Actions

```text
APPROVE
APPROVE + MONITOR
3DS
OTP
BIOMETRIC STEP-UP
TEMPORARY HOLD
MANUAL REVIEW
BLOCK
```

### Expected-loss framework

Conceptually:

```text
Expected Loss(action)
=
fraud_loss
+
chargeback_loss
+
customer_friction_cost
+
operational_cost
```

The system chooses the action with the lowest expected loss subject to policy constraints.

---

# 15. Risk-Based Authentication

Banks need layered authentication rather than a binary allow/deny experience.

```text
Low risk
→ normal transaction

Medium risk
→ 3DS / biometric

High risk
→ stronger step-up

Critical risk
→ block + case
```

The platform should integrate with existing authentication systems rather than becoming the bank's identity provider.

FFIEC guidance emphasizes risk-based authentication and layered security for financial institutions, including risks from compromised credentials and push-payment capabilities.

Reference: https://www.ffiec.gov/news/press-releases/2021/pr-08-11

---

# 16. Chargeback Intelligence

Fraud and chargeback are separate predictions.

### Chargeback model

```text
transaction
customer history
merchant category
refund behavior
delivery/evidence signals
prior disputes
```

Output:

```text
chargeback_probability = 0.67
```

### Prevention actions

```text
request additional verification
capture stronger evidence
flag merchant
route to review
initiate customer outreach
```

---

# 17. Evidence Vault

Maintain structured transaction evidence for dispute workflows.

Examples:

```text
Authentication result
3DS result
Device information
IP / network metadata
Order information
Delivery confirmation
Customer interaction
Refund activity
Transaction timeline
Relevant policy decisions
```

Sensitive payment data should be tokenized/minimized. PCI SSC states that stored PAN must be rendered unreadable under PCI DSS requirements, while other cardholder data remains subject to applicable protections.

Reference: https://www.pcisecuritystandards.org/faqs/1222/

---

# 18. Investigator Workbench

Risk analysts need more than a transaction table.

```text
TRANSACTION #TX-92831

RISK             84
DECISION         STEP-UP
CAMPAIGN         #1842
CUSTOMER         4 years
DEVICE           NEW
IP               HIGH RISK

WHY?
+21 velocity
+19 device novelty
+17 network reputation
+14 geo anomaly
+13 graph relationship
```

### Timeline

```text
09:41 Login
09:42 Password change
09:43 New device
09:44 Beneficiary added
09:44 ₹84,000 payment
09:45 Step-up failed
```

---

# 19. Explainability

Every decision must answer:

```text
WHY?
WHAT CHANGED?
WHAT WOULD HAVE HAPPENED OTHERWISE?
```

### Counterfactual view

```text
Current:
Risk 84 → STEP-UP

Without new-device signal:
Risk 63 → REVIEW

Without network anomaly:
Risk 52 → 3DS

Without velocity:
Risk 41 → APPROVE
```

---

# 20. Rule Engine

Rules remain important for high-confidence controls.

### Rule types

```text
BLOCK
ALLOW
INCREASE_RISK
FORCE_STEP_UP
CREATE_CASE
WATCH
RATE_LIMIT
```

Example:

```yaml
name: impossible_travel

when:
  previous_country_distance_km: "> 1500"
  elapsed_minutes: "< 60"

then:
  action: increase_risk
  score: 30
```

---

# 21. Rule Governance

Rules must have:

```text
Owner
Version
Reason
Created timestamp
Approved timestamp
Effective timestamp
Rollback version
Change ticket
Approver
Performance metrics
```

### Maker-checker workflow

```text
Analyst creates rule
        ↓
Peer review
        ↓
Risk approval
        ↓
Shadow mode
        ↓
Canary
        ↓
Production
```

For bank deployments, do not allow one analyst to silently push production decisioning changes.

---

# 22. Model Governance

Every model receives:

```text
Model ID
Version
Training dataset
Feature version
Metrics
Bias checks
Validation results
Approval status
Deployment status
Rollback version
```

### Champion / challenger

```text
                 TRANSACTION
                      ↓
             CHAMPION MODEL
                      │
             ┌────────┴────────┐
             ↓                 ↓
          decision         CHALLENGER
                              │
                         shadow only
```

Promote a challenger only when predefined performance and safety gates are satisfied.

---

# 23. Replay Engine

Take historical transactions and replay them against:

```text
new model
new rules
new policy
new threshold
```

Show:

```text
Current policy:
Fraud captured       81%
False positives       4.2%

Proposed policy:
Fraud captured       87%
False positives       3.1%

Estimated loss reduction:
₹X
```

This enables safe policy development.

---

# 24. Attack Simulation Lab

Create controlled simulations of:

```text
Card testing
Credential stuffing
Account takeover
Mule network
Synthetic identity
Velocity attack
Promo abuse
Coordinated payment campaign
APP / social engineering
```

### Example

```text
ATTACK LAB

Scenario: Account Takeover

10,000 synthetic events
500 compromised identities
125 devices
35 IP ranges

[ RUN SIMULATION ]
```

Output:

```text
Baseline ML
Detection: 61%

+ Graph
Detection: 82%

+ Campaign Detector
Detection: 91%

+ Adaptive Policy
Expected loss: -37%
```

This lets the platform be demonstrated under attack rather than only with static examples.

---

# 25. Model Drift & Fraud Drift

Monitor both the model and the threat environment.

Alerts:

```text
Feature drift
Prediction drift
Label drift
Fraud-rate shift
False-positive increase
New attack cluster
Rule firing spike
New device spike
Geographic anomaly spike
```

Example:

```text
[ALERT] THREAT DRIFT

Device novelty increased 41%
over the last 2 hours.

Possible new campaign detected.
```

---

# 26. Real-Time Threat Map

For a bank operations center:

```text
LIVE THREAT ACTIVITY

India      1,821 alerts
Singapore    209
UK           182
US           711
```

The map should show region-level:

```text
fraud clusters
campaigns
high-risk destinations
velocity hotspots
```

Do not expose sensitive individual customer locations to unauthorized users.

---

# 27. Case Management

Cases can be created automatically.

```text
CASE #1842
TYPE: COORDINATED FRAUD
SEVERITY: CRITICAL
STATUS: INVESTIGATING
OWNER: Analyst 021
```

### Case actions

```text
Assign
Escalate
Add note
Attach evidence
Freeze / hold via approved integration
Close
Mark false positive
Confirm fraud
```

### Case lifecycle

```text
OPEN
→ TRIAGED
→ INVESTIGATING
→ ESCALATED
→ RESOLVED
```

---

# 28. Investigation Copilot

Add a controlled AI assistant for analysts.

It can:

```text
summarize a case
explain risk
show connected entities
surface similar historical cases
draft investigation notes
suggest next checks
summarize timelines
```

The copilot must not autonomously freeze accounts, reject transactions, or submit regulatory reports without an authorized workflow.

---

# 29. Bank / Enterprise Controls

## RBAC

Roles:

```text
Platform Admin
Fraud Admin
Fraud Analyst
Investigator
Model Risk
Compliance
Auditor
Read Only
```

## Separation of duties

```text
Analyst ≠ Rule Approver
Modeler ≠ Model Approver
Developer ≠ Production Approver
```

---

# 30. Audit Trail

Every material action must be immutable/auditable.

Record:

```text
Who
What
When
Why
Before
After
Approval
Source system
Request ID
```

Example:

```json
{
  "actor": "analyst_18",
  "action": "rule_published",
  "rule_version": "v42",
  "previous_version": "v41",
  "approved_by": "risk_manager_03",
  "timestamp": "..."
}
```

---

# 31. Security Requirements

### Data security

```text
TLS in transit
Encryption at rest
Tokenization
Secrets management
Key rotation
Data minimization
PII access controls
```

### Access

```text
SSO
MFA
RBAC / ABAC
Privileged access controls
Session logging
```

### Payments

```text
No raw CVV storage
Tokenize sensitive card identifiers
Strict PAN handling
Network segmentation
Least privilege
```

PCI DSS considerations are implementation requirements where a deployment is in PCI scope, not a claim that this student/project implementation is certified.

---

# 32. Privacy Controls

Support:

```text
purpose limitation
data minimization
retention policies
field-level masking
regional data residency
PII redaction
right-to-delete workflows where applicable
```

Analyst UI:

```text
Full PAN → •••• 4921
Email → a***@example.com
Phone → ******8212
IP → masked unless privileged
```

---

# 33. Resilience Architecture

```text
                 GLOBAL TRAFFIC
                       ↓
                API GATEWAY
                       ↓
                RISK CLUSTER
                /          \
               /            \
          Region A        Region B
             │               │
          Cache          Cache
             │               │
          Feature        Feature
          Store          Store
```

## Failure modes

**Model unavailable**
```text
→ rules-only fallback
```

**Feature store unavailable**
```text
→ cached features
→ degraded-risk mode
```

**Graph unavailable**
```text
→ graph features omitted
→ continue with other signals
```

**Entire risk service unavailable**
```text
→ institution-configured fail-open or fail-closed policy
```

Every fallback must be observable.

---

# 34. Performance Requirements

Target initial real-time decision SLA:

```text
p50 < 50 ms
p95 < 100 ms
p99 < 200 ms
```

Target availability:

```text
99.95%+
```

For critical deployments:

```text
multi-region
automatic failover
disaster recovery
tested restoration procedures
```

---

# 35. Event Architecture

```text
Payment Systems
      ↓
Kafka / Pub/Sub
      ↓
Stream Processing
      ↓
Feature Aggregation
      ↓
Real-Time Stores
      ↓
Risk Decision API
```

All decisions also produce events:

```text
risk_scored
decision_made
authentication_requested
fraud_confirmed
chargeback_opened
case_created
rule_changed
model_changed
```

---

# 36. Storage Architecture

| Data | Recommended store |
|---|---|
| Transactions | PostgreSQL / Cloud SQL |
| Hot features | Redis |
| Event stream | Kafka / Pub/Sub |
| Analytics | BigQuery / Snowflake |
| Graph | Neo4j / graph database |
| Search | OpenSearch |
| Model artifacts | Object storage |
| Audit | Immutable/WORM-compatible storage |

---

# 37. Integration Layer

ATDP should expose connectors for:

```text
Core banking
Card processor
Payment gateway
3DS provider
KYC provider
Device intelligence provider
IP intelligence provider
Identity provider
Case management
Data warehouse
SIEM
Notification systems
```

Integration styles:

```text
REST
gRPC
Webhooks
Kafka
ISO 20022 adapters
```

---

# 38. Metrics & KPIs

## Risk effectiveness

```text
Fraud capture rate ↑
Fraud loss ↓
Chargeback rate ↓
Account takeover loss ↓
Mule detection ↑
Campaign detection time ↓
```

## Customer impact

```text
False-positive rate ↓
Approval rate ↑
Step-up success rate ↑
Customer friction ↓
```

## Engineering

```text
p95 latency
p99 latency
availability
error rate
feature-store latency
model inference latency
```

## Operations

```text
Cases per analyst
Mean time to investigate
Mean time to resolve
Rule change success rate
Alert precision
```

---

# 39. Business Decision Dashboard

Executives should not need to understand model internals.

Show:

```text
FRAUD PREVENTED
₹4.8Cr

FRAUD CAPTURE
87.4%

FALSE POSITIVE
2.1%

TRANSACTION SUCCESS
96.8%

MEDIAN DECISION
42ms
```

And:

```text
TOP ACTIVE CAMPAIGNS
#1842  Account takeover
#1839  Card testing
#1830  Mule network
```

---

# 40. Customer-Facing Protection

For banks, approved risk events can trigger customer-facing protection workflows:

```text
New device detected
Suspicious payment
Beneficiary change
Step-up authentication
Transaction blocked
Account temporarily protected
```

Notification behavior must be institution-approved and auditable.

---

# 41. False-Positive Learning

When an analyst marks:

```text
FALSE POSITIVE
```

the event should feed governed feedback pipelines for:

```text
rule tuning
training labels
feature analysis
customer segmentation
threshold optimization
```

Do not retrain the production model immediately on every individual analyst action.

---

# 42. Segmentation

Different customers have different normal behavior.

Create policy segments such as:

```text
Retail
Premium
SME
Corporate
Cross-border
High-value
New customer
Long-tenured
```

Risk policies can vary by segment under controlled governance.

---

# 43. Risk Policy Engine

Policies should support combinations such as:

```text
IF fraud_score > 80
AND customer_segment = "premium"
AND device_known = true
THEN 3DS

IF fraud_score > 90
AND campaign_score > 80
THEN BLOCK

IF chargeback_score > 70
AND transaction_value > ₹50,000
THEN REVIEW
```

Policies should be versioned independently from ML models.

---

# 44. Safe Deployment

Every major rule/model change should support:

```text
Offline evaluation
↓
Historical replay
↓
Shadow mode
↓
Canary rollout
↓
Limited traffic
↓
Full rollout
```

Automatic rollback when:

```text
false positives spike
latency breaches SLA
fraud capture collapses
error rate rises
```

---

# 45. Analytics & Reporting

Scheduled reporting:

```text
Daily fraud report
Weekly campaign report
Monthly model performance
Rule performance
Chargeback trends
Operational capacity
```

Each report should compare current period, previous period, and historical baselines.

---

# 46. Non-Functional Requirements

## Security

- MFA for privileged users
- Encryption in transit/at rest
- Audit logging
- Least privilege
- Secret rotation

## Scalability

Initial target:

```text
5,000 TPS
```

Architecture should scale toward:

```text
50,000+ TPS
```

without changing the product contract.

## Multi-tenancy

Each institution must have:

```text
tenant isolation
separate policies
separate models where required
separate data access
tenant-level keys where appropriate
```

---

# 47. Proposed Tech Stack

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
GSAP
React Three Fiber / Three.js
```

The public-facing product experience can retain the cinematic visual language from the reference video, while the authenticated bank console switches to a dense analyst mode during investigations.

## Backend

```text
Go / FastAPI
gRPC
REST
Kafka / Pub/Sub
Redis
PostgreSQL
```

## ML

```text
Python
XGBoost / LightGBM
scikit-learn
PyTorch
MLflow
Feature Store
```

## Graph

```text
Neo4j
or another graph database
```

## Cloud

```text
Kubernetes / Cloud Run
Object Storage
Managed SQL
Managed Redis
Managed Kafka / Pub/Sub
BigQuery / Snowflake
```

---

# 48. Product Interface

The visual brand should preserve the reference site's cinematic language for the public-facing product experience:

```text
BLACK
+
OVERSIZED TYPE
+
NEON SIGNALS
+
LAYERED TECHNICAL OBJECTS
+
EDITORIAL MOTION
```

But the authenticated bank console should prioritize usability:

```text
LIVE RISK
TRANSACTIONS
CAMPAIGNS
CASES
RULES
MODELS
SIMULATOR
MONITORING
AUDIT
```

The landing experience can be artistic; the banking operations product must be operationally clear.

---

# 49. Proposed Main Screens

## 01. Command Center

```text
LIVE TRANSACTIONS
ACTIVE CAMPAIGNS
FRAUD PREVENTED
RISK EXPOSURE
SYSTEM HEALTH
```

## 02. Transaction Investigation

```text
Decision
Risk scores
Why
Counterfactual
Timeline
Graph
Actions
```

## 03. Fraud Campaigns

```text
Campaign
Entities
Amount
Velocity
Countries
Confidence
Status
```

## 04. Entity Graph

```text
Customer ↔ Device ↔ IP ↔ Card ↔ Beneficiary ↔ Merchant
```

## 05. Rules

```text
Active rules
Drafts
Shadow rules
Performance
Approval queue
```

## 06. Models

```text
Champion
Challenger
Drift
Performance
Version history
```

## 07. Attack Lab

```text
Scenario
Traffic
Detection
False positives
Expected loss
```

## 08. Case Management

```text
Open
Investigating
Escalated
Resolved
```

## 09. Audit

```text
Configuration changes
Model releases
Rule releases
Analyst activity
Authentication logs
```

---

# 50. MVP

Do not attempt every bank feature at once.

## MVP must contain

```text
1. Transaction API
2. Real-time feature engine
3. Rules engine
4. Fraud ML model
5. Entity graph
6. Adaptive decision engine
7. Transaction investigation UI
8. Counterfactual explanation
9. Campaign detector
10. Basic case management
11. Historical replay
12. Model/rule monitoring
```

This is already substantially beyond a generic fraud classifier.

---

# 51. Phase 2

Add:

```text
Chargeback model
ATO model
Novelty detector
Adaptive authentication integration
Attack Lab
Model champion/challenger
Drift detection
Fraud heatmap
Evidence vault
Investigator Copilot
```

---

# 52. Phase 3 — Bank-Grade Expansion

Add:

```text
Multi-region deployment
Multi-tenancy
ISO 20022 adapters
Core-banking integrations
Advanced RBAC/ABAC
Maker-checker governance
Immutable audit
Data residency
Advanced disaster recovery
SIEM integration
Enterprise identity
Policy simulation
Regulatory reporting workflows
```

RBI's 2024 Master Directions on Fraud Risk Management for commercial banks emphasize prevention, early detection, timely reporting, fraud analysis and parameterized monitoring. They also identify signals such as transaction velocity, new-account activity, time zones, geolocation, IP origin, declined transactions, and behavioral biometrics as examples of fraud-monitoring parameters.

Reference: https://systemhealth.rbi.org.in/Scripts/BS_ViewMasDirections.aspx_id%3D12702%281%29.html

---

# 53. Regulatory / Standards Design Inputs

These are design inputs, not certification claims.

### RBI Fraud Risk Management

Design for prevention, early detection, investigation, reporting workflows, fraud analysis, and parameterized monitoring. The platform's risk-signal architecture intentionally supports velocity, new-account behavior, time, geolocation, IP/network, declined-transaction, and behavioral signals.

### FFIEC

Support layered, risk-based authentication and strong access controls for financial-institution environments.

### PCI DSS

Keep payment-card data minimized and tokenized; never store CVV, and render stored PAN unreadable when applicable to the deployment's PCI scope.

### ISO 20022

Provide an adapter layer so normalized ATDP events can coexist with structured financial messages used across payment systems.

---

# 54. Success Criteria

The platform succeeds when it can demonstrate this complete flow:

```text
Synthetic transaction
       ↓
Feature extraction
       ↓
Entity graph lookup
       ↓
Fraud + chargeback + novelty scores
       ↓
Campaign correlation
       ↓
Expected-loss optimization
       ↓
Adaptive intervention
       ↓
Explainability
       ↓
Case creation
       ↓
Analyst decision
       ↓
Outcome label
       ↓
Replay / model improvement
```

---

# 55. Demo Scenario

## Coordinated account takeover

Create 50 synthetic accounts.

Attack sequence:

```text
01. Credential reuse
02. Login from new device
03. Password change
04. New beneficiary
05. Unusual transfer
06. Multiple accounts repeat pattern
```

The platform should:

```text
Detect individual anomaly
        ↓
Link shared device/IP/beneficiary
        ↓
Recognize campaign
        ↓
Raise campaign confidence
        ↓
Apply stronger intervention
        ↓
Create investigation case
```

Dashboard:

```text
CAMPAIGN #1842

Accounts        17
Devices          6
Beneficiaries    3
Exposure         ₹18.4L
Confidence       94%

STATUS
ACTIVE ATTACK
```

---

# 56. What Makes This Portfolio-Level

The strongest implementation is not the biggest one.

The differentiator is the combination:

```text
GRAPH INTELLIGENCE
       +
ADAPTIVE DECISIONING
       +
CAMPAIGN DETECTION
       +
COUNTERFACTUAL EXPLANATIONS
       +
ATTACK SIMULATION
       +
GOVERNED MODEL / RULE LIFECYCLE
```

That combination demonstrates:

```text
ML engineering
+
distributed systems
+
graph systems
+
security
+
fintech
+
MLOps
+
risk operations
+
product design
```

---

# 57. Important Scope Boundary

ATDP is a **fraud/risk decisioning platform**.

It should integrate with:

```text
core banking
KYC
AML
sanctions
payment processing
authentication
case management
```

rather than attempting to replace all of them.

A realistic architecture is:

```text
                  BANK ECOSYSTEM

Core Banking ─────────────┐
Payment Rails ────────────┤
Card Processor ───────────┤
KYC / Identity ───────────┤
Auth / 3DS ───────────────┤
                           ↓
                 ┌──────────────────┐
                 │       ATDP       │
                 │ Risk Decisioning  │
                 └────────┬─────────┘
                          ↓
                  Cases / Actions
```

This makes the product more credible than claiming to be an entire banking platform.

---

# 58. Final Product Definition

> **ATDP is a real-time adaptive transaction defense platform for banks and payment providers. It combines behavioral intelligence, entity graphs, machine learning, anomaly detection, coordinated-attack detection, chargeback intelligence, and expected-loss optimization to choose the safest intervention for each transaction while giving risk teams explainable decisions, investigation tooling, governed model/rule deployment, and continuous feedback.**

---

# 59. North-Star Metric

> **Minimize expected financial loss per transaction while preserving legitimate customer conversion.**

The system should optimize across the competing objectives of fraud loss, chargeback loss, false positives, customer friction, and operational cost rather than maximizing raw fraud-blocking rate.
