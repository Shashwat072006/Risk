"use client";
import React, { useState } from "react";

export interface AuditRecord {
  requestId: string;
  who: string;
  role: string;
  what: string;
  category:
    | "Account access"
    | "Transaction access"
    | "Decision"
    | "Rule change"
    | "Model deployment"
    | "Policy change"
    | "Case update"
    | "Evidence export"
    | "Consent access"
    | "Consent revocation"
    | "Admin action";
  when: string;
  why: string;
  before: string;
  after: string;
}

const AUDIT_CATEGORIES = [
  "ALL",
  "Account access",
  "Transaction access",
  "Decision",
  "Rule change",
  "Model deployment",
  "Policy change",
  "Case update",
  "Evidence export",
  "Consent access",
  "Consent revocation",
  "Admin action",
] as const;

const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    requestId: "REQ-92831",
    who: "system_decision_engine",
    role: "Autonomous Defense Rail",
    what: "Adaptive Intervention: STEP-UP required",
    category: "Decision",
    when: "05 Sep 2026 14:42:19 IST",
    why: "₹84k transfer to new beneficiary from unknown device",
    before: "Status: PENDING_EVAL",
    after: "Decision: STEP-UP (OTP + Biometric)",
  },
  {
    requestId: "REQ-92830",
    who: "analyst_018",
    role: "Lead Forensics Investigator",
    what: "Inspected Rahul Sharma Account 360 & Passbook",
    category: "Account access",
    when: "05 Sep 2026 14:42:45 IST",
    why: "Triage review triggered by Case #CS-4091",
    before: "Session: IDLE",
    after: "Action: RECORD_ACCESSED",
  },
  {
    requestId: "REQ-92829",
    who: "analyst_018",
    role: "Lead Forensics Investigator",
    what: "Inspected Transaction #TX-92831 Multi-Model Signals",
    category: "Transaction access",
    when: "05 Sep 2026 14:43:02 IST",
    why: "Deep investigation of ₹84,000 instant transfer",
    before: "View: UNINSPECTED",
    after: "View: TELEMETRY_EXAMINED",
  },
  {
    requestId: "REQ-92828",
    who: "ml_engineer_04",
    role: "Lead MLOps",
    what: "Promoted Model v4.0.0-rc2 to Canary",
    category: "Model deployment",
    when: "05 Sep 2026 13:15:40 IST",
    why: "Maker-Checker approved 1.6% traffic deployment",
    before: "Traffic: 0% (Shadow)",
    after: "Traffic: 1.6% (Canary)",
  },
  {
    requestId: "REQ-92827",
    who: "risk_mgr_03",
    role: "Risk Policy Committee",
    what: "Rule R-01 (impossible_travel) promoted to Production",
    category: "Rule change",
    when: "05 Sep 2026 11:20:11 IST",
    why: "4-Eye approval completed after 72h shadow validation",
    before: "Stage: CANARY (5%)",
    after: "Stage: PRODUCTION (100%)",
  },
  {
    requestId: "REQ-92826",
    who: "risk_ops_lead",
    role: "Risk Operations Lead",
    what: "Adjusted Fraud Threshold & Step-Up Policy",
    category: "Policy change",
    when: "05 Sep 2026 10:45:00 IST",
    why: "Updated expected-loss optimization matrix",
    before: "Threshold: 70",
    after: "Threshold: 80 (+10)",
  },
  {
    requestId: "REQ-92825",
    who: "analyst_018",
    role: "Lead Forensics Investigator",
    what: "Case #CS-4091 escalated to Senior Investigation",
    category: "Case update",
    when: "05 Sep 2026 09:50:30 IST",
    why: "Entity graph confirmed overlap with Campaign #1842",
    before: "Status: TRIAGED",
    after: "Status: INVESTIGATING",
  },
  {
    requestId: "REQ-92824",
    who: "compliance_officer_01",
    role: "Regulatory Compliance",
    what: "Exported Cryptographic Evidence Vault Package",
    category: "Evidence export",
    when: "05 Sep 2026 09:12:00 IST",
    why: "FIU regulatory submission packet generation",
    before: "Export Count: 0",
    after: "Export Count: 1 (Signed PKCS#7)",
  },
  {
    requestId: "REQ-92823",
    who: "fip_connector_daemon",
    role: "Account Aggregator Ingestion Service",
    what: "Ingested statement & transaction telemetry via CONS-92831",
    category: "Consent access",
    when: "05 Sep 2026 08:30:15 IST",
    why: "Daily scheduled consent-based reconciliation",
    before: "Artifacts: 4,120",
    after: "Artifacts: 4,128 (+8 txns)",
  },
  {
    requestId: "REQ-92822",
    who: "customer_portal_gateway",
    role: "Self-Service Banking API",
    what: "Revoked third-party data aggregator consent CONS-78102",
    category: "Consent revocation",
    when: "04 Sep 2026 21:10:00 IST",
    why: "Explicit customer withdrawal of financial data sharing",
    before: "Status: ACTIVE",
    after: "Status: REVOKED (Halted)",
  },
  {
    requestId: "REQ-92821",
    who: "secops_admin",
    role: "System Security Administrator",
    what: "Enforced Session Invalidation & Hardware Token Re-auth",
    category: "Admin action",
    when: "04 Sep 2026 19:00:00 IST",
    why: "Routine credential cycling for privileged analyst tier",
    before: "MFA State: VALID",
    after: "MFA State: RE-CHALLENGE_REQUIRED",
  },
];

