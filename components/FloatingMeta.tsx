"use client";

interface FloatingMetaProps {
  label: string;
  value: string;
  accent?: string;
  style?: React.CSSProperties;
}

export default function FloatingMeta({ label, value, accent = "#39FF88", style }: FloatingMetaProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        ...style,
      }}
    >
      <span
        style={{
          fontSize: "0.5625rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#F4F4F0",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}
