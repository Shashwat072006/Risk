"use client";
import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Sub-components
import TransactionForm, { TxnFormData, DEFAULT_FORM } from "@/components/TransactionForm";
import ScorePanel from "@/components/ScorePanel";
import RulesList from "@/components/RulesList";
import FeatureBar from "@/components/FeatureBar";
import MultiModelScores, { ModelScore } from "@/components/MultiModelScores";
import CounterfactualPanel, { CounterfactualItem } from "@/components/CounterfactualPanel";
import TimelineView from "@/components/TimelineView";
import BehavioralBaseline, { BaselineDimension } from "@/components/BehavioralBaseline";
import MoneyFlowGraph, { FlowNode, FlowEdge } from "@/components/MoneyFlowGraph";
import TransactionHistory, { Transaction } from "@/components/TransactionHistory";
import RiskTimeline360, { RiskEvent } from "@/components/RiskTimeline360";
import ConfusionMatrix from "@/components/ConfusionMatrix";
import MetricCard from "@/components/MetricCard";

// Bank-Grade Account 360 & PRD v3 Components
import AccountPassbook from "@/components/AccountPassbook";
import CashFlowView from "@/components/CashFlowView";
import CardsView from "@/components/CardsView";
import BeneficiaryIntelligence from "@/components/BeneficiaryIntelligence";
import DeviceIntelligence from "@/components/DeviceIntelligence";
import CustomerRiskProfile from "@/components/CustomerRiskProfile";
import NetworkIntelligence from "@/components/NetworkIntelligence";
import ConsentProvenanceView from "@/components/ConsentProvenanceView";
import PolicySimulatorReplay from "@/components/PolicySimulatorReplay";
import GoldenDemoPlayer, { GOLDEN_STEPS } from "@/components/GoldenDemoPlayer";

const API = "http://localhost:8000";

// ════════════════════════════════════════════════════════════════════════════
// MASTER MODULE TABS
// ════════════════════════════════════════════════════════════════════════════

type ModuleTab =
  | "command"
  | "account360"
  | "console"
  | "alerts"
  | "investigate"
  | "cases"
  | "campaigns"
  | "metrics"
  | "rules"
  | "models"
  | "policysim"
  | "attacklab"
  | "audit";

interface TabDef {
  key: ModuleTab;
  num: string;
  label: string;
  badge?: string;
  group: "primary" | "specialist";
}

// PRD v4 Navigation System (§4)
const MODULE_TABS: TabDef[] = [
  // Primary Banking Navigation
  { key: "command",     num: "01", label: "Overview",       badge: "LIVE",   group: "primary" },
  { key: "account360",  num: "02", label: "Accounts",       badge: "HERO",   group: "primary" },
  { key: "console",     num: "03", label: "Transactions",                    group: "primary" },
  { key: "alerts",      num: "04", label: "Alerts",         badge: "5 PENDING", group: "primary" },
  { key: "investigate", num: "05", label: "Investigations",                  group: "primary" },
  { key: "cases",       num: "06", label: "Cases",                           group: "primary" },
  { key: "campaigns",   num: "07", label: "Campaigns",      badge: "ACTIVE", group: "primary" },
  { key: "metrics",     num: "08", label: "Reports",                         group: "primary" },
  // Specialist Navigation
  { key: "rules",       num: "09", label: "Rules",                           group: "specialist" },
  { key: "models",      num: "10", label: "Models",                          group: "specialist" },
  { key: "policysim",   num: "11", label: "Simulator",      badge: "REPLAY", group: "specialist" },
  { key: "attacklab",   num: "12", label: "Attack Lab",                      group: "specialist" },
  { key: "audit",       num: "13", label: "Audit",                           group: "specialist" },
];

// ════════════════════════════════════════════════════════════════════════════
// SHARED DATA DEFINITIONS & MOCKS
// ════════════════════════════════════════════════════════════════════════════

// -- Account 360 Profiles
const ACC_42817_BASELINE: BaselineDimension[] = [
  { label: "Transfer Velocity", current: 0.84, baseline: 0.12, rawCurrent: "8.4 txns/hr", rawBaseline: "1.2 txns/hr", unit: "txns/hr" },
  { label: "Typical Amount", current: 0.88, baseline: 0.20, rawCurrent: "₹84,000", rawBaseline: "₹3,800", unit: "INR" },
  { label: "Active Hours (IST)", current: 0.25, baseline: 0.85, rawCurrent: "03:30 AM", rawBaseline: "07:30 PM", unit: "time" },
  { label: "Unique Devices (30d)", current: 0.90, baseline: 0.15, rawCurrent: "5 devices", rawBaseline: "1 device", unit: "devices" },
  { label: "Beneficiary Novelty", current: 0.95, baseline: 0.08, rawCurrent: "95% new", rawBaseline: "8% new", unit: "% new" },
  { label: "Cross-Border Ratio", current: 0.67, baseline: 0.00, rawCurrent: "67% intl", rawBaseline: "0% intl", unit: "% intl" },
];

const ACC_42817_NODES: FlowNode[] = [
  { id: "center", label: "ACC-42817 (Rohan)", type: "account", riskScore: 94, volume: 98712, txnCount: 26, country: "IN" },
  { id: "n1", label: "Intl Wire NG", type: "flagged", riskScore: 94, volume: 84000, txnCount: 1, country: "NG" },
  { id: "n2", label: "Croma Electronics", type: "merchant", riskScore: 18, volume: 4200, txnCount: 3, country: "IN" },
  { id: "n3", label: "FastPay Beneficiary", type: "flagged", riskScore: 89, volume: 84000, txnCount: 1, country: "NG" },
  { id: "n4", label: "Swiggy / Zomato", type: "merchant", riskScore: 8, volume: 1850, txnCount: 8, country: "IN" },
  { id: "n5", label: "Uber India", type: "merchant", riskScore: 12, volume: 940, txnCount: 6, country: "IN" },
  { id: "n6", label: "Pvt Ltd Salary Cr", type: "peer", riskScore: 5, volume: 85000, txnCount: 1, country: "IN" },
];

const ACC_42817_EDGES: FlowEdge[] = [
  { from: "center", to: "n1", volume: 84000, txnCount: 1, riskScore: 94, direction: "out" },
  { from: "center", to: "n2", volume: 4200, txnCount: 3, riskScore: 18, direction: "out" },
  { from: "center", to: "n3", volume: 84000, txnCount: 1, riskScore: 89, direction: "out" },
  { from: "center", to: "n4", volume: 1850, txnCount: 8, riskScore: 8, direction: "out" },
  { from: "center", to: "n5", volume: 940, txnCount: 6, riskScore: 12, direction: "out" },
  { from: "n6", to: "center", volume: 85000, txnCount: 1, riskScore: 5, direction: "in" },
];

const ACC_42817_TXN: Transaction[] = [
  { id: "TX-99001", date: "2024-11-28", time: "09:41", merchant: "Niyo Remit / FastPay Lagos", category: "Wire", amount: 84000, currency: "INR", channel: "wire", decision: "BLOCK", riskScore: 94, country: "NG" },
  { id: "TX-99002", date: "2024-11-28", time: "09:43", merchant: "Binance P2P Rapid", category: "Crypto P2P", amount: 120000, currency: "INR", channel: "wallet", decision: "BLOCK", riskScore: 96, country: "KY" },
  { id: "TX-42817-03", date: "2024-11-27", time: "18:22", merchant: "Croma Electronics Mumbai", category: "Electronics", amount: 4200, currency: "INR", channel: "card", decision: "ALLOW", riskScore: 18, country: "IN" },
  { id: "TX-42817-04", date: "2024-11-25", time: "12:04", merchant: "TechCorp Pvt Ltd", category: "Salary", amount: -85000, currency: "INR", channel: "wire", decision: "ALLOW", riskScore: 5, country: "IN" },
];

const ACC_42817_EVENTS: RiskEvent[] = [
  { txnId: "TX-99001", timestamp: "2024-11-28T09:41:00Z", decision: "BLOCK", riskScore: 94, topDriver: "New device + Lagos IP + Campaign #1842", channel: "mobile", amount: 84000, currency: "INR", merchant: "Niyo Remit", campaignId: "#1842" },
  { txnId: "TX-99002", timestamp: "2024-11-28T09:43:00Z", decision: "BLOCK", riskScore: 96, topDriver: "Velocity burst post-decline to crypto off-ramp", channel: "web", amount: 120000, currency: "INR", merchant: "Binance P2P", campaignId: "#1842" },
  { txnId: "TX-42817-03", timestamp: "2024-11-27T18:22:00Z", decision: "ALLOW", riskScore: 18, topDriver: "Known merchant + resident device", channel: "card", amount: 4200, currency: "INR", merchant: "Croma Mumbai" },
];

