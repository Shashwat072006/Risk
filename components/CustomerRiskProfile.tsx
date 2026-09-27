"use client";
import React from "react";

export default function CustomerRiskProfile() {
  const dimensions = [
    { label: "Fraud Risk", score: 28, baseline: 12, desc: "Baseline payment & card abuse risk", color: "#39FF88" },
    { label: "ATO Risk", score: 12, baseline: 8, desc: "Account takeover & credential stuffing", color: "#39FF88" },
    { label: "APP Risk", score: 19, baseline: 5, desc: "Authorized Push Payment & scam indicators", color: "#39FF88" },
    { label: "Chargeback Risk", score: 19, baseline: 15, desc: "Friendly fraud & dispute probability", color: "#39FF88" },
    { label: "Mule / Pass-through", score: 63, baseline: 10, desc: "Rapid drainage & structuring flow", color: "#FFA31A" },
    { label: "Behavior Anomaly", score: 71, baseline: 14, desc: "Deviation from historical tenure profile", color: "#FF4D4D" },
    { label: "Campaign Exposure", score: 42, baseline: 0, desc: "Entity graph degree with active campaigns", color: "#FFA31A" },
    { label: "Device Risk", score: 35, baseline: 6, desc: "Hardware integrity & emulator probability", color: "#FFA31A" },
    { label: "Network Risk", score: 42, baseline: 4, desc: "IP reputation, proxy/VPN & ASN profile", color: "#FFA31A" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 9 Independent Dimensions (PRD §6) */}
      <div
        style={{
          background: "#101010",
          border: "1px solid #282828",
          borderRadius: "2px",
          padding: "1.25rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              CUSTOMER RISK PROFILE // PRD §25
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
              9-Dimension Risk Vectors (Decoupled Financial Crime Signals)
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.2rem" }}>
              Decoupled risk indicators evaluating fraud, ATO, APP, and mule signals.
            </div>
          </div>
          <span style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>
            EVALUATED: 05 SEP 2026 14:42 IST
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {dimensions.map((d) => (
            <div
              key={d.label}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "3px",
                padding: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F4F4F0", fontFamily: "monospace" }}>
                  {d.label}
                </span>
                <span
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 800,
                    fontFamily: "monospace",
                    color: d.score >= 70 ? "#FF4D4D" : d.score >= 40 ? "#FFA31A" : "#39FF88",
                  }}
                >
                  {d.score}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", margin: "0.6rem 0", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${d.score}%`,
                    background: d.score >= 70 ? "#FF4D4D" : d.score >= 40 ? "#FFA31A" : "#39FF88",
                    borderRadius: "2px",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5625rem", color: "rgba(244,244,240,0.35)", fontFamily: "monospace" }}>
                <span>Baseline: {d.baseline}</span>
                <span>Delta: +{d.score - d.baseline}</span>
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.5)", marginTop: "0.35rem" }}>
                {d.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behavioral Baseline vs Current Event (PRD §14) */}
      <div
        style={{
          background: "#101010",
          border: "1px solid #282828",
          borderRadius: "2px",
          padding: "1.25rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              BEHAVIORAL BASELINE COMPARATOR // PRD §14
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
              Learned Account Norms vs Live Transaction Event
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>BEHAVIOR DEVIATION</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FF4D4D", fontFamily: "monospace" }}>
              94 / 100 [HIGH]
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Normal Baseline */}
          <div style={{ background: "#151515", border: "1px solid rgba(57,255,136,0.25)", borderRadius: "2px", padding: "1rem" }}>
            <div style={{ fontSize: "0.625rem", fontWeight: 700, color: "#39FF88", fontFamily: "monospace", marginBottom: "0.75rem", letterSpacing: "0.08em" }}>
              NORMAL BEHAVIOR (6Y 4M TENURE)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.75rem", fontFamily: "monospace", color: "#F5F4EF" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Typical payment:</span>
                <span style={{ fontWeight: 600 }}>₹1,500 – ₹8,000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Typical transfer:</span>
                <span style={{ fontWeight: 600 }}>₹2,000 – ₹12,000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Typical hours:</span>
                <span style={{ fontWeight: 600 }}>09:00 – 22:30 IST</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Typical locations:</span>
                <span style={{ fontWeight: 600 }}>Delhi / Gurgaon, IN</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Known devices:</span>
                <span style={{ fontWeight: 600 }}>iPhone 15 Pro / MacBook Pro</span>
              </div>
            </div>
          </div>

          {/* Current Event */}
          <div style={{ background: "rgba(255,77,77,0.03)", border: "1px solid rgba(255,77,77,0.3)", borderRadius: "3px", padding: "1rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#FF4D4D", fontFamily: "monospace", marginBottom: "0.75rem" }}>
              // CURRENT EVENT UNDER EVALUATION (TX-92831)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(244,244,240,0.85)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Payment amount:</span>
                <span style={{ color: "#FF4D4D", fontWeight: 700 }}>₹84,000 (+950% spike)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Execution time:</span>
                <span style={{ color: "#FF4D4D", fontWeight: 700 }}>03:14 AM IST (Nocturnal)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Origin location:</span>
                <span style={{ color: "#FFA31A", fontWeight: 700 }}>Dubai, UAE (VPN exit)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Hardware client:</span>
                <span style={{ color: "#FF4D4D", fontWeight: 700 }}>New Windows Device (DEVICE-991)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(244,244,240,0.4)" }}>Recipient:</span>
                <span style={{ color: "#FF4D4D", fontWeight: 700 }}>New Beneficiary (Added 2m ago)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
