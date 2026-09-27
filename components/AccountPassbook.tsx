"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface PassbookEntry {
  id: string;
  date: string;
  displayDate: string;
  time: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  category: string;
  merchantOrBeneficiary: string;
  rail: "Instant Payment" | "Wire / RTGS" | "Card" | "ACH / NEFT";
  channel: "Mobile" | "Web" | "ATM" | "POS";
  location: string;
  riskScore: number;
  riskTier: "HIGH" | "MEDIUM" | "NORMAL";
  decision: "APPROVE" | "STEP-UP" | "REVIEW" | "BLOCK";
  flags?: string[];
  isNewBeneficiary?: boolean;
}

const PASSBOOK_RECORDS: PassbookEntry[] = [
  {
    id: "TX-92831",
    date: "2026-09-05",
    displayDate: "05 SEP 2026",
    time: "14:42",
    amount: 84000,
    type: "DEBIT",
    category: "Instant Transfer",
    merchantOrBeneficiary: "FastPay / Beneficiary Ben-918",
    rail: "Instant Payment",
    channel: "Mobile",
    location: "Dubai, UAE",
    riskScore: 84,
    riskTier: "HIGH",
    decision: "STEP-UP",
    flags: ["NEW BENEFICIARY", "NEW DEVICE", "VELOCITY BURST", "GEO MISMATCH"],
    isNewBeneficiary: true,
  },
  {
    id: "TX-92812",
    date: "2026-09-05",
    displayDate: "05 SEP 2026",
    time: "11:20",
    amount: 2450,
    type: "DEBIT",
    category: "Grocery",
    merchantOrBeneficiary: "Nature's Basket Connaught Place",
    rail: "Card",
    channel: "POS",
    location: "Delhi, IN",
    riskScore: 12,
    riskTier: "NORMAL",
    decision: "APPROVE",
  },
  {
    id: "TX-92790",
    date: "2026-09-04",
    displayDate: "04 SEP 2026",
    time: "18:22",
    amount: 148000,
    type: "CREDIT",
    category: "Salary",
    merchantOrBeneficiary: "Apex Tech Corp Monthly Payroll",
    rail: "Wire / RTGS",
    channel: "Web",
    location: "Gurgaon, IN",
    riskScore: 4,
    riskTier: "NORMAL",
    decision: "APPROVE",
  },
  {
    id: "TX-92744",
    date: "2026-09-03",
    displayDate: "03 SEP 2026",
    time: "20:15",
    amount: 48500,
    type: "DEBIT",
    category: "Transfers Out",
    merchantOrBeneficiary: "Pradeep Verma (P2P Wire)",
    rail: "Instant Payment",
    channel: "Mobile",
    location: "Delhi, IN",
    riskScore: 68,
    riskTier: "MEDIUM",
    decision: "REVIEW",
    flags: ["RAPID PASS-THROUGH", "4 MIN DWELL TIME"],
  },
  {
    id: "TX-92740",
    date: "2026-09-03",
    displayDate: "03 SEP 2026",
    time: "20:11",
    amount: 50000,
    type: "CREDIT",
    category: "Transfers In",
    merchantOrBeneficiary: "R. K. Enterprises Clearing",
    rail: "Instant Payment",
    channel: "Web",
    location: "Mumbai, IN",
    riskScore: 61,
    riskTier: "MEDIUM",
    decision: "APPROVE",
    flags: ["INBOUND AGGREGATION"],
  },
  {
    id: "TX-92688",
    date: "2026-09-02",
    displayDate: "02 SEP 2026",
    time: "13:05",
    amount: 1850,
    type: "DEBIT",
    category: "Food",
    merchantOrBeneficiary: "Blue Tokai Coffee Gurgaon",
    rail: "Card",
    channel: "POS",
    location: "Gurgaon, IN",
    riskScore: 6,
    riskTier: "NORMAL",
    decision: "APPROVE",
  },
  {
    id: "TX-92610",
    date: "2026-09-01",
    displayDate: "01 SEP 2026",
    time: "09:30",
    amount: 35000,
    type: "DEBIT",
    category: "Rent",
    merchantOrBeneficiary: "DLF CyberCity Leasing Ltd",
    rail: "ACH / NEFT",
    channel: "Web",
    location: "Gurgaon, IN",
    riskScore: 8,
    riskTier: "NORMAL",
    decision: "APPROVE",
  },
  {
    id: "TX-92550",
    date: "2026-08-30",
    displayDate: "30 AUG 2026",
    time: "16:40",
    amount: 6200,
    type: "DEBIT",
    category: "Utilities",
    merchantOrBeneficiary: "Tata Power Delhi Electricity",
    rail: "ACH / NEFT",
    channel: "Web",
    location: "Delhi, IN",
    riskScore: 5,
    riskTier: "NORMAL",
    decision: "APPROVE",
  },
];

