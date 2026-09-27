"use client";
import React, { useState } from "react";

export default function ConsentProvenanceView() {
  const [consentStatus, setConsentStatus] = useState<"ACTIVE" | "REVOKED">("ACTIVE");
  const [showConsentModal, setShowConsentModal] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Consent Center (PRD v4 §35) */}
      <div
        style={{
          background: "#101010",
          border: "1px solid #282828",
          borderRadius: "4px",
          padding: "1.25rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.625rem", color: "#929292", fontFamily: "monospace", letterSpacing: "0.08em" }}>
              CONSENT CENTER · §35
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
              Consent-Based Financial Data Connection
            </div>
            <div style={{ fontSize: "0.625rem", color: "#929292", marginTop: "0.2rem" }}>
              Approved connector / sandbox data ingestion. No credentials scraping or unauthorized access.
            </div>
          </div>

          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 800,
              fontFamily: "monospace",
              color: consentStatus === "ACTIVE" ? "#39FF88" : "#FF4D4D",
              background: consentStatus === "ACTIVE" ? "rgba(57,255,136,0.1)" : "rgba(255,77,77,0.1)",
              border: `1px solid ${consentStatus === "ACTIVE" ? "#39FF88" : "#FF4D4D"}`,
              padding: "0.25rem 0.6rem",
              borderRadius: "3px",
            }}
          >
            ● {consentStatus}
          </div>
        </div>

        {/* Consent Info Box */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.85rem", borderRadius: "3px" }}>
            <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>FINANCIAL INSTITUTION</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace", marginTop: "0.25rem" }}>
              Example Bank
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.2rem" }}>
              Account: ••••4821 (Rahul Sharma)
            </div>
          </div>

          <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.85rem", borderRadius: "3px" }}>
            <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>DATA ARTIFACTS</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace", marginTop: "0.25rem" }}>
              Transactions · Balance · Account Details
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.2rem" }}>
              Account Aggregator Schema v2.1
            </div>
          </div>

          <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.85rem", borderRadius: "3px" }}>
            <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>PURPOSE & DURATION</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace", marginTop: "0.25rem" }}>
              Fraud Investigation (90 days)
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.2rem" }}>
              Valid through 04 Dec 2026
            </div>
          </div>
        </div>

        {/* Action Triggers */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => setShowConsentModal(true)}
            style={{
              background: "#151515",
              border: "1px solid #282828",
              color: "#F5F4EF",
              padding: "0.45rem 0.9rem",
              borderRadius: "3px",
              fontSize: "0.6875rem",
              fontFamily: "monospace",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            [View consent]
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to revoke consent CONS-92831? Ingestion will immediately halt.")) {
                setConsentStatus(consentStatus === "ACTIVE" ? "REVOKED" : "ACTIVE");
              }
            }}
            style={{
              background: "rgba(255,77,77,0.08)",
              border: "1px solid rgba(255,77,77,0.3)",
              color: "#FF4D4D",
              padding: "0.45rem 0.9rem",
              borderRadius: "3px",
              fontSize: "0.6875rem",
              fontFamily: "monospace",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {consentStatus === "ACTIVE" ? "[Revoke]" : "[Re-enable consent]"}
          </button>
        </div>
      </div>

      {/* Data Provenance & Lineage (PRD v4 §36) */}
      <div
        style={{
          background: "#101010",
          border: "1px solid #282828",
          borderRadius: "4px",
          padding: "1.25rem",
        }}
      >
        <div style={{ marginBottom: "1rem", borderBottom: "1px solid #282828", paddingBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.625rem", color: "#39FF88", fontFamily: "monospace", letterSpacing: "0.08em" }}>
            DATA PROVENANCE · §36
          </div>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
            Traceable Chain of Custody for Financial Telemetry
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.75rem" }}>
          {[
            { label: "SOURCE", val: "Example Bank", sub: "Approved core banking" },
            { label: "CONNECTOR", val: "Approved / Sandbox", sub: "mTLS TLS 1.3" },
            { label: "CONSENT", val: "CONS-92831", sub: "Digitally signed" },
            { label: "RECEIVED", val: "05 Sep 2026 14:42", sub: "Latency 38ms" },
            { label: "PROCESSED", val: "Account Intelligence", sub: "Risk Engine" },
            { label: "ACCESSED BY", val: "Investigator 018", sub: "Lead Forensics" },
          ].map((p) => (
            <div
              key={p.label}
              style={{
                background: "#151515",
                border: "1px solid #282828",
                borderRadius: "3px",
                padding: "0.75rem",
              }}
            >
              <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>
                {p.label}
              </div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {p.val}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.15rem", fontFamily: "monospace" }}>
                {p.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consent Modal */}
      {showConsentModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#101010",
              border: "1px solid #282828",
              borderRadius: "6px",
              padding: "2rem",
              maxWidth: 550,
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              fontFamily: "monospace",
            }}
          >
            <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#F5F4EF" }}>
              CONSENT ARTIFACT: CONS-92831
            </div>
            <div style={{ fontSize: "0.75rem", color: "#F5F4EF", lineHeight: 1.6, background: "#151515", border: "1px solid #282828", padding: "1rem", borderRadius: "4px" }}>
              <p><strong>Consent Artifact ID:</strong> CONS-92831-FIP-AA</p>
              <p><strong>Customer:</strong> Rahul Sharma (Customer ID: CUST-4821)</p>
              <p><strong>FIP Entity:</strong> Example Bank</p>
              <p><strong>FIU Entity:</strong> ATDP Risk & Fraud Defense Engine</p>
              <p><strong>Data Frequency:</strong> Real-Time Payment Events + Daily Statement</p>
              <p><strong>Cryptographic Signature:</strong> SHA256-RSA-99214ab818fe0</p>
              <p><strong>Purpose Code:</strong> Fraud Investigation (90 days)</p>
            </div>
            <button
              onClick={() => setShowConsentModal(false)}
              style={{
                alignSelf: "flex-end",
                background: "#151515",
                border: "1px solid #282828",
                color: "#F5F4EF",
                padding: "0.4rem 1rem",
                borderRadius: "3px",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
