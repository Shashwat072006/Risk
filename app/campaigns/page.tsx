"use client";
import React from "react";
import Link from "next/link";

const CAMPAIGNS = [
  {
    id: "CAMPAIGN #1842",
    type: "Account Takeover",
    severity: "CRITICAL",
    accounts: 17,
    devices: 6,
    networkClusters: 3,
    cards: 31,
    beneficiaries: 3,
    exposure: "₹18.4L",
    confidence: 94,
    status: "ACTIVE",
    color: "#FF4D4D",
    description:
      "Coordinated login from 6 devices across 17 accounts. Password changes followed by new beneficiary additions and large transfers. Linked through shared device fingerprint and IP cluster.",
    timeline: [
      { time: "09:31", event: "First suspicious account" },
      { time: "09:48", event: "Shared device detected" },
      { time: "10:02", event: "Beneficiary overlap" },
      { time: "10:17", event: "Velocity spike" },
      { time: "10:19", event: "Campaign generated" },
    ],
    signals: ["New device burst", "Velocity spike", "Geo mismatch", "Shared IP cluster"],
  },
  {
    id: "CAMPAIGN #1839",
    type: "Card Testing",
    severity: "HIGH",
    accounts: 31,
    devices: 12,
    networkClusters: 2,
    cards: 48,
    beneficiaries: 0,
    exposure: "₹2.1L",
    confidence: 87,
    status: "REVIEW",
    color: "#FFA31A",
    description:
      "Sequential small-value transactions (₹50 – ₹199) across 31 cards from 12 devices. BIN enumeration pattern detected. High decline-then-success ratio.",
    timeline: [
      { time: "08:14", event: "Rapid micropayment cluster detected" },
      { time: "08:22", event: "BIN velocity limit triggered" },
      { time: "08:35", event: "12 coordinated browser fingerprints mapped" },
      { time: "08:41", event: "Campaign generated" },
    ],
    signals: ["Low amount burst", "BIN enumeration", "High declines", "VPN cluster"],
  },
  {
    id: "CAMPAIGN #1830",
    type: "Mule Network",
    severity: "HIGH",
    accounts: 9,
    devices: 4,
    networkClusters: 2,
    cards: 14,
    beneficiaries: 7,
    exposure: "₹6.7L",
    confidence: 72,
    status: "REVIEW",
    color: "#FFA31A",
    description:
      "9 accounts receiving inbound funds and rapidly redistributing to 7 common beneficiaries within minutes. Graph clustering revealed common fund-flow topology consistent with mule pass-through behavior.",
    timeline: [
      { time: "06:10", event: "Multiple peer inbound settlements" },
      { time: "06:14", event: "Immediate rapid outward dissipation (dwell 4m)" },
      { time: "06:28", event: "Beneficiary convergence across 9 nodes" },
      { time: "06:33", event: "Campaign generated" },
    ],
    signals: ["Rapid redistribution", "New beneficiaries", "Graph clustering", "Unusual timing"],
  },
];

