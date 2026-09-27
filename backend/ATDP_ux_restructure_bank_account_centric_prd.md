# ATDP — Adaptive Financial Risk Operating System
## Product Requirements & UX Direction v4

### Core product idea

ATDP is not primarily an "AI fraud dashboard." It is a **banking-risk operating system** that starts with the customer/account and uses intelligence to explain what is happening, identify abnormal behavior, connect related entities, recommend an intervention, and preserve the evidence/audit trail.

> **Account → Behavior → Transaction → Risk → Relationships → Threat → Decision → Case → Audit**

---

# 1. Product Vision

Build a platform that a bank, payment provider, or fintech risk team can use to understand suspicious financial activity without forcing analysts to jump between a core-banking screen, fraud tool, graph tool, case system, and audit system.

The product should unify:

- Account 360
- Passbook / transaction history
- Cash-flow intelligence
- Beneficiary intelligence
- Device intelligence
- Network intelligence
- Real-time transaction risk
- Fraud / ATO / APP / mule / chargeback signals
- Entity relationships
- Campaign detection
- Adaptive intervention
- Deep investigation
- Case management
- Evidence
- Audit
- Consent/data provenance
- Model/rule governance
- Historical replay
- Attack simulation

---

# 2. Most Important UX Principle

## Make the bank account the hero, not the AI.

The current interface looks visually sophisticated but is overloaded with:

- neon status colors
- ML/model terminology
- telemetry
- campaign labels
- badges
- engineering metrics
- multiple colored systems

That makes the product read as an **AI cybersecurity demo**.

The target experience should instead feel like:

> **A premium financial operations platform with intelligent risk assistance underneath it.**

AI/ML/graph capabilities should appear when the user needs them.

---

# 3. Primary Information Hierarchy

The whole application should follow:

```text
CUSTOMER / ACCOUNT
        ↓
FINANCIAL HISTORY
        ↓
CURRENT TRANSACTION
        ↓
BEHAVIORAL DEVIATION
        ↓
RISK SIGNALS
        ↓
RELATIONSHIPS
        ↓
CAMPAIGN / THREAT
        ↓
RECOMMENDED ACTION
        ↓
INVESTIGATION
        ↓
CASE
        ↓
AUDIT
```

Do not expose every layer simultaneously.

---

# 4. Navigation

### Primary navigation

```text
OVERVIEW
ACCOUNTS
TRANSACTIONS
ALERTS
INVESTIGATIONS
CASES
CAMPAIGNS
REPORTS
```

### Secondary / specialist navigation

```text
RISK ENGINE
  Rules
  Models
  Simulator
  Attack Lab
  Monitoring

ADMIN
  Consents
  Evidence
  Audit
  Settings
```

This is more believable than placing `ENGINE`, `SIGNALS`, `LAB`, `MODELS`, and `SIMULATOR` beside normal banking workflows.

---

# 5. Visual Design System

## Color

Use primarily:

```text
Near-black
White / warm white
Neutral grey
One brand accent
```

Recommended:

```css
--bg: #070707;
--surface: #101010;
--surface-2: #151515;
--text: #F5F4EF;
--muted: #929292;
--line: #282828;
--accent: #39FF88;
```

Semantic colors:

```text
Approved  → green
Review    → amber
Critical  → red
```

Do not use cyan, magenta, yellow, green, red, and orange simultaneously throughout the interface.

Use additional neon colors only in special modules such as Attack Lab.

---

# 6. Typography

Maintain the strong editorial feel of the reference site, but reduce oversized type inside operational areas.

### Landing / public site

```text
Hero: 100–180px
Section heading: 70–110px
```

### Bank console

```text
Page title: 32–48px
Account name: 32–42px
Metric: 28–44px
Body: 13–16px
Metadata: 10–12px
```

Large type should communicate hierarchy, not create noise.

---

# 7. Command Center

## Purpose

Answer:

> What requires attention right now?

### Header

