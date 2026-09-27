"use client";
import Link from "next/link";

export interface RiskEvent {
  txnId: string;
  timestamp: string;     // ISO
  decision: string;
  riskScore: number;
  topDriver: string;
  channel: string;
  amount: number;
  currency: string;
  merchant: string;
  campaignId?: string;
  note?: string;
}

interface Props {
  events: RiskEvent[];
  onInvestigate?: (txnId: string) => void;
}

const DECISION_COLOR: Record<string, string> = {
  ALLOW: "#39FF88",
  REVIEW: "#FFA31A",
  BLOCK: "#FF4D4D",
  "STEP-UP": "#FFA31A",
  "3DS": "#FFA31A",
};

function fmtTs(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

function riskColor(score: number): string {
  if (score >= 70) return "#FF4D4D";
  if (score >= 40) return "#FFA31A";
  return "#39FF88";
}

export default function RiskTimeline360({ events, onInvestigate }: Props) {
  if (events.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(244,244,240,0.2)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        No risk events on record
      </div>
    );
  }

  // Group by day
  const byDay: Record<string, RiskEvent[]> = {};
  events.forEach(ev => {
    const day = ev.timestamp.split("T")[0];
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(ev);
  });
  const days = Object.keys(byDay).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "0.25rem" }}>
            Risk Audit Trail
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F4F4F0", letterSpacing: "-0.01em" }}>
            Decision Timeline
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {Object.entries(DECISION_COLOR).map(([d, c]) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <div style={{ width: 6, height: 6, background: c, borderRadius: "50%" }} />
              <span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Vertical spine */}
        <div style={{
          position: "absolute",
          left: 120,
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(255,255,255,0.06)",
        }} />

        {days.map(day => {
          const dayEvents = byDay[day];
          const dayDate = new Date(day);
          const dayLabel = dayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

          return (
            <div key={day} style={{ marginBottom: "2.5rem" }}>
              {/* Day marker */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{
                  width: 120,
                  fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "rgba(244,244,240,0.25)", textAlign: "right", paddingRight: "1.25rem",
                }}>
                  {dayLabel}
                </div>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* Events for this day */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {dayEvents.map(ev => {
                  const dc = DECISION_COLOR[ev.decision] ?? "#888";
                  const rc = riskColor(ev.riskScore);
                  const { time } = fmtTs(ev.timestamp);
                  return (
                    <div key={ev.txnId} style={{ display: "flex", alignItems: "flex-start", gap: "0" }}>
                      {/* Time label */}
                      <div style={{
                        width: 120, flexShrink: 0,
                        paddingRight: "1.25rem", textAlign: "right",
                        fontSize: "0.5625rem", fontFamily: "monospace",
                        color: "rgba(244,244,240,0.3)", paddingTop: "1rem",
                      }}>
                        {time}
                      </div>

                      {/* Node on spine */}
                      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", marginTop: "0.875rem" }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: dc,
                          border: `2px solid ${dc}`,
                          boxShadow: `0 0 8px ${dc}55`,
                          position: "relative",
                          zIndex: 1,
                        }} />
                      </div>

                      {/* Card */}
                      <div style={{
                        flex: 1,
                        marginLeft: "1.25rem",
                        background: "#0A0A0A",
                        border: `1px solid ${dc}22`,
                        padding: "1rem 1.25rem",
                        transition: "border-color 200ms ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = `${dc}55`)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = `${dc}22`)}
                      >
                        {/* Top row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                          <span style={{
                            fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                            color: dc, padding: "0.15rem 0.5rem",
                            background: `${dc}14`, border: `1px solid ${dc}33`,
                          }}>
                            {ev.decision}
                          </span>
                          <span style={{ fontSize: "0.5625rem", fontFamily: "monospace", color: "rgba(244,244,240,0.3)" }}>
                            {ev.txnId}
                          </span>
                          {ev.campaignId && (
                            <span style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.08em", color: "#FF4D4D", padding: "0.125rem 0.375rem", border: "1px solid rgba(255,77,77,0.3)", background: "rgba(255,77,77,0.06)" }}>
                              CAMPAIGN {ev.campaignId}
                            </span>
                          )}
                        </div>

                        {/* Main detail row */}
                        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Merchant</div>
                            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#F4F4F0", marginTop: "0.125rem" }}>{ev.merchant}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Amount</div>
                            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#FF4D4D", marginTop: "0.125rem", fontFamily: "monospace" }}>
                              {ev.currency} {ev.amount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Risk Score</div>
                            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: rc, marginTop: "0.125rem" }}>{ev.riskScore}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Top Driver</div>
                            <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.55)", marginTop: "0.125rem" }}>{ev.topDriver}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Channel</div>
                            <div style={{
                              fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                              color: "rgba(244,244,240,0.4)", padding: "0.125rem 0.375rem",
                              border: "1px solid rgba(255,255,255,0.08)", marginTop: "0.25rem",
                            }}>
                              {ev.channel}
                            </div>
                          </div>
                        </div>

                        {/* Note */}
                        {ev.note && (
                          <div style={{ marginTop: "0.75rem", fontSize: "0.6875rem", color: "rgba(244,244,240,0.4)", lineHeight: 1.6, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "0.625rem" }}>
                            {ev.note}
                          </div>
                        )}

                        {/* Investigate link */}
                        <div style={{ marginTop: "0.75rem" }}>
                          {onInvestigate ? (
                            <button
                              onClick={() => onInvestigate(ev.txnId)}
                              style={{
                                background: "none", border: "none", cursor: "pointer", padding: 0,
                                fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                                color: "#39FF88",
                                display: "inline-flex", alignItems: "center", gap: "0.25rem",
                              }}
                            >
                              Deep Investigate →
                            </button>
                          ) : (
                            <Link
                              href={`/command-center?tab=investigate&id=${ev.txnId}`}
                              style={{
                                fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                                color: "#39FF88", textDecoration: "none",
                                display: "inline-flex", alignItems: "center", gap: "0.25rem",
                              }}
                            >
                              Deep Investigate →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
