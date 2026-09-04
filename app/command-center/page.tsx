"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ── Mock data ────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Fraud Prevented",       value: "INR 4.8Cr",  color: "#39FF88",  sub: "This month" },
  { label: "Fraud Capture Rate",    value: "87.4%",       color: "#00F6FF",  sub: "vs 85% target" },
  { label: "False Positive Rate",   value: "2.1%",        color: "#FFA31A",  sub: "vs 10% target" },
  { label: "Transaction Success",   value: "96.8%",       color: "#F4F4F0",  sub: "Approval rate" },
  { label: "Median Decision",       value: "42ms",        color: "#E600FF",  sub: "p50 latency" },
  { label: "Active Campaigns",      value: "3",           color: "#FF4D4D",  sub: "Under investigation" },
];

const CAMPAIGNS = [
  { id: "#1842", type: "Account Takeover",    accounts: 17, devices: 6,  exposure: "INR 18.4L", confidence: 94, status: "ACTIVE ATTACK",  color: "#FF4D4D" },
  { id: "#1839", type: "Card Testing",        accounts: 31, devices: 12, exposure: "INR 2.1L",  confidence: 87, status: "MONITORING",      color: "#FFA31A" },
  { id: "#1830", type: "Mule Network",        accounts: 9,  devices: 4,  exposure: "INR 6.7L",  confidence: 72, status: "INVESTIGATING",   color: "#E600FF" },
];

const SYSTEM_HEALTH = [
  { label: "p50",         value: "38ms",   ok: true  },
  { label: "p95",         value: "87ms",   ok: true  },
  { label: "p99",         value: "174ms",  ok: true  },
  { label: "Availability",value: "99.97%", ok: true  },
  { label: "Error Rate",  value: "0.02%",  ok: true  },
  { label: "Model Status",value: "LIVE",   ok: true  },
];