```text
COMMAND CENTER

05 SEP 2026
LIVE
```

### Primary metrics

```text
₹4.8Cr
Fraud prevented

1.42M
Transactions

96.8%
Approval rate

2.1%
False-positive rate

42ms
Median decision

17
Open high-risk cases
```

Avoid putting model precision/recall and architecture terminology in the primary hero.

Those belong in Model Monitoring.

---

# 8. Command Center — Attention Feed

Primary module:

```text
REQUIRES ATTENTION
```

Rows:

```text
ACCOUNT      EVENT               RISK      ACTION
••••4821     ₹84k transfer       HIGH      REVIEW
••••1092     New beneficiary     HIGH      STEP-UP
••••7820     ATO sequence        CRITICAL  BLOCK
••••2911     Unusual cash flow   MEDIUM    REVIEW
```

Clicking a row opens Investigation.

---

# 9. Account 360 — Signature Feature

This should become the strongest screen in the entire product.

### Header

```text
RAHUL SHARMA

Premium · Active
Account ••••4821
6Y 4M relationship

Available             Current
₹1,84,240             ₹2,14,820
```

Secondary information:

```text
Branch: Connaught Place
KYC: Verified
Last activity: 14:41
```

Keep sensitive fields masked by default.

---

# 10. Account 360 Navigation

```text
OVERVIEW
PASSBOOK
CASH FLOW
CARDS
BENEFICIARIES
DEVICES
RISK
NETWORK
CASES
AUDIT
CONSENT
```

Only the selected tab expands deeply.

---

# 11. Account Overview

Sections:

```text
CUSTOMER
ACCOUNT
BEHAVIOR
RISK
RECENT ACTIVITY
OPEN CASES
LINKED ENTITIES
```

### Behavioral snapshot

```text
Typical transfer       ₹2k–₹12k
Typical payment        ₹1.5k–₹8k
Usual hours             09:00–22:30
Known devices            3
Known locations          2
Known beneficiaries      8
```

---

# 12. Passbook

The passbook must look like a legitimate financial activity timeline, not an AI table.

```text
05 SEP

14:42
-₹84,000
Instant Transfer
New Beneficiary

⚠ Unusual


11:20
-₹2,450
Grocery
Normal


04 SEP

18:22
+₹1,48,000
Salary
Normal
```

### Filters

```text
Date
Amount
Credit / debit
Payment rail
Merchant
Beneficiary
Category
Risk
Status
```

---

# 13. Passbook Transaction Drilldown

Clicking a transaction reveals:

```text
TRANSACTION #TX-92831

₹84,000
Instant Transfer

FRAUD RISK             82
ATO RISK               67
APP RISK               74
CHARGEBACK RISK         8
NOVELTY                92
```

Then:

```text
WHY THIS IS UNUSUAL

Amount is 7.8× customer baseline
Beneficiary created 2 min ago
Device never seen before
Activity occurred outside normal hours
Related account cluster detected
```

Then:

```text
[View graph]
[Investigate]
[Create case]
```

---

# 14. Behavioral Baseline

The system should distinguish:

```text
NORMAL
vs
CURRENT
```

Example:

```text
NORMAL

Transfer       ₹2k–₹12k
Time           09:00–22:30
Location       Delhi NCR
Device         iPhone
Beneficiaries  8 known


CURRENT

Transfer       ₹84,000
Time           03:14
Location       Dubai
Device         Windows / new
Beneficiary    first use
```

Output:

```text
BEHAVIOR DEVIATION
94 / 100
```

The score is an indicator, not proof of fraud.

---

# 15. Cash-Flow Intelligence

Show financial behavior at account level.

```text
THIS MONTH

Income           ₹1,48,000
Expenses           ₹91,400
Transfers In       ₹42,000
Transfers Out      ₹88,000
Net Cash Flow      ₹10,600
```

### Categories

```text
Salary
Rent
Utilities
Food
Travel
Subscriptions
Shopping
EMI
Transfers
Cash
Investments
```

---