// -- Multi-Transaction DB for Investigation
const TRANSACTIONS_DB: Record<string, any> = {
  "TX-99001": {
    id: "TX-99001",
    accountId: "ACC-42817",
    customerName: "Rohan Mehta",
    decision: "BLOCK",
    risk_score_pct: 94,
    rule_score: 0.92,
    ml_prob: 0.97,
    latency_ms: 41.2,
    customer_age: "4.2 years",
    device: "NEW / UNRECOGNIZED",
    device_id: "DEV-81729-IOS",
    ip_risk: "HIGH RISK (VPN/TOR)",
    ip_address: "197.210.226.41 [Tokenized]",
    asn: "AS37148 MTN Nigeria (Anomalous)",
    campaign: "#1842",
    amount: "INR 84,000",
    merchant: "Niyo Remit / Rapid Wire",
    country: "NG",
    channel: "Mobile App (Direct API)",
    payment_method: "Visa Corporate Debit",
    tokenized_pan: "•••• •••• •••• 4921",
    cvv_status: "MATCH (Not stored - PCI 4.0)",
    three_ds_cavv: "AAABBBCCDDEEFF0011223344",
    three_ds_eci: "07 (Authentication Failed / Bypass)",
    explanation: "Critical account takeover detected. Unrecognized iOS device in Lagos initiated beneficiary modification followed by instantaneous ₹84,000 transfer. Strongly correlated with Campaign #1842 (17 linked accounts).",
    copilot_summary: "High-confidence Account Takeover (94% risk). Attack sequence conforms with credential stuffing: (1) Password changed 12 mins prior via Tor proxy, (2) Unknown iOS device paired without biometric handoff, (3) High-velocity instant transfer. Recommended: Immediate account freeze, invalidate tokens, file SAR.",
    multi_models: [
      { label: "Fraud", score: 94, color: "#FF4D4D", desc: "Card-testing / payment abuse" },
      { label: "ATO", score: 98, color: "#FF4D4D", desc: "Credential reuse & device hijacking" },
      { label: "Chargeback", score: 81, color: "#FFA31A", desc: "Probability of dispute/reversal" },
      { label: "Novelty", score: 95, color: "#FFA31A", desc: "Extreme deviation from 30d baseline" },
      { label: "Campaign", score: 96, color: "#39FF88", desc: "Clustered with Campaign #1842" },
    ],
    counterfactuals: [
      { removed_signal: "Lagos, NG IP geolocation", without_score: 72, without_decision: "STEP-UP" },
      { removed_signal: "New device anomaly", without_score: 58, without_decision: "REVIEW" },
      { removed_signal: "Campaign #1842 cluster link", without_score: 64, without_decision: "STEP-UP" },
      { removed_signal: "Recent password change (12m)", without_score: 42, without_decision: "APPROVE" },
    ],
    rules: [
      { rule_id: "R01", description: "Velocity: >3 txns in 5m post-credential change", weight: 0.95, triggered: true },
      { rule_id: "R02", description: "Impossible Travel: Mumbai -> Lagos in <45m", weight: 0.98, triggered: true },
      { rule_id: "R06", description: "High-risk geo egress (NG/PK/BD/RU/CN)", weight: 0.88, triggered: true },
      { rule_id: "R09", description: "New device + transfer amount > INR 50,000", weight: 0.92, triggered: true },
      { rule_id: "R12", description: "Entity graph linked to active Campaign #1842", weight: 0.96, triggered: true },
    ],
    features: [
      { feature: "geo_velocity_kmh", value: 0.994 },
      { feature: "device_novelty_score", value: 0.971 },
      { feature: "campaign_link_degree", value: 0.958 },
      { feature: "time_since_pwd_reset_hrs", value: 0.912 },
    ],
    timeline_events: [
      { time: "09:32", label: "Tor Exit Proxy session initiated", type: "risk" },
      { time: "09:35", label: "Password reset bypass attempted", type: "risk" },
      { time: "09:38", label: "New device DEV-81729 paired without MFA", type: "risk" },
      { time: "09:40", label: "FastPay Lagos beneficiary added", type: "risk" },
      { time: "09:41", label: "Payment attempt — INR 84,000", type: "block" },
      { time: "09:41", label: "Platform decision: Hard BLOCK (Rule R01)", type: "block" },
    ],
  },
  "TX-99002": {
    id: "TX-99002",
    accountId: "ACC-42817",
    customerName: "Rohan Mehta",
    decision: "BLOCK",
    risk_score_pct: 96,
    rule_score: 0.94,
    ml_prob: 0.98,
    latency_ms: 36.8,
    customer_age: "4.2 years",
    device: "NEW / EMULATOR",
    device_id: "DEV-81729-IOS",
    ip_risk: "HOSTING PROVIDER / VPN",
    ip_address: "185.220.101.5 [Tokenized]",
    asn: "AS60729 Zscaler / Tor Exit",
    campaign: "#1842",
    amount: "INR 1,20,000",
    merchant: "Binance P2P / SwiftCrypto",
    country: "SC",
    channel: "Web REST API",
    payment_method: "IMPS Instant Transfer",
    tokenized_pan: "•••• •••• •••• 4921",
    cvv_status: "NOT_APPLICABLE",
    three_ds_cavv: "N/A - Direct Push API",
    three_ds_eci: "N/A",
    explanation: "Rapid second liquidation attempt within 2 minutes of prior decline. Recipient matches known high-risk crypto off-ramp entity.",
    copilot_summary: "Automated follow-on attack. Follow-on P2P crypto rail payment of ₹1,20,000 attempted. Immediate lockdown recommended.",
    multi_models: [
      { label: "Fraud", score: 96, color: "#FF4D4D", desc: "Automated liquidation abuse" },
      { label: "ATO", score: 99, color: "#FF4D4D", desc: "Hostile takeover persistence" },
      { label: "Chargeback", score: 89, color: "#FFA31A", desc: "Near-certain dispute" },
      { label: "Novelty", score: 98, color: "#FFA31A", desc: "Unprecedented merchant type" },
      { label: "Campaign", score: 97, color: "#39FF88", desc: "Campaign #1842 node" },
    ],
    counterfactuals: [
      { removed_signal: "Velocity after decline", without_score: 84, without_decision: "BLOCK" },
      { removed_signal: "Crypto P2P MCC code", without_score: 76, without_decision: "STEP-UP" },
    ],
    rules: [
      { rule_id: "R01", description: "Velocity: Re-attempt within 120s of hard decline", weight: 0.99, triggered: true },
      { rule_id: "R07", description: "Crypto off-ramp destination on unverified account", weight: 0.94, triggered: true },
    ],
    features: [
      { feature: "seconds_since_last_decline", value: 0.995 },
      { feature: "high_risk_mcc_weight", value: 0.963 },
    ],
    timeline_events: [
      { time: "09:42", label: "Direct REST API payment call", type: "risk" },
      { time: "09:43", label: "Crypto mule liquidation — INR 1,20,000", type: "block" },
      { time: "09:43", label: "Automated Rejection: Rule R01 burst", type: "block" },
    ],
  },
  "TX-92831": {
    id: "TX-92831",
    accountId: "ACC-42817",
    customerName: "Rohan Mehta",
    decision: "STEP-UP",
    risk_score_pct: 84,
    rule_score: 0.72,
    ml_prob: 0.91,
    latency_ms: 38.4,
    customer_age: "4.0 years",
    device: "NEW DEVICE",
    device_id: "DEV-49912-AND",
    ip_risk: "HIGH RISK IP",
    ip_address: "102.89.23.11 [Tokenized]",
    asn: "AS29465 MainOne Cable NG",
    campaign: "#1842",
    amount: "INR 84,000",
    merchant: "International Wire Service",
    country: "NG",
    channel: "Web Portal",
    payment_method: "Mastercard Platinum",
    tokenized_pan: "•••• •••• •••• 8834",
    cvv_status: "MATCH",
    three_ds_cavv: "Pending Resolution",
    three_ds_eci: "02 (Attempted)",
    explanation: "High fraud score driven by new device registration, high-risk network origin, and unusual transfer velocity.",
    copilot_summary: "Borderline intervention zone (Risk 84). Biometric Step-Up chosen over outright block to balance customer friction.",
    multi_models: [
      { label: "Fraud", score: 84, color: "#FF4D4D", desc: "Payment fraud probability" },
      { label: "ATO", score: 91, color: "#FF4D4D", desc: "Account takeover likelihood" },
      { label: "Chargeback", score: 63, color: "#FFA31A", desc: "Dispute risk estimate" },
      { label: "Novelty", score: 92, color: "#FFA31A", desc: "Behavioral divergence" },
      { label: "Campaign", score: 88, color: "#39FF88", desc: "Campaign #1842 association" },
    ],
    counterfactuals: [
      { removed_signal: "New device signal", without_score: 63, without_decision: "REVIEW" },
      { removed_signal: "Network / IP risk", without_score: 52, without_decision: "3DS" },
    ],
    rules: [
      { rule_id: "R01", description: "Velocity: >5 txns in 1h from single device", weight: 0.85, triggered: true },
      { rule_id: "R06", description: "High-risk country IP (NG/PK/BD/RU/CN)", weight: 0.7, triggered: true },
    ],
    features: [
      { feature: "device_age_days", value: 0.982 },
      { feature: "prior_declines_1h", value: 0.874 },
    ],
    timeline_events: [
      { time: "09:41", label: "Login from Lagos IP", type: "risk" },
      { time: "09:44", label: "Wire transfer — INR 84,000", type: "block" },
      { time: "09:45", label: "FIDO2 WebAuthn Step-Up dispatched", type: "auth" },
    ],
  },
};

// -- Attack Lab Scenarios
const ATTACK_SCENARIOS = [
  {
    id: "ato",
    label: "Account Takeover",
    desc: "10,000 events · 500 identities · 125 devices",
    color: "#FF4D4D",
    baseline: { detection: 54, fp: 9, loss: 100 },
    withGraph: { detection: 77, fp: 6, loss: 58 },
    withCampaign: { detection: 88, fp: 3, loss: 38 },
    withAdaptive: { detection: 93, fp: 1.5, loss: 28 },
  },
  {
    id: "card_testing",
    label: "Card Testing",
    desc: "10,000 events · 500 cards · 35 IP ranges",
    color: "#FFA31A",
    baseline: { detection: 61, fp: 12, loss: 100 },
    withGraph: { detection: 82, fp: 7, loss: 63 },
    withCampaign: { detection: 91, fp: 4, loss: 42 },
    withAdaptive: { detection: 94, fp: 2, loss: 31 },
  },
  {
    id: "mule_network",
    label: "Mule Network",
    desc: "5,000 events · 200 accounts · 40 beneficiaries",
    color: "#FF4D4D",
    baseline: { detection: 41, fp: 15, loss: 100 },
    withGraph: { detection: 73, fp: 8, loss: 52 },
    withCampaign: { detection: 84, fp: 5, loss: 39 },
    withAdaptive: { detection: 90, fp: 2, loss: 27 },
  },
];

