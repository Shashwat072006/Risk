"use client";
import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Subtab Components
import AccountPassbook from "@/components/AccountPassbook";
import CashFlowView from "@/components/CashFlowView";
import CardsView from "@/components/CardsView";
import BeneficiaryIntelligence from "@/components/BeneficiaryIntelligence";
import DeviceIntelligence from "@/components/DeviceIntelligence";
import CustomerRiskProfile from "@/components/CustomerRiskProfile";
import NetworkIntelligence from "@/components/NetworkIntelligence";
import ConsentProvenanceView from "@/components/ConsentProvenanceView";
import PolicySimulatorReplay from "@/components/PolicySimulatorReplay";
import GoldenDemoPlayer from "@/components/GoldenDemoPlayer";

// ════════════════════════════════════════════════════════════════════════════
// SUBTAB DEFINITIONS (PRD §5)
// ════════════════════════════════════════════════════════════════════════════

type SubTab =
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
  | "replay";

const SUBTABS: { key: SubTab; label: string; badge?: string }[] = [
  { key: "overview", label: "OVERVIEW" },
  { key: "passbook", label: "PASSBOOK", badge: "LEDGER" },
  { key: "cashflow", label: "CASH FLOW", badge: "FLOW" },
  { key: "cards", label: "CARDS" },
  { key: "beneficiaries", label: "BENEFICIARIES", badge: "ALERT" },
  { key: "devices", label: "DEVICES", badge: "NOVEL" },
  { key: "risk", label: "RISK (9D)", badge: "94" },
  { key: "network", label: "NETWORK", badge: "IP-17" },
  { key: "cases", label: "CASES", badge: "1 OPEN" },
  { key: "audit", label: "AUDIT" },
  { key: "consent", label: "CONSENT", badge: "ACTIVE" },
  { key: "replay", label: "POLICY / REPLAY", badge: "SIM" },
];