export default function CampaignsPage() {
  return (
    <main style={{ background: "#070707", minHeight: "100vh", color: "#F5F4EF" }}>
      <div className="grain-overlay" aria-hidden="true" />
      

      <section
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "3rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid #282828",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#FF4D4D", marginBottom: "0.75rem", fontFamily: "monospace" }}>
              FRAUD CAMPAIGNS · §21 & §22
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#F5F4EF", textTransform: "uppercase", margin: 0, fontFamily: "monospace" }}>
              Coordinated Threat Campaigns
            </h1>
            <p style={{ maxWidth: 540, fontSize: "0.8125rem", color: "#929292", lineHeight: 1.6, marginTop: "0.75rem" }}>
              A campaign is generated when multiple events share meaningful entity relationships or temporal and behavioral patterns. Used as a deep investigation area.
            </p>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              { label: "Active Campaigns", value: "3", color: "#FF4D4D" },
              { label: "Total Exposure", value: "₹27.2L", color: "#FFA31A" },
              { label: "Avg Confidence", value: "84%", color: "#39FF88" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color, letterSpacing: "-0.03em", fontFamily: "monospace" }}>{s.value}</div>
                <div style={{ fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginTop: "0.2rem", fontFamily: "monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "3rem 2.5rem", maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {CAMPAIGNS.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#101010",
              border: "1px solid #282828",
              borderLeft: `4px solid ${c.color}`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Campaign header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr auto auto auto auto 120px",
                gap: "1.5rem",
                alignItems: "center",
                padding: "1.25rem 1.75rem",
                borderBottom: "1px solid #282828",
              }}
            >
              <span style={{ fontSize: "0.9375rem", fontWeight: 800, color: c.color, fontFamily: "monospace" }}>{c.id}</span>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F4EF" }}>{c.type}</div>
                <div style={{ fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginTop: "0.2rem", fontFamily: "monospace" }}>{c.severity} SEVERITY</div>
              </div>
              <StatPill label="Accounts" value={c.accounts.toString()} color="#F5F4EF" />
              <StatPill label="Devices" value={c.devices.toString()} color="#F5F4EF" />
              <StatPill label="Exposure" value={c.exposure} color={c.color} />
              <ConfidencePill value={c.confidence} color={c.color} />
              <div
                style={{
                  padding: "0.35rem 0.6rem",
                  border: `1px solid ${c.color}`,
                  color: c.color,
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  background: `${c.color}15`,
                  borderRadius: "2px",
                  fontFamily: "monospace",
                }}
              >
                ● {c.status}
              </div>
            </div>

            {/* Campaign body: Split into 3 columns (Description & Entity Breakdown | Campaign Timeline §22 | Actions) */}
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 260px", gap: "0", padding: "0" }}>
              {/* Col 1: Description & Entities */}
              <div style={{ padding: "1.5rem 1.75rem", borderRight: "1px solid #282828" }}>
                <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginBottom: "0.5rem", fontFamily: "monospace" }}>
                  Pattern Analysis
                </div>
                <p style={{ fontSize: "0.75rem", color: "#F5F4EF", lineHeight: 1.6, margin: "0 0 1rem" }}>
                  {c.description}
                </p>

                <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginBottom: "0.5rem", fontFamily: "monospace" }}>
                  Entity Scope (§21)
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                  <span style={{ background: "#151515", border: "1px solid #282828", padding: "0.2rem 0.5rem", borderRadius: "2px", color: "#F5F4EF" }}>
                    {c.accounts} accounts
                  </span>
                  <span style={{ background: "#151515", border: "1px solid #282828", padding: "0.2rem 0.5rem", borderRadius: "2px", color: "#F5F4EF" }}>
                    {c.devices} devices
                  </span>
                  <span style={{ background: "#151515", border: "1px solid #282828", padding: "0.2rem 0.5rem", borderRadius: "2px", color: "#F5F4EF" }}>
                    {c.networkClusters} network clusters
                  </span>
                  <span style={{ background: "#151515", border: "1px solid #282828", padding: "0.2rem 0.5rem", borderRadius: "2px", color: "#F5F4EF" }}>
                    {c.cards} cards
                  </span>
                  <span style={{ background: "#151515", border: "1px solid #282828", padding: "0.2rem 0.5rem", borderRadius: "2px", color: "#F5F4EF" }}>
                    {c.beneficiaries} beneficiaries
                  </span>
                </div>
              </div>

              {/* Col 2: Campaign Timeline (§22) */}
              <div style={{ padding: "1.5rem 1.75rem", borderRight: "1px solid #282828" }}>
                <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginBottom: "0.75rem", fontFamily: "monospace" }}>
                  Campaign Timeline (§22)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {c.timeline.map((t, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                      <span style={{ color: "#929292", minWidth: "40px" }}>{t.time}</span>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: idx === c.timeline.length - 1 ? c.color : "#929292" }} />
                      <span style={{ color: idx === c.timeline.length - 1 ? c.color : "#F5F4EF", fontWeight: idx === c.timeline.length - 1 ? 700 : 400 }}>
                        {t.event}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 3: Actions */}
              <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginBottom: "0.75rem", fontFamily: "monospace" }}>
                    Investigation Actions
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <Link
                      href={`/command-center?tab=investigate&campaign=${encodeURIComponent(c.id)}`}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "#151515",
                        border: "1px solid #282828",
                        color: "#F5F4EF",
                        fontSize: "0.6875rem",
                        fontFamily: "monospace",
                        textAlign: "center",
                        borderRadius: "3px",
                        textDecoration: "none",
                      }}
                    >
                      Investigate Case
                    </Link>
                    <Link
                      href={`/account-360?tab=network`}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "#151515",
                        border: "1px solid #282828",
                        color: "#F5F4EF",
                        fontSize: "0.6875rem",
                        fontFamily: "monospace",
                        textAlign: "center",
                        borderRadius: "3px",
                        textDecoration: "none",
                      }}
                    >
                      View Entity Graph
                    </Link>
                    <Link
                      href={`/cases`}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "rgba(255,77,77,0.08)",
                        border: "1px solid rgba(255,77,77,0.3)",
                        color: "#FF4D4D",
                        fontSize: "0.6875rem",
                        fontFamily: "monospace",
                        textAlign: "center",
                        borderRadius: "3px",
                        textDecoration: "none",
                      }}
                    >
                      Create Investigation Case
                    </Link>
                  </div>
                </div>

                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", marginTop: "1rem" }}>
                  Confidence: <strong style={{ color: c.color }}>{c.confidence}%</strong> · Status: {c.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      
    </main>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "1.125rem", fontWeight: 700, color, letterSpacing: "-0.02em", fontFamily: "monospace" }}>{value}</div>
      <div style={{ fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginTop: "0.2rem", fontFamily: "monospace" }}>{label}</div>
    </div>
  );
}

function ConfidencePill({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "1.125rem", fontWeight: 700, color, letterSpacing: "-0.02em", fontFamily: "monospace" }}>{value}%</div>
      <div style={{ fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginTop: "0.2rem", fontFamily: "monospace" }}>Confidence</div>
    </div>
  );
}