# 16. Cash-Flow Anomalies

Detect:

### Rapid pass-through

```text
₹50k received
↓ 4 min
₹48.5k sent
```

### Funnel

```text
A ─₹50k─┐
B ─₹70k─┼→ ACCOUNT → ₹220k → BENEFICIARY X
C ─₹100k┘
```

### Sudden baseline change

```text
Normal monthly transfers: ₹25k
Current month: ₹3.4L

Deviation: HIGH
```

Flag patterns for investigation; do not automatically claim criminal conduct.

---

# 17. Beneficiary Intelligence

```text
BENEFICIARY #291

Created:
2 minutes ago

Prior customer interactions:
0

Linked accounts:
7

Shared devices:
3

Shared networks:
2

Risk signal:
91
```

Recommended action:

```text
STEP-UP REQUIRED
```

---

# 18. Device Intelligence

```text
DEVICE-991

First seen: Today
Last seen: Today

Customers linked: 9
Accounts linked: 12
Confirmed fraud links: 3

Risk signal: 94
```

Related activity:

```text
View linked accounts →
```

---

# 19. Network Intelligence

Show:

```text
Network reputation
ASN
VPN / proxy indicator
Approximate geography
Known-account count
Historical risk
Velocity
```

Do not make an IP address alone a block reason.

---

# 20. Entity Graph

This is a supporting intelligence layer.

Entities:

```text
Customer
Account
Card
Device
IP
Phone
Email
Beneficiary
Merchant
Session
Transaction
```

Example:

```text
CUSTOMER
    │
 ACCOUNT
 ├── DEVICE
 ├── IP
 ├── BENEFICIARY
 └── TRANSACTIONS
        │
     MERCHANT
```

The graph should answer:

> What else is connected to this event?

---

# 21. Fraud Campaigns

A campaign is created when multiple events share meaningful relationships or temporal/behavioral patterns.

```text
CAMPAIGN #1842

17 accounts
6 devices
3 network clusters
31 cards
3 beneficiaries

Exposure
₹18.4L

Confidence
94%

Status
ACTIVE
```

Use the campaign page as a deeper investigation area, not the default home-screen centerpiece.

---

# 22. Campaign Timeline

```text
09:31
First suspicious account

09:48
Shared device detected

10:02
Beneficiary overlap

10:17
Velocity spike

10:19
Campaign generated
```

---

# 23. Adaptive Decisioning

Replace binary:

```text
ALLOW / BLOCK
```

with:

```text
APPROVE
APPROVE + MONITOR
3DS
OTP
BIOMETRIC
HOLD
REVIEW
BLOCK
```

The system evaluates:

```text
fraud loss
chargeback loss
customer friction
operational cost
institution policy
```

Goal:

> **Minimize expected loss without unnecessarily disrupting legitimate customers.**

---

# 24. Decision Explanation

Example:

```text
RECOMMENDED ACTION
STEP-UP AUTHENTICATION

WHY

Fraud risk: 72
New beneficiary
New device
High behavior deviation

BLOCK would reduce fraud exposure
but create unnecessary customer friction.

STEP-UP provides a lower expected loss.
```

This is much more credible than:

```text
AI says BLOCK
```

---

# 25. Multi-Model Intelligence

Models may include:

```text
Fraud
ATO
APP / Social Engineering
Chargeback
Mule
Novelty
Campaign
```

Display them only in Investigation or advanced views.

Do not place model labels everywhere.

---

# 26. Deep Investigation

The investigation screen should combine:

```text
Transaction
Account
Behavior
Timeline
Risk
Relationships
Campaign
Decision
Evidence
```

Layout:

```text
TRANSACTION
₹84,000
STEP-UP

ACCOUNT
••••4821

RISK
84

WHY
New beneficiary
New device
Amount deviation

TIMELINE
Login → Device → Beneficiary → Payment

NETWORK
4 linked accounts
2 devices
1 campaign
```

---

# 27. Counterfactuals

