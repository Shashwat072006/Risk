"use client";

interface TimelineEvent {
  time: string;
  label: string;
  type: "normal" | "risk" | "block" | "auth";
}

interface TimelineViewProps {
  events: TimelineEvent[];
  txnId?: string;
}

const TYPE_COLORS: Record<string, string> = {
  normal: "rgba(244,244,240,0.3)",
  risk:   "#FFA31A",
  block:  "#FF4D4D",
  auth:   "#FFA31A",
};

const DEMO_EVENTS: TimelineEvent[] = [
  { time: "09:41", label: "Login from known device",    type: "normal" },
  { time: "09:42", label: "Password change",             type: "risk" },
  { time: "09:43", label: "New device registered",       type: "risk" },
  { time: "09:44", label: "Beneficiary added",           type: "risk" },
  { time: "09:44", label: "Payment attempt — INR 84,000", type: "block" },
  { time: "09:45", label: "Step-up authentication sent", type: "auth" },
  { time: "09:45", label: "Step-up failed",              type: "block" },
];

export default function TimelineView({ events, txnId }: TimelineViewProps) {
  const display = events.length > 0 ? events : DEMO_EVENTS;

  return (
    <div>
      <div
        style={{
          fontSize: "0.5rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.35)",
          marginBottom: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Event Timeline</span>
        {txnId && (
          <span style={{ color: "rgba(244,244,240,0.2)", fontFamily: "monospace" }}>
            {txnId}
          </span>
        )}
      </div>

      <div style={{ position: "relative", paddingLeft: "2.5rem" }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "0.6875rem",
            top: 6,
            bottom: 6,
            width: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {display.map((ev, i) => {
            const col = TYPE_COLORS[ev.type];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  position: "relative",
                  padding: "0.625rem 0",
                  borderBottom: i < display.length - 1 ? "none" : "none",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: ev.type === "block" ? 10 : 7,
                    height: ev.type === "block" ? 10 : 7,
                    borderRadius: "50%",
                    background: col,
                    left: -29,
                    boxShadow: ev.type !== "normal" ? `0 0 6px ${col}88` : "none",
                  }}
                />
                {/* Time */}
                <span
                  style={{
                    fontSize: "0.5rem",
                    fontFamily: "monospace",
                    color: "rgba(244,244,240,0.25)",
                    letterSpacing: "0.06em",
                    minWidth: 36,
                    paddingTop: "0.1rem",
                  }}
                >
                  {ev.time}
                </span>
                {/* Label */}
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: ev.type === "normal" ? "rgba(244,244,240,0.65)" : col,
                    fontWeight: ev.type === "block" ? 600 : 400,
                    letterSpacing: ev.type === "block" ? "0.02em" : 0,
                  }}
                >
                  {ev.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
        {[
          { type: "normal", label: "Normal" },
          { type: "risk",   label: "Risk Signal" },
          { type: "auth",   label: "Authentication" },
          { type: "block",  label: "Blocked" },
        ].map(({ type, label }) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: TYPE_COLORS[type],
              }}
            />
            <span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.35)", letterSpacing: "0.08em" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { TimelineEvent };
