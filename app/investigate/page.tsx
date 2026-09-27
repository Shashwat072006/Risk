"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import ScorePanel from "@/components/ScorePanel";
import RulesList from "@/components/RulesList";
import FeatureBar from "@/components/FeatureBar";
import MultiModelScores from "@/components/MultiModelScores";
import CounterfactualPanel from "@/components/CounterfactualPanel";
import TimelineView from "@/components/TimelineView";
import type { ModelScore } from "@/components/MultiModelScores";
import type { CounterfactualItem } from "@/components/CounterfactualPanel";

// ── Multi-Transaction Database ────────────────────────────────────────────────

interface TransactionRecord {
  id: string;
  accountId: string;
  customerName: string;
  decision: "ALLOW" | "REVIEW" | "BLOCK" | "STEP-UP" | "3DS";
  risk_score_pct: number;
  rule_score: number;
  ml_prob: number;
  latency_ms: number;
  customer_age: string;
  device: string;
  device_id: string;
  ip_risk: string;
  ip_address: string;
  asn: string;
  campaign?: string;
  amount: string;
  merchant: string;
  country: string;
  channel: string;
  payment_method: string;
  tokenized_pan: string;
  cvv_status: string;
  three_ds_cavv: string;
  three_ds_eci: string;
  explanation: string;
  copilot_summary: string;
  multi_models: ModelScore[];
  counterfactuals: CounterfactualItem[];
  rules: { rule_id: string; description: string; weight: number; triggered: boolean }[];
  features: { feature: string; value: number }[];
  timeline_events: { time: string; label: string; type: "normal" | "risk" | "block" | "auth" }[];
}