```text
CURRENT
Risk 84 → STEP-UP

Without new device
Risk 63 → REVIEW

Without network signal
Risk 54 → 3DS

Without velocity
Risk 47 → APPROVE
```

The analyst understands what drove the decision.

---

# 28. Account Takeover Sequence

Track:

```text
LOGIN
↓
DEVICE CHANGE
↓
PASSWORD RESET
↓
PROFILE UPDATE
↓
BENEFICIARY ADDITION
↓
LARGE TRANSFER
```

Output:

```text
ATO RISK
91

Sequence anomaly detected.
```

---

# 29. APP / Social Engineering

Distinguish:

```text
UNAUTHORIZED FRAUD
```

from:

```text
POSSIBLE AUTHORIZED SCAM
```

Signals:

```text
new beneficiary
first-time large transfer
unusual recipient
new device
unusual timing
large amount
session anomaly
```

The platform recommends stronger verification instead of automatically labeling the customer fraudulent.

---

# 30. Mule / Pass-Through Detection

Indicators:

```text
many unrelated inbound accounts
rapid outbound transfers
short holding times
new beneficiaries
network growth
unusual velocity
```

Example:

```text
MULE RISK

Inbound links     28
Outbound links    17
Median hold       11m
Risk               93
```

---

# 31. Chargeback Intelligence

Show separately:

```text
Fraud risk:        31
Chargeback risk:   78
```

Factors:

```text
customer disputes
merchant history
refund activity
authentication
purchase pattern
delivery evidence
```

---

# 32. Case Management

Existing Kanban remains.

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
Customer
Accounts
Transactions
Campaigns
Risk
Evidence
Timeline
Notes
Owner
Audit
```

---

# 33. Evidence

Create an evidence vault:

```text
Transaction
Authentication
Device metadata
Network metadata
Account timeline
Merchant information
Delivery data
Refund information
Analyst notes
Decision history
```

Use tokenized/masked payment identifiers.

---

# 34. Audit

Record:

```text
Account access
Transaction access
Decision
Rule change
Model deployment
Policy change
Case update
Evidence export
Consent access
Consent revocation
Admin action
```

Every event:

```text
WHO
WHAT
WHEN
WHY
BEFORE
AFTER
REQUEST ID
```

---

# 35. Consent Center

The product must **not ask users to enter arbitrary bank credentials**.

For a realistic banking prototype:

```text
Approved connector
Sandbox
Consent-based financial data
Institution APIs
```

Example:

```text
DATA CONNECTION

Institution
Example Bank

Account
••••4821

Data
Transactions
Balance
Account details

Purpose
Fraud Investigation

Duration
90 days

● ACTIVE

[View consent]
[Revoke]
```

For a portfolio build use synthetic data or a sandbox.

---

# 36. Data Provenance

Every imported financial datum should be traceable:

```text
SOURCE
Example Bank

CONNECTOR
Approved / Sandbox

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

# 37. Attack Lab

Keep this as an advanced module.

Scenarios:

```text
Card Testing
Credential Stuffing
Account Takeover
Velocity Attack
Mule Network
Coordinated Campaign
APP Scam
New Beneficiary Attack
Device Farm
Synthetic Identity
```

Flow:

```text
SCENARIO
 ↓
SYNTHETIC EVENTS
 ↓
RISK ENGINE
 ↓
GRAPH
 ↓
CAMPAIGN DETECTION
 ↓
DECISION
 ↓
RESULT
```

---

# 38. Replay

Risk teams should be able to test new policies against historical/synthetic transactions.

```text
CURRENT POLICY
vs
PROPOSED POLICY
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

---

# 39. Policy Simulator

Allow:

```text
fraud threshold
70 → 80

new-device score
+15 → +25