function Account360Content() {
  const params = useSearchParams();
  const [activeTab, setActiveTab] = useState<SubTab>("overview");
  const [showGoldenDemo, setShowGoldenDemo] = useState(false);
  const [goldenStep, setGoldenStep] = useState(0);

  useEffect(() => {
    const tabParam = params.get("tab") as SubTab;
    if (tabParam && SUBTABS.some((t) => t.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [params]);

  function handleTabChange(tabKey: SubTab) {
    setActiveTab(tabKey);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/account-360?tab=${tabKey}`);
    }
  }

  function handleGoldenStepChange(stepIdx: number) {
    setGoldenStep(stepIdx);
    // Auto-switch tabs based on step
    if (stepIdx === 0) setActiveTab("overview");
    else if (stepIdx === 1 || stepIdx === 3) setActiveTab("passbook");
    else if (stepIdx === 2 || stepIdx === 6) setActiveTab("risk");
    else if (stepIdx === 4) setActiveTab("beneficiaries");
    else if (stepIdx === 5) setActiveTab("devices");
    else if (stepIdx === 7) setActiveTab("network");
    else if (stepIdx === 13) setActiveTab("cases");
    else if (stepIdx === 15) setActiveTab("audit");
    else if (stepIdx === 17) setActiveTab("replay");
  }

  return (
    <div style={{ background: "#070707", minHeight: "100vh", color: "#F5F4EF" }} suppressHydrationWarning>

      {/* ── PRD v4 §5 Header Section ────────────────────────────────────── */}
      <section
        style={{
          paddingTop: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #282828",
          background: "#070707",
        }}
        suppressHydrationWarning
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2.5rem" }} suppressHydrationWarning>
          {/* PRD §9 — Account 360 Signature Screen Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            {/* Row 1: Breadcrumb + Demo button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3a3a3a" }}>
                Accounts / Account 360
              </div>
              <button
                onClick={() => setShowGoldenDemo(!showGoldenDemo)}
                style={{
                  background: showGoldenDemo ? "rgba(57,255,136,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${showGoldenDemo ? "#39FF88" : "#282828"}`,
                  color: showGoldenDemo ? "#39FF88" : "#929292",
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.5rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                {showGoldenDemo ? "Hide Demo" : "Golden Demo"}
              </button>
            </div>

            {/* Row 2: Main identity block */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-start", gap: "2rem" }}>
              {/* LEFT: Customer identity */}
              <div>
                {/* Customer name — PRD §9: 32–42px */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                  <h1 style={{
                    fontSize: "clamp(28px, 4vw, 42px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    color: "#F5F4EF",
                    lineHeight: 1.05,
                  }}>
                    Rahul Sharma
                  </h1>
                  <span style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: "#929292",
                    letterSpacing: "0.06em",
                    marginTop: "0.25rem",
                  }}>
                    Premium · Active
                  </span>
                </div>

                {/* Account number + tenure */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "0.85rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#C8C7C2", letterSpacing: "0.04em" }}>
                    Account ••••4821
                  </span>
                  <span style={{ width: 1, height: 12, background: "#282828", display: "inline-block" }} />
                  <span style={{ fontSize: "0.6875rem", color: "#929292" }}>
                    6Y 4M relationship
                  </span>
                </div>

                {/* Secondary metadata */}
                <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", fontSize: "0.625rem", color: "#535353", letterSpacing: "0.04em" }}>
                  <span>Branch: <strong style={{ color: "#929292" }}>Connaught Place</strong></span>
                  <span>KYC: <strong style={{ color: "#39FF88" }}>Verified</strong></span>
                  <span>Last activity: <strong style={{ color: "#929292" }}>14:41</strong></span>
                </div>
              </div>

              {/* RIGHT: Balance card */}
              <div style={{
                display: "flex",
                gap: 0,
                background: "#101010",
                border: "1px solid #282828",
              }}>
                <div style={{ padding: "1rem 1.5rem", borderRight: "1px solid #282828" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#535353", marginBottom: "0.4rem" }}>
                    Available
                  </div>
                  <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "#39FF88", lineHeight: 1, letterSpacing: "-0.02em" }}>
                    ₹1,84,240
                  </div>
                </div>
                <div style={{ padding: "1rem 1.5rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#535353", marginBottom: "0.4rem" }}>
                    Current
                  </div>
                  <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "#F5F4EF", lineHeight: 1, letterSpacing: "-0.02em" }}>
                    ₹2,14,820
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Golden Demo Player */}
          {showGoldenDemo && (
            <div style={{ marginBottom: "1.25rem" }}>
              <GoldenDemoPlayer
                currentStepIndex={goldenStep}
                onSelectStep={handleGoldenStepChange}
                onClose={() => setShowGoldenDemo(false)}
              />
            </div>
          )}


          {/* ── 11 Account Subtabs Navigation Bar (PRD v4 §5) ──────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
              overflowX: "auto",
              paddingTop: "0.75rem",
              borderTop: "1px solid #1a1a1a",
            }}
          >
            {SUBTABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  style={{
                    padding: "0.6rem 0.85rem",
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? "2px solid #39FF88" : "2px solid transparent",
                    color: isActive ? "#F5F4EF" : "#929292",
                    fontSize: "0.5625rem",
                    fontWeight: isActive ? 700 : 400,
                    letterSpacing: "0.1em",
                    fontFamily: "monospace",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    whiteSpace: "nowrap",
                    transition: "all 0.12s ease",
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      style={{
                        fontSize: "0.45rem",
                        padding: "0.1rem 0.3rem",
                        background:
                          tab.badge === "ALERT" || tab.badge === "94"
                            ? "rgba(255,77,77,0.12)"
                            : tab.badge === "NOVEL"
                            ? "rgba(255,163,26,0.12)"
                            : "rgba(255,255,255,0.06)",
                        border:
                          tab.badge === "ALERT" || tab.badge === "94"
                            ? "1px solid rgba(255,77,77,0.3)"
                            : tab.badge === "NOVEL"
                            ? "1px solid rgba(255,163,26,0.3)"
                            : "1px solid #282828",
                        color:
                          tab.badge === "ALERT" || tab.badge === "94"
                            ? "#FF4D4D"
                            : tab.badge === "NOVEL"
                            ? "#FFA31A"
                            : "#929292",
                        borderRadius: "2px",
                        fontWeight: 700,
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Subtab Content Display Section ───────────────────────────── */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 2.5rem 6rem" }}>
        {/* TAB 1: OVERVIEW — PRD v4 §11 & §49 Layout */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* PRD §49: Split Top: BEHAVIOR vs RISK */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#282828", border: "1px solid #282828" }}>
              {/* BEHAVIOR CARD (PRD §11 & §49) */}
              <div style={{ background: "#101010", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.14em", color: "#929292", textTransform: "uppercase", fontFamily: "monospace" }}>
                    BEHAVIORAL BASELINE
                  </div>
                  <span style={{ fontSize: "0.5rem", fontWeight: 700, padding: "0.15rem 0.4rem", background: "rgba(57,255,136,0.08)", border: "1px solid rgba(57,255,136,0.25)", color: "#39FF88", borderRadius: "2px", fontFamily: "monospace" }}>
                    6Y 4M TENURE
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.75rem", fontFamily: "monospace" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#929292" }}>Typical transfer</span>
                    <span style={{ color: "#F5F4EF", fontWeight: 700 }}>₹2,000 – ₹12,000</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#929292" }}>Typical payment</span>
                    <span style={{ color: "#F5F4EF", fontWeight: 700 }}>₹1,500 – ₹8,000</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#929292" }}>Usual hours</span>
                    <span style={{ color: "#F5F4EF", fontWeight: 700 }}>09:00 – 22:30 IST</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#929292" }}>Known devices</span>
                    <span style={{ color: "#F5F4EF", fontWeight: 700 }}>3 (iPhone 15 Pro, MacBook Pro, <span style={{ color: "#FF4D4D" }}>DEVICE-991 [NEW]</span>)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#929292" }}>Known locations</span>
                    <span style={{ color: "#F5F4EF", fontWeight: 700 }}>2 (Delhi NCR, <span style={{ color: "#FFA31A" }}>Dubai [NOVEL]</span>)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#929292" }}>Known beneficiaries</span>
                    <span style={{ color: "#F5F4EF", fontWeight: 700 }}>8 (4 registered, <span style={{ color: "#FF4D4D" }}>BEN-918 flagged</span>)</span>
                  </div>
                </div>

                <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #282828", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>BEHAVIOR DEVIATION</span>
                  <span style={{ fontSize: "1.125rem", fontWeight: 800, fontFamily: "monospace", color: "#FF4D4D" }}>
                    94 / 100 [HIGH DEVIATION]
                  </span>
                </div>
              </div>

              {/* RISK CARD (PRD §11 & §49) */}
              <div style={{ background: "#101010", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.14em", color: "#929292", textTransform: "uppercase", fontFamily: "monospace" }}>
                    MULTI-MODEL RISK SIGNALS
                  </div>
                  <button
                    onClick={() => handleTabChange("risk")}
                    style={{ background: "none", border: "none", fontSize: "0.5625rem", color: "#39FF88", cursor: "pointer", fontWeight: 700, fontFamily: "monospace" }}
                  >
                    View 9D Vectors →
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  {[
                    { label: "Fraud", score: 28, baseline: 12, color: "#39FF88", status: "NORMAL" },
                    { label: "ATO", score: 12, baseline: 8, color: "#39FF88", status: "NORMAL (SPIKE 91 ON TX)" },
                    { label: "APP", score: 19, baseline: 5, color: "#39FF88", status: "NORMAL" },
                    { label: "Mule", score: 63, baseline: 10, color: "#FFA31A", status: "ELEVATED" },
                  ].map((r) => (
                    <div key={r.label} style={{ background: "#151515", border: "1px solid #282828", padding: "0.85rem", borderRadius: "2px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: "0.6875rem", color: "#929292", fontFamily: "monospace", fontWeight: 600 }}>{r.label}</span>
                        <span style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "monospace", color: r.color }}>{r.score}</span>
                      </div>
                      <div style={{ fontSize: "0.5rem", color: "#535353", fontFamily: "monospace", marginTop: "0.25rem" }}>
                        Baseline: {r.baseline} • {r.status}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                    <span style={{ color: "#929292" }}>Novelty Risk (Deviation):</span>
                    <span style={{ color: "#FF4D4D", fontWeight: 700 }}>92 / 100</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                    <span style={{ color: "#929292" }}>Campaign Exposure:</span>
                    <span style={{ color: "#FFA31A", fontWeight: 700 }}>42 / 100 (Linked to Syndicate #1842)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                    <span style={{ color: "#929292" }}>Chargeback Risk:</span>
                    <span style={{ color: "#39FF88", fontWeight: 700 }}>8 / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRD §49: RECENT ACTIVITY */}
            <div style={{ background: "#101010", border: "1px solid #282828" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid #282828" }}>
                <div>
                  <div style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.14em", color: "#929292", textTransform: "uppercase", fontFamily: "monospace" }}>
                    RECENT ACTIVITY (PRD §49)
                  </div>
                  <div style={{ fontSize: "0.5625rem", color: "#535353", fontFamily: "monospace", marginTop: "0.15rem" }}>
                    Account passbook timeline entries with real-time risk classification
                  </div>
                </div>
                <button
                  onClick={() => handleTabChange("passbook")}
                  style={{ background: "none", border: "none", fontSize: "0.5625rem", color: "#39FF88", cursor: "pointer", fontWeight: 700, fontFamily: "monospace" }}
                >
                  Open Full Passbook →
                </button>
              </div>

              {/* Activity rows */}
              {[
                {
                  id: "TX-92831",
                  amount: "-₹84,000",
                  category: "Instant Transfer",
                  detail: "FastPay / Beneficiary Ben-918",
                  time: "14:42 (05 Sep)",
                  isUnusual: true,
                  unusualTag: "⚠ Unusual",
                  statusColor: "#FF4D4D",
                  decision: "STEP-UP",
                  decisionColor: "#FFA31A",
                  reason: "Amount is 7.8× baseline · Beneficiary created 2m ago · New device",
                },
                {
                  id: "TX-92812",
                  amount: "-₹2,450",
                  category: "Grocery",
                  detail: "Nature's Basket Connaught Place",
                  time: "11:20 (05 Sep)",
                  isUnusual: false,
                  unusualTag: "Normal",
                  statusColor: "#39FF88",
                  decision: "APPROVE",
                  decisionColor: "#39FF88",
                  reason: "Consistent with 30d retail baseline",
                },
                {
                  id: "TX-92688",
                  amount: "-₹1,850",
                  category: "Fuel / Dining",
                  detail: "Blue Tokai Coffee Gurgaon",
                  time: "13:05 (02 Sep)",
                  isUnusual: false,
                  unusualTag: "Normal",
                  statusColor: "#39FF88",
                  decision: "APPROVE",
                  decisionColor: "#39FF88",
                  reason: "Regular merchant in resident geo",
                },
                {
                  id: "TX-92790",
                  amount: "+₹1,48,000",
                  category: "Salary Credit",
                  detail: "Apex Tech Corp Monthly Payroll",
                  time: "18:22 (04 Sep)",
                  isUnusual: false,
                  unusualTag: "Normal",
                  statusColor: "#39FF88",
                  decision: "APPROVE",
                  decisionColor: "#39FF88",
                  reason: "Verified corporate recurring credit",
                },
                {
                  id: "TX-92744",
                  amount: "-₹48,500",
                  category: "Transfers Out",
                  detail: "Pradeep Verma (P2P Wire)",
                  time: "20:15 (03 Sep)",
                  isUnusual: true,
                  unusualTag: "⚠ Unusual",
                  statusColor: "#FFA31A",
                  decision: "REVIEW",
                  decisionColor: "#FFA31A",
                  reason: "Rapid pass-through: 4 min dwell after ₹50k credit",
                },
              ].map((row) => (
                <div
                  key={row.id}
                  onClick={() => handleTabChange("passbook")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 180px 1fr 140px 110px",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "0.95rem 1.25rem",
                    borderBottom: "1px solid #1a1a1a",
                    cursor: "pointer",
                    transition: "background 120ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#151515")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 700, color: row.amount.startsWith("-") ? "#F5F4EF" : "#39FF88" }}>
                    {row.amount}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F5F4EF" }}>{row.category}</div>
                    <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>{row.time}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#F5F4EF" }}>{row.detail}</div>
                    <div style={{ fontSize: "0.5625rem", color: "#929292" }}>{row.reason}</div>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color: row.statusColor,
                        padding: "0.2rem 0.5rem",
                        background: row.isUnusual ? "rgba(255,77,77,0.08)" : "rgba(57,255,136,0.08)",
                        border: `1px solid ${row.isUnusual ? "rgba(255,77,77,0.25)" : "rgba(57,255,136,0.25)"}`,
                        borderRadius: "2px",
                      }}
                    >
                      {row.unusualTag}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        fontSize: "0.625rem",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: row.decisionColor,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {row.decision}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* PRD §11: OPEN CASES & LINKED ENTITIES */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* OPEN CASES */}
              <div style={{ background: "#101010", border: "1px solid #282828", padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.14em", color: "#929292", textTransform: "uppercase", fontFamily: "monospace" }}>
                    OPEN CASES (PRD §11)
                  </div>
                  <button
                    onClick={() => handleTabChange("cases")}
                    style={{ background: "none", border: "none", fontSize: "0.5625rem", color: "#39FF88", cursor: "pointer", fontWeight: 700, fontFamily: "monospace" }}
                  >
                    View Kanban →
                  </button>
                </div>
                <div
                  onClick={() => handleTabChange("cases")}
                  style={{
                    background: "#151515",
                    border: "1px solid rgba(255,77,77,0.3)",
                    padding: "1rem",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, fontFamily: "monospace", color: "#F5F4EF" }}>
                      Case #CS-4091
                    </span>
                    <span style={{ fontSize: "0.5rem", fontWeight: 800, padding: "0.15rem 0.4rem", background: "rgba(255,77,77,0.15)", border: "1px solid #FF4D4D", color: "#FF4D4D", borderRadius: "2px", fontFamily: "monospace" }}>
                      HIGH SEVERITY
                    </span>
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "#F5F4EF", marginBottom: "0.35rem" }}>
                    Account Takeover & Rapid Dissipation
                  </div>
                  <div style={{ fontSize: "0.5625rem", color: "#929292", lineHeight: 1.5 }}>
                    Unrecognized Windows workstation (DEVICE-991) in Dubai added BEN-918 followed by instant ₹84,000 transfer. Assigned: Investigator 018.
                  </div>
                </div>
              </div>

              {/* LINKED ENTITIES */}
              <div style={{ background: "#101010", border: "1px solid #282828", padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.14em", color: "#929292", textTransform: "uppercase", fontFamily: "monospace" }}>
                    LINKED ENTITIES (PRD §11)
                  </div>
                  <button
                    onClick={() => handleTabChange("network")}
                    style={{ background: "none", border: "none", fontSize: "0.5625rem", color: "#39FF88", cursor: "pointer", fontWeight: 700, fontFamily: "monospace" }}
                  >
                    Explore Graph →
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.4rem", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#929292" }}>Devices (3)</span>
                    <span style={{ color: "#F5F4EF" }}>iPhone 15 Pro, MacBook Pro, <strong style={{ color: "#FF4D4D" }}>DEVICE-991</strong></span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.4rem", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#929292" }}>Beneficiaries (4)</span>
                    <span style={{ color: "#F5F4EF" }}>DLF, Tata Power, Pradeep, <strong style={{ color: "#FF4D4D" }}>BEN-918 (flagged)</strong></span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.4rem", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#929292" }}>Payment Cards (2)</span>
                    <span style={{ color: "#F5F4EF" }}>••••4921 (Visa Debit), ••••8104 (RuPay Credit)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#929292" }}>Syndicate Cluster</span>
                    <span style={{ color: "#FFA31A", fontWeight: 700 }}>Linked to Campaign #1842 (17 accounts)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PASSBOOK */}
        {activeTab === "passbook" && (
          <AccountPassbook
            onSelectTxn={(id) => console.log("Selected txn:", id)}
            onSwitchTab={(t) => handleTabChange(t as any)}
          />
        )}

        {/* TAB 3: CASH FLOW */}
        {activeTab === "cashflow" && <CashFlowView />}

        {/* TAB 4: CARDS */}
        {activeTab === "cards" && <CardsView />}

        {/* TAB 5: BENEFICIARIES */}
        {activeTab === "beneficiaries" && <BeneficiaryIntelligence />}

        {/* TAB 6: DEVICES */}
        {activeTab === "devices" && <DeviceIntelligence />}

        {/* TAB 7: RISK */}
        {activeTab === "risk" && <CustomerRiskProfile />}

        {/* TAB 8: NETWORK */}
        {activeTab === "network" && <NetworkIntelligence />}

        {/* TAB 9: CASES */}
        {activeTab === "cases" && (
          <div style={{ background: "#101010", border: "1px solid #282828", borderRadius: "2px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #282828", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", letterSpacing: "0.12em" }}>TIED FRAUD & ATO CASES // ACCOUNT ••••4821</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F5F4EF", fontFamily: "monospace" }}>Case #CS-4091: Account Takeover & Rapid Dissipation</div>
              </div>
              <span style={{ fontSize: "0.5625rem", padding: "0.2rem 0.6rem", background: "rgba(255,77,77,0.15)", color: "#FF4D4D", border: "1px solid #FF4D4D", borderRadius: "2px", fontFamily: "monospace", fontWeight: 700 }}>
                SEVERITY: HIGH
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", fontSize: "0.75rem", fontFamily: "monospace", color: "#F5F4EF" }}>
              <div style={{ background: "#151515", border: "1px solid #282828", padding: "1rem", borderRadius: "2px" }}>
                <div style={{ color: "#39FF88", marginBottom: "0.5rem", fontWeight: 700 }}>CASE SUMMARY:</div>
                <p style={{ lineHeight: 1.6, color: "#929292", margin: 0 }}>
                  Unrecognized Windows workstation (DEVICE-991) in Dubai initiated beneficiary creation of BEN-918 followed by an instantaneous ₹84,000 transfer (TX-92831). Account behavioral baseline deviated to 94/100. Step-up authentication failed (ECI 07 bypass attempt).
                </p>
              </div>

              <div style={{ background: "#151515", border: "1px solid #282828", padding: "1rem", borderRadius: "2px" }}>
                <div style={{ color: "#39FF88", marginBottom: "0.5rem", fontWeight: 700 }}>EVIDENCE & ENTITIES:</div>
                <ul style={{ paddingLeft: "1rem", lineHeight: 1.7, color: "#929292", margin: 0 }}>
                  <li>Assigned Investigator: <strong style={{ color: "#F5F4EF" }}>Investigator 018 (Lead Forensics)</strong></li>
                  <li>Linked Campaign: <strong style={{ color: "#FFA31A" }}>Coordinated Syndicate Campaign #1842</strong></li>
                  <li>Action Taken: <strong style={{ color: "#FF4D4D" }}>Soft block enforced, session tokens revoked</strong></li>
                  <li>Status: <strong style={{ color: "#FFA31A" }}>UNDER INVESTIGATION (Triaged)</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: AUDIT */}
        {activeTab === "audit" && <ConsentProvenanceView />}

        {/* TAB 11: CONSENT */}
        {activeTab === "consent" && <ConsentProvenanceView />}

        {/* TAB 12: POLICY / REPLAY */}
        {activeTab === "replay" && <PolicySimulatorReplay />}
      </section>

    </div>
  );
}

export default function Account360Page() {
  return (
    <Suspense fallback={<div style={{ color: "#F4F4F0", padding: "5rem", fontFamily: "monospace" }}>Loading Account 360...</div>}>
      <Account360Content />
    </Suspense>
  );
}