const TRANSACTIONS_DB: Record<string, TransactionRecord> = {
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
    asn: "AS37148 MTN Nigeria (Anomalous Origin)",
    campaign: "#1842",
    amount: "INR 84,000",
    merchant: "Niyo Remit / Rapid Wire",
    country: "NG",
    channel: "Mobile App (Direct API)",
    payment_method: "Visa Corporate Debit",
    tokenized_pan: "•••• •••• •••• 4921",
    cvv_status: "MATCH (Not stored - PCI 4.0 compliant)",
    three_ds_cavv: "AAABBBCCDDEEFF0011223344",
    three_ds_eci: "07 (Authentication Failed / Bypass Attempt)",
    explanation:
      "Critical account takeover detected. New unrecognized device in Lagos, Nigeria initiated immediate beneficiary modification followed by an instantaneous ₹84,000 international transfer. Strongly clustered with Campaign #1842 (17 linked accounts).",
    copilot_summary:
      "High-confidence Account Takeover (94% risk). Attack sequence conforms with credential stuffing: (1) Password changed 12 mins prior via Tor proxy, (2) Unknown iOS device paired without biometric handoff, (3) High-velocity instant transfer. Recommended action: Immediate account freeze, invalidate active tokens, and initiate SAR filing.",
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
      { rule_id: "R03", description: "Merchant whitelist match", weight: 0.3, triggered: false },
      { rule_id: "R04", description: "Valid biometrics on initiation", weight: 0.4, triggered: false },
    ],
    features: [
      { feature: "geo_velocity_kmh", value: 0.994 },
      { feature: "device_novelty_score", value: 0.971 },
      { feature: "campaign_link_degree", value: 0.958 },
      { feature: "time_since_pwd_reset_hrs", value: 0.912 },
      { feature: "amount_to_avg_ratio", value: 0.843 },
      { feature: "ip_reputation_risk", value: 0.819 },
      { feature: "beneficiary_age_hrs", value: 0.785 },
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
    explanation:
      "Rapid second liquidation attempt within 2 minutes of prior decline. Recipient matches known high-risk crypto off-ramp entity. Synthetic velocity burst confirms automated adversary playbook.",
    copilot_summary:
      "Automated follow-on attack. Following the failure of TX-99001, adversary attempted an instant P2P crypto rail payment of ₹1,20,000. Mule off-ramp address matches known laundering syndicate. Immediate account lockdown recommended.",
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
      { removed_signal: "Unregistered device footprint", without_score: 62, without_decision: "REVIEW" },
    ],
    rules: [
      { rule_id: "R01", description: "Velocity: Re-attempt within 120s of hard decline", weight: 0.99, triggered: true },
      { rule_id: "R07", description: "Crypto off-ramp destination on unverified account", weight: 0.94, triggered: true },
      { rule_id: "R12", description: "Account already marked under active investigation", weight: 0.97, triggered: true },
    ],
    features: [
      { feature: "seconds_since_last_decline", value: 0.995 },
      { feature: "high_risk_mcc_weight", value: 0.963 },
      { feature: "entity_cluster_risk", value: 0.944 },
      { feature: "device_emulator_signal", value: 0.891 },
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
    asn: "AS29465 MainOne Cable Nigeria",
    campaign: "#1842",
    amount: "INR 84,000",
    merchant: "International Wire Service",
    country: "NG",
    channel: "Web Portal",
    payment_method: "Mastercard Platinum",
    tokenized_pan: "•••• •••• •••• 8834",
    cvv_status: "MATCH",
    three_ds_cavv: "Pending Step-Up Resolution",
    three_ds_eci: "02 (Attempted)",
    explanation:
      "High fraud score driven by new device registration, high-risk network origin, and unusual transfer velocity. Transaction correlated with Campaign #1842 — coordinated account takeover. Step-up authentication requested.",
    copilot_summary:
      "Borderline intervention zone (Risk 84). While device and IP are completely novel, historical account tenure is 4 years with high positive balance. Least-cost intervention engine selected Biometric Step-Up over outright block to balance customer friction vs fraud exposure.",
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
      { removed_signal: "Transaction velocity", without_score: 41, without_decision: "APPROVE" },
      { removed_signal: "Campaign correlation", without_score: 68, without_decision: "STEP-UP" },
    ],
    rules: [
      { rule_id: "R01", description: "Velocity: >5 txns in 1h from single device", weight: 0.85, triggered: true },
      { rule_id: "R02", description: "Prior declines: >3 in last 60 minutes", weight: 0.9, triggered: true },
      { rule_id: "R06", description: "High-risk country IP (NG/PK/BD/RU/CN)", weight: 0.7, triggered: true },
      { rule_id: "R09", description: "New device + amount > INR 50,000", weight: 0.95, triggered: true },
      { rule_id: "R03", description: "Amount within normal range for merchant", weight: 0.4, triggered: false },
      { rule_id: "R04", description: "Account age > 90 days", weight: 0.3, triggered: false },
      { rule_id: "R05", description: "No prior chargebacks on account", weight: 0.5, triggered: false },
    ],
    features: [
      { feature: "device_age_days", value: 0.982 },
      { feature: "prior_declines_1h", value: 0.874 },
      { feature: "accounts_on_ip_24h", value: 0.761 },
      { feature: "txn_count_1h", value: 0.643 },
      { feature: "amount_log", value: 0.521 },
      { feature: "geo_mismatch", value: 0.489 },
      { feature: "velocity_score", value: 0.412 },
    ],
    timeline_events: [
      { time: "09:41", label: "Login from Lagos IP", type: "risk" },
      { time: "09:42", label: "Password change via Web", type: "risk" },
      { time: "09:43", label: "New browser device registered", type: "risk" },
      { time: "09:44", label: "Beneficiary added", type: "risk" },
      { time: "09:44", label: "Wire transfer — INR 84,000", type: "block" },
      { time: "09:45", label: "FIDO2 WebAuthn Step-Up dispatched", type: "auth" },
    ],
  },
  "TX-11203-01": {
    id: "TX-11203-01",
    accountId: "ACC-11203",
    customerName: "Sarah Chen",
    decision: "3DS",
    risk_score_pct: 54,
    rule_score: 0.42,
    ml_prob: 0.48,
    latency_ms: 29.1,
    customer_age: "2.5 years",
    device: "KNOWN DEVICE",
    device_id: "DEV-33019-MAC",
    ip_risk: "LOW RISK (COMMERCIAL)",
    ip_address: "141.136.21.90 [Tokenized]",
    asn: "AS3320 Deutsche Telekom AG",
    amount: "EUR 3,400",
    merchant: "Lufthansa German Airlines",
    country: "DE",
    channel: "Web Checkout",
    payment_method: "Visa Infinite Debit",
    tokenized_pan: "•••• •••• •••• 1092",
    cvv_status: "MATCH",
    three_ds_cavv: "M01019A8201B78299102AA19",
    three_ds_eci: "05 (Fully Authenticated)",
    explanation:
      "Geo-shift detected: Customer usually transacts in Singapore, currently requesting ticket purchase in Frankfurt. However, device fingerprint matches known laptop and airline purchase aligns with executive travel calendar. 3DS challenge recommended.",
    copilot_summary:
      "Legitimate travel anomaly with low fraud probability (54%). Customer has high lifetime volume and zero historic chargebacks. Friction cost calculation favors 3DS challenge rather than review or block.",
    multi_models: [
      { label: "Fraud", score: 38, color: "#39FF88", desc: "Low direct card abuse likelihood" },
      { label: "ATO", score: 24, color: "#39FF88", desc: "Low account takeover probability" },
      { label: "Chargeback", score: 29, color: "#39FF88", desc: "Dispute likelihood negligible" },
      { label: "Novelty", score: 71, color: "#FFA31A", desc: "Moderate geo-novelty (DE vs SG)" },
      { label: "Campaign", score: 12, color: "#39FF88", desc: "No known campaign affiliation" },
    ],
    counterfactuals: [
      { removed_signal: "Frankfurt geo-distance", without_score: 22, without_decision: "ALLOW" },
      { removed_signal: "Amount > EUR 2,500", without_score: 36, without_decision: "ALLOW" },
    ],
    rules: [
      { rule_id: "R08", description: "Cross-border payment > EUR 2,000", weight: 0.6, triggered: true },
      { rule_id: "R03", description: "Merchant recognized travel category", weight: 0.4, triggered: true },
      { rule_id: "R04", description: "Trusted device signature match", weight: 0.2, triggered: true },
    ],
    features: [
      { feature: "geo_distance_km", value: 0.742 },
      { feature: "amount_eur_log", value: 0.584 },
      { feature: "device_confidence_score", value: 0.941 },
    ],
    timeline_events: [
      { time: "04:15", label: "Session resumed via FaceID", type: "normal" },
      { time: "04:18", label: "Cart checkout Lufthansa LH 779 — EUR 3,400", type: "risk" },
      { time: "04:19", label: "EMV 3DS 2.2 Challenge Completed (Frictionless)", type: "auth" },
    ],
  },
  "TX-90041-01": {
    id: "TX-90041-01",
    accountId: "ACC-90041",
    customerName: "Unknown / Synthetic Entity",
    decision: "BLOCK",
    risk_score_pct: 99,
    rule_score: 0.99,
    ml_prob: 0.99,
    latency_ms: 32.7,
    customer_age: "11 days",
    device: "MULTIPLE SIM-BOXES",
    device_id: "DEV-99104-SYN",
    ip_risk: "CRITICAL (BULK PROXY)",
    ip_address: "185.191.171.12 [Tokenized]",
    asn: "AS44034 HiChina Web Solutions",
    campaign: "#1830",
    amount: "USD 48,000",
    merchant: "Rapid Settlement Gateway",
    country: "HK",
    channel: "Automated Batch Sched",
    payment_method: "SWIFT Wire",
    tokenized_pan: "•••• •••• •••• 9901",
    cvv_status: "FAILED / BYPASS",
    three_ds_cavv: "REJECTED",
    three_ds_eci: "08",
    explanation:
      "Severe Mule Dispersal behavior. Account was opened 11 days ago, received rapid inbound structuring wires, and is now attempting immediate cross-border split transfers across 7 jurisdictions. SAR filed.",
    copilot_summary:
      "Classified as Money Mule Dispersal Node (Risk 99%). Entity exhibits 100% velocity-to-drainage ratio: $50K deposited via wire was immediately scheduled for dispersal within 18 minutes. Matched against known syndicate Campaign #1830. Regulatory SAR 2026-FR-9901 created.",
    multi_models: [
      { label: "Fraud", score: 99, color: "#FF4D4D", desc: "Mule account dispersal" },
      { label: "ATO", score: 45, color: "#FFA31A", desc: "Not ATO; account opened synthetically" },
      { label: "Chargeback", score: 94, color: "#FF4D4D", desc: "Clawback unavoidable" },
      { label: "Novelty", score: 98, color: "#FF4D4D", desc: "Total divergence from standard retail" },
      { label: "Campaign", score: 99, color: "#39FF88", desc: "Syndicate #1830 Hub" },
    ],
    counterfactuals: [
      { removed_signal: "Account age < 14 days", without_score: 91, without_decision: "BLOCK" },
      { removed_signal: "Cross-border spread (7 nations)", without_score: 87, without_decision: "BLOCK" },
    ],
    rules: [
      { rule_id: "R10", description: "Mule Velocity: Inbound -> Outbound in <30m", weight: 0.99, triggered: true },
      { rule_id: "R11", description: "Rapid Account Drainage: >95% balance outflow", weight: 0.98, triggered: true },
      { rule_id: "R12", description: "Entity Graph linked to Campaign #1830", weight: 0.99, triggered: true },
    ],
    features: [
      { feature: "drainage_rate_pct", value: 0.998 },
      { feature: "inbound_to_outbound_delta_min", value: 0.994 },
      { feature: "graph_mule_centrality", value: 0.989 },
    ],
    timeline_events: [
      { time: "01:00", label: "Inbound corporate wire — USD 50,000", type: "normal" },
      { time: "01:14", label: "Rapid multi-jurisdiction dispersal initiated", type: "block" },
      { time: "01:18", label: "Account Freeze & Regulatory SAR 2026-FR-9901 filed", type: "block" },
    ],
  },
};

