"use client";

interface MetricCardProps {
  label: string;
  value: string;
  target?: string;
  met?: boolean;
  accent?: string;
  sub?: string;
}

export default function MetricCard({ label, value, target, met, accent, sub }: MetricCardProps) {
  const color = accent ?? (met === true ? "#39FF88" : met === false ? "#FF4D4D" : "#F4F4F0");

  return (
    <div
      style={{
        background: "#0D0D0D",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle accent glow strip on top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: color,
          opacity: 0.7,
        }}
      />

      {/* Label */}
      <div
        style={{
          fontSize: "0.5rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.4)",
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: "3rem",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color,
        }}
      >
        {value}
      </div>

      {/* Sub-text */}
      {sub && (
        <div style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.3)" }}>
          {sub}
        </div>
      )}

      {/* Goal indicator */}
      {target !== undefined && met !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "0.25rem",
          }}
        >
          <span
            style={{
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "0.15rem 0.5rem",
              background: met ? "rgba(57,255,136,0.1)" : "rgba(255,77,77,0.1)",
              border: `1px solid ${met ? "rgba(57,255,136,0.3)" : "rgba(255,77,77,0.3)"}`,
              color: met ? "#39FF88" : "#FF4D4D",
            }}
          >
            {met ? "PASS" : "FAIL"}
          </span>
          <span
            style={{
              fontSize: "0.5rem",
              color: "rgba(244,244,240,0.3)",
              letterSpacing: "0.06em",
            }}
          >
            Target: {target}
          </span>
        </div>
      )}
    </div>
  );
}