function LiveTicker() {
  const TXNS = [
    { id: "TX-9281A", amount: "INR 84,000", merchant: "Electronics Store",   decision: "BLOCK",  score: 91, country: "IN" },
    { id: "TX-1039C", amount: "INR 299",    merchant: "Gaming Platform",      decision: "ALLOW",  score: 12, country: "US" },
    { id: "TX-7712F", amount: "INR 3,400",  merchant: "Travel Agency",        decision: "REVIEW", score: 54, country: "SG" },
    { id: "TX-4451B", amount: "INR 1,299",  merchant: "Streaming Service",    decision: "ALLOW",  score: 8,  country: "IN" },
    { id: "TX-3310D", amount: "INR 45,000", merchant: "Wire Transfer",        decision: "BLOCK",  score: 88, country: "NG" },
    { id: "TX-2298E", amount: "INR 599",    merchant: "Food Delivery",        decision: "ALLOW",  score: 5,  country: "IN" },
    { id: "TX-6613G", amount: "INR 12,500", merchant: "Forex Exchange",       decision: "REVIEW", score: 61, country: "AE" },
  ];

  const [items, setItems] = useState(TXNS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick((n) => n + 1);
      setItems((prev) => {
        const clone = [...prev];
        const moved = clone.shift()!;
        clone.push({ ...moved, id: "TX-" + Math.random().toString(36).slice(2, 7).toUpperCase() });
        return clone;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const DCOL: Record<string, string> = {
    ALLOW: "#39FF88", REVIEW: "#FFA31A", BLOCK: "#FF4D4D",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "0.5rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(244,244,240,0.4)",
          }}
        >
          Live Transactions
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#39FF88",
              animation: "pulse-dot 1.4s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: "0.5rem", color: "#39FF88", letterSpacing: "0.1em" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "110px 1fr 140px 70px 70px",
          gap: "0.5rem",
          padding: "0.375rem 0.75rem",
          fontSize: "0.45rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.25)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "0.375rem",
        }}
      >
        <span>TXN ID</span>
        <span>Merchant</span>
        <span>Amount</span>
        <span>Country</span>
        <span style={{ textAlign: "right" }}>Decision</span>
      </div>

      {items.map((txn, i) => (
        <Link
          key={txn.id}
          href={`/investigate?id=${txn.id}`}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "110px 1fr 140px 70px 70px",
              gap: "0.5rem",
              padding: "0.5rem 0.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              cursor: "pointer",
              opacity: 1 - i * 0.08,
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: "0.5625rem", fontFamily: "monospace", color: "#39FF88" }}>
              {txn.id}
            </span>
            <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {txn.merchant}
            </span>
            <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.5)", fontFamily: "monospace" }}>
              {txn.amount}
            </span>
            <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.35)", letterSpacing: "0.06em" }}>
              {txn.country}
            </span>
            <span
              style={{
                fontSize: "0.45rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: DCOL[txn.decision],
                textAlign: "right",
              }}
            >
              {txn.decision}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CommandCenterPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />

      {/* Hero */}
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
            <div
              style={{
                fontSize: "0.5rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#39FF88",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#39FF88", display: "inline-block" }} />
              Operations Live
            </div>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: "#F4F4F0",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Command
              <br />
              Center
            </h1>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            {[
              { label: "Risk Console",  href: "/risk-console" },
              { label: "Campaigns",     href: "/campaigns" },
              { label: "Cases",         href: "/cases" },
              { label: "Attack Lab",    href: "/attack-lab" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.5rem 1.25rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(244,244,240,0.6)",
                  fontSize: "0.5625rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "border-color 200ms ease, color 200ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#F4F4F0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(244,244,240,0.6)"; }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "3rem 2.5rem", maxWidth: 1400, margin: "0 auto" }}>

        {/* KPI banner */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "1px", marginBottom: "3rem", background: "rgba(255,255,255,0.06)" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "#050505", padding: "2rem 1.25rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color, opacity: 0.7 }} />
              <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginTop: "0.5rem" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.2)", marginTop: "0.25rem" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "1.5rem", alignItems: "start" }}>

          {/* Left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Live ticker */}
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
              <LiveTicker />
            </div>

            {/* Active campaigns */}
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)" }}>
                  Active Fraud Campaigns
                </div>
                <Link href="/campaigns" style={{ fontSize: "0.5rem", color: "#39FF88", textDecoration: "none", letterSpacing: "0.08em" }}>
                  View all
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {CAMPAIGNS.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr auto auto 100px",
                      gap: "1rem",
                      alignItems: "center",
                      padding: "0.875rem 1rem",
                      borderLeft: `3px solid ${c.color}`,
                      background: `${c.color}08`,
                    }}
                  >
                    <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: c.color, fontFamily: "monospace" }}>{c.id}</span>
                    <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.7)" }}>{c.type}</span>
                    <span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", whiteSpace: "nowrap" }}>
                      {c.accounts} accts / {c.devices} devs
                    </span>
                    <span style={{ fontSize: "0.5625rem", fontFamily: "monospace", color: "rgba(244,244,240,0.5)" }}>{c.exposure}</span>
                    <span
                      style={{
                        fontSize: "0.45rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: c.color,
                        padding: "0.2rem 0.5rem",
                        border: `1px solid ${c.color}44`,
                        textAlign: "center",
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* System health */}
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.75rem" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1.25rem" }}>
                System Health
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {SYSTEM_HEALTH.map((s) => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.5)", letterSpacing: "0.06em" }}>{s.label}</span>
                    <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: s.ok ? "#39FF88" : "#FF4D4D", fontFamily: "monospace" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "1.75rem" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1.25rem" }}>
                Quick Actions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  { label: "Score a Transaction", href: "/risk-console", color: "#39FF88" },
                  { label: "Investigate a Case",  href: "/investigate",  color: "#00F6FF" },
                  { label: "Run Attack Simulation",href: "/attack-lab",  color: "#E600FF" },
                  { label: "View Metrics",         href: "/metrics",     color: "#FFA31A" },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    style={{
                      display: "block",
                      padding: "0.75rem 1rem",
                      border: `1px solid ${action.color}22`,
                      color: action.color,
                      fontSize: "0.5625rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                      transition: "background 150ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = `${action.color}0D`)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </main>
  );
}
