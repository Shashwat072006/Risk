"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Case {
  id: string;
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
    { id: "CASE-2210", type: "Coordinated ATO",      severity: "CRITICAL", txnCount: 17, exposure: "INR 18.4L", owner: "Unassigned",   campaign: "#1842", opened: "Today 09:41" },
    { id: "CASE-2208", type: "Card Testing Burst",   severity: "HIGH",     txnCount: 31, exposure: "INR 2.1L",  owner: "Unassigned",   campaign: "#1839", opened: "Today 08:12" },
    { id: "CASE-2201", type: "Suspicious Wire",      severity: "MEDIUM",   txnCount: 1,  exposure: "INR 84,000",owner: "Unassigned",   opened: "Today 06:30" },
  ],
  INVESTIGATING: [
    { id: "CASE-2199", type: "Mule Network",         severity: "HIGH",     txnCount: 9,  exposure: "INR 6.7L",  owner: "Analyst 021",  campaign: "#1830", opened: "Yesterday" },
    { id: "CASE-2195", type: "Velocity Anomaly",     severity: "MEDIUM",   txnCount: 4,  exposure: "INR 1.2L",  owner: "Analyst 007",  opened: "Yesterday" },
  ],
  ESCALATED: [
    { id: "CASE-2188", type: "Synthetic Identity",   severity: "CRITICAL", txnCount: 23, exposure: "INR 42L",   owner: "Risk Manager",  opened: "2 days ago" },
  ],
  RESOLVED: [
    { id: "CASE-2180", type: "Card Not Present",     severity: "HIGH",     txnCount: 6,  exposure: "INR 3.4L",  owner: "Analyst 014",  opened: "3 days ago" },
    { id: "CASE-2174", type: "Promo Abuse",          severity: "MEDIUM",   txnCount: 12, exposure: "INR 0.9L",  owner: "Analyst 021",  opened: "4 days ago" },
  ],
};

const SEV_COLORS: Record<string, string> = {
  CRITICAL: "#FF4D4D",
  HIGH:     "#FFA31A",
  MEDIUM:   "#00F6FF",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN:          "#FF4D4D",
  INVESTIGATING: "#00F6FF",
  ESCALATED:     "#E600FF",
  RESOLVED:      "#39FF88",
};

export default function CasesPage() {
  const [cases, setCases] = useState(INITIAL_CASES);
  const [dragging, setDragging] = useState<{ caseId: string; fromCol: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const COLUMNS = ["OPEN", "INVESTIGATING", "ESCALATED", "RESOLVED"] as const;

  function onDrop(toCol: string) {
    if (!dragging || dragging.fromCol === toCol) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    setCases((prev) => {
      const fromArr = [...prev[dragging.fromCol]];
      const idx = fromArr.findIndex((c) => c.id === dragging.caseId);
      if (idx === -1) return prev;
      const [moved] = fromArr.splice(idx, 1);
      const toArr = [...prev[toCol], moved];
      return { ...prev, [dragging.fromCol]: fromArr, [toCol]: toArr };
    });
    setDragging(null);
    setDragOver(null);
  }

  const totalOpen = cases.OPEN.length + cases.INVESTIGATING.length + cases.ESCALATED.length;
  const totalExposure = "INR 75.8L";

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
            <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#00F6FF", marginBottom: "1rem" }}>
              Analyst Workspace
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F4F4F0", textTransform: "uppercase", margin: 0 }}>
              Case
              <br />
              Management
            </h1>
            <p style={{ maxWidth: 400, fontSize: "0.75rem", color: "rgba(244,244,240,0.4)", lineHeight: 1.6, marginTop: "1rem" }}>
              Drag cases between columns to update status. All actions are audit-logged.
            </p>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              { label: "Open Cases",     value: totalOpen.toString(),  color: "#FF4D4D" },
              { label: "Total Exposure", value: totalExposure,          color: "#FFA31A" },
              { label: "Resolved Today", value: "2",                   color: "#39FF88" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color, letterSpacing: "-0.04em" }}>{s.value}</div>
                <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginTop: "0.25rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kanban board */}
      <section style={{ padding: "3rem 2.5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", alignItems: "start" }}>
          {COLUMNS.map((col) => {
            const colColor = STATUS_COLORS[col];
            const colCases = cases[col];
            const isOver = dragOver === col;

            return (
              <div
                key={col}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => onDrop(col)}
                style={{
                  background: isOver ? `${colColor}08` : "transparent",
                  border: isOver ? `1px dashed ${colColor}55` : "1px solid rgba(255,255,255,0.04)",
                  minHeight: 200,
                  transition: "background 150ms ease, border-color 150ms ease",
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    borderBottom: `1px solid ${colColor}22`,
                    background: `${colColor}08`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: colColor }} />
                    <span style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: colColor }}>
                      {col}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      color: "rgba(244,244,240,0.4)",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {colCases.length}
                  </span>
                </div>

                {/* Cases */}
                <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {colCases.map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={() => setDragging({ caseId: c.id, fromCol: col })}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                      style={{
                        background: "#0A0A0A",
                        border: `1px solid rgba(255,255,255,0.06)`,
                        borderLeft: `3px solid ${SEV_COLORS[c.severity]}`,
                        padding: "1rem",
                        cursor: "grab",
                        opacity: dragging?.caseId === c.id ? 0.4 : 1,
                        transition: "opacity 150ms ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.5rem", fontWeight: 700, color: SEV_COLORS[c.severity], fontFamily: "monospace" }}>
                          {c.id}
                        </span>
                        <span
                          style={{
                            fontSize: "0.4rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: SEV_COLORS[c.severity],
                            padding: "0.15rem 0.35rem",
                            border: `1px solid ${SEV_COLORS[c.severity]}44`,
                          }}
                        >
                          {c.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.625rem", fontWeight: 600, color: "#F4F4F0", marginBottom: "0.5rem" }}>
                        {c.type}
                      </div>
                      {c.campaign && (
                        <div style={{ fontSize: "0.45rem", color: "#FF4D4D", letterSpacing: "0.06em", marginBottom: "0.375rem" }}>
                          Campaign {c.campaign}
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.625rem" }}>
                        <span style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.35)" }}>
                          {c.txnCount} txn · {c.exposure}
                        </span>
                        <span style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.25)" }}>
                          {c.opened}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.3)", marginTop: "0.375rem" }}>
                        {c.owner}
                      </div>
                    </div>
                  ))}
                  {colCases.length === 0 && (
                    <div style={{ padding: "2rem 1rem", fontSize: "0.5rem", color: "rgba(244,244,240,0.15)", textAlign: "center", letterSpacing: "0.06em" }}>
                      No cases
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
