"use client";
import React, { useState } from "react";

export interface Beneficiary {
  id: string;
  name: string;
  accountMasked: string;
  bankName: string;
  createdAgo: string;
  priorInteractions: number;
  connectedCustomers: number;
  sharedDevices: number;
  sharedIps: number;
  riskScore: number;
  status: "CRITICAL" | "ELEVATED" | "VERIFIED";
  isFlaggedMule?: boolean;
}

const BENEFICIARIES_DATA: Beneficiary[] = [
  {
    id: "BEN-918",
    name: "FastPay International / Recipient X",
    accountMasked: "••••8819",
    bankName: "First Global Digital Bank",
    createdAgo: "2 minutes ago",
    priorInteractions: 0,
    connectedCustomers: 7,
    sharedDevices: 3,
    sharedIps: 2,
    riskScore: 91,
    status: "CRITICAL",
    isFlaggedMule: true,
  },
  {
    id: "BEN-442",
    name: "Pradeep Verma",
    accountMasked: "••••3190",
    bankName: "HDFC Bank Ltd",
    createdAgo: "3 days ago",
    priorInteractions: 1,
    connectedCustomers: 3,
    sharedDevices: 1,
    sharedIps: 1,
    riskScore: 68,
    status: "ELEVATED",
  },
  {
    id: "BEN-104",
    name: "DLF CyberCity Leasing Ltd",
    accountMasked: "••••9912",
    bankName: "State Bank of India",
    createdAgo: "4 years ago",
    priorInteractions: 48,
    connectedCustomers: 1200,
    sharedDevices: 0,
    sharedIps: 0,
    riskScore: 4,
    status: "VERIFIED",
  },
  {
    id: "BEN-021",
    name: "Tata Power Delhi Distribution",
    accountMasked: "••••1184",
    bankName: "ICICI Bank Ltd",
    createdAgo: "5 years ago",
    priorInteractions: 60,
    connectedCustomers: 45000,
    sharedDevices: 0,
    sharedIps: 0,
    riskScore: 2,
    status: "VERIFIED",
  },
];