interface AccountPassbookProps {
  onSelectTxn?: (txnId: string) => void;
  onSwitchTab?: (tabKey: string) => void;
}

export default function AccountPassbook({ onSelectTxn, onSwitchTab }: AccountPassbookProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "DEBIT" | "CREDIT">("ALL");
  const [filterRisk, setFilterRisk] = useState<"ALL" | "HIGH" | "MEDIUM" | "NORMAL">("ALL");
  const [filterRail, setFilterRail] = useState<string>("ALL");
  const [selectedTxn, setSelectedTxn] = useState<PassbookEntry | null>(null);

  // Counterfactual state toggles
  const [cfNewDeviceOff, setCfNewDeviceOff] = useState(false);
  const [cfNetworkOff, setCfNetworkOff] = useState(false);
  const [cfVelocityOff, setCfVelocityOff] = useState(false);

  const filteredRecords = PASSBOOK_RECORDS.filter((rec) => {
    if (filterType !== "ALL" && rec.type !== filterType) return false;
    if (filterRisk !== "ALL" && rec.riskTier !== filterRisk) return false;
    if (filterRail !== "ALL" && rec.rail !== filterRail) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        rec.id.toLowerCase().includes(q) ||
        rec.merchantOrBeneficiary.toLowerCase().includes(q) ||
        rec.category.toLowerCase().includes(q) ||
        rec.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Group by displayDate
  const groupedByDate: Record<string, PassbookEntry[]> = {};
  for (const item of filteredRecords) {
    if (!groupedByDate[item.displayDate]) {
      groupedByDate[item.displayDate] = [];
    }
    groupedByDate[item.displayDate].push(item);
  }

  // Calculate dynamic counterfactual risk for TX-92831
  let dynamicRisk = 84;
  let dynamicDecision = "STEP-UP";
  if (cfNewDeviceOff) dynamicRisk -= 21;
  if (cfNetworkOff) dynamicRisk -= 9;
  if (cfVelocityOff) dynamicRisk -= 7;
  if (dynamicRisk <= 50) {
    dynamicDecision = "APPROVE";
  } else if (dynamicRisk <= 65) {
    dynamicDecision = "REVIEW";
  } else {
    dynamicDecision = "STEP-UP";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "4px",
        }}
      >
        <div style={{ flex: "1 1 240px", minWidth: 200, position: "relative" }}>
          <input
            type="text"
            placeholder="Search passbook by merchant, category, txn ID, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "4px",
              padding: "0.5rem 0.75rem",
              fontSize: "0.75rem",
              color: "#F4F4F0",
              fontFamily: "monospace",
              outline: "none",
            }}
          />
        </div>

        {/* Type Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.6rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase", marginRight: "0.25rem" }}>
            FLOW:
          </span>
          {(["ALL", "DEBIT", "CREDIT"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                background: filterType === t ? "rgba(57,255,136,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${filterType === t ? "#39FF88" : "rgba(255,255,255,0.08)"}`,
                color: filterType === t ? "#39FF88" : "rgba(244,244,240,0.6)",
                padding: "0.3rem 0.6rem",
                borderRadius: "3px",
                fontSize: "0.625rem",
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Risk Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.6rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase", marginRight: "0.25rem" }}>
            RISK:
          </span>
          {(["ALL", "HIGH", "MEDIUM", "NORMAL"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              style={{
                background:
                  filterRisk === r
                    ? r === "HIGH"
                      ? "rgba(255,77,77,0.2)"
                      : r === "MEDIUM"
                      ? "rgba(255,163,26,0.2)"
                      : "rgba(57,255,136,0.2)"
                    : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  filterRisk === r
                    ? r === "HIGH"
                      ? "#FF4D4D"
                      : r === "MEDIUM"
                      ? "#FFA31A"
                      : "#39FF88"
                    : "rgba(255,255,255,0.08)"
                }`,
                color:
                  filterRisk === r
                    ? r === "HIGH"
                      ? "#FF4D4D"
                      : r === "MEDIUM"
                      ? "#FFA31A"
                      : "#39FF88"
                    : "rgba(244,244,240,0.6)",
                padding: "0.3rem 0.6rem",
                borderRadius: "3px",
                fontSize: "0.625rem",
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Rail Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.6rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase", marginRight: "0.25rem" }}>
            RAIL:
          </span>
          <select
            value={filterRail}
            onChange={(e) => setFilterRail(e.target.value)}
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(244,244,240,0.8)",
              fontSize: "0.625rem",
              fontFamily: "monospace",
              padding: "0.25rem 0.5rem",
              borderRadius: "3px",
              outline: "none",
            }}
          >
            <option value="ALL">All Rails</option>
            <option value="Instant Payment">Instant Payment</option>
            <option value="Wire / RTGS">Wire / RTGS</option>
            <option value="Card">Card</option>
            <option value="ACH / NEFT">ACH / NEFT</option>
          </select>
        </div>
      </div>

      {/* Passbook Ledger Container */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "4px",
          background: "rgba(10,10,12,0.9)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1.25rem",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.6875rem", fontFamily: "monospace", letterSpacing: "0.08em", color: "rgba(244,244,240,0.5)" }}>
              STATEMENT LEDGER // ACCOUNT ••••4821
            </span>
            <span style={{ fontSize: "0.625rem", padding: "0.15rem 0.4rem", background: "rgba(57,255,136,0.1)", color: "#39FF88", borderRadius: "2px" }}>
              {filteredRecords.length} EVENTS LOADED
            </span>
          </div>
          <span style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.35)", fontFamily: "monospace" }}>
            CLICK ANY ROW TO OPEN FORENSIC DRAWER
          </span>
        </div>

        {Object.keys(groupedByDate).length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(244,244,240,0.3)", fontSize: "0.8rem", fontFamily: "monospace" }}>
            NO TRANSACTIONS MATCH SPECIFIED FILTERS
          </div>
        ) : (
          Object.entries(groupedByDate).map(([dateHeader, txns]) => (
            <div key={dateHeader} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {/* Date Section Header */}
              <div
                style={{
                  padding: "0.6rem 1.25rem",
                  background: "rgba(255,255,255,0.015)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#F5F4EF",
                  fontFamily: "monospace",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>//</span> {dateHeader}
              </div>

              {/* Transactions in Date */}
              {txns.map((t) => {
                const isSelected = selectedTxn?.id === t.id;
                const isDebit = t.type === "DEBIT";
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTxn(t);
                      if (onSelectTxn) onSelectTxn(t.id);
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "70px 140px 1fr 130px 110px 100px",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.85rem 1.25rem",
                      borderTop: "1px solid rgba(255,255,255,0.03)",
                      background: isSelected
                        ? "rgba(57,255,136,0.08)"
                        : t.riskTier === "HIGH"
                        ? "rgba(255,77,77,0.03)"
                        : "transparent",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          t.riskTier === "HIGH" ? "rgba(255,77,77,0.03)" : "transparent";
                      }
                    }}
                  >
                    {/* Time */}
                    <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.5)", fontFamily: "monospace" }}>
                      {t.time}
                    </div>

                    {/* Amount */}
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color: isDebit ? "#F4F4F0" : "#39FF88",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {isDebit ? "-" : "+"}₹{t.amount.toLocaleString("en-IN")}
                    </div>

                    {/* Description & Category */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#F4F4F0" }}>
                          {t.merchantOrBeneficiary}
                        </span>
                        {t.isNewBeneficiary && (
                          <span
                            style={{
                              fontSize: "0.5625rem",
                              padding: "0.1rem 0.35rem",
                              background: "rgba(255,77,77,0.15)",
                              color: "#FF4D4D",
                              border: "1px solid rgba(255,77,77,0.3)",
                              borderRadius: "2px",
                              fontFamily: "monospace",
                            }}
                          >
                            NEW BENEFICIARY
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.625rem", color: "rgba(244,244,240,0.4)" }}>
                        <span style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>{t.category}</span>
                        <span>•</span>
                        <span>{t.rail}</span>
                        <span>•</span>
                        <span>{t.location}</span>
                      </div>
                    </div>

                    {/* Channel & Rail */}
                    <div style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.6)", fontFamily: "monospace" }}>
                      {t.channel} ({t.rail.split(" ")[0]})
                    </div>

                    {/* Risk Badge */}
                    <div>
                      {t.riskTier === "HIGH" ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.625rem",
                            padding: "0.2rem 0.5rem",
                            background: "rgba(255,77,77,0.15)",
                            border: "1px solid rgba(255,77,77,0.4)",
                            color: "#FF4D4D",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            borderRadius: "3px",
                          }}
                        >
                          <span>[ALERT]</span> RISK {t.riskScore}
                        </div>
                      ) : t.riskTier === "MEDIUM" ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.625rem",
                            padding: "0.2rem 0.5rem",
                            background: "rgba(255,163,26,0.15)",
                            border: "1px solid rgba(255,163,26,0.4)",
                            color: "#FFA31A",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            borderRadius: "3px",
                          }}
                        >
                          <span>[WARN]</span> RISK {t.riskScore}
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.625rem",
                            padding: "0.2rem 0.5rem",
                            background: "rgba(57,255,136,0.08)",
                            border: "1px solid rgba(57,255,136,0.25)",
                            color: "#39FF88",
                            fontFamily: "monospace",
                            borderRadius: "3px",
                          }}
                        >
                          <span>[OK]</span> NORMAL
                        </div>
                      )}
                    </div>

                    {/* Action Decision */}
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "0.625rem",
                          fontFamily: "monospace",
                          color:
                            t.decision === "APPROVE"
                              ? "#39FF88"
                              : t.decision === "STEP-UP"
                              ? "#FFA31A"
                              : "#FF4D4D",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {t.decision}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Transaction Detail Forensic Drawer (PRD §13) */}
      {selectedTxn && (
        <div
          style={{
            border: "1px solid #282828",
            background: "#101010",
            borderRadius: "2px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #282828", paddingBottom: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                TRANSACTION #{selectedTxn.id}
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F5F4EF", fontFamily: "monospace", marginTop: "0.25rem" }}>
                ₹{selectedTxn.amount.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#929292", marginTop: "0.2rem", fontFamily: "monospace" }}>
                {selectedTxn.category} • {selectedTxn.merchantOrBeneficiary}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 800,
                  fontFamily: "monospace",
                  color: dynamicDecision === "APPROVE" ? "#39FF88" : dynamicDecision === "STEP-UP" ? "#FFA31A" : "#FF4D4D",
                  padding: "0.35rem 0.8rem",
                  background: dynamicDecision === "APPROVE" ? "rgba(57,255,136,0.1)" : dynamicDecision === "STEP-UP" ? "rgba(255,163,26,0.1)" : "rgba(255,77,77,0.1)",
                  border: `1px solid ${dynamicDecision === "APPROVE" ? "#39FF88" : dynamicDecision === "STEP-UP" ? "#FFA31A" : "#FF4D4D"}`,
                  borderRadius: "2px",
                  display: "inline-block",
                }}
              >
                ● {dynamicDecision} REQUIRED
              </div>
              <div style={{ fontSize: "0.5625rem", color: "#535353", fontFamily: "monospace", marginTop: "0.35rem" }}>
                ADAPTIVE INTERVENTION (PRD §23)
              </div>
            </div>
          </div>

          {/* Multi-Model Risk Grid (PRD §13) */}
          <div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              MULTI-MODEL RISK SIGNALS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem" }}>
              {[
                { label: "FRAUD RISK", score: selectedTxn.id === "TX-92831" ? 82 : selectedTxn.riskScore, color: selectedTxn.riskTier === "HIGH" ? "#FF4D4D" : "#39FF88" },
                { label: "ATO RISK", score: selectedTxn.id === "TX-92831" ? 67 : 12, color: selectedTxn.id === "TX-92831" ? "#FFA31A" : "#39FF88" },
                { label: "APP RISK", score: selectedTxn.id === "TX-92831" ? 74 : 15, color: selectedTxn.id === "TX-92831" ? "#FF4D4D" : "#39FF88" },
                { label: "CHARGEBACK RISK", score: 8, color: "#39FF88" },
                { label: "NOVELTY", score: selectedTxn.id === "TX-92831" ? 92 : 18, color: selectedTxn.id === "TX-92831" ? "#FF4D4D" : "#39FF88" },
              ].map((m) => (
                <div key={m.label} style={{ background: "#151515", border: "1px solid #282828", padding: "0.75rem", borderRadius: "2px" }}>
                  <div style={{ fontSize: "0.5rem", color: "#929292", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: "1.375rem", fontWeight: 800, color: m.color, fontFamily: "monospace", marginTop: "0.2rem" }}>
                    {m.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHY THIS IS UNUSUAL (PRD §13) & Counterfactuals (PRD §27) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {/* WHY THIS IS UNUSUAL */}
            <div style={{ background: "#151515", border: "1px solid #282828", padding: "1.25rem", borderRadius: "2px" }}>
              <div style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.12em", color: "#929292", fontFamily: "monospace", marginBottom: "0.75rem", textTransform: "uppercase" }}>
                WHY THIS IS UNUSUAL (PRD §13)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                {[
                  "Amount is 7.8× customer baseline (₹84,000 vs typical ₹3,800)",
                  "Beneficiary created 2 min ago (BEN-918, 0 prior interactions)",
                  "Device never seen before (DEVICE-991 Windows Chrome)",
                  "Activity occurred outside normal hours (03:14 AM IST)",
                  "Related account cluster detected (Campaign #1842)",
                ].map((reason, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ color: "#FF4D4D", fontWeight: 700 }}>•</span>
                    <span style={{ color: "#F5F4EF" }}>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Counterfactual Analysis (PRD §27) */}
            <div style={{ background: "#151515", border: "1px solid #282828", padding: "1.25rem", borderRadius: "2px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.12em", color: "#929292", fontFamily: "monospace", textTransform: "uppercase" }}>
                  COUNTERFACTUAL WHAT-IF (PRD §27)
                </div>
                <div style={{ fontSize: "0.5rem", color: "#535353", fontFamily: "monospace" }}>
                  DYNAMIC RE-SCORING
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.6875rem", color: "#F5F4EF", cursor: "pointer", fontFamily: "monospace" }}>
                  <span>Without new device</span>
                  <input
                    type="checkbox"
                    checked={cfNewDeviceOff}
                    onChange={(e) => setCfNewDeviceOff(e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", marginLeft: "0.5rem" }}>
                  Expected: Risk 63 → REVIEW
                </div>

                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.6875rem", color: "#F5F4EF", cursor: "pointer", fontFamily: "monospace" }}>
                  <span>Without network signal</span>
                  <input
                    type="checkbox"
                    checked={cfNetworkOff}
                    onChange={(e) => setCfNetworkOff(e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", marginLeft: "0.5rem" }}>
                  Expected: Risk 54 → 3DS
                </div>

                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.6875rem", color: "#F5F4EF", cursor: "pointer", fontFamily: "monospace" }}>
                  <span>Without velocity</span>
                  <input
                    type="checkbox"
                    checked={cfVelocityOff}
                    onChange={(e) => setCfVelocityOff(e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <div style={{ fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace", marginLeft: "0.5rem" }}>
                  Expected: Risk 47 → APPROVE
                </div>

                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    background: "#101010",
                    border: "1px solid #282828",
                    borderRadius: "2px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.6875rem",
                    fontFamily: "monospace",
                  }}
                >
                  <span style={{ color: "#929292" }}>Simulated Score:</span>
                  <span style={{ color: dynamicDecision === "APPROVE" ? "#39FF88" : dynamicDecision === "REVIEW" ? "#FFA31A" : "#FF4D4D", fontWeight: 800 }}>
                    {dynamicRisk} / 100 ({dynamicDecision})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Links (PRD §13: [View graph], [Investigate], [Create case]) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid #282828" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => {
                  if (onSwitchTab) onSwitchTab("network");
                  else router.push("/account-360?tab=network");
                }}
                style={{
                  background: "#151515",
                  border: "1px solid #282828",
                  color: "#F5F4EF",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "2px",
                  fontSize: "0.625rem",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                [View graph]
              </button>
              <button
                onClick={() => {
                  router.push(`/command-center?tab=investigate&id=${selectedTxn.id}`);
                }}
                style={{
                  background: "rgba(57,255,136,0.1)",
                  border: "1px solid rgba(57,255,136,0.3)",
                  color: "#39FF88",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "2px",
                  fontSize: "0.625rem",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                [Investigate]
              </button>
              <button
                onClick={() => {
                  if (onSwitchTab) onSwitchTab("cases");
                  else router.push("/command-center?tab=cases");
                }}
                style={{
                  background: "#151515",
                  border: "1px solid #282828",
                  color: "#FFA31A",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "2px",
                  fontSize: "0.625rem",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                [Create case]
              </button>
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              style={{
                background: "transparent",
                border: "1px solid #282828",
                color: "#929292",
                padding: "0.45rem 0.9rem",
                borderRadius: "2px",
                fontSize: "0.625rem",
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