// -- Cases Kanban Data
const INITIAL_CASES_RECORD = {
  OPEN: [
    { id: "CASE-2210", type: "Coordinated ATO", severity: "CRITICAL", txnCount: 17, exposure: "INR 18.4L", owner: "Unassigned", campaign: "#1842", opened: "Today 09:41" },
    { id: "CASE-2208", type: "Card Testing Burst", severity: "HIGH", txnCount: 31, exposure: "INR 2.1L", owner: "Unassigned", campaign: "#1839", opened: "Today 08:12" },
  ],
  INVESTIGATING: [
    { id: "CASE-2199", type: "Mule Network", severity: "HIGH", txnCount: 9, exposure: "INR 6.7L", owner: "Analyst 021", campaign: "#1830", opened: "Yesterday" },
  ],
  ESCALATED: [
    { id: "CASE-2188", type: "Synthetic Identity", severity: "CRITICAL", txnCount: 23, exposure: "INR 42L", owner: "Risk Manager", opened: "2 days ago" },
  ],
  RESOLVED: [
    { id: "CASE-2180", type: "Card Not Present", severity: "HIGH", txnCount: 6, exposure: "INR 3.4L", owner: "Analyst 014", opened: "3 days ago" },
  ],
};

// -- Rules Inventory
const INITIAL_RULES_INVENTORY = [
  { id: "R-01", name: "impossible_travel_egress", category: "GEO", stage: "PRODUCTION", action: "INCREASE_RISK", weight: 0.95, condition: "geo_velocity_kmh > 800 AND session_delta_min < 60", hits: 342 },
  { id: "R-02", name: "burst_post_credential_change", category: "VELOCITY", stage: "PRODUCTION", action: "FORCE_STEP_UP", weight: 0.92, condition: "time_since_pwd_reset_min < 15 AND amount > 50000", hits: 129 },
  { id: "R-03", name: "entity_campaign_cluster_match", category: "ENTITY_GRAPH", stage: "PRODUCTION", action: "BLOCK", weight: 0.98, condition: "campaign_link_degree > 0 AND campaign_confidence >= 0.85", hits: 88 },
  { id: "R-04", name: "mule_rapid_drainage_ratio", category: "MULE", stage: "PRODUCTION", action: "CREATE_CASE", weight: 0.94, condition: "drainage_rate > 0.90 AND inflow_to_outflow_min < 30", hits: 53 },
  { id: "R-05", name: "sim_box_emulator_fingerprint", category: "DEVICE", stage: "CANARY", action: "BLOCK", weight: 0.91, condition: "emulator_flags_count >= 3 OR sim_box_confidence > 0.88", hits: 76 },
];

// -- Audit Entries
const INITIAL_AUDIT_STREAM = [
  { id: "AUD-9912", timestamp: "Today 19:42 UTC", actor: "analyst_021", action: "Emergency Account Lockout", target: "ACC-42817", hash: "e3b0c44298fc1c14..." },
  { id: "AUD-9911", timestamp: "Today 19:41 UTC", actor: "policy_engine", action: "Hard Rejection (Rule R-03)", target: "TX-99001", hash: "7f83b1657ff1fc53..." },
  { id: "AUD-9910", timestamp: "Today 18:30 UTC", actor: "risk_mgr_01", action: "SAR Form F-1 Filed", target: "ACC-90041", hash: "cb8379ac2098aa16..." },
  { id: "AUD-9909", timestamp: "Today 17:15 UTC", actor: "ml_ops_04", action: "Challenger Canary Rollout (1.6%)", target: "Model v4.0.0-rc2", hash: "4dff4ea340f0a823..." },
];

