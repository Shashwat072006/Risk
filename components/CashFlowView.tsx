"use client";
import React, { useState } from "react";

export default function CashFlowView() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>("pass_through");

  const categories = [
    { name: "Salary", amount: 148000, type: "INCOME", pct: 100, color: "#39FF88" },
    { name: "Transfers In", amount: 42000, type: "INFLOW", pct: 28, color: "#F5F4EF" },
    { name: "Rent", amount: 35000, type: "EXPENSE", pct: 38, color: "#FFA31A" },
    { name: "Transfers Out", amount: 88000, type: "OUTFLOW", pct: 59, color: "#FF4D4D" },
    { name: "EMI / Loan", amount: 18500, type: "EXPENSE", pct: 20, color: "#FFA31A" },
    { name: "Utilities", amount: 6200, type: "EXPENSE", pct: 7, color: "#929292" },
    { name: "Food & Dining", amount: 14200, type: "EXPENSE", pct: 15, color: "#929292" },
    { name: "Shopping", amount: 9800, type: "EXPENSE", pct: 10, color: "#929292" },
    { name: "Travel", amount: 4500, type: "EXPENSE", pct: 5, color: "#929292" },
    { name: "Subscriptions", amount: 1800, type: "EXPENSE", pct: 2, color: "#929292" },
    { name: "Investments", amount: 12000, type: "ASSET", pct: 13, color: "#39FF88" },
    { name: "Cash / ATM", amount: 3000, type: "EXPENSE", pct: 3, color: "#929292" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI Cards Strip (PRD v4 §15) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        {[
          { label: "INCOME", val: "₹1,48,000", sub: "Monthly recurring", color: "#39FF88" },
          { label: "EXPENSES", val: "₹91,400", sub: "Normalized baseline", color: "#FFA31A" },
          { label: "TRANSFERS IN", val: "₹42,000", sub: "3 counterparty sources", color: "#F5F4EF" },
          { label: "TRANSFERS OUT", val: "₹88,000", sub: "Spike in last 48 hrs", color: "#FF4D4D" },
          { label: "NET CASH FLOW", val: "+₹10,600", sub: "Reserve balance maintained", color: "#39FF88" },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "#101010",
              border: "1px solid #282828",
              borderRadius: "4px",
              padding: "1rem 1.25rem",
            }}
          >
            <div style={{ fontSize: "0.5625rem", fontFamily: "monospace", letterSpacing: "0.1em", color: "#929292", textTransform: "uppercase" }}>
              {k.label}
            </div>
            <div style={{ fontSize: "1.375rem", fontWeight: 800, fontFamily: "monospace", color: k.color, marginTop: "0.25rem" }}>
              {k.val}
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.25rem", fontFamily: "monospace" }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Grid: Category Breakdown vs Money-Flow Anomaly Detection */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "1.5rem" }}>
        {/* Left: 11 Flow Categories (PRD v4 §15) */}
        <div
          style={{
            background: "#101010",
            border: "1px solid #282828",
            borderRadius: "4px",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.625rem", color: "#929292", fontFamily: "monospace", letterSpacing: "0.08em" }}>
                CASH-FLOW INTELLIGENCE · §15
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
                Categorized Financial Inflows & Outflows
              </div>
            </div>
            <span style={{ fontSize: "0.625rem", color: "#929292", fontFamily: "monospace", background: "#151515", border: "1px solid #282828", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
              THIS MONTH (30D)
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {categories.map((c) => (
              <div key={c.name} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "#F5F4EF", fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontSize: "0.5625rem", color: "#929292" }}>({c.type})</span>
                  </div>
                  <span style={{ color: c.color, fontWeight: 700 }}>
                    ₹{c.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                {/* Visual bar */}
                <div style={{ height: "4px", background: "#151515", borderRadius: "2px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${c.pct}%`,
                      background: c.color,
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Money-Flow Anomaly Detection (PRD v4 §16) */}
        <div
          style={{
            background: "#101010",
            border: "1px solid #282828",
            borderRadius: "4px",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.625rem", color: "#FF4D4D", fontFamily: "monospace", letterSpacing: "0.08em" }}>
              CASH-FLOW ANOMALIES · §16
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
              Money-Flow Pattern Classification
            </div>
            <div style={{ fontSize: "0.625rem", color: "#929292", marginTop: "0.2rem" }}>
              Flag patterns for investigation; does not automatically claim criminal conduct.
            </div>
          </div>

          {/* Anomaly 1: Rapid Pass-Through (§16) */}
          <div
            onClick={() => setSelectedAnomaly("pass_through")}
            style={{
              padding: "1rem",
              background: selectedAnomaly === "pass_through" ? "rgba(255,77,77,0.06)" : "#151515",
              border: `1px solid ${selectedAnomaly === "pass_through" ? "#FF4D4D" : "#282828"}`,
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF4D4D", fontFamily: "monospace" }}>
                1. RAPID PASS-THROUGH
              </span>
              <span style={{ fontSize: "0.5625rem", padding: "0.15rem 0.4rem", background: "rgba(255,77,77,0.15)", color: "#FF4D4D", borderRadius: "2px", fontFamily: "monospace" }}>
                CRITICAL (DWELL 4 MIN)
              </span>
            </div>
            <div
              style={{
                background: "#070707",
                border: "1px solid #282828",
                padding: "0.6rem 0.8rem",
                borderRadius: "3px",
                fontFamily: "monospace",
                fontSize: "0.6875rem",
                color: "#F5F4EF",
                lineHeight: 1.6,
              }}
            >
              <div>+ ₹50,000 received (Inbound Clearing)</div>
              <div style={{ color: "#FF4D4D", paddingLeft: "1.5rem" }}>↓ 4 min dwell time</div>
              <div>- ₹48,500 sent (P2P Transfer / Beneficiary X)</div>
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.5rem" }}>
              Short holding period with 97% liquidity drainage within minutes. Flagged for pass-through mule review.
            </div>
          </div>

          {/* Anomaly 2: Funnel Behavior (§16) */}
          <div
            onClick={() => setSelectedAnomaly("funnel")}
            style={{
              padding: "1rem",
              background: selectedAnomaly === "funnel" ? "rgba(255,163,26,0.06)" : "#151515",
              border: `1px solid ${selectedAnomaly === "funnel" ? "#FFA31A" : "#282828"}`,
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FFA31A", fontFamily: "monospace" }}>
                2. FUNNEL / AGGREGATION BEHAVIOR
              </span>
              <span style={{ fontSize: "0.5625rem", padding: "0.15rem 0.4rem", background: "rgba(255,163,26,0.15)", color: "#FFA31A", borderRadius: "2px", fontFamily: "monospace" }}>
                HIGH CONFIDENCE
              </span>
            </div>
            <div
              style={{
                background: "#070707",
                border: "1px solid #282828",
                padding: "0.6rem 0.8rem",
                borderRadius: "3px",
                fontFamily: "monospace",
                fontSize: "0.6875rem",
                color: "#F5F4EF",
                lineHeight: 1.5,
              }}
            >
              <div>Account A ─ ₹50,000 ─┐</div>
              <div>Account B ─ ₹70,000 ─┼→ ACCOUNT → ₹2,20,000 → BENEFICIARY X</div>
              <div>Account C ─ ₹1,00,000┘</div>
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.5rem" }}>
              Multiple independent sources converge into single customer account before large outward disbursement.
            </div>
          </div>

          {/* Anomaly 3: Sudden Baseline Change (§16) */}
          <div
            onClick={() => setSelectedAnomaly("sudden_change")}
            style={{
              padding: "1rem",
              background: selectedAnomaly === "sudden_change" ? "rgba(255,163,26,0.06)" : "#151515",
              border: `1px solid ${selectedAnomaly === "sudden_change" ? "#FFA31A" : "#282828"}`,
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FFA31A", fontFamily: "monospace" }}>
                3. SUDDEN BASELINE CHANGE
              </span>
              <span style={{ fontSize: "0.5625rem", padding: "0.15rem 0.4rem", background: "rgba(255,163,26,0.15)", color: "#FFA31A", borderRadius: "2px", fontFamily: "monospace" }}>
                DEVIATION: HIGH
              </span>
            </div>
            <div
              style={{
                background: "#070707",
                border: "1px solid #282828",
                padding: "0.6rem 0.8rem",
                borderRadius: "3px",
                fontFamily: "monospace",
                fontSize: "0.6875rem",
                color: "#F5F4EF",
                lineHeight: 1.6,
              }}
            >
              <div>Normal monthly transfers: <strong style={{ color: "#929292" }}>₹25,000</strong></div>
              <div>Current month transfers: <strong style={{ color: "#FF4D4D" }}>₹3,40,000</strong></div>
              <div style={{ color: "#FFA31A", marginTop: "0.25rem" }}>13.6× volume surge vs 90d customer mean</div>
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.5rem" }}>
              Elevated transfer velocity triggering automated anomaly review queue.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
