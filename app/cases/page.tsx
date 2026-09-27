"use client";
import React, { useState } from "react";

interface Case {
  id: string;
  customer: string;
  account: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  txnCount: number;
  exposure: string;
  owner: string;
  campaign?: string;
  opened: string;
}

const INITIAL_CASES: Record<string, Case[]> = {
  OPEN: [
    { id: "CASE-2210", customer: "Vikram Malhotra", account: "••••7820", type: "Coordinated ATO", severity: "CRITICAL", txnCount: 17, exposure: "₹18.4L", owner: "Unassigned", campaign: "#1842", opened: "Today 09:41" },
    { id: "CASE-2208", customer: "Anonymous Cardholder", account: "••••1092", type: "Card Testing Burst", severity: "HIGH", txnCount: 31, exposure: "₹2.1L", owner: "Unassigned", campaign: "#1839", opened: "Today 08:12" },
  ],
  TRIAGED: [
    { id: "CASE-2201", customer: "Rahul Sharma", account: "••••4821", type: "High Amount Transfer", severity: "HIGH", txnCount: 1, exposure: "₹84,000", owner: "Investigator 018", opened: "Today 14:42" },
  ],
  INVESTIGATING: [
    { id: "CASE-2199", customer: "Kavita Rao", account: "••••9004", type: "Mule Pass-Through", severity: "HIGH", txnCount: 9, exposure: "₹6.7L", owner: "Analyst 021", campaign: "#1830", opened: "Yesterday" },
    { id: "CASE-2195", customer: "Deepak Patel", account: "••••2911", type: "Velocity Anomaly", severity: "MEDIUM", txnCount: 4, exposure: "₹1.2L", owner: "Analyst 007", opened: "Yesterday" },
  ],
  ESCALATED: [
    { id: "CASE-2188", customer: "Sanjay Singhal", account: "••••4119", type: "Synthetic Identity Ring", severity: "CRITICAL", txnCount: 23, exposure: "₹42.0L", owner: "Risk Manager", opened: "2 days ago" },
  ],
  RESOLVED: [
    { id: "CASE-2180", customer: "Pooja Hegde", account: "••••3319", type: "Card Not Present Dispute", severity: "MEDIUM", txnCount: 6, exposure: "₹3.4L", owner: "Analyst 014", opened: "3 days ago" },
    { id: "CASE-2174", customer: "Aman Verma", account: "••••8812", type: "Promo Exploitation", severity: "MEDIUM", txnCount: 12, exposure: "₹90,000", owner: "Analyst 021", opened: "4 days ago" },
  ],
};

const SEV_COLORS: Record<string, string> = {
  CRITICAL: "#FF4D4D",
  HIGH: "#FFA31A",
  MEDIUM: "#929292",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "#FF4D4D",
  TRIAGED: "#FFA31A",
  INVESTIGATING: "#FFA31A",
  ESCALATED: "#FF4D4D",
  RESOLVED: "#39FF88",
};

