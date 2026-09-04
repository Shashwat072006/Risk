"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CAMPAIGNS = [
  {
    id: "#1842",
    type: "Account Takeover",
    severity: "CRITICAL",
    accounts: 17,
    devices: 6,
    beneficiaries: 3,
    ips: 42,
    exposure: "INR 18.4L",
    confidence: 94,
    status: "ACTIVE ATTACK",
    color: "#FF4D4D",
    description:
      "Coordinated login from 6 devices across 17 accounts. Password changes followed by new beneficiary additions and large transfers. Linked through shared device fingerprint and IP cluster.",
    countries: ["IN", "NG", "RU"],
    signals: ["New device burst", "Velocity spike", "Geo mismatch", "Shared IP cluster"],
  },
  {
    id: "#1839",
    type: "Card Testing",
    severity: "HIGH",
    accounts: 31,
    devices: 12,
    beneficiaries: 0,
    ips: 18,
    exposure: "INR 2.1L",
    confidence: 87,
    status: "MONITORING",
    color: "#FFA31A",
    description:
      "Sequential small-value transactions (INR 0.50 – 9.99) across 31 cards from 12 devices. BIN enumeration pattern detected. High decline-then-success ratio.",
    countries: ["CN", "PK"],
    signals: ["Low amount burst", "BIN enumeration", "High declines", "VPN cluster"],
  },
  {
    id: "#1830",
    type: "Mule Network",
    severity: "HIGH",
    accounts: 9,
    devices: 4,
    beneficiaries: 7,
    ips: 11,
    exposure: "INR 6.7L",
    confidence: 72,
    status: "INVESTIGATING",
    color: "#E600FF",
    description:
      "9 accounts receiving funds and rapidly redistributing to 7 beneficiaries within minutes. Graph clustering revealed common fund-flow topology consistent with mule behavior.",
    countries: ["IN", "AE"],
    signals: ["Rapid redistribution", "New beneficiaries", "Graph clustering", "Unusual timing"],
  },
];

export default function CampaignsPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />

      <section
        style={{
          paddingTop: "8rem",
          paddingBottom: "4rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FF4D4D", marginBottom: "1rem" }}>
              Active Threat Intelligence
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F4F4F0", textTransform: "uppercase", margin: 0 }}>
              Fraud
              <br />
              Campaigns
            </h1>
            <p style={{ maxWidth: 480, fontSize: "0.8125rem", color: "rgba(244,244,240,0.45)", lineHeight: 1.65, marginTop: "1.25rem" }}>
              Coordinated attacks grouped by shared device, IP, beneficiary, and behavioral patterns.
              Each campaign is detected via graph clustering and temporal correlation.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Active Campaigns", value: "3",     color: "#FF4D4D" },
              { label: "Total Exposure",   value: "INR 27.2L", color: "#FFA31A" },
              { label: "Avg Confidence",   value: "84%",   color: "#39FF88" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color, letterSpacing: "-0.04em" }}>{s.value}</div>
                <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginTop: "0.25rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "4rem 2.5rem", maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {CAMPAIGNS.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#0A0A0A",
              border: `1px solid ${c.color}22`,
              borderLeft: `3px solid ${c.color}`,
              overflow: "hidden",
            }}
          >
            {/* Campaign header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr auto auto auto auto 120px",
                gap: "1.5rem",
                alignItems: "center",
                padding: "1.5rem 2rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: 800, color: c.color, fontFamily: "monospace" }}>{c.id}</span>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F4F4F0" }}>{c.type}</div>
                <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>{c.severity}</div>
              </div>
              <StatPill label="Accounts"     value={c.accounts.toString()} color={c.color} />
              <StatPill label="Devices"      value={c.devices.toString()} color={c.color} />
              <StatPill label="Exposure"     value={c.exposure}            color={c.color} />
              <ConfidencePill value={c.confidence} color={c.color} />
              <div
                style={{
                  padding: "0.4rem 0.75rem",
                  border: `1px solid ${c.color}44`,
                  color: c.color,
                  fontSize: "0.45rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  background: `${c.color}0D`,
                }}
              >
                {c.status}
              </div>
            </div>

            {/* Campaign body */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0", padding: "0" }}>
              <div style={{ padding: "1.5rem 2rem", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginBottom: "0.75rem" }}>
                  Description
                </div>
                <p style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.6)", lineHeight: 1.65, margin: 0 }}>
                  {c.description}
                </p>
              </div>
              <div style={{ padding: "1.5rem 2rem", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginBottom: "0.75rem" }}>
                  Risk Signals
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {c.signals.map((s) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.65)" }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginBottom: "0.5rem" }}>
                    Origin Countries
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {c.countries.map((cc) => (
                      <span key={cc} style={{ padding: "0.15rem 0.5rem", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", fontSize: "0.5rem", letterSpacing: "0.08em", fontFamily: "monospace" }}>
                        {cc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: "1.5rem 2rem" }}>
                <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginBottom: "0.75rem" }}>
                  Actions
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { label: "Investigate Case",      action: () => {} },
                    { label: "Increase friction — all linked entities", action: () => {} },
                    { label: "Create Investigation Case", action: () => {} },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      style={{
                        padding: "0.625rem 1rem",
                        background: "transparent",
                        border: `1px solid ${c.color}33`,
                        color: "rgba(244,244,240,0.6)",
                        fontSize: "0.5625rem",
                        letterSpacing: "0.06em",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color 150ms ease, color 150ms ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.color = "#F4F4F0"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${c.color}33`; e.currentTarget.style.color = "rgba(244,244,240,0.6)"; }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "1.125rem", fontWeight: 700, color, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: "0.45rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>{label}</div>
    </div>
  );
}

function ConfidencePill({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "1.125rem", fontWeight: 700, color, letterSpacing: "-0.02em" }}>{value}%</div>
      <div style={{ fontSize: "0.45rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>Confidence</div>
    </div>
  );
}