// ════════════════════════════════════════════════════════════════════════════
// MASTER ALL-IN-ONE COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function UnifiedRiskOSContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ModuleTab>("command");
  const [selectedTxnId, setSelectedTxnId] = useState<string>("TX-99001");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("ACC-42817");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync tab with URL search parameter if modified externally
  useEffect(() => {
    const rawTab = searchParams.get("tab")?.toLowerCase();
    const tabMap: Record<string, ModuleTab> = {
      "command": "command",
      "overview": "command",
      "account360": "account360",
      "account-360": "account360",
      "accounts": "account360",
      "console": "console",
      "risk-console": "console",
      "transactions": "console",
      "alerts": "alerts",
      "investigate": "investigate",
      "investigations": "investigate",
      "campaigns": "campaigns",
      "cases": "cases",
      "rules": "rules",
      "models": "models",
      "attacklab": "attacklab",
      "attack-lab": "attacklab",
      "audit": "audit",
      "metrics": "metrics",
      "reports": "metrics",
      "policysim": "policysim",
      "simulator": "policysim",
    };
    if (rawTab && tabMap[rawTab]) {
      setActiveTab(tabMap[rawTab]);
    }
    const qId = searchParams.get("id");
    if (qId) setSelectedTxnId(qId);
    const qAccount = searchParams.get("account");
    if (qAccount) setSelectedAccountId(qAccount);
  }, [searchParams]);

  // Tab switch with clean URL update
  function switchTab(tab: ModuleTab, extraParams?: Record<string, string>) {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => url.searchParams.set(k, v));
      }
      window.history.replaceState(null, "", url.toString());
    }
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  // Omnibar search handler
  function handleOmniSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim().toUpperCase();
    if (!q) return;

    if (q.startsWith("TX-") || q === "TX-99001" || q === "TX-99002" || q === "TX-92831") {
      setSelectedTxnId(q);
      switchTab("investigate", { id: q });
      showToast(`Focused on Transaction ${q}`);
    } else if (q.startsWith("ACC-") || q === "ACC-42817" || q === "ACC-11203" || q === "ACC-90041") {
      setSelectedAccountId(q);
      switchTab("account360", { id: q });
      showToast(`Focused on Account ${q}`);
    } else if (q.includes("1842") || q.includes("1839") || q.includes("1830") || q.startsWith("#")) {
      switchTab("campaigns");
      showToast(`Navigated to Campaign ${q}`);
    } else if (q.startsWith("CASE-")) {
      switchTab("cases");
      showToast(`Navigated to Case ${q}`);
    } else if (q.startsWith("R-") || q.startsWith("R0")) {
      switchTab("rules");
      showToast(`Navigated to Rule Engine for ${q}`);
    } else {
      switchTab("console");
      showToast(`Opened Real-Time Risk Scorer for query "${searchQuery}"`);
    }
    setSearchQuery("");
  }

  // Sub-states for interactive tabs
  // 1. Console State
  const [consoleResult, setConsoleResult] = useState<any>(null);
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [consoleFormKey, setConsoleFormKey] = useState(0);
  const [consoleScoredHistory, setConsoleScoredHistory] = useState<any[]>([]);
  const [consoleError, setConsoleError] = useState<string | null>(null);
  const [consoleFormData, setConsoleFormData] = useState<TxnFormData>(DEFAULT_FORM);

  const handleConsoleSample = useCallback(async (type: "fraud" | "legit") => {
    setConsoleError(null);
    setConsoleLoading(true);
    try {
      const res = await fetch(`${API}/api/sample?type=${type}`);
      if (!res.ok) throw new Error("Failed to load sample");
      const sample = await res.json();
      const { is_fraud, ...clean } = sample;
      void is_fraud;
      const merged: TxnFormData = { ...DEFAULT_FORM, ...clean };
      setConsoleFormData(merged);
      setConsoleFormKey((k) => k + 1);
      // Auto-score the sample immediately
      const scoreRes = await fetch(`${API}/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });
      if (!scoreRes.ok) throw new Error("Scoring failed");
      const json = await scoreRes.json();
      json._loadedAs = type;
      setConsoleResult(json);
      setConsoleScoredHistory((prev) => [json, ...prev].slice(0, 10));
      showToast(`${type.toUpperCase()} sample scored: ${json.decision} (Risk ${json.risk_score_pct}/100)`);
    } catch (e: unknown) {
      setConsoleError(e instanceof Error ? e.message : "Sample load or scoring failed");
    } finally {
      setConsoleLoading(false);
    }
  }, [showToast]);
  const [evalMetrics, setEvalMetrics] = useState<any>({
    precision: 1.0,
    recall: 1.0,
    roc_auc: 1.0,
    false_positive_rate: 0.0,
    true_positives: 48,
    true_negatives: 192,
    false_positives: 0,
    false_negatives: 0,
    test_size: 240,
  });

  useEffect(() => {
    fetch(`${API}/api/metrics`)
      .then((r) => r.json())
      .then((d) => setEvalMetrics(d))
      .catch(() => {});
  }, []);

  const handleScoreSubmit = async (data: TxnFormData) => {
    setConsoleLoading(true);
    setConsoleError(null);
    try {
      const res = await fetch(`${API}/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        setConsoleResult(json);
        setConsoleScoredHistory((prev) => [json, ...prev].slice(0, 10));
        showToast(`Transaction scored: ${json.decision} (Risk: ${json.risk_score_pct})`);
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? "Scoring API returned an error");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setConsoleError(msg);
      // Offline fallback simulation
      const fallback = {
        transaction_id: "TX-" + Math.floor(10000 + Math.random() * 90000),
        risk_score: 0.84,
        risk_score_pct: 84,
        decision: "STEP-UP",
        rule_score: 0.72,
        ml_prob: 0.91,
        latency_ms: 38.4,
        explanation: "High risk driven by device velocity and IP reputation anomaly. Least-cost intervention selected: STEP-UP (offline simulation).",
        triggered_rules: [
          { rule_id: "R01", description: "Velocity: >5 txns in 1h from device", weight: 0.85, triggered: true },
          { rule_id: "R06", description: "High-risk geo egress", weight: 0.7, triggered: true },
        ],
        top_features: [
          { feature: "device_age_days", value: 0.982 },
          { feature: "prior_declines_1h", value: 0.874 },
        ],
        _offline: true,
      };
      setConsoleResult(fallback);
      setConsoleScoredHistory((prev) => [fallback, ...prev].slice(0, 10));
      showToast("Offline simulation — connect backend for live scoring");
    } finally {
      setConsoleLoading(false);
    }
  };

  // 2. Investigate State
  const currInvestigateTxn = TRANSACTIONS_DB[selectedTxnId] || TRANSACTIONS_DB["TX-99001"];
  const [investigateSubTab, setInvestigateSubTab] = useState<"overview" | "models" | "counterfactual" | "evidence" | "timeline">("overview");
  const [copilotDrawer, setCopilotDrawer] = useState(false);

  // 3. Attack Lab State
  const [selectedAttack, setSelectedAttack] = useState(ATTACK_SCENARIOS[0]);
  const [attackRunning, setAttackRunning] = useState(false);
  const [attackDone, setAttackDone] = useState(false);

  const runAttackSimulation = () => {
    setAttackRunning(true);
    setAttackDone(false);
    setTimeout(() => {
      setAttackRunning(false);
      setAttackDone(true);
      showToast(`Simulation complete: Expected loss reduced by 37% with adaptive policy`);
    }, 2000);
  };

  // 4. Cases Kanban State
  const [casesRecord, setCasesRecord] = useState(INITIAL_CASES_RECORD);

  // 5. Account 360 Subtab (PRD §5: 11 Subtabs)
  const [account360Tab, setAccount360Tab] = useState<
    | "overview"
    | "passbook"
    | "cashflow"
    | "cards"
    | "beneficiaries"
    | "devices"
    | "risk"
    | "network"
    | "cases"
    | "audit"
    | "consent"
  >("overview");

  // 6. Golden Demo State (PRD §56)
  const [goldenDemoActive, setGoldenDemoActive] = useState(false);
  const [goldenStep, setGoldenStep] = useState(0);

  const handleGoldenStepChange = (stepIdx: number) => {
    setGoldenStep(stepIdx);
    const step = GOLDEN_STEPS[stepIdx];
    if (step) {
      if (step.module === "account360") {
        setActiveTab("account360");
        if (step.subtab) setAccount360Tab(step.subtab as any);
      } else if (step.module === "console") {
        setActiveTab("console");
      } else if (step.module === "campaigns") {
        setActiveTab("campaigns");
      } else if (step.module === "cases") {
        setActiveTab("cases");
      } else if (step.module === "investigate") {
        setActiveTab("investigate");
      } else if (step.module === "audit") {
        setActiveTab("audit");
      } else if (step.module === "attacklab") {
        setActiveTab("attacklab");
      } else if (step.module === "models") {
        setActiveTab("models");
      }
      showToast(`Golden Demo Step ${step.num}: ${step.title}`);
    }
  };

  return (
    <div style={{ background: "#070707", minHeight: "100vh", color: "#F5F4EF" }} suppressHydrationWarning>


      {/* ── CONSOLE TOP BAR (PRD §48 — clean, banking-first) ─────────────────── */}
      <div
        style={{
          padding: "0.75rem 2rem",
          borderBottom: "1px solid #282828",
          background: "#101010",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
        suppressHydrationWarning
      >
        {/* Search / Global Jump */}
        <form onSubmit={handleOmniSearch} style={{ flex: "1 1 320px", display: "flex", maxWidth: 500 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts, transactions, campaigns, cases... (e.g. ACC-42817, TX-99001)"
            style={{
              width: "100%",
              background: "#0D0D0D",
              border: "1px solid #282828",
              padding: "0.45rem 1rem",
              color: "#F5F4EF",
              fontSize: "0.6875rem",
              fontFamily: "inherit",
              outline: "none",
              borderRadius: "2px",
            }}
          />
        </form>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setGoldenDemoActive(!goldenDemoActive)}
            style={{
              background: goldenDemoActive ? "rgba(57,255,136,0.12)" : "rgba(255,255,255,0.04)",
              border: goldenDemoActive ? "1px solid #39FF88" : "1px solid #282828",
              color: goldenDemoActive ? "#39FF88" : "#929292",
              padding: "0.4rem 0.85rem",
              fontSize: "0.5625rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            {goldenDemoActive ? "Hide Demo" : "Golden Demo"}
          </button>
          <div style={{ fontSize: "0.5625rem", color: "#535353", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            analyst_021
          </div>
        </div>
      </div>

      {goldenDemoActive && (
        <div style={{ padding: "0 2rem 1rem", background: "#0D0D0D", borderBottom: "1px solid #282828" }}>
          <GoldenDemoPlayer
            currentStepIndex={goldenStep}
            onSelectStep={handleGoldenStepChange}
            onClose={() => setGoldenDemoActive(false)}
          />
        </div>
      )}

      {toastMessage && (
        <div className="console-toast">
          ✓ {toastMessage}
        </div>
      )}

      {/* ── MODULE TAB BAR (secondary horizontal nav) ────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid #282828",
          background: "#070707",
          padding: "0 2rem",
          overflowX: "auto",
          display: "flex",
          alignItems: "stretch",
        }}
        suppressHydrationWarning
      >
        {/* Primary banking tabs */}
        {MODULE_TABS.filter(t => t.group === "primary").map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              style={{
                padding: "0.7rem 1rem",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #39FF88" : "2px solid transparent",
                color: isActive ? "#F5F4EF" : "#929292",
                fontSize: "0.5625rem",
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
                flexShrink: 0,
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: "0.4rem",
                  padding: "0.1rem 0.3rem",
                  background: tab.badge === "LIVE" || tab.badge === "HERO" ? "rgba(57,255,136,0.12)" : "rgba(255,163,26,0.12)",
                  border: tab.badge === "LIVE" || tab.badge === "HERO" ? "1px solid rgba(57,255,136,0.3)" : "1px solid rgba(255,163,26,0.3)",
                  color: tab.badge === "LIVE" || tab.badge === "HERO" ? "#39FF88" : "#FFA31A",
                  fontWeight: 800,
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div style={{ width: 1, background: "#1f1f1f", margin: "0.5rem 0.25rem", flexShrink: 0 }} />

        {/* Risk Engine label + specialist tabs */}
        <span style={{ fontSize: "0.4375rem", color: "#3a3a3a", letterSpacing: "0.14em", padding: "0 0.5rem", whiteSpace: "nowrap", display: "flex", alignItems: "center", fontWeight: 700, textTransform: "uppercase", flexShrink: 0 }}>
          Engine
        </span>
        {MODULE_TABS.filter(t => t.group === "specialist").map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              style={{
                padding: "0.7rem 0.85rem",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #929292" : "2px solid transparent",
                color: isActive ? "#F5F4EF" : "#535353",
                fontSize: "0.5rem",
                fontWeight: isActive ? 700 : 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
                flexShrink: 0,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── WORKSTATION VIEWPORT ───────────────────────────────────────────── */}
      <div style={{ padding: "2rem" }} suppressHydrationWarning>



        {/* 01. COMMAND CENTER — PRD §48 EXACT LAYOUT */}
        {activeTab === "command" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Section header: COMMAND CENTER + date + LIVE */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
              <div>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: "#F5F4EF" }}>COMMAND CENTER</h1>
                <div style={{ fontSize: "0.625rem", color: "#929292", fontFamily: "monospace", marginTop: "0.2rem", letterSpacing: "0.12em" }}>05 SEP 2026</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#39FF88", display: "inline-block", animation: "pulse-dot 1.8s infinite" }} />
                <span style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.14em", color: "#39FF88" }}>LIVE</span>
              </div>
            </div>

            {/* PRD §7: Primary 6 Financial Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1px", background: "#282828", border: "1px solid #282828" }}>
              {[
                { label: "Fraud prevented",      val: "₹4.8Cr",  accent: true },
                { label: "Transactions",          val: "1.42M",   accent: false },
                { label: "Approval rate",         val: "96.8%",   accent: false },
                { label: "False-positive rate",   val: "2.1%",    accent: false },
                { label: "Median decision",       val: "42ms",    accent: false },
                { label: "Open high-risk cases",  val: "17",      accent: false },
              ].map((k) => (
                <div key={k.label} style={{ background: "#101010", padding: "1.25rem 1rem" }}>
                  <div style={{ fontSize: "0.5625rem", textTransform: "uppercase", color: "#929292", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>{k.label}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: k.accent ? "#39FF88" : "#F5F4EF", fontFamily: "monospace" }}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* PRD §8: REQUIRES ATTENTION feed */}
            <div style={{ background: "#101010", border: "1px solid #282828" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #282828", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.14em", color: "#F5F4EF" }}>REQUIRES ATTENTION</span>
                <span style={{ fontSize: "0.5rem", color: "#929292", fontFamily: "monospace" }}>4 ITEMS PENDING TRIAGE</span>
              </div>

              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 100px 100px", gap: "1rem", padding: "0.5rem 1.25rem", borderBottom: "1px solid #1a1a1a" }}>
                {["ACCOUNT", "EVENT", "RISK", "ACTION"].map(col => (
                  <span key={col} style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.12em", color: "#535353" }}>{col}</span>
                ))}
              </div>

              {[
                { account: "••••4821", event: "₹84k Instant Transfer",    risk: "HIGH",     riskColor: "#FFA31A", action: "Review",  txnId: "TX-99001" },
                { account: "••••1092", event: "New beneficiary added",     risk: "HIGH",     riskColor: "#FFA31A", action: "Step-up", txnId: "TX-99001" },
                { account: "••••7820", event: "ATO sequence detected",     risk: "CRITICAL", riskColor: "#FF4D4D", action: "Block",   txnId: "TX-99002" },
                { account: "••••2911", event: "Unusual cash flow pattern", risk: "MEDIUM",   riskColor: "#929292", action: "Review",  txnId: "TX-92831" },
              ].map((row, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedTxnId(row.txnId); switchTab("investigate", { id: row.txnId }); }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr 100px 100px",
                    gap: "1rem",
                    padding: "0.9rem 1.25rem",
                    borderBottom: "1px solid #1a1a1a",
                    cursor: "pointer",
                    transition: "background 120ms ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#151515")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.75rem", color: "#F5F4EF" }}>{row.account}</span>
                  <span style={{ fontSize: "0.75rem", color: "#F5F4EF" }}>{row.event}</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 800, color: row.riskColor, letterSpacing: "0.08em" }}>{row.risk}</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "#929292", textTransform: "uppercase", letterSpacing: "0.08em" }}>{row.action}</span>
                </div>
              ))}
            </div>

            {/* PRD §48 Split Bottom: Account Activity + Active Campaigns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#282828" }}>

              {/* ACCOUNT ACTIVITY */}
              <div style={{ background: "#101010", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.14em", color: "#929292", marginBottom: "1rem" }}>ACCOUNT ACTIVITY</div>
                <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "monospace", color: "#F5F4EF" }}>12.4k</div>
                    <div style={{ fontSize: "0.5625rem", color: "#929292" }}>events today</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "monospace", color: "#FF4D4D" }}>18</div>
                    <div style={{ fontSize: "0.5625rem", color: "#929292" }}>high risk</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { account: "••••4821", event: "₹84k Transfer flagged",       time: "14:42" },
                    { account: "••••7820", event: "ATO sequence — blocked",      time: "14:38" },
                    { account: "••••1092", event: "Beneficiary added — step-up", time: "14:31" },
                    { account: "••••3341", event: "Salary credit — normal",      time: "14:15" },
                  ].map((a, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #1a1a1a" }}>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.6875rem", fontWeight: 700, color: "#F5F4EF" }}>{a.account}</span>
                        <span style={{ fontSize: "0.625rem", color: "#929292" }}>{a.event}</span>
                      </div>
                      <span style={{ fontSize: "0.5625rem", fontFamily: "monospace", color: "#535353" }}>{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIVE CAMPAIGNS */}
              <div style={{ background: "#101010", padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.14em", color: "#929292" }}>ACTIVE CAMPAIGNS</span>
                  <button onClick={() => switchTab("campaigns")} style={{ background: "none", border: "none", fontSize: "0.5625rem", color: "#39FF88", cursor: "pointer", fontWeight: 700 }}>View all</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { id: "#1842", type: "ATO",           accounts: 17, exposure: "₹18.4L", confidence: 94, status: "ACTIVE" },
                    { id: "#1839", type: "Card Testing",  accounts: 31, exposure: "₹2.1L",  confidence: 88, status: "ACTIVE" },
                    { id: "#1830", type: "Mule Network",  accounts: 9,  exposure: "₹6.7L",  confidence: 81, status: "INVESTIGATING" },
                  ].map(c => (
                    <div key={c.id} onClick={() => switchTab("campaigns")} style={{ padding: "0.75rem", background: "#151515", border: "1px solid #282828", cursor: "pointer", transition: "border 120ms ease" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#39FF88")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "#282828")}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, fontFamily: "monospace", color: "#F5F4EF" }}>{c.id}</span>
                        <span style={{ fontSize: "0.5rem", fontWeight: 700, color: c.status === "ACTIVE" ? "#FF4D4D" : "#FFA31A", letterSpacing: "0.1em" }}>{c.status}</span>
                      </div>
                      <div style={{ fontSize: "0.625rem", color: "#929292" }}>{c.type} — {c.accounts} accounts — {c.exposure}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALERTS tab \u2014 mirrors the REQUIRES ATTENTION feed as a full page */}
        {activeTab === "alerts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: "#F5F4EF" }}>ALERTS</h1>
                <div style={{ fontSize: "0.625rem", color: "#929292", fontFamily: "monospace", marginTop: "0.2rem" }}>Requires attention — triage queue</div>
              </div>
              <span style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.12em", padding: "0.2rem 0.5rem", background: "rgba(255,163,26,0.12)", border: "1px solid rgba(255,163,26,0.3)", color: "#FFA31A" }}>5 PENDING</span>
            </div>
            <div style={{ background: "#101010", border: "1px solid #282828" }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 100px 100px", gap: "1rem", padding: "0.5rem 1.25rem", borderBottom: "1px solid #282828" }}>
                {["ACCOUNT", "EVENT", "RISK", "ACTION"].map(col => (
                  <span key={col} style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.12em", color: "#535353" }}>{col}</span>
                ))}
              </div>
              {[
                { account: "••••4821", event: "₹84k Instant Transfer — new beneficiary, new device", risk: "HIGH",     riskColor: "#FFA31A", action: "Review",  txnId: "TX-99001" },
                { account: "••••1092", event: "Beneficiary BENE-441 added — first use, risk 91",     risk: "HIGH",     riskColor: "#FFA31A", action: "Step-up", txnId: "TX-99001" },
                { account: "••••7820", event: "Account Takeover pattern — login, device, password",  risk: "CRITICAL", riskColor: "#FF4D4D", action: "Block",   txnId: "TX-99002" },
                { account: "••••2911", event: "Unusual cash flow: ₹50k received, ₹48.5k sent (4m)", risk: "MEDIUM",   riskColor: "#929292", action: "Review",  txnId: "TX-92831" },
                { account: "••••5572", event: "New device from Dubai IP cluster — Device-991",       risk: "HIGH",     riskColor: "#FFA31A", action: "Step-up", txnId: "TX-99001" },
              ].map((row, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedTxnId(row.txnId); switchTab("investigate", { id: row.txnId }); }}
                  style={{ display: "grid", gridTemplateColumns: "120px 1fr 100px 100px", gap: "1rem", padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#151515")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.75rem", color: "#F5F4EF" }}>{row.account}</span>
                  <span style={{ fontSize: "0.6875rem", color: "#F5F4EF" }}>{row.event}</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 800, color: row.riskColor, letterSpacing: "0.08em" }}>{row.risk}</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "#929292", textTransform: "uppercase", letterSpacing: "0.08em" }}>{row.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 02. RISK CONSOLE */}
        {activeTab === "console" && (
          <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.5rem", letterSpacing: "0.16em", color: "#39FF88", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#39FF88", display: "inline-block", boxShadow: "0 0 6px #39FF88" }} />
                  Risk Engine — Live
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Interactive Risk Decisioning Console</h2>
                <div style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.45)", marginTop: "0.3rem" }}>Real-time HybridScorer (Rule 40% + XGBoost 60%) · Explainable AI · Audit-logged</div>
              </div>
              {/* Status chips */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ padding: "0.25rem 0.75rem", background: "rgba(57,255,136,0.06)", border: "1px solid rgba(57,255,136,0.2)", fontSize: "0.5rem", color: "#39FF88", fontWeight: 700, letterSpacing: "0.1em" }}>API ONLINE</span>
                <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", fontWeight: 600 }}>XGBOOST v1 LOADED</span>
                <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", fontWeight: 600 }}>13 RULES ACTIVE</span>
              </div>
            </div>

            {/* Error banner */}
            {consoleError && (
              <div style={{ padding: "0.75rem 1.25rem", background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.25)", color: "#FF4D4D", fontSize: "0.6875rem", marginBottom: "1.5rem", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontWeight: 800 }}>⚠</span>
                {consoleError}
                <button onClick={() => setConsoleError(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#FF4D4D", cursor: "pointer", fontSize: "0.875rem", lineHeight: 1 }}>×</button>
              </div>
            )}

            {/* Main grid: Form | Results */}
            <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "2rem", alignItems: "start" }}>

              {/* LEFT: Transaction Input Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.07)", padding: "1.75rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "1.25rem" }}>Transaction Payload</div>
                  <TransactionForm
                    key={consoleFormKey}
                    onSubmit={handleScoreSubmit}
                    onLoadSample={handleConsoleSample}
                    loading={consoleLoading}
                  />
                </div>

                {/* Scored history */}
                {consoleScoredHistory.length > 0 && (
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem" }}>
                    <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "0.75rem" }}>Recent Decisions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {consoleScoredHistory.slice(0, 6).map((r, i) => {
                        const dc = r.decision === "ALLOW" ? "#39FF88" : r.decision === "BLOCK" ? "#FF4D4D" : "#FFA31A";
                        return (
                          <div
                            key={i}
                            onClick={() => setConsoleResult(r)}
                            style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.4rem 0.6rem", cursor: "pointer", border: `1px solid ${i === 0 && consoleResult?.transaction_id === r.transaction_id ? "rgba(57,255,136,0.2)" : "transparent"}`, background: i === 0 && consoleResult?.transaction_id === r.transaction_id ? "rgba(57,255,136,0.03)" : "transparent" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#111")}
                            onMouseLeave={e => (e.currentTarget.style.background = i === 0 && consoleResult?.transaction_id === r.transaction_id ? "rgba(57,255,136,0.03)" : "transparent")}
                          >
                            <span style={{ fontFamily: "monospace", fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", minWidth: 90 }}>{r.transaction_id}</span>
                            <span style={{ fontSize: "0.5rem", fontWeight: 800, color: dc, letterSpacing: "0.08em", minWidth: 50 }}>{r.decision}</span>
                            <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ width: `${r.risk_score_pct}%`, height: "100%", background: dc, borderRadius: 2 }} />
                            </div>
                            <span style={{ fontFamily: "monospace", fontSize: "0.5rem", color: "rgba(244,244,240,0.35)", minWidth: 28, textAlign: "right" }}>{r.risk_score_pct}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Results */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Score + Decision Panel */}
                {(consoleResult || consoleLoading) ? (
                  <div
                    style={{
                      background: "#0A0A0A",
                      border: `1px solid ${
                        consoleLoading ? "rgba(255,255,255,0.07)"
                        : consoleResult?.decision === "BLOCK" ? "rgba(255,77,77,0.3)"
                        : consoleResult?.decision === "ALLOW" ? "rgba(57,255,136,0.25)"
                        : "rgba(255,163,26,0.25)"
                      }`,
                      padding: "2rem",
                      position: "relative",
                      transition: "border-color 400ms ease",
                    }}
                  >
                    {/* Left accent stripe */}
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                      background: consoleLoading ? "transparent"
                        : consoleResult?.decision === "BLOCK" ? "#FF4D4D"
                        : consoleResult?.decision === "ALLOW" ? "#39FF88"
                        : "#FFA31A",
                      transition: "background 400ms ease",
                    }} />

                    {consoleLoading ? (
                      <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
                        <div style={{ fontSize: "0.5625rem", letterSpacing: "0.18em", color: "#39FF88", textTransform: "uppercase", fontWeight: 700 }}>
                          ⟳ Scoring transaction through HybridScorer...
                        </div>
                        <div style={{ marginTop: "1rem", height: 2, background: "rgba(57,255,136,0.1)", borderRadius: 1, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: "#39FF88", borderRadius: 1, animation: "console-scan 1.2s ease-in-out infinite" }} />
                        </div>
                      </div>
                    ) : consoleResult && (
                      <>
                        {/* TXN ID + Sample badge */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                          <div style={{ fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(244,244,240,0.4)" }}>{consoleResult.transaction_id}</div>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            {consoleResult._loadedAs === "fraud" && (
                              <span style={{ padding: "0.2rem 0.6rem", background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", fontSize: "0.45rem", fontWeight: 800, letterSpacing: "0.1em" }}>FRAUD SAMPLE</span>
                            )}
                            {consoleResult._loadedAs === "legit" && (
                              <span style={{ padding: "0.2rem 0.6rem", background: "rgba(57,255,136,0.1)", border: "1px solid rgba(57,255,136,0.3)", color: "#39FF88", fontSize: "0.45rem", fontWeight: 800, letterSpacing: "0.1em" }}>LEGIT SAMPLE</span>
                            )}
                            {consoleResult._offline && (
                              <span style={{ padding: "0.2rem 0.6rem", background: "rgba(255,163,26,0.1)", border: "1px solid rgba(255,163,26,0.3)", color: "#FFA31A", fontSize: "0.45rem", fontWeight: 800, letterSpacing: "0.1em" }}>OFFLINE SIM</span>
                            )}
                          </div>
                        </div>
                        <ScorePanel
                          score={consoleResult.risk_score_pct}
                          decision={consoleResult.decision}
                          latencyMs={consoleResult.latency_ms}
                          ruleScore={consoleResult.rule_score}
                          mlProb={consoleResult.ml_prob}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "4rem 2rem", textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.2 }}>⚡</div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.3)", lineHeight: 1.6 }}>
                      Load a <strong style={{ color: "#FF4D4D" }}>Fraud Sample</strong> or <strong style={{ color: "#39FF88" }}>Legit Sample</strong> to auto-score,<br />
                      or manually fill the form and click <em>Score Transaction</em>.
                    </div>
                  </div>
                )}

                {/* Explanation card */}
                {consoleResult && !consoleLoading && (
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                    <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "0.75rem" }}>Engine Explanation</div>
                    <p style={{ fontSize: "0.8125rem", color: "rgba(244,244,240,0.8)", lineHeight: 1.7, margin: 0 }}>{consoleResult.explanation}</p>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F5F4EF", letterSpacing: "-0.02em" }}>{(consoleResult.rule_score * 100).toFixed(0)}</div>
                        <div style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rule Score</div>
                      </div>
                      <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F5F4EF", letterSpacing: "-0.02em" }}>{(consoleResult.ml_prob * 100).toFixed(0)}</div>
                        <div style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>ML Probability</div>
                      </div>
                      <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#39FF88", letterSpacing: "-0.02em" }}>{consoleResult.latency_ms?.toFixed(1)}<span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)" }}>ms</span></div>
                        <div style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Decision Latency</div>
                      </div>
                      <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F5F4EF", letterSpacing: "-0.02em" }}>{(consoleResult.triggered_rules || []).filter((r: any) => r.triggered).length}</div>
                        <div style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rules Fired</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rules + Features side-by-side */}
                {consoleResult && !consoleLoading && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                      <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "1rem" }}>Rule Engine (40% weight)</div>
                      <RulesList rules={consoleResult.triggered_rules || []} />
                    </div>
                    <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                      <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "1rem" }}>ML Feature Attribution (60% weight)</div>
                      <FeatureBar features={consoleResult.top_features || []} />
                    </div>
                  </div>
                )}

                {/* Audit metadata footer */}
                {consoleResult && !consoleLoading && (
                  <div style={{ background: "#060606", border: "1px solid rgba(255,255,255,0.04)", padding: "1rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                    {[
                      { label: "Scored At", value: new Date().toLocaleTimeString() },
                      { label: "Engine", value: "HybridScorer v1" },
                      { label: "Threshold", value: "ALLOW < 40 · REVIEW < 65 · BLOCK ≥ 65" },
                      { label: "Audit ID", value: "AUD-" + consoleResult.transaction_id?.slice(-6) },
                    ].map((m) => (
                      <div key={m.label}>
                        <div style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{m.label}</div>
                        <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.65)", fontFamily: "monospace", marginTop: "0.2rem" }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Inline CSS for scoring animation */}
            <style>{`
              @keyframes console-scan {
                0%   { width: 0%; margin-left: 0; }
                50%  { width: 60%; margin-left: 20%; }
                100% { width: 0%; margin-left: 100%; }
              }
            `}</style>
          </div>
        )}

        {/* 03. INVESTIGATION WORKBENCH */}
        {activeTab === "investigate" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, fontFamily: "monospace" }}>{currInvestigateTxn.id}</h2>
                  <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255,77,77,0.15)", border: "1px solid #FF4D4D", color: "#FF4D4D", fontSize: "0.75rem", fontWeight: 800 }}>
                    {currInvestigateTxn.decision} (Risk {currInvestigateTxn.risk_score_pct}/100)
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.6)" }}>
                  Account:{" "}
                  <button
                    onClick={() => {
                      setSelectedAccountId(currInvestigateTxn.accountId);
                      switchTab("account360", { id: currInvestigateTxn.accountId });
                    }}
                    style={{ background: "none", border: "none", color: "#FFA31A", fontWeight: 700, cursor: "pointer", padding: 0 }}
                  >
                    {currInvestigateTxn.accountId} ({currInvestigateTxn.customerName}) ↗
                  </button>
                  {currInvestigateTxn.campaign && (
                    <button
                      onClick={() => switchTab("campaigns")}
                      style={{ marginLeft: "1rem", color: "#FF4D4D", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      Linked to Campaign {currInvestigateTxn.campaign} ↗
                    </button>
                  )}
                </div>
              </div>

              {/* Switch Presets */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["TX-99001", "TX-99002", "TX-92831"] as const).map((id) => (
                  <button
                    key={id}
                    onClick={() => setSelectedTxnId(id)}
                    style={{
                      padding: "0.3rem 0.6rem",
                      background: selectedTxnId === id ? "#39FF88" : "#0A0A0A",
                      color: selectedTxnId === id ? "#050505" : "rgba(244,244,240,0.5)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "monospace",
                      fontSize: "0.5625rem",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "2rem" }}>
              {(["overview", "models", "counterfactual", "evidence", "timeline"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setInvestigateSubTab(st)}
                  style={{
                    padding: "0.6rem 1rem",
                    background: "none",
                    border: "none",
                    borderBottom: investigateSubTab === st ? "2px solid #39FF88" : "2px solid transparent",
                    color: investigateSubTab === st ? "#39FF88" : "rgba(244,244,240,0.4)",
                    fontSize: "0.5625rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {st}
                </button>
              ))}
              <button
                onClick={() => setCopilotDrawer(!copilotDrawer)}
                style={{
                  marginLeft: "auto",
                  background: copilotDrawer ? "#39FF88" : "rgba(57,255,136,0.12)",
                  border: "1px solid #39FF88",
                  color: copilotDrawer ? "#050505" : "#39FF88",
                  padding: "0.3rem 0.9rem",
                  fontSize: "0.5625rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                {copilotDrawer ? "Close Copilot" : "Investigator Copilot"}
              </button>
            </div>

            {/* Content view */}
            <div style={{ display: "grid", gridTemplateColumns: copilotDrawer ? "1fr 360px" : "1fr", gap: "2rem" }}>
              <div>
                {investigateSubTab === "overview" && (
                  <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 1fr", gap: "1.5rem" }}>
                    <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,77,77,0.3)", padding: "1.5rem" }}>
                      <ScorePanel score={currInvestigateTxn.risk_score_pct} decision={currInvestigateTxn.decision} latencyMs={currInvestigateTxn.latency_ms} ruleScore={currInvestigateTxn.rule_score} mlProb={currInvestigateTxn.ml_prob} />
                    </div>
                    <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                      <RulesList rules={currInvestigateTxn.rules} />
                    </div>
                    <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                      <FeatureBar features={currInvestigateTxn.features} />
                    </div>
                  </div>
                )}
                {investigateSubTab === "models" && (
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", maxWidth: 800 }}>
                    <MultiModelScores scores={currInvestigateTxn.multi_models} />
                  </div>
                )}
                {investigateSubTab === "counterfactual" && (
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", maxWidth: 800 }}>
                    <CounterfactualPanel current_score={currInvestigateTxn.risk_score_pct} current_decision={currInvestigateTxn.decision} items={currInvestigateTxn.counterfactuals} />
                  </div>
                )}
                {investigateSubTab === "evidence" && (
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: "0 0 1rem" }}>PCI DSS 4.0 & EMVCo 3DS Evidence Vault</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.75rem" }}>
                      <div style={{ background: "#060606", padding: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ color: "rgba(244,244,240,0.4)", fontSize: "0.5625rem" }}>TOKENIZED PAN</div>
                        <div style={{ fontFamily: "monospace", color: "#F5F4EF", marginTop: "0.25rem" }}>{currInvestigateTxn.tokenized_pan}</div>
                      </div>
                      <div style={{ background: "#060606", padding: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ color: "rgba(244,244,240,0.4)", fontSize: "0.5625rem" }}>3DS 2.2 CAVV CRYPTOGRAM</div>
                        <div style={{ fontFamily: "monospace", color: "#FFA31A", marginTop: "0.25rem" }}>{currInvestigateTxn.three_ds_cavv}</div>
                      </div>
                    </div>
                  </div>
                )}
                {investigateSubTab === "timeline" && (
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", maxWidth: 800 }}>
                    <TimelineView events={currInvestigateTxn.timeline_events} txnId={currInvestigateTxn.id} />
                  </div>
                )}
              </div>

              {/* Copilot Drawer */}
              {copilotDrawer && (
                <div style={{ background: "#090909", border: "1px solid rgba(57,255,136,0.2)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ fontSize: "0.5625rem", fontWeight: 800, color: "#39FF88", letterSpacing: "0.1em" }}>AI INVESTIGATOR COPILOT</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.75)", lineHeight: 1.5 }}>{currInvestigateTxn.copilot_summary}</div>
                  <button onClick={() => showToast("Account locked & SAR Form drafted")} style={{ background: "#FF4D4D", border: "none", color: "#050505", padding: "0.5rem", fontWeight: 700, fontSize: "0.625rem", cursor: "pointer" }}>
                    Freeze Account & File SAR
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 04. ACCOUNT 360 (PRD §5 - §14) */}
        {activeTab === "account360" && (
          <div>
            {/* PRD §5 Header Section */}
            <div
              style={{
                background: "rgba(10,12,18,0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.5rem",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, fontFamily: "monospace", color: "#F4F4F0" }}>
                    Rahul Sharma
                  </h2>
                  <span style={{ fontSize: "0.625rem", padding: "0.2rem 0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#F5F4EF", borderRadius: "2px", fontWeight: 700, fontFamily: "monospace" }}>
                    SEGMENT: PREMIUM
                  </span>
                  <span style={{ fontSize: "0.625rem", padding: "0.2rem 0.5rem", background: "rgba(57,255,136,0.15)", border: "1px solid rgba(57,255,136,0.35)", color: "#39FF88", borderRadius: "2px", fontWeight: 700, fontFamily: "monospace" }}>
                    STATUS: ACTIVE
                  </span>
                  <span style={{ fontSize: "0.625rem", padding: "0.2rem 0.5rem", background: "rgba(255,163,26,0.15)", border: "1px solid rgba(255,163,26,0.35)", color: "#FFA31A", borderRadius: "2px", fontWeight: 700, fontFamily: "monospace" }}>
                    RISK TIER: MEDIUM
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", fontSize: "0.6875rem", fontFamily: "monospace", color: "rgba(244,244,240,0.6)" }}>
                  <span>Account: <strong style={{ color: "#F4F4F0" }}>••••4821</strong></span>
                  <span>Account age: <strong style={{ color: "#F4F4F0" }}>6Y 4M</strong></span>
                  <span>Branch: <strong style={{ color: "#F4F4F0" }}>Connaught Place, New Delhi</strong></span>
                  <span>KYC: <strong style={{ color: "#39FF88" }}>VERIFIED (CKYC-2021)</strong></span>
                </div>
              </div>

              {/* Balances (PRD §5: Available ₹1,84,240 | Current ₹2,14,820) */}
              <div style={{ display: "flex", gap: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.75rem 1.25rem", borderRadius: "4px" }}>
                <div style={{ textAlign: "right", borderRight: "1px solid rgba(255,255,255,0.06)", paddingRight: "1rem" }}>
                  <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>AVAILABLE BALANCE</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "monospace", color: "#39FF88", marginTop: "0.2rem" }}>₹1,84,240</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>CURRENT LEDGER</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "monospace", color: "#F4F4F0", marginTop: "0.2rem" }}>₹2,14,820</div>
                </div>
              </div>
            </div>

            {/* 11 Subtabs Bar (PRD §5) */}
            <div
              style={{
                display: "flex",
                gap: "0.35rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "1.5rem",
                overflowX: "auto",
              }}
            >
              {[
                { key: "overview", label: "OVERVIEW" },
                { key: "passbook", label: "PASSBOOK" },
                { key: "cashflow", label: "CASH FLOW" },
                { key: "cards", label: "CARDS" },
                { key: "beneficiaries", label: "BENEFICIARIES" },
                { key: "devices", label: "DEVICES" },
                { key: "risk", label: "RISK (9D)" },
                { key: "network", label: "NETWORK" },
                { key: "cases", label: "CASES" },
                { key: "audit", label: "AUDIT" },
                { key: "consent", label: "CONSENT" },
              ].map((st) => {
                const isSelected = account360Tab === st.key;
                return (
                  <button
                    key={st.key}
                    onClick={() => setAccount360Tab(st.key as any)}
                    style={{
                      padding: "0.55rem 0.9rem",
                      background: isSelected ? "rgba(255,163,26,0.12)" : "transparent",
                      border: "none",
                      borderBottom: isSelected ? "2px solid #FFA31A" : "2px solid transparent",
                      color: isSelected ? "#FFA31A" : "rgba(244,244,240,0.5)",
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>

            {/* Subtab Contents */}
            {account360Tab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem", borderRadius: "4px" }}>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 0.75rem", fontFamily: "monospace", color: "#39FF88" }}>
                      // ACCOUNT TRAJECTORY & SIGNALS
                    </h3>
                    <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.7)", lineHeight: 1.6, fontFamily: "monospace" }}>
                      Historical baseline was 12/100 (Safe). Sudden +600% transfer velocity burst in the last 24h triggered critical ATO escalation. Unrecognized device DEVICE-991 added from Dubai IP cluster IP-17.
                    </div>
                  </div>
                  <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem", borderRadius: "4px" }}>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 700, margin: "0 0 0.75rem", fontFamily: "monospace", color: "#FF4D4D" }}>
                      // ACTIVE SECURITY FLAGS
                    </h3>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {["ATO CAMPAIGN #1842", "VELOCITY BURST", "TOR EGRESS", "NEW DEVICE", "NEW BENEFICIARY"].map((f) => (
                        <span key={f} style={{ padding: "0.25rem 0.5rem", background: "rgba(255,77,77,0.15)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", fontSize: "0.625rem", fontWeight: 700, fontFamily: "monospace" }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Embedded Passbook preview */}
                <AccountPassbook
                  onSelectTxn={(id) => {
                    setSelectedTxnId(id);
                    switchTab("investigate", { id });
                    showToast(`Opened forensic investigation for ${id}`);
                  }}
                />
              </div>
            )}

            {account360Tab === "passbook" && (
              <AccountPassbook
                onSelectTxn={(id) => {
                  setSelectedTxnId(id);
                  switchTab("investigate", { id });
                  showToast(`Opened forensic investigation for ${id}`);
                }}
              />
            )}

            {account360Tab === "cashflow" && <CashFlowView />}
            {account360Tab === "cards" && <CardsView />}
            {account360Tab === "beneficiaries" && <BeneficiaryIntelligence />}
            {account360Tab === "devices" && <DeviceIntelligence />}
            {account360Tab === "risk" && <CustomerRiskProfile />}
            {account360Tab === "network" && <NetworkIntelligence />}
            {account360Tab === "cases" && (
              <div style={{ background: "rgba(10,10,12,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.625rem", color: "#FF4D4D", fontFamily: "monospace" }}>TIED FRAUD & ATO CASES // ACCOUNT ••••4821</div>
                    <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F4F4F0", fontFamily: "monospace" }}>Case #CS-4091: Account Takeover & Rapid Dissipation</div>
                  </div>
                  <span style={{ fontSize: "0.6875rem", padding: "0.2rem 0.6rem", background: "rgba(255,77,77,0.15)", color: "#FF4D4D", border: "1px solid #FF4D4D", borderRadius: "3px", fontFamily: "monospace", fontWeight: 700 }}>
                    SEVERITY: HIGH
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(244,244,240,0.8)", lineHeight: 1.6 }}>
                  Unrecognized Windows workstation (DEVICE-991) in Dubai initiated beneficiary creation of BEN-918 followed by an instantaneous ₹84,000 transfer (TX-92831). Account behavioral baseline deviated to 94/100. Step-up authentication failed (ECI 07 bypass attempt).
                </div>
              </div>
            )}
            {account360Tab === "audit" && <ConsentProvenanceView />}
            {account360Tab === "consent" && <ConsentProvenanceView />}
          </div>
        )}

        {/* 05. CAMPAIGNS */}
        {activeTab === "campaigns" && (
          <div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 1.5rem" }}>Coordinated Fraud Campaigns</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {[
                { id: "#1842", name: "Lagos / Tor Syndicate ATO", accounts: 17, devices: 6, exposure: "₹18.4L", conf: 94, status: "ACTIVE" },
                { id: "#1839", name: "Card Testing Enumeration Burst", accounts: 31, devices: 12, exposure: "₹2.1L", conf: 87, status: "CONTAINED" },
                { id: "#1830", name: "Cross-Border Mule Network", accounts: 9, devices: 4, exposure: "₹6.7L", conf: 72, status: "SAR FILED" },
              ].map((c) => (
                <div key={c.id} style={{ background: "#0A0A0A", border: "1px solid rgba(255,77,77,0.4)", padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", color: "#FF4D4D", fontWeight: 800 }}>{c.id}</span>
                    <span style={{ fontSize: "0.5rem", padding: "0.2rem 0.4rem", background: "rgba(255,77,77,0.15)", color: "#FF4D4D", fontWeight: 700 }}>{c.status}</span>
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0.5rem 0" }}>{c.name}</h3>
                  <div style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.6)", display: "flex", flexDirection: "column", gap: "0.25rem", margin: "1rem 0" }}>
                    <div>Linked Accounts: <strong>{c.accounts}</strong></div>
                    <div>Linked Devices: <strong>{c.devices}</strong></div>
                    <div>Total Exposure: <strong style={{ color: "#F4F4F0" }}>{c.exposure}</strong></div>
                    <div>Confidence: <strong style={{ color: "#39FF88" }}>{c.conf}%</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTxnId("TX-99001");
                      switchTab("investigate", { id: "TX-99001" });
                    }}
                    style={{ background: "#FF4D4D", border: "none", color: "#050505", padding: "0.4rem 0.8rem", fontSize: "0.5625rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    Investigate Linked Node →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 06. CASES KANBAN */}
        {activeTab === "cases" && (
          <div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 1.5rem" }}>Case Management Kanban</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              {Object.entries(casesRecord).map(([status, cases]) => (
                <div key={status} style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1rem" }}>
                  <div style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.1em", color: status === "OPEN" ? "#FF4D4D" : status === "INVESTIGATING" ? "#FFA31A" : status === "ESCALATED" ? "#FF4D4D" : "#39FF88", marginBottom: "1rem" }}>
                    {status} ({cases.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {cases.map((c: any) => (
                      <div key={c.id} style={{ background: "#060606", border: "1px solid rgba(255,255,255,0.08)", padding: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: "monospace", color: "#F5F4EF", fontSize: "0.6875rem", fontWeight: 700 }}>{c.id}</span>
                          <span style={{ fontSize: "0.5rem", color: c.severity === "CRITICAL" ? "#FF4D4D" : "#FFA31A", fontWeight: 800 }}>{c.severity}</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, margin: "0.4rem 0" }}>{c.type}</div>
                        <div style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.5)" }}>{c.exposure} · {c.owner}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 07. RULES & POLICY */}
        {activeTab === "rules" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>Rule Governance & Policy Engine</h2>
              <button onClick={() => showToast("Rule Builder: Feature is ready in Rule Governance")} style={{ background: "#39FF88", border: "none", color: "#050505", padding: "0.5rem 1rem", fontSize: "0.625rem", fontWeight: 800, cursor: "pointer" }}>
                + Add Rule
              </button>
            </div>
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}>
              {INITIAL_RULES_INVENTORY.map((r) => (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "80px 220px 1fr 140px 100px", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", fontSize: "0.75rem" }}>
                  <span style={{ fontFamily: "monospace", color: "#39FF88", fontWeight: 700 }}>{r.id}</span>
                  <span style={{ fontWeight: 600 }}>{r.name}</span>
                  <code style={{ background: "#060606", padding: "0.2rem 0.5rem", color: "#F5F4EF", fontSize: "0.6875rem" }}>{r.condition}</code>
                  <span style={{ color: "#FFA31A", fontWeight: 700 }}>{r.action}</span>
                  <span style={{ color: "rgba(244,244,240,0.4)" }}>{r.hits} hits</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 08. MODEL GOVERNANCE & DRIFT */}
        {activeTab === "models" && (
          <div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 1.5rem" }}>Champion vs Challenger Model Benchmarking</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div style={{ background: "#0A0A0A", border: "1px solid #39FF88", padding: "2rem" }}>
                <span style={{ fontSize: "0.5625rem", color: "#39FF88", fontWeight: 800 }}>CHAMPION (PRODUCTION · 98.4%)</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.5rem 0" }}>v3.2.1-prod (XGBoost)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                  <div>ROC-AUC: <strong style={{ color: "#39FF88" }}>0.942</strong></div>
                  <div>Precision: <strong>87.4%</strong></div>
                  <div>P95 Latency: <strong style={{ color: "#39FF88" }}>38.4ms</strong></div>
                  <div>False Positive Rate: <strong>2.1%</strong></div>
                </div>
              </div>
              <div style={{ background: "#0A0A0A", border: "1px solid #FFA31A", padding: "2rem" }}>
                <span style={{ fontSize: "0.5625rem", color: "#FFA31A", fontWeight: 800 }}>CHALLENGER (CANARY · 1.6%)</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.5rem 0" }}>v4.0.0-rc2 (LightGBM)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                  <div>ROC-AUC: <strong style={{ color: "#39FF88" }}>0.961 (+0.019)</strong></div>
                  <div>Precision: <strong>89.8% (+2.4%)</strong></div>
                  <div>P95 Latency: <strong style={{ color: "#39FF88" }}>31.2ms (-7.2ms)</strong></div>
                  <div>False Positive Rate: <strong>1.6% (-0.5%)</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 09. ATTACK SIMULATION LAB */}
        {activeTab === "attacklab" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>Attack Simulation Lab</h2>
              <button onClick={runAttackSimulation} style={{ background: "#39FF88", border: "none", color: "#050505", padding: "0.6rem 1.5rem", fontSize: "0.6875rem", fontWeight: 800, cursor: "pointer" }}>
                {attackRunning ? "Running Simulation..." : "Execute Simulation →"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {ATTACK_SCENARIOS.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedAttack(s)}
                    style={{
                      padding: "1rem",
                      background: selectedAttack.id === s.id ? "rgba(57,255,136,0.1)" : "#0A0A0A",
                      border: `1px solid ${selectedAttack.id === s.id ? "#39FF88" : "rgba(255,255,255,0.06)"}`,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#F4F4F0" }}>{s.label}</div>
                    <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)" }}>{s.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: "0 0 1rem" }}>{selectedAttack.label} — Layer-by-Layer Defense</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                  {[
                    { layer: "01. Baseline ML", val: `${selectedAttack.baseline.detection}%`, color: "rgba(244,244,240,0.4)" },
                    { layer: "02. + Graph", val: `${selectedAttack.withGraph.detection}%`, color: "#FFA31A" },
                    { layer: "03. + Campaign", val: `${selectedAttack.withCampaign.detection}%`, color: "#39FF88" },
                    { layer: "04. + Adaptive Policy", val: `${selectedAttack.withAdaptive.detection}%`, color: "#39FF88" },
                  ].map((l) => (
                    <div key={l.layer} style={{ background: "#060606", border: `1px solid ${l.color}`, padding: "1.25rem" }}>
                      <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.5)" }}>{l.layer}</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: l.color, marginTop: "0.5rem" }}>{l.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. AUDIT & COMPLIANCE */}
        {activeTab === "audit" && (
          <div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 1.5rem" }}>Immutable Audit & Regulatory Ledger</h2>
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}>
              {INITIAL_AUDIT_STREAM.map((a) => (
                <div key={a.id} style={{ display: "grid", gridTemplateColumns: "110px 160px 140px 1fr 180px", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", fontSize: "0.75rem" }}>
                  <span style={{ fontFamily: "monospace", color: "#FFA31A", fontWeight: 700 }}>{a.id}</span>
                  <span style={{ color: "rgba(244,244,240,0.5)", fontSize: "0.6875rem" }}>{a.timestamp}</span>
                  <span style={{ color: "#F4F4F0", fontWeight: 600 }}>{a.actor}</span>
                  <div>
                    <span style={{ color: "#39FF88" }}>{a.action}</span>
                    <span style={{ color: "rgba(244,244,240,0.4)", marginLeft: "0.5rem" }}>({a.target})</span>
                  </div>
                  <span style={{ fontFamily: "monospace", color: "rgba(244,244,240,0.3)", fontSize: "0.5625rem" }}>{a.hash}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. METRICS */}
        {activeTab === "metrics" && (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Held-Out Test Set Evaluation</h2>
              <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.5)" }}>
                Grounded in benchmark dataset evaluation ({evalMetrics.test_size} held-out test instances)
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
              <MetricCard label="Precision" value={`${(evalMetrics.precision * 100).toFixed(1)}%`} target="≥ 75%" met={evalMetrics.precision >= 0.75} accent="#39FF88" />
              <MetricCard label="Recall" value={`${(evalMetrics.recall * 100).toFixed(1)}%`} target="≥ 85%" met={evalMetrics.recall >= 0.85} accent="#39FF88" />
              <MetricCard label="ROC-AUC" value={evalMetrics.roc_auc.toFixed(3)} target="≥ 0.90" met={evalMetrics.roc_auc >= 0.90} accent="#FFA31A" />
              <MetricCard label="False Positive Rate" value={`${(evalMetrics.false_positive_rate * 100).toFixed(1)}%`} target="≤ 10%" met={evalMetrics.false_positive_rate <= 0.10} accent="#39FF88" />
            </div>
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", maxWidth: 600 }}>
              <div style={{ fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1rem" }}>
                Confusion Matrix (Test Size: {evalMetrics.test_size})
              </div>
              <ConfusionMatrix
                tp={evalMetrics.true_positives}
                fp={evalMetrics.false_positives}
                fn={evalMetrics.false_negatives}
                tn={evalMetrics.true_negatives}
              />
            </div>
          </div>
        )}

        {/* 12. POLICY SIMULATOR & REPLAY ENGINE (PRD §31 & §32) */}
        {activeTab === "policysim" && (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.4rem", fontFamily: "monospace" }}>
                Policy Simulator & Replay Engine
              </h2>
              <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.5)", fontFamily: "monospace" }}>
                Controlled what-if parameter simulation and historical 80,000 transaction replay
              </div>
            </div>
            <PolicySimulatorReplay />
          </div>
        )}

      </div>

    </div>
  );
}

export default function UnifiedRiskOSPage() {
  return (
    <Suspense fallback={<div style={{ background: "#050505", minHeight: "100vh" }} />}>
      <UnifiedRiskOSContent />
    </Suspense>
  );
}