high-risk beneficiary
→ force step-up
```

Show expected operational/business consequences before deployment.

---

# 40. Model Center

Keep specialist ML information here.

Track:

```text
Model version
Feature set
Training period
Precision
Recall
AUC
False positives
Latency
Drift
Approval
Rollback
```

The command center should summarize this rather than displaying ML diagnostics everywhere.

---

# 41. Rules

Categories:

```text
Velocity
Account
Device
Network
Beneficiary
Payment
Geo
Graph
Campaign
Merchant
Customer
Channel
```

Actions:

```text
Increase Risk
Force Step-up
Block
Create Case
Watch
Alert
Approve
```

---

# 42. Rules / Model Governance

Use:

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

Important production changes use maker-checker separation.

---

# 43. Threat Monitoring

Monitor:

```text
Model drift
Feature drift
Fraud rate changes
False-positive changes
Campaign growth
Device spikes
Beneficiary spikes
Network anomalies
Rule firing spikes
```

Example:

```text
NEW THREAT PATTERN

Shared-device activity
+41% in 2 hours

Potential campaign detected.
```

---

# 44. Investigator Copilot

Allowed:

```text
Explain this transaction.
Summarize this account.
Show connected entities.
Find similar cases.
Explain the decision.
Draft case notes.
```

Do not let it independently:

```text
freeze accounts
permanently block customers
override policies
submit regulatory reports
```

Use human approval for high-impact actions.

---

# 45. Global Search

Search across:

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

# 46. Landing Page vs Console

The public-facing website can retain the cinematic reference style:

```text
black
oversized type
layered technical objects
green accent
subtle neon
parallax
scroll-driven motion
```

The authenticated bank console must be more restrained:

```text
financial data first
clear hierarchy
minimal color
dense when necessary
AI revealed contextually
```

This distinction is essential.

---

# 47. UI Component Priorities

### Tier 1 — always visible

```text
Customer
Account
Balance
Transaction
Risk
Decision
Alerts
```

### Tier 2 — visible when relevant

```text
Behavior
Beneficiary
Device
Network
Campaign
Case
```

### Tier 3 — advanced

```text
Model reasoning
Graph internals
Counterfactuals
Simulation
Rule configuration
Drift
```

This three-tier system will remove most of the current visual clutter.

---

# 48. Recommended Command Center Layout

```text
┌─────────────────────────────────────────────────────────┐
│ COMMAND CENTER                              LIVE ●      │
│                                                         │
│ ₹4.8Cr       1.42M       96.8%      2.1%      42ms     │
│ Prevented    Txns        Approval   FP Rate   Median   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ REQUIRES ATTENTION                                      │
│                                                         │
│ ••••4821   ₹84k Transfer        HIGH       Review       │
│ ••••1092   New beneficiary      HIGH       Step-up      │
│ ••••7820   ATO pattern          CRITICAL   Block        │
│                                                         │
├───────────────────────────┬─────────────────────────────┤
│ ACCOUNT ACTIVITY          │ ACTIVE CAMPAIGNS            │
│                           │                             │
│ 12.4k events              │ #1842  ATO                  │
│ 18 high risk              │ #1839  Card testing         │
└───────────────────────────┴─────────────────────────────┘
```

---

# 49. Recommended Account 360 Layout

```text
┌─────────────────────────────────────────────────────────┐
│ RAHUL SHARMA                   PREMIUM · ACTIVE          │
│ ••••4821 · 6Y 4M                                      │
│                                                         │
│ AVAILABLE                     CURRENT                   │
│ ₹1,84,240                     ₹2,14,820                │
├─────────────────────────────────────────────────────────┤
│ Overview | Passbook | Cash Flow | Cards | Beneficiary │
├──────────────────────────┬──────────────────────────────┤
│ BEHAVIOR                 │ RISK                         │
│                          │                              │
│ Typical transfer ₹2–12k │ Fraud        28             │
│ Typical time 09–22:30   │ ATO          12             │
│ Devices 3               │ APP          19             │
│ Locations 2             │ Mule         63             │
├──────────────────────────┴──────────────────────────────┤
│ RECENT ACTIVITY                                         │
│                                                         │
│ ₹84k Transfer        ⚠ Unusual                         │
│ ₹2,450 Grocery       Normal                            │
│ ₹1,850 Fuel          Normal                            │
└─────────────────────────────────────────────────────────┘
```

---

# 50. Recommended Transaction Detail

```text
₹84,000
INSTANT TRANSFER

