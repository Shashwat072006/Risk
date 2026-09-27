"use client";
import React, { useState } from "react";

export default function PolicySimulatorReplay() {
  const [activeSubTab, setActiveSubTab] = useState<"simulator" | "replay">("simulator");

  // Policy Simulator interactive parameters (PRD v4 §39)
  const [fraudThreshold, setFraudThreshold] = useState<number>(75);
  const [newDeviceWeight, setNewDeviceWeight] = useState<number>(20);
  const [forceStepUpHighRiskBen, setForceStepUpHighRiskBen] = useState<boolean>(true);
  const [velocityWeight, setVelocityWeight] = useState<number>(18);

  // Dynamic calculations for simulator
  const totalTxns = 100000;
  const baseFPR = Math.max(1.2, 4.3 - (fraudThreshold - 70) * 0.15);
  const fraudCapture = Math.min(96.0, Math.max(75.0, 84.0 + (newDeviceWeight - 15) * 0.4 + (velocityWeight - 15) * 0.3 - (fraudThreshold - 70) * 0.2));
  const stepUpRate = forceStepUpHighRiskBen ? 2.4 + (fraudThreshold < 75 ? 0.8 : 0.2) : 1.2;
  const blockRate = Math.max(0.4, (100 - fraudThreshold) * 0.04);
  const approveRate = 100 - stepUpRate - blockRate - (baseFPR * 0.3);

  // Expected Loss (PRD v4 §23: Fraud Loss + Chargeback Loss + Customer Friction + Operational Review)
  const fraudLoss = Math.round((1 - fraudCapture / 100) * 8500000);
  const chargebackLoss = 420000;
  const frictionCost = Math.round((stepUpRate / 100) * totalTxns * 12);
  const operationalCost = Math.round((baseFPR / 100) * totalTxns * 45);
  const totalExpectedLoss = fraudLoss + chargebackLoss + frictionCost + operationalCost;
  const baselineLoss = 4820000;
  const netSavings = baselineLoss - totalExpectedLoss;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
        <button
          onClick={() => setActiveSubTab("simulator")}
          style={{
            background: activeSubTab === "simulator" ? "#151515" : "transparent",
            border: `1px solid ${activeSubTab === "simulator" ? "#39FF88" : "#282828"}`,
            color: activeSubTab === "simulator" ? "#39FF88" : "#929292",
            padding: "0.45rem 1rem",
            borderRadius: "3px",
            fontSize: "0.75rem",
            fontWeight: 700,
            fontFamily: "monospace",
            cursor: "pointer",
          }}
        >
          POLICY SIMULATOR · §39
        </button>
        <button
          onClick={() => setActiveSubTab("replay")}
          style={{
            background: activeSubTab === "replay" ? "#151515" : "transparent",
            border: `1px solid ${activeSubTab === "replay" ? "#39FF88" : "#282828"}`,
            color: activeSubTab === "replay" ? "#39FF88" : "#929292",
            padding: "0.45rem 1rem",
            borderRadius: "3px",
            fontSize: "0.75rem",
            fontWeight: 700,
            fontFamily: "monospace",
            cursor: "pointer",
          }}
        >
          HISTORICAL REPLAY · §38
        </button>
      </div>

      {activeSubTab === "simulator" ? (
        /* ── POLICY SIMULATOR VIEW (PRD v4 §39) ────────────────────────── */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1.5rem" }}>
          {/* Controls Panel */}
          <div
            style={{
              background: "#101010",
              border: "1px solid #282828",
              borderRadius: "4px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div style={{ borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
              <div style={{ fontSize: "0.625rem", color: "#39FF88", fontFamily: "monospace", letterSpacing: "0.08em" }}>
                INTERACTIVE POLICY CONTROLS · §39
              </div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
                Pre-Deployment Policy Tuning
              </div>
              <div style={{ fontSize: "0.625rem", color: "#929292", marginTop: "0.2rem" }}>
                Simulate expected business consequences across 100,000 transactions before deployment.
              </div>
            </div>

            {/* Slider 1: Fraud Threshold */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontFamily: "monospace" }}>
                <span style={{ color: "#F5F4EF" }}>Decision Step-Up Threshold:</span>
                <span style={{ color: "#39FF88", fontWeight: 700 }}>{fraudThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={fraudThreshold}
                onChange={(e) => setFraudThreshold(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#39FF88", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>
                <span>50 (High Friction)</span>
                <span>Baseline: 70</span>
                <span>90 (Low Friction)</span>
              </div>
            </div>

            {/* Slider 2: New Device Score Weight */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontFamily: "monospace" }}>
                <span style={{ color: "#F5F4EF" }}>New Device Penalty Weight:</span>
                <span style={{ color: "#FFA31A", fontWeight: 700 }}>+{newDeviceWeight}</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                value={newDeviceWeight}
                onChange={(e) => setNewDeviceWeight(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#FFA31A", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>
                <span>+10 (Forgiving)</span>
                <span>Baseline: +15</span>
                <span>+35 (Aggressive)</span>
              </div>
            </div>

            {/* Slider 3: Velocity Weight */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontFamily: "monospace" }}>
                <span style={{ color: "#F5F4EF" }}>Velocity Multiplier:</span>
                <span style={{ color: "#FFA31A", fontWeight: 700 }}>+{velocityWeight}</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={velocityWeight}
                onChange={(e) => setVelocityWeight(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#FFA31A", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>
                <span>+10</span>
                <span>Baseline: +15</span>
                <span>+30</span>
              </div>
            </div>

            {/* Toggle: Force Step-up on High-Risk Beneficiaries */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem",
                background: "#151515",
                border: "1px solid #282828",
                borderRadius: "3px",
              }}
            >
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
                  Force Step-Up on High-Risk Beneficiary
                </div>
                <div style={{ fontSize: "0.5625rem", color: "#929292" }}>
                  Requires biometric / OTP on unvetted counterparties
                </div>
              </div>
              <input
                type="checkbox"
                checked={forceStepUpHighRiskBen}
                onChange={(e) => setForceStepUpHighRiskBen(e.target.checked)}
                style={{ accentColor: "#39FF88", width: 18, height: 18, cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Outcome & Loss Impact Panel */}
          <div
            style={{
              background: "#101010",
              border: "1px solid #282828",
              borderRadius: "4px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Header / Net Loss Reduction */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.625rem", color: "#929292", fontFamily: "monospace" }}>PROJECTED OUTCOME</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
                  Expected Loss & Operational Optimization
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>ESTIMATED LOSS REDUCTION</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: netSavings >= 0 ? "#39FF88" : "#FF4D4D", fontFamily: "monospace" }}>
                  {netSavings >= 0 ? "+" : ""}₹{netSavings.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.75rem", borderRadius: "3px" }}>
                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>FRAUD CAPTURE RATE</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#39FF88", fontFamily: "monospace", marginTop: "0.2rem" }}>
                  {fraudCapture.toFixed(1)}%
                </div>
                <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.15rem", fontFamily: "monospace" }}>Baseline: 81.0%</div>
              </div>

              <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.75rem", borderRadius: "3px" }}>
                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>FALSE POSITIVE RATE</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F5F4EF", fontFamily: "monospace", marginTop: "0.2rem" }}>
                  {baseFPR.toFixed(1)}%
                </div>
                <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.15rem", fontFamily: "monospace" }}>Baseline: 4.3%</div>
              </div>

              <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.75rem", borderRadius: "3px" }}>
                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>TOTAL EXPECTED LOSS</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F5F4EF", fontFamily: "monospace", marginTop: "0.2rem" }}>
                  ₹{(totalExpectedLoss / 100000).toFixed(1)}L
                </div>
                <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.15rem", fontFamily: "monospace" }}>Baseline: ₹48.2L</div>
              </div>
            </div>

            {/* Expected Loss Component Stack */}
            <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.6875rem", color: "#929292", fontFamily: "monospace", marginBottom: "0.5rem" }}>
                EXPECTED LOSS COMPOSITION (§23)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#929292" }}>Direct Fraud Loss:</span>
                  <span style={{ color: "#FF4D4D" }}>₹{fraudLoss.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#929292" }}>Chargeback Loss:</span>
                  <span style={{ color: "#FFA31A" }}>₹{chargebackLoss.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#929292" }}>Customer Friction Cost:</span>
                  <span style={{ color: "#F5F4EF" }}>₹{frictionCost.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#929292" }}>Operational Review Cost:</span>
                  <span style={{ color: "#F5F4EF" }}>₹{operationalCost.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Action Distribution Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.625rem", fontFamily: "monospace", marginBottom: "0.35rem" }}>
                <span style={{ color: "#39FF88" }}>APPROVE: {approveRate.toFixed(1)}%</span>
                <span style={{ color: "#FFA31A" }}>STEP-UP: {stepUpRate.toFixed(1)}%</span>
                <span style={{ color: "#FFA31A" }}>REVIEW: {(baseFPR * 0.3).toFixed(1)}%</span>
                <span style={{ color: "#FF4D4D" }}>BLOCK: {blockRate.toFixed(1)}%</span>
              </div>
              <div style={{ height: "6px", display: "flex", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${approveRate}%`, background: "#39FF88" }} />
                <div style={{ width: `${stepUpRate}%`, background: "#FFA31A" }} />
                <div style={{ width: `${baseFPR * 0.3}%`, background: "#FFA31A", opacity: 0.6 }} />
                <div style={{ width: `${blockRate}%`, background: "#FF4D4D" }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── REPLAY ENGINE VIEW (PRD v4 §38) ────────────────────────────── */
        <div
          style={{
            background: "#101010",
            border: "1px solid #282828",
            borderRadius: "4px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div style={{ borderBottom: "1px solid #282828", paddingBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.625rem", color: "#39FF88", fontFamily: "monospace", letterSpacing: "0.08em" }}>
                HISTORICAL REPLAY · §38
              </div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F5F4EF", fontFamily: "monospace" }}>
                Current Policy vs Proposed Policy
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#929292", marginTop: "0.2rem" }}>
                Replay 80,000 historical transactions against proposed challenger policy.
              </div>
            </div>

            <button
              onClick={() => alert("Replay simulation completed across 80,000 transactions in 1.4s")}
              style={{
                background: "#151515",
                border: "1px solid #39FF88",
                color: "#39FF88",
                padding: "0.5rem 1rem",
                borderRadius: "3px",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              [Run 80k Replay]
            </button>
          </div>

          {/* Side-by-Side Comparison Table (PRD v4 §38) */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: "0.75rem" }}>
              <thead>
                <tr style={{ background: "#151515", borderBottom: "1px solid #282828" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#929292" }}>METRIC</th>
                  <th style={{ textAlign: "center", padding: "0.75rem 1rem", color: "#FFA31A" }}>CURRENT POLICY</th>
                  <th style={{ textAlign: "center", padding: "0.75rem 1rem", color: "#F5F4EF" }}>PROPOSED POLICY</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#39FF88" }}>NET DELTA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Fraud Capture Rate", curr: "81.0%", prop: "88.4%", delta: "+7.4%", positive: true },
                  { name: "False Positive Rate", curr: "4.3%", prop: "3.1%", delta: "-1.2%", positive: true },
                  { name: "Approval Rate", curr: "96.8%", prop: "97.4%", delta: "+0.6%", positive: true },
                  { name: "Step-Up Challenge Rate", curr: "2.4%", prop: "1.9%", delta: "-0.5%", positive: true },
                  { name: "Median Decision Latency", curr: "38.4ms", prop: "31.2ms", delta: "-7.2ms", positive: true },
                  { name: "Total Monthly Expected Loss", curr: "₹48,20,000", prop: "₹29,80,000", delta: "-₹18,40,000", positive: true },
                ].map((row, idx) => (
                  <tr key={row.name} style={{ borderBottom: "1px solid #1f1f1f", background: idx % 2 === 0 ? "transparent" : "#121212" }}>
                    <td style={{ padding: "0.75rem 1rem", color: "#F5F4EF", fontWeight: 600 }}>{row.name}</td>
                    <td style={{ textAlign: "center", padding: "0.75rem 1rem", color: "#929292" }}>{row.curr}</td>
                    <td style={{ textAlign: "center", padding: "0.75rem 1rem", color: "#F5F4EF", fontWeight: 700 }}>{row.prop}</td>
                    <td style={{ textAlign: "right", padding: "0.75rem 1rem", color: row.positive ? "#39FF88" : "#FF4D4D", fontWeight: 800 }}>{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: "1rem", background: "rgba(57,255,136,0.05)", border: "1px solid rgba(57,255,136,0.2)", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#39FF88", fontFamily: "monospace" }}>
                ESTIMATED LOSS REDUCTION: ₹18,40,000 / MONTH
              </div>
              <div style={{ fontSize: "0.625rem", color: "#929292", marginTop: "0.2rem" }}>
                Challenger policy meets all safety requirements: FPR &lt; 3.5%, Latency &lt; 35ms, and positive conversion preservation.
              </div>
            </div>
            <button
              onClick={() => alert("Initiated Canary promotion workflow under Maker-Checker governance.")}
              style={{
                background: "#39FF88",
                border: "none",
                color: "#070707",
                padding: "0.45rem 0.9rem",
                borderRadius: "3px",
                fontSize: "0.6875rem",
                fontWeight: 800,
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              Promote to Canary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
