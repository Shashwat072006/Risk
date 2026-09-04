"use client";

interface EngineCardProps {
  num: string;
  title: string;
  subtitle: string;
  items: string[];
  accent: string;
}

export default function EngineCard({ num, title, subtitle, items, accent }: EngineCardProps) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 2,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        cursor: "default",
        transition: "transform 450ms ease, border-color 450ms ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* Accent line on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: accent,
          opacity: 0.5,
        }}
      />

      {/* Number */}
      <div
        style={{
          fontSize: "0.5rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#444",
        }}
      >
        {num}
      </div>

      {/* Title */}
      <div>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "#F4F4F0",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "0.625rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accent,
            marginTop: "0.5rem",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Item list */}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
        {items.map((item) => (
          <li
            key={item}
            style={{
              fontSize: "0.75rem",
              color: "#555",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ color: accent, fontSize: "0.5rem", opacity: 0.7 }}>→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
