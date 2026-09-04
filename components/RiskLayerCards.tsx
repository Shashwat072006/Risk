"use client";
import { useEffect, useRef, useState } from "react";

const LAYERS = [
  {
    heading: "SIGNALS",
    accent: "#00F6FF",
    num: "01",
    items: [
      { icon: "◌", name: "Device",   sub: "Fingerprint + browser" },
      { icon: "◎", name: "Identity", sub: "Email + phone velocity" },
      { icon: "≋", name: "Velocity", sub: "5-min txn rate" },
      { icon: "⌖", name: "Geo",      sub: "Distance anomaly" },
      { icon: "▣", name: "Payment",  sub: "Card + amount pattern" },
    ],
  },
  {
    heading: "MODELS",
    accent: "#E600FF",
    num: "02",
    items: [
      { icon: "→", name: "Fraud",      sub: "XGBoost · rule hybrid" },
      { icon: "→", name: "ATO",        sub: "Account takeover" },
      { icon: "→", name: "Chargeback", sub: "Dispute predictor" },
    ],
  },
  {
    heading: "DECISIONS",
    accent: "#39FF88",
    num: "03",
    items: [
      { icon: "↗", name: "Approve",   sub: "Score < 0.35" },
      { icon: "+", name: "Challenge", sub: "Score 0.35–0.70" },
      { icon: "×", name: "Block",     sub: "Score > 0.70" },
    ],
  },
];

export default function RiskLayerCards() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: "#050505", padding: "8rem 2.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "4rem" }}>
        <div style={{ fontSize: "0.5rem", color: "#444", letterSpacing: "0.12em", marginBottom: "1rem" }}>05 / LAYERS</div>
        <div
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            color: "#F4F4F0",
            opacity: visible ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
        >
          THREE RISK<br />
          <span style={{ color: "#39FF88" }}>LAYERS.</span>
        </div>
      </div>

      {/* Cards row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {LAYERS.map((layer, li) => (
          <div
            key={layer.num}
            style={{
              background: "#080808",
              padding: "2.5rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(20px)",
              transition: `opacity 700ms ease ${li * 120}ms, transform 700ms ease ${li * 120}ms`,
            }}
          >
            {/* Number + heading */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.5rem", color: "#444", letterSpacing: "0.1em" }}>{layer.num}</div>
              <div
                style={{
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: layer.accent,
                }}
              >
                {layer.heading}
              </div>
            </div>

            {/* Big label */}
            <div
              style={{
                fontSize: "3rem",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "#F4F4F0",
                lineHeight: 0.9,
                marginBottom: "2rem",
                borderBottom: `1px solid ${layer.accent}22`,
                paddingBottom: "1.5rem",
              }}
            >
              {layer.heading}
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {layer.items.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    padding: "0.625rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    transition: "border-color 250ms ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = `${layer.accent}30`)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.04)")}
                >
                  <span style={{ fontSize: "0.875rem", color: layer.accent, width: 18, textAlign: "center", flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#F4F4F0", letterSpacing: "0.03em" }}>{item.name}</div>
                    <div style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "0.05em", marginTop: "0.125rem" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