// Fallback generator for unknown IDs
function getTransaction(id: string): TransactionRecord {
  if (TRANSACTIONS_DB[id]) return TRANSACTIONS_DB[id];
  return {
    ...TRANSACTIONS_DB["TX-92831"],
    id,
    explanation: `Real-time evaluation for transaction ${id}. Evaluated using multi-model fraud, ATO, novelty, and campaign detection layers.`,
  };
}

// ── Page Component ───────────────────────────────────────────────────────────

function InvestigateContent() {
  const params = useSearchParams();
  const [txnId, setTxnId] = useState("TX-99001");

  useEffect(() => {
    const qId = params.get("id");
    if (qId) {
      setTxnId(qId);
    }
  }, [params]);

  const [activeTab, setActiveTab] = useState<"overview" | "models" | "counterfactual" | "timeline" | "evidence">("overview");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [analystNotes, setAnalystNotes] = useState<string[]>([
    "Initial triage: Flagged by Campaign Engine #1842 correlation at 09:41 UTC.",
  ]);
  const [noteInput, setNoteInput] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const txn = getTransaction(txnId);

  const DCOL: Record<string, string> = {
    ALLOW: "#39FF88",
    REVIEW: "#FFA31A",
    BLOCK: "#FF4D4D",
    "STEP-UP": "#FFA31A",
    "3DS": "#FFA31A",
  };
  const decCol = DCOL[txn.decision] ?? "#F4F4F0";

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "models", label: "Multi-Model Risk" },
    { key: "counterfactual", label: "Counterfactuals" },
    { key: "evidence", label: "Evidence Vault (PCI/3DS)" },
    { key: "timeline", label: "Audit Timeline" },
  ] as const;

  function handleSelectTxn(id: string) {
    setTxnId(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/investigate?id=${id}`);
    }
  }

  function triggerAction(actionName: string, color: string) {
    setActionNotice(`${actionName} executed successfully. Logged to immutable audit trail.`);
    setAnalystNotes((prev) => [
      `[${new Date().toLocaleTimeString()}] Action: ${actionName} by Analyst 021`,
      ...prev,
    ]);
    setTimeout(() => setActionNotice(null), 4000);
  }

  function handleAddNote() {
    if (!noteInput.trim()) return;
    setAnalystNotes((prev) => [
      `[${new Date().toLocaleTimeString()}] Note: ${noteInput.trim()}`,
      ...prev,
    ]);
    setNoteInput("");
  }

  return (
    <main style={{ background: "#050505", minHeight: "100vh", color: "#F4F4F0" }} suppressHydrationWarning>
      <div className="grain-overlay" aria-hidden="true" />
      

      {/* Hero Section */}
      <section
        suppressHydrationWarning
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "2.5rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }} suppressHydrationWarning>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#39FF88" }}>
                Enterprise Risk Workbench
              </div>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.6)", fontFamily: "monospace" }}>
                Account:{" "}
                <Link href={`/account-360?id=${txn.accountId}`} style={{ color: "#FFA31A", textDecoration: "none", fontWeight: 600 }}>
                  {txn.accountId} ({txn.customerName}) ↗
                </Link>
              </div>
            </div>

            {/* Switch Preset Transactions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)" }}>
                Preset Cases:
              </span>
              {(["TX-99001", "TX-99002", "TX-92831", "TX-11203-01", "TX-90041-01"] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => handleSelectTxn(id)}
                  style={{
                    background: txnId === id ? "rgba(57, 255, 136, 0.15)" : "#0A0A0A",
                    border: txnId === id ? "1px solid #39FF88" : "1px solid rgba(255,255,255,0.08)",
                    color: txnId === id ? "#39FF88" : "rgba(244,244,240,0.5)",
                    fontSize: "0.5rem",
                    padding: "0.25rem 0.6rem",
                    fontFamily: "monospace",
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", flexWrap: "wrap" }}>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: "#F4F4F0",
                textTransform: "uppercase",
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              {txn.id}
            </h1>
            <div
              style={{
                padding: "0.4rem 1.25rem",
                background: `${decCol}14`,
                border: `1px solid ${decCol}44`,
                color: decCol,
                fontSize: "0.875rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
              }}
            >
              {txn.decision}
            </div>
            {txn.campaign && (
              <Link
                href="/campaigns"
                style={{
                  fontSize: "0.625rem",
                  color: "#FF4D4D",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  textDecoration: "none",
                  padding: "0.3rem 0.75rem",
                  border: "1px solid rgba(255,77,77,0.3)",
                  background: "rgba(255,77,77,0.08)",
                }}
              >
                CAMPAIGN {txn.campaign} LINKED ↗
              </Link>
            )}

            <button
              onClick={() => setCopilotOpen(!copilotOpen)}
              style={{
                marginLeft: "auto",
                background: copilotOpen ? "#39FF88" : "rgba(57,255,136,0.12)",
                border: "1px solid #39FF88",
                color: copilotOpen ? "#050505" : "#39FF88",
                padding: "0.5rem 1.25rem",
                fontSize: "0.625rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: copilotOpen ? "#050505" : "#39FF88" }} />
              {copilotOpen ? "Close AI Copilot" : "Investigator Copilot"}
            </button>
          </div>

          <p style={{ maxWidth: 800, fontSize: "0.875rem", color: "rgba(244,244,240,0.65)", lineHeight: 1.6, marginTop: "1.25rem" }}>
            {txn.explanation}
          </p>

          {actionNotice && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(57, 255, 136, 0.1)",
                border: "1px solid #39FF88",
                color: "#39FF88",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              [OK] {actionNotice}
            </div>
          )}
        </div>
      </section>

      {/* Metadata KPI Bar */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 2.5rem", background: "#080808" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: "0", overflowX: "auto" }}>
          {[
            { label: "Total Risk", value: `${txn.risk_score_pct}/100`, color: decCol },
            { label: "Amount", value: txn.amount, color: "#F4F4F0" },
            { label: "Customer Age", value: txn.customer_age, color: "#F4F4F0" },
            { label: "Device Health", value: txn.device, color: txn.device.includes("NEW") || txn.device.includes("SIM") ? "#FF4D4D" : "#39FF88" },
            { label: "IP Origin", value: `${txn.country} - ${txn.ip_risk}`, color: txn.ip_risk.includes("HIGH") || txn.ip_risk.includes("CRITICAL") ? "#FF4D4D" : "#39FF88" },
            { label: "Channel", value: txn.channel, color: "rgba(244,244,240,0.8)" },
            { label: "Decision SLA", value: `${txn.latency_ms}ms`, color: "#39FF88" },
          ].map((m) => (
            <div key={m.label} style={{ padding: "1.25rem 1.5rem", borderRight: "1px solid rgba(255,255,255,0.06)", minWidth: 120 }}>
              <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "0.375rem" }}>
                {m.label}
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: m.color, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Tabs + Copilot split view */}
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "stretch" }}>
        {/* Main workbench body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tab nav */}
          <section style={{ padding: "0 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "1rem 1.5rem",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab.key ? `2px solid #39FF88` : "2px solid transparent",
                    color: activeTab === tab.key ? "#F4F4F0" : "rgba(244,244,240,0.35)",
                    fontSize: "0.5625rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {/* Tab Content */}
          <div style={{ padding: "2.5rem" }}>
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 1fr", gap: "2rem", alignItems: "start" }}>
                <div style={{ background: "#0A0A0A", border: `1px solid ${decCol}33`, padding: "2rem" }}>
                  <ScorePanel
                    score={txn.risk_score_pct}
                    decision={txn.decision as "ALLOW" | "REVIEW" | "BLOCK"}
                    latencyMs={txn.latency_ms}
                    ruleScore={txn.rule_score}
                    mlProb={txn.ml_prob}
                  />
                </div>
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1.25rem" }}>
                    Rule Evaluation Layer (40%)
                  </div>
                  <RulesList rules={txn.rules} />
                </div>
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1.25rem" }}>
                    SHAP Feature Attribution (60%)
                  </div>
                  <FeatureBar features={txn.features} />
                </div>
              </div>
            )}

            {activeTab === "models" && (
              <div style={{ maxWidth: 800 }}>
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#39FF88", marginBottom: "1.5rem" }}>
                    Multi-Model Risk Deconstruction (PRD Section 12)
                  </div>
                  <MultiModelScores scores={txn.multi_models} />
                </div>
                <div style={{ marginTop: "1.5rem", padding: "1.5rem 2rem", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginBottom: "0.75rem" }}>
                    Ensemble Decision Logic
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "rgba(244,244,240,0.75)", lineHeight: 1.65, margin: 0 }}>
                    ATDP isolates individual risk dimensions rather than flattening into a single probability. For this event,
                    ATO risk ({txn.multi_models.find((m) => m.label === "ATO")?.score ?? 90}) and Novelty detector (
                    {txn.multi_models.find((m) => m.label === "Novelty")?.score ?? 92}) supersede raw card-testing probability.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "counterfactual" && (
              <div style={{ maxWidth: 840 }}>
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#39FF88", marginBottom: "1.5rem" }}>
                    What-If Counterfactual Explanations (PRD Section 19)
                  </div>
                  <CounterfactualPanel
                    current_score={txn.risk_score_pct}
                    current_decision={txn.decision}
                    items={txn.counterfactuals}
                  />
                </div>
              </div>
            )}

            {activeTab === "evidence" && (
              <div style={{ maxWidth: 900 }}>
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <div>
                      <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#39FF88" }}>
                        PCI DSS 4.0 & EMVCo 3DS Evidence Vault (PRD Section 17)
                      </div>
                      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0.25rem 0 0", color: "#F4F4F0" }}>
                        Dispute & Chargeback Verification Package
                      </h2>
                    </div>
                    <button
                      onClick={() => triggerAction("Dispute Evidence Bundle Exported (JSON/PDF)", "#39FF88")}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "rgba(57, 255, 136, 0.12)",
                        border: "1px solid #39FF88",
                        color: "#39FF88",
                        fontSize: "0.5625rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                      }}
                    >
                      Export Dispute Package ↓
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    {/* Payment / Card Details */}
                    <div style={{ background: "#050505", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                      <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1rem" }}>
                        Payment Instrument
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "rgba(244,244,240,0.5)" }}>Method:</span>
                          <span style={{ fontWeight: 600 }}>{txn.payment_method}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "rgba(244,244,240,0.5)" }}>Masked PAN:</span>
                          <span style={{ fontFamily: "monospace", color: "#F5F4EF" }}>{txn.tokenized_pan}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "rgba(244,244,240,0.5)" }}>CVV Check:</span>
                          <span style={{ color: "#39FF88", fontWeight: 600 }}>{txn.cvv_status}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "rgba(244,244,240,0.5)" }}>Settlement Rail:</span>
                          <span style={{ fontFamily: "monospace" }}>ISO 20022 pacs.008</span>
                        </div>
                      </div>
                    </div>

                    {/* 3DS 2.2 Telemetry */}
                    <div style={{ background: "#050505", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                      <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1rem" }}>
                        EMV 3DS 2.2 Telemetry
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "rgba(244,244,240,0.5)" }}>CAVV Cryptogram:</span>
                          <span style={{ fontFamily: "monospace", color: "#FFA31A" }}>{txn.three_ds_cavv}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "rgba(244,244,240,0.5)" }}>ECI Flag:</span>
                          <span style={{ fontFamily: "monospace" }}>{txn.three_ds_eci}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "rgba(244,244,240,0.5)" }}>Liability Shift:</span>
                          <span style={{ color: txn.decision === "BLOCK" ? "#FF4D4D" : "#39FF88", fontWeight: 700 }}>
                            {txn.decision === "BLOCK" ? "Merchant / Issuer Liable" : "Shifted to Cardholder Bank"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Device & Network Telemetry */}
                    <div style={{ background: "#050505", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem", gridColumn: "span 2" }}>
                      <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1rem" }}>
                        Device & Network Egress Intelligence
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.75rem" }}>
                        <div>
                          <div style={{ color: "rgba(244,244,240,0.4)", fontSize: "0.625rem" }}>Device Identifier</div>
                          <div style={{ fontFamily: "monospace", color: "#F4F4F0", marginTop: "0.25rem" }}>{txn.device_id}</div>
                        </div>
                        <div>
                          <div style={{ color: "rgba(244,244,240,0.4)", fontSize: "0.625rem" }}>Client IP Token</div>
                          <div style={{ fontFamily: "monospace", color: "#F4F4F0", marginTop: "0.25rem" }}>{txn.ip_address}</div>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                          <div style={{ color: "rgba(244,244,240,0.4)", fontSize: "0.625rem" }}>Autonomous System (ASN)</div>
                          <div style={{ fontFamily: "monospace", color: "#FFA31A", marginTop: "0.25rem" }}>{txn.asn}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div style={{ maxWidth: 840 }}>
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#39FF88", marginBottom: "1.5rem" }}>
                    Forensic Activity Timeline
                  </div>
                  <TimelineView events={txn.timeline_events} txnId={txn.id} />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Analyst Actions Bar */}
          <section
            style={{
              padding: "1.5rem 2.5rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "#080808",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.5)" }}>
                Analyst Actions:
              </span>
              <button
                onClick={() => triggerAction(`Account ${txn.accountId} Locked & Suspended`, "#FF4D4D")}
                style={{
                  background: "rgba(255, 77, 77, 0.15)",
                  border: "1px solid #FF4D4D",
                  color: "#FF4D4D",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                Freeze Account
              </button>
              <button
                onClick={() => triggerAction("Out-of-band Biometric Step-Up Dispatched", "#FFA31A")}
                style={{
                  background: "rgba(255, 163, 26, 0.12)",
                  border: "1px solid #FFA31A",
                  color: "#FFA31A",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                Force Step-Up
              </button>
              <button
                onClick={() => triggerAction(`SAR (Suspicious Activity Report) Filed with Compliance`, "#FF4D4D")}
                style={{
                  background: "rgba(255, 77, 77, 0.12)",
                  border: "1px solid #FF4D4D",
                  color: "#FF4D4D",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                File Regulatory SAR
              </button>
              <button
                onClick={() => triggerAction("Marked as Legitimate False Positive. Feedback loop updated.", "#39FF88")}
                style={{
                  background: "rgba(57, 255, 136, 0.12)",
                  border: "1px solid #39FF88",
                  color: "#39FF88",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                Mark False Positive
              </button>
            </div>

            <Link
              href="/cases"
              style={{
                fontSize: "0.625rem",
                color: "#FFA31A",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.08em",
              }}
            >
              Open in Case Management →
            </Link>
          </section>
        </div>

        {/* Investigator Copilot Drawer */}
        {copilotOpen && (
          <aside
            style={{
              width: 380,
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              background: "#070707",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#39FF88" }} />
                <span style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#39FF88" }}>
                  Investigator Copilot
                </span>
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1rem" }}
              >
                X
              </button>
            </div>

            {/* AI Executive Summary */}
            <div style={{ background: "#0D0D0D", border: "1px solid rgba(57,255,136,0.2)", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#39FF88", marginBottom: "0.5rem" }}>
                Executive Synthesis
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.8)", lineHeight: 1.55, margin: 0 }}>
                {txn.copilot_summary}
              </p>
            </div>

            {/* Regulatory Alignment Checklist */}
            <div style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFA31A", marginBottom: "0.75rem" }}>
                Regulatory Compliance Checks
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.6875rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ color: "#39FF88", fontSize: "0.5625rem", fontWeight: 700 }}>[PASS]</span>
                  <span>RBI Master Directions 2024: Parameterized velocity logged</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ color: "#39FF88", fontSize: "0.5625rem", fontWeight: 700 }}>[PASS]</span>
                  <span>FFIEC Layered Auth: Device-token mismatch flagged</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ color: "#39FF88", fontSize: "0.5625rem", fontWeight: 700 }}>[PASS]</span>
                  <span>PCI DSS 4.0: Zero CVV persistence observed</span>
                </div>
              </div>
            </div>

            {/* Analyst Case Notes & Audit */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "0.75rem" }}>
                Case Notes & Audit Log ({analystNotes.length})
              </div>
              <div
                style={{
                  flex: 1,
                  maxHeight: 180,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {analystNotes.map((note, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "0.6875rem",
                      color: "rgba(244,244,240,0.7)",
                      background: "#050505",
                      padding: "0.5rem 0.75rem",
                      borderLeft: "2px solid #39FF88",
                    }}
                  >
                    {note}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Add case note..."
                  style={{
                    flex: 1,
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "0.4rem 0.75rem",
                    color: "#F4F4F0",
                    fontSize: "0.6875rem",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleAddNote}
                  style={{
                    background: "#39FF88",
                    border: "none",
                    color: "#050505",
                    padding: "0.4rem 0.75rem",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      
    </main>
  );
}

export default function InvestigatePage() {
  return (
    <Suspense fallback={<div style={{ background: "#050505", minHeight: "100vh" }} />}>
      <InvestigateContent />
    </Suspense>
  );
}
