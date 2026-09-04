"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScorePanel from "@/components/ScorePanel";
import RulesList from "@/components/RulesList";
import FeatureBar from "@/components/FeatureBar";
import MultiModelScores from "@/components/MultiModelScores";
import CounterfactualPanel from "@/components/CounterfactualPanel";
import TimelineView from "@/components/TimelineView";
import type { ModelScore } from "@/components/MultiModelScores";
import type { CounterfactualItem } from "@/components/CounterfactualPanel";

// ── Mock investigation data ──────────────────────────────────────────────────

const MOCK_TXN = {
  id: "TX-92831",
  decision: "STEP-UP" as const,
  risk_score_pct: 84,
  rule_score: 0.72,
  ml_prob: 0.91,
  latency_ms: 38.4,
  customer_age: "4 years",
  device: "NEW",
  ip_risk: "HIGH RISK",
  campaign: "#1842",
  amount: "INR 84,000",
  merchant: "International Wire",
  country: "NG",
  explanation:
    "High fraud score driven by new device registration, high-risk network origin, and unusual transfer velocity. Transaction correlated with Campaign #1842 — coordinated account takeover. Step-up authentication requested.",
};

const MOCK_MULTI_MODELS: ModelScore[] = [
  { label: "Fraud",      score: 84, color: "#FF4D4D", desc: "Card-testing / payment fraud" },
  { label: "ATO",        score: 91, color: "#E600FF", desc: "Account takeover" },
  { label: "Chargeback", score: 63, color: "#FFA31A", desc: "Dispute risk" },
  { label: "Novelty",    score: 92, color: "#00F6FF", desc: "Behavioral anomaly" },
  { label: "Campaign",   score: 88, color: "#39FF88", desc: "Coordinated attack correlation" },
];

const MOCK_COUNTERFACTUALS: CounterfactualItem[] = [
  { removed_signal: "New device signal",          without_score: 63, without_decision: "REVIEW" },
  { removed_signal: "Network / IP risk",           without_score: 52, without_decision: "3DS" },
  { removed_signal: "Transaction velocity",        without_score: 41, without_decision: "APPROVE" },
  { removed_signal: "Campaign correlation",        without_score: 68, without_decision: "STEP-UP" },
];

const MOCK_RULES = [
  { rule_id: "R01", description: "Velocity: >5 txns in 1h from single device", weight: 0.85, triggered: true },
  { rule_id: "R02", description: "Prior declines: >3 in last 60 minutes",       weight: 0.9,  triggered: true },
  { rule_id: "R06", description: "High-risk country IP (NG/PK/BD/RU/CN)",       weight: 0.7,  triggered: true },
  { rule_id: "R09", description: "New device + amount > INR 50,000",             weight: 0.95, triggered: true },
  { rule_id: "R03", description: "Amount within normal range for merchant",      weight: 0.4,  triggered: false },
  { rule_id: "R04", description: "Account age > 90 days",                        weight: 0.3,  triggered: false },
  { rule_id: "R05", description: "No prior chargebacks on account",              weight: 0.5,  triggered: false },
];

const MOCK_FEATURES = [
  { feature: "device_age_days",   value: 0.982 },
  { feature: "prior_declines_1h", value: 0.874 },
  { feature: "accounts_on_ip_24h",value: 0.761 },
  { feature: "txn_count_1h",      value: 0.643 },
  { feature: "amount_log",        value: 0.521 },
  { feature: "geo_mismatch",      value: 0.489 },
  { feature: "velocity_score",    value: 0.412 },
];

// ── Page ─────────────────────────────────────────────────────────────────────