export default function AuditPage() {
  const [logs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredLogs = logs.filter((l) => {
    const catMatch = filterCategory === "ALL" || l.category === filterCategory;
    const query = searchQuery.toLowerCase();
    const queryMatch =
      !searchQuery ||
      l.requestId.toLowerCase().includes(query) ||
      l.who.toLowerCase().includes(query) ||
      l.what.toLowerCase().includes(query) ||
      l.why.toLowerCase().includes(query) ||
      l.category.toLowerCase().includes(query);
    return catMatch && queryMatch;
  });

  function handleExport(format: "JSON" | "CSV") {
    setExportNotice(`Audit ledger exported in ${format} format with SHA-256 cryptographic verification signatures.`);
    setTimeout(() => setExportNotice(null), 4500);
  }

  return (
    <main style={{ background: "#070707", minHeight: "100vh", color: "#F5F4EF" }}>
      <div className="grain-overlay" aria-hidden="true" />
      

      {/* Hero Section */}
      <section
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "2.5rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid #282828",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
            <div>
              <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#39FF88", marginBottom: "0.75rem", fontFamily: "monospace" }}>
                AUDIT & GOVERNANCE · §34
              </div>
              <h1
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  color: "#F5F4EF",
                  textTransform: "uppercase",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                Immutable Audit Trail
              </h1>
              <p style={{ maxWidth: 680, fontSize: "0.8125rem", color: "#929292", lineHeight: 1.6, marginTop: "0.75rem" }}>
                Every access, decision, policy modification, model promotion, and evidence extraction is recorded with strict WORM immutability.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => handleExport("CSV")}
                style={{
                  background: "#101010",
                  border: "1px solid #282828",
                  color: "#F5F4EF",
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  borderRadius: "3px",
                }}
              >
                Export CSV ↓
              </button>
              <button
                onClick={() => handleExport("JSON")}
                style={{
                  background: "#39FF88",
                  border: "none",
                  color: "#070707",
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.6875rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  borderRadius: "3px",
                }}
              >
                Export Signed JSON Package ↓
              </button>
            </div>
          </div>

          {exportNotice && (
            <div
              style={{
                marginTop: "1.25rem",
                padding: "0.75rem 1rem",
                background: "rgba(57,255,136,0.08)",
                border: "1px solid #39FF88",
                color: "#39FF88",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                borderRadius: "3px",
              }}
            >
              ● {exportNotice}
            </div>
          )}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ borderBottom: "1px solid #282828", padding: "1.25rem 2.5rem", background: "#101010" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", fontFamily: "monospace", marginRight: "0.4rem" }}>
              CATEGORY (§34):
            </span>
            {AUDIT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  background: filterCategory === cat ? "#151515" : "transparent",
                  border: filterCategory === cat ? "1px solid #39FF88" : "1px solid #282828",
                  color: filterCategory === cat ? "#39FF88" : "#929292",
                  fontSize: "0.625rem",
                  fontFamily: "monospace",
                  fontWeight: filterCategory === cat ? 700 : 400,
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "2px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search WHO, WHAT, WHY, REQUEST ID..."
            style={{
              background: "#151515",
              border: "1px solid #282828",
              padding: "0.45rem 0.85rem",
              color: "#F5F4EF",
              fontSize: "0.6875rem",
              fontFamily: "monospace",
              outline: "none",
              width: 280,
              borderRadius: "3px",
            }}
          />
        </div>
      </section>

      {/* Audit Log Ledger Table: STRICT PRD v4 §34 Spec (WHO, WHAT, WHEN, WHY, BEFORE, AFTER, REQUEST ID) */}
      <section style={{ padding: "2.5rem 2.5rem 5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ border: "1px solid #282828", background: "#101010", borderRadius: "4px", overflow: "hidden" }}>
          {/* Table Header: Exactly PRD §34 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "110px 170px 1.1fr 140px 1.2fr 1fr 1fr",
              padding: "0.85rem 1.25rem",
              borderBottom: "1px solid #282828",
              fontSize: "0.5625rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#929292",
              fontFamily: "monospace",
              background: "#151515",
            }}
          >
            <div>REQUEST ID</div>
            <div>WHO</div>
            <div>WHAT</div>
            <div>WHEN</div>
            <div>WHY</div>
            <div>BEFORE</div>
            <div>AFTER</div>
          </div>

          {/* Rows */}
          {filteredLogs.map((log) => (
            <div
              key={log.requestId}
              style={{
                display: "grid",
                gridTemplateColumns: "110px 170px 1.1fr 140px 1.2fr 1fr 1fr",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid #1a1a1a",
                alignItems: "center",
                fontSize: "0.75rem",
                fontFamily: "monospace",
              }}
            >
              {/* REQUEST ID */}
              <div style={{ color: "#39FF88", fontWeight: 700 }}>
                {log.requestId}
              </div>

              {/* WHO */}
              <div>
                <div style={{ color: "#F5F4EF", fontWeight: 600 }}>{log.who}</div>
                <div style={{ fontSize: "0.5625rem", color: "#929292" }}>{log.role}</div>
              </div>

              {/* WHAT */}
              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.15rem 0.45rem",
                    background: "#151515",
                    border: "1px solid #282828",
                    color: "#F5F4EF",
                    fontSize: "0.5625rem",
                    borderRadius: "2px",
                    marginBottom: "0.2rem",
                  }}
                >
                  {log.category}
                </span>
                <div style={{ fontSize: "0.6875rem", color: "#F5F4EF" }}>{log.what}</div>
              </div>

              {/* WHEN */}
              <div style={{ fontSize: "0.6875rem", color: "#929292" }}>
                {log.when}
              </div>

              {/* WHY */}
              <div style={{ fontSize: "0.6875rem", color: "#929292", paddingRight: "0.75rem" }}>
                {log.why}
              </div>

              {/* BEFORE */}
              <div style={{ fontSize: "0.6875rem", color: "#929292" }}>
                {log.before}
              </div>

              {/* AFTER */}
              <div style={{ fontSize: "0.6875rem", color: "#39FF88", fontWeight: 600 }}>
                {log.after}
              </div>
            </div>
          ))}
        </div>
      </section>

      
    </main>
  );
}