● STEP-UP REQUIRED

Customer baseline:
₹2k–₹12k

Current:
₹84k

WHY
New beneficiary
New device
Outside normal hours
High relationship risk

[ View relationships ]
[ Investigate ]
[ Create case ]
```

This is much more useful than a wall of model telemetry.

---

# 51. Backend Architecture

```text
                  BANK / APPROVED DATA
                         │
                EVENT / CONSENT LAYER
                         ↓
                  NORMALIZATION
                         ↓
              ┌──────────┼──────────┐
              ↓          ↓          ↓
          Account DB   Redis      Graph DB
              │          │          │
              └──────────┼──────────┘
                         ↓
                   FEATURE ENGINE
                         ↓
            ┌────────────┼───────────┐
            ↓            ↓           ↓
          Rules         ML        Anomaly
            └────────────┼───────────┘
                         ↓
                    CAMPAIGNS
                         ↓
                 DECISION ENGINE
                         ↓
                 CASE / ACTIONS
                         ↓
                    AUDIT
```

---

# 52. API Requirements

```http
POST /v1/risk/evaluate
GET  /v1/accounts/{id}
GET  /v1/accounts/{id}/transactions
GET  /v1/accounts/{id}/cash-flow
GET  /v1/accounts/{id}/entities
GET  /v1/transactions/{id}
GET  /v1/campaigns
GET  /v1/campaigns/{id}
POST /v1/cases
GET  /v1/cases
GET  /v1/audit
GET  /v1/consents
POST /v1/simulations
POST /v1/replay
```

---

# 53. Data Model

```text
Customer
Account
Transaction
Card
Device
IP
Beneficiary
Merchant
Session
Campaign
Case
Decision
Rule
Model
Consent
Evidence
AuditEvent
```

Relationships:

```text
Customer → Account
Account → Transaction
Customer → Device
Transaction → Beneficiary
Transaction → Merchant
Device → IP
Transaction → Campaign
Transaction → Case
Decision → Rule
Decision → Model
Data → Consent
Action → AuditEvent
```

---

# 54. Security Requirements

```text
TLS
Encryption at rest
Secrets management
MFA
SSO
RBAC
Least privilege
Tenant isolation
PII masking
Data minimization
Audit logging
Network segmentation
Key rotation
```

For payment-card data, comply with applicable payment-security requirements.

---

# 55. Privacy Requirements

```text
Consent
Purpose limitation
Data minimization
Retention
Field masking
Access controls
Access logging
Regional controls
Deletion workflows where applicable
```

Default:

```text
PAN → ••••4921
Email → a***@example.com
Phone → ******8212
```

---

# 56. Performance

Initial target:

```text
5,000 TPS
```

Scale architecture:

```text
50,000+ TPS
```

Decision target:

```text
p50 < 50ms
p95 < 100ms
p99 < 200ms
```

Validate targets against actual payment-rail requirements.

---

# 57. Resilience

Model unavailable:

```text
Rules + cached features
```

Feature store unavailable:

```text
Cached/degraded mode
```

Graph unavailable:

```text
Continue without graph-derived features
```

Entire service unavailable:

```text
Institution-configured fail-open / fail-closed
```

Every fallback must be observable.

---

# 58. Multi-Tenancy

Each institution must have controlled separation of:

```text
Data
Policies
Rules
Models
Users
Audit
Encryption configuration
```

Large institutions may use isolated deployments.

---

# 59. Realistic Bank Connectivity

The platform should integrate with, not replace:

```text
Core Banking
Payment Processing
Card Processor
Authentication / 3DS
KYC / identity systems
Device intelligence
Network intelligence
Case systems
SIEM
Data warehouse
Approved financial-data connectivity
```

For India-oriented financial-data sharing, an Account Aggregator/sandbox-style consent model is more realistic than direct credential scraping.

---

# 60. Demo Data

Use synthetic data.

Suggested:

```text
10,000 customers
25,000 accounts
80,000 transactions
40,000 devices
15,000 beneficiaries
1,000 merchants
50 synthetic campaigns
```

Generate both normal and anomalous behavior.

---

# 61. Golden Demo

The entire product should be demonstrable through one story.

```text
OPEN ACCOUNT 360
      ↓