export default function CasesPage() {
  const [cases, setCases] = useState(INITIAL_CASES);
  const [dragging, setDragging] = useState<{ caseId: string; fromCol: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const COLUMNS = ["OPEN", "TRIAGED", "INVESTIGATING", "ESCALATED", "RESOLVED"] as const;

  function onDrop(toCol: string) {
    if (!dragging || dragging.fromCol === toCol) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    setCases((prev) => {
      const fromArr = [...(prev[dragging.fromCol] || [])];
      const idx = fromArr.findIndex((c) => c.id === dragging.caseId);
      if (idx === -1) return prev;
      const [moved] = fromArr.splice(idx, 1);
      const toArr = [...(prev[toCol] || []), moved];
      return { ...prev, [dragging.fromCol]: fromArr, [toCol]: toArr };
    });
    setDragging(null);
    setDragOver(null);
  }

  const totalOpen = (cases.OPEN?.length || 0) + (cases.TRIAGED?.length || 0) + (cases.INVESTIGATING?.length || 0) + (cases.ESCALATED?.length || 0);

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
            <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#FFA31A", marginBottom: "0.75rem", fontFamily: "monospace" }}>
              CASE MANAGEMENT · §32
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#F5F4EF", textTransform: "uppercase", margin: 0, fontFamily: "monospace" }}>
              Risk Case Pipeline
            </h1>
            <p style={{ maxWidth: 540, fontSize: "0.8125rem", color: "#929292", lineHeight: 1.6, marginTop: "0.75rem" }}>
              Drag cases between columns to advance through the investigation lifecycle. All updates append immutable entries to the audit trail.
            </p>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              { label: "Active Open Cases", value: totalOpen.toString(), color: "#FF4D4D" },
              { label: "Total Exposure", value: "₹70.4L", color: "#FFA31A" },
              { label: "Resolved Today", value: "2", color: "#39FF88" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color, letterSpacing: "-0.03em", fontFamily: "monospace" }}>{s.value}</div>
                <div style={{ fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#929292", marginTop: "0.2rem", fontFamily: "monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kanban board: 5 columns (§32) */}
      <section style={{ padding: "2.5rem 2.5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", alignItems: "start" }}>
          {COLUMNS.map((col) => {
            const colColor = STATUS_COLORS[col];
            const colCases = cases[col] || [];
            const isOver = dragOver === col;

            return (
              <div
                key={col}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => onDrop(col)}
                style={{
                  background: isOver ? `${colColor}10` : "#101010",
                  border: isOver ? `1px dashed ${colColor}` : "1px solid #282828",
                  borderRadius: "4px",
                  minHeight: 350,
                  transition: "background 150ms ease, border-color 150ms ease",
                  overflow: "hidden",
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.85rem 1rem",
                    borderBottom: "1px solid #282828",
                    background: "#151515",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: colColor }} />
                    <span style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F5F4EF", fontFamily: "monospace" }}>
                      {col}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      color: "#929292",
                      background: "#282828",
                      borderRadius: "10px",
                      padding: "0.1rem 0.4rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {colCases.length}
                  </span>
                </div>

                {/* Cases */}
                <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {colCases.map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={() => setDragging({ caseId: c.id, fromCol: col })}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                      style={{
                        background: "#151515",
                        border: "1px solid #282828",
                        borderLeft: `3px solid ${SEV_COLORS[c.severity]}`,
                        padding: "0.85rem",
                        borderRadius: "3px",
                        cursor: "grab",
                        opacity: dragging?.caseId === c.id ? 0.4 : 1,
                        transition: "opacity 150ms ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
                          {c.id}
                        </span>
                        <span
                          style={{
                            fontSize: "0.5rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: SEV_COLORS[c.severity],
                            padding: "0.1rem 0.35rem",
                            background: `${SEV_COLORS[c.severity]}15`,
                            borderRadius: "2px",
                            fontFamily: "monospace",
                          }}
                        >
                          {c.severity}
                        </span>
                      </div>

                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#F5F4EF", marginBottom: "0.2rem" }}>
                        {c.customer}
                      </div>

                      <div style={{ fontSize: "0.625rem", color: "#929292", fontFamily: "monospace", marginBottom: "0.5rem" }}>
                        {c.account} · {c.type}
                      </div>

                      {c.campaign && (
                        <div style={{ fontSize: "0.5625rem", color: "#FF4D4D", fontFamily: "monospace", marginBottom: "0.5rem" }}>
                          Linked to {c.campaign}
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #282828", paddingTop: "0.4rem", marginTop: "0.4rem", fontSize: "0.5625rem", color: "#929292", fontFamily: "monospace" }}>
                        <span style={{ color: "#F5F4EF", fontWeight: 600 }}>{c.exposure}</span>
                        <span>{c.owner}</span>
                      </div>
                    </div>
                  ))}
                  {colCases.length === 0 && (
                    <div style={{ padding: "2rem 1rem", fontSize: "0.625rem", color: "#929292", textAlign: "center", fontFamily: "monospace" }}>
                      Queue Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      
    </main>
  );
}
