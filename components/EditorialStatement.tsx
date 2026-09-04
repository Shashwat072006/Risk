"use client";
import { useEffect, useRef, useState } from "react";

export default function EditorialStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const lines = ["CATCH RISK", "BEFORE IT", "BECOMES LOSS."];

  return (
    <section
      ref={ref}
      style={{
        background: "#050505",
        padding: "10rem 2.5rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4rem",
        alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: Big editorial statement */}
      <div>
        {lines.map((line, i) => (
          <div
            key={line}
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.9,
              color: "#F4F4F0",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(24px)",
              transition: `opacity 700ms ease ${i * 90}ms, transform 700ms ease ${i * 90}ms`,
            }}
          >
            {line}
          </div>
        ))}

        <div
          style={{
            marginTop: "2.5rem",
            opacity: visible ? 1 : 0,
            transition: "opacity 700ms ease 350ms",
          }}
        >
          <a href="#engine" className="arrow-btn">
            Explore the engine <span className="arr">→</span>
          </a>
        </div>
      </div>

      {/* Right: Body copy + accent line */}
      <div
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          paddingLeft: "3rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 800ms ease 200ms",
        }}
      >
        {/* Accent label */}
        <div style={{ fontSize: "0.5625rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#39FF88", marginBottom: "1.5rem" }}>
          What we do
        </div>

        <p className="body-copy" style={{ color: "#888", marginBottom: "2rem" }}>
          A real-time transaction risk layer that combines behavioral signals, deterministic rules, and machine learning before authorization turns into fraud, dispute, or chargeback.
        </p>

        {/* Thin stat list */}
        {[
          { label: "Rule Engine", value: "< 2ms" },
          { label: "ML Inference", value: "< 12ms" },
          { label: "Full Decision", value: "< 42ms" },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.05em" }}>{label}</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#F4F4F0", letterSpacing: "0.04em" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Mobile */}
      <style>{`
        @media (max-width: 768px) {
          section { grid-template-columns: 1fr !important; padding: 5rem 1.25rem !important; }
          div[style*="borderLeft"] { border-left: none !important; padding-left: 0 !important; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 2rem; }
        }
      `}</style>
    </section>
  );
}