VIEW PASSBOOK
      ↓
₹84K TRANSFER APPEARS
      ↓
NEW BENEFICIARY
      ↓
NEW DEVICE
      ↓
BEHAVIOR DEVIATION
      ↓
GRAPH FINDS 4 RELATED ACCOUNTS
      ↓
CAMPAIGN ENGINE LINKS EVENTS
      ↓
RISK SCORES UPDATE
      ↓
ADAPTIVE ENGINE CHOOSES STEP-UP
      ↓
AUTHENTICATION FAILS
      ↓
BLOCK
      ↓
CASE CREATED
      ↓
EVIDENCE ATTACHED
      ↓
AUDIT RECORDED
      ↓
REPLAY SHOWS ALTERNATIVE POLICY
```

This should be the centerpiece of the project presentation.

---

# 62. Design Cleanup Checklist

### Remove/reduce

```text
Too many colored badges
Too many simultaneous model metrics
Repeated "AI / ML / signal / telemetry" labels
Engineering metrics from the primary view
Unnecessary decorative boxes
Multiple competing accent colors
```

### Increase

```text
Account identity
Balances
Transaction history
Customer behavior
Financial context
Actionable alerts
Clear decisions
Human-readable explanations
```

---

# 63. What Makes the Product Different

The final differentiator is not "we have an ML model."

It is the combination:

```text
ACCOUNT 360
+
PASSBOOK
+
BEHAVIORAL BASELINE
+
ENTITY GRAPH
+
CAMPAIGN DETECTION
+
MULTI-MODEL RISK
+
ADAPTIVE INTERVENTION
+
INVESTIGATION
+
CASE MANAGEMENT
+
REPLAY
+
ATTACK LAB
+
AUDIT
```

The platform sees **the financial context around the transaction**, not just the transaction.

---

# 64. Final Product Statement

> **ATDP is a bank-oriented financial-risk operating system that gives investigators one contextual view of the customer, account, transaction history, financial behavior, relationships, emerging threats, risk signals, recommended action, investigation evidence, and audit trail.**

The AI is the engine underneath.

**The account is the product.**

---

# 65. Scope Boundary

Do not claim this portfolio prototype:

```text
accesses arbitrary real bank accounts
scrapes bank credentials
is PCI certified
is RBI approved
replaces AML systems
makes legal determinations
is production-ready for a bank
```

Instead:

> **Bank-oriented reference implementation / prototype for adaptive transaction defense.**

Real deployments require institution-approved connectivity, security review, privacy controls, operational resilience, formal model governance, regulatory assessment, and integration testing.

---

# 66. North-Star Metric

> **Minimize expected financial loss per transaction while preserving legitimate customer conversion.**

A system that simply blocks more payments is not necessarily better.

---

# 67. Definition of Done

A reviewer must be able to:

```text
✓ Open a customer account
✓ View account details
✓ View passbook
✓ Understand normal behavior
✓ Inspect cash flow
✓ Open a suspicious transaction
✓ See risk and reasons
✓ See linked entities
✓ See a campaign
✓ Run counterfactuals
✓ See adaptive decision
✓ Create a case
✓ Attach evidence
✓ Inspect audit
✓ Inspect consent/provenance
✓ Run an attack scenario
✓ Replay a policy
✓ Review model/rule governance
```

At that point the project is no longer simply a fraud classifier.

It is a coherent **financial-risk operations platform**.