export default function BeneficiaryIntelligence() {
  const [selectedBen, setSelectedBen] = useState<Beneficiary>(BENEFICIARIES_DATA[0]);
  const [stepUpEnforced, setStepUpEnforced] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Banner Alert if high risk */}
      <div
        style={{
          background: "rgba(255,77,77,0.08)",
          border: "1px solid rgba(255,77,77,0.3)",
          borderRadius: "4px",
          padding: "1rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.875rem", color: "#FF4D4D", fontWeight: 800, fontFamily: "monospace" }}>
            [ALERT] CRITICAL BENEFICIARY RISK DETECTED
          </span>
          <span style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.8)" }}>
            Beneficiary {BENEFICIARIES_DATA[0].name} ({BENEFICIARIES_DATA[0].id}) created 2 mins ago with 0 prior transactions, linked to 7 other customer accounts.
          </span>
        </div>
        <button
          onClick={() => setStepUpEnforced(!stepUpEnforced)}
          style={{
            background: stepUpEnforced ? "rgba(57,255,136,0.2)" : "rgba(255,77,77,0.2)",
            border: `1px solid ${stepUpEnforced ? "#39FF88" : "#FF4D4D"}`,
            color: stepUpEnforced ? "#39FF88" : "#FF4D4D",
            padding: "0.4rem 0.8rem",
            borderRadius: "3px",
            fontSize: "0.6875rem",
            fontWeight: 700,
            fontFamily: "monospace",
            cursor: "pointer",
          }}
        >
          {stepUpEnforced ? "[STEP-UP ENFORCED ACTIVE]" : "FORCE STEP-UP"}
        </button>
      </div>

      {/* Main Grid: List vs Detailed Forensic Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "1.5rem" }}>
        {/* Beneficiaries List */}
        <div
          style={{
            background: "rgba(10,10,12,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1.25rem",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              fontFamily: "monospace",
              color: "rgba(244,244,240,0.6)",
              letterSpacing: "0.08em",
            }}
          >
            LINKED BENEFICIARIES REGISTRY ({BENEFICIARIES_DATA.length})
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {BENEFICIARIES_DATA.map((b) => {
              const isSelected = selectedBen.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBen(b)}
                  style={{
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: isSelected ? "rgba(57,255,136,0.08)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "background 0.15s ease",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#F4F4F0" }}>{b.name}</span>
                      <span style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>{b.accountMasked}</span>
                    </div>
                    <div style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.5)", marginTop: "0.2rem" }}>
                      {b.bankName} • Added: {b.createdAgo} • Prior txns: {b.priorInteractions}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.6875rem",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: b.riskScore >= 80 ? "#FF4D4D" : b.riskScore >= 50 ? "#FFA31A" : "#39FF88",
                      }}
                    >
                      RISK {b.riskScore}
                    </div>
                    <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.15rem", fontFamily: "monospace" }}>
                      {b.connectedCustomers > 1 ? `${b.connectedCustomers} ACCOUNTS` : "ISOLATED"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Beneficiary Forensic Details (PRD §12) */}
        <div
          style={{
            background: "rgba(10,10,12,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "4px",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.625rem", color: "#39FF88", fontFamily: "monospace" }}>
                BENEFICIARY INTELLIGENCE // PRD §12
              </div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F4F4F0", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedBen.name}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.5)", marginTop: "0.15rem" }}>
                ID: {selectedBen.id} • {selectedBen.bankName} • Account: {selectedBen.accountMasked}
              </div>
            </div>

            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 800,
                fontFamily: "monospace",
                color: selectedBen.riskScore >= 80 ? "#FF4D4D" : selectedBen.riskScore >= 50 ? "#FFA31A" : "#39FF88",
                background: selectedBen.riskScore >= 80 ? "rgba(255,77,77,0.15)" : "rgba(57,255,136,0.15)",
                border: `1px solid ${selectedBen.riskScore >= 80 ? "#FF4D4D" : "#39FF88"}`,
                padding: "0.3rem 0.6rem",
                borderRadius: "3px",
              }}
            >
              RISK: {selectedBen.riskScore}
            </div>
          </div>

          {/* Deep Metrics Spec (§12) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>CREATED TIMESTAMP</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: selectedBen.createdAgo.includes("minute") ? "#FF4D4D" : "#F4F4F0", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedBen.createdAgo}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                Novelty anomaly multiplier active
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>PRIOR INTERACTIONS</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: selectedBen.priorInteractions === 0 ? "#FF4D4D" : "#39FF88", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedBen.priorInteractions} transactions
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                No verified counterparty history
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>CONNECTED CUSTOMERS</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: selectedBen.connectedCustomers > 5 ? "#FF4D4D" : "#F4F4F0", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedBen.connectedCustomers} accounts
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                Graph cluster degree centralization
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>SHARED HARDWARE / IP</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: selectedBen.sharedDevices > 0 ? "#FF4D4D" : "#39FF88", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedBen.sharedDevices} Devices / {selectedBen.sharedIps} IPs
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                Correlated with DEVICE-991 and IP-17
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              onClick={() => alert(`Enforced Step-Up Challenge for all transactions to ${selectedBen.name}`)}
              style={{
                flex: 1,
                background: "rgba(255,163,26,0.15)",
                border: "1px solid rgba(255,163,26,0.4)",
                color: "#FFA31A",
                padding: "0.5rem",
                borderRadius: "3px",
                fontSize: "0.6875rem",
                fontWeight: 700,
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              [ENFORCE STEP-UP]
            </button>
            <button
              onClick={() => alert(`Added ${selectedBen.id} to Bank-Wide Threat Watchlist`)}
              style={{
                flex: 1,
                background: "rgba(255,77,77,0.15)",
                border: "1px solid rgba(255,77,77,0.4)",
                color: "#FF4D4D",
                padding: "0.5rem",
                borderRadius: "3px",
                fontSize: "0.6875rem",
                fontWeight: 700,
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              [ADD TO WATCHLIST]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