function InvestigateContent() {
  const params = useSearchParams();
  const txnId = params.get("id") ?? MOCK_TXN.id;
  const [activeTab, setActiveTab] = useState<"overview" | "models" | "counterfactual" | "timeline">("overview");

  const txn = { ...MOCK_TXN, id: txnId };

  const DCOL: Record<string, string> = {
    ALLOW: "#39FF88", REVIEW: "#FFA31A", BLOCK: "#FF4D4D", "STEP-UP": "#00F6FF", "3DS": "#00F6FF",
  };
  const decCol = DCOL[txn.decision] ?? "#F4F4F0";

  const TABS = [
    { key: "overview",       label: "Overview" },
    { key: "models",         label: "Multi-Model" },
    { key: "counterfactual", label: "Counterfactual" },
    { key: "timeline",       label: "Timeline" },
  ] as const;

  return (
    <main style={{ background: "#050505", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />

      {/* Hero */}
      <section
        style={{
          paddingTop: "8rem",
          paddingBottom: "3rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#00F6FF", marginBottom: "1rem" }}>
            Transaction Investigation
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
              <div style={{ fontSize: "0.5rem", color: "#FF4D4D", letterSpacing: "0.1em", fontWeight: 600 }}>
                CAMPAIGN {txn.campaign}
              </div>
            )}
          </div>
          <p style={{ maxWidth: 600, fontSize: "0.8125rem", color: "rgba(244,244,240,0.45)", lineHeight: 1.65, marginTop: "1rem" }}>
            {txn.explanation}
          </p>
        </div>
      </section>

      {/* Metadata bar */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 2.5rem" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: "0", overflowX: "auto" }}>
          {[
            { label: "Risk",     value: txn.risk_score_pct.toString(), color: decCol },
            { label: "Customer", value: txn.customer_age,              color: "#F4F4F0" },
            { label: "Device",   value: txn.device,                    color: txn.device === "NEW" ? "#FF4D4D" : "#39FF88" },
            { label: "IP Risk",  value: txn.ip_risk,                   color: txn.ip_risk.includes("HIGH") ? "#FF4D4D" : "#39FF88" },
            { label: "Amount",   value: txn.amount,                    color: "#F4F4F0" },
            { label: "Merchant", value: txn.merchant,                  color: "#F4F4F0" },
            { label: "Country",  value: txn.country,                   color: ["NG","PK","BD","RU","CN"].includes(txn.country) ? "#FF4D4D" : "#F4F4F0" },
            { label: "Latency",  value: `${txn.latency_ms}ms`,         color: "#39FF88" },
          ].map((m) => (
            <div key={m.label} style={{ padding: "1.25rem 1.5rem", borderRight: "1px solid rgba(255,255,255,0.06)", minWidth: 100 }}>
              <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginBottom: "0.375rem" }}>
                {m.label}
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: m.color, letterSpacing: "-0.01em" }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section style={{ padding: "0 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 0 }}>
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
                transition: "color 200ms ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab content */}
      <section style={{ padding: "3rem 2.5rem", maxWidth: 1400, margin: "0 auto" }}>
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
                Rule Engine (40%)
              </div>
              <RulesList rules={MOCK_RULES} />
            </div>
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1.25rem" }}>
                ML Attribution (60%)
              </div>
              <FeatureBar features={MOCK_FEATURES} />
            </div>
          </div>
        )}

        {activeTab === "models" && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
              <MultiModelScores scores={MOCK_MULTI_MODELS} />
            </div>
            <div style={{ marginTop: "1.5rem", padding: "1.5rem 2rem", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginBottom: "0.75rem" }}>
                Dominant Signal
              </div>
              <p style={{ fontSize: "0.8125rem", color: "rgba(244,244,240,0.65)", lineHeight: 1.65, margin: 0 }}>
                ATO model (91) and Novelty detector (92) are the primary drivers. High novelty score indicates
                this transaction pattern has not been seen for this customer before. Campaign correlation (88)
                confirms linkage to coordinated attack Campaign #1842.
              </p>
            </div>
          </div>
        )}

        {activeTab === "counterfactual" && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
              <CounterfactualPanel
                current_score={txn.risk_score_pct}
                current_decision={txn.decision}
                items={MOCK_COUNTERFACTUALS}
              />
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
              <TimelineView events={[]} txnId={txn.id} />
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default function InvestigatePage() {
  return (
    <Suspense>
      <InvestigateContent />
    </Suspense>
  );
}
