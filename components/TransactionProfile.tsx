"use client";
import { useEffect, useRef, useState } from "react";

const RULES = ["velocity_5m", "device_novelty", "geo_anomaly"];

export default function TransactionProfile() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
        // Animate score count up
        let current = 0;
        const target = 82;
        const step = () => {
          current = Math.min(current + 3, target);
          setScore(current);
          if (current < target) requestAnimationFrame(step);
        };
        setTimeout(() => requestAnimationFrame(step), 400);
      }
    }, { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: "#050505", padding: "8rem 2.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Section label */}
      <div style={{ fontSize: "0.5rem", color: "#444", letterSpacing: "0.12em", marginBottom: "4rem" }}>07 / INVESTIGATION</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        {/* Left: Large editorial typography block */}
        <div>
          {/* TX ID */}
          <div
            style={{
              fontSize: "0.5625rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#888",
              marginBottom: "0.5rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 700ms ease",
            }}
          >
            Transaction
          </div>
          <div
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#F4F4F0",
              marginBottom: "2.5rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(20px)",
              transition: "opacity 700ms ease 80ms, transform 700ms ease 80ms",
              fontFamily: "monospace",
            }}
          >
            #TX-948201
          </div>

          {/* Thin divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "2.5rem" }} />

          {/* Risk score — giant number */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: "0.5rem", opacity: visible ? 1 : 0, transition: "opacity 600ms ease 200ms" }}>
              Risk Score
            </div>
            <div
              style={{
                fontSize: "clamp(5rem, 12vw, 9rem)",
                fontWeight: 700,
                letterSpacing: "-0.06em",
                lineHeight: 0.85,
                color: "#ff4444",
                opacity: visible ? 1 : 0,
                transition: "opacity 700ms ease 150ms",
              }}
            >
              {score}
            </div>
          </div>

          {/* Decision */}
          <div style={{ marginBottom: "2.5rem", opacity: visible ? 1 : 0, transition: "opacity 700ms ease 250ms" }}>
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: "0.5rem" }}>Decision</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "rgba(255,68,68,0.1)", border: "1px solid rgba(255,68,68,0.35)", borderRadius: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4444" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff4444" }}>BLOCK</span>
            </div>
          </div>

          {/* Model */}
          <div style={{ opacity: visible ? 1 : 0, transition: "opacity 700ms ease 320ms" }}>
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: "0.5rem" }}>Model</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#F4F4F0", fontFamily: "monospace", letterSpacing: "0.04em" }}>fraud-v23</div>
          </div>
        </div>

        {/* Right: Rules + visual panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Rules triggered */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(16px)",
              transition: "opacity 700ms ease 350ms, transform 700ms ease 350ms",
            }}
          >
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: "1rem" }}>Rules Triggered</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {RULES.map((rule, i) => (
                <div
                  key={rule}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 2,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateX(-12px)",
                    transition: `opacity 600ms ease ${400 + i * 80}ms, transform 600ms ease ${400 + i * 80}ms`,
                  }}
                >
                  <span style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#FFA31A", letterSpacing: "0.04em" }}>{rule}</span>
                  <span style={{ fontSize: "0.5rem", color: "#ff4444", letterSpacing: "0.1em", fontWeight: 600 }}>HIT</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk score bar chart */}
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 2,
              padding: "1.5rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 700ms ease 600ms",
            }}
          >
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", marginBottom: "1rem" }}>Score Breakdown</div>
            {[
              { label: "Rules",   value: 0.40, color: "#FFA31A" },
              { label: "ML",      value: 0.60, color: "#E600FF" },
              { label: "Hybrid",  value: 0.82, color: "#ff4444" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ marginBottom: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "0.08em" }}>{label}</span>
                  <span style={{ fontSize: "0.6rem", color, fontWeight: 600, letterSpacing: "0.06em" }}>{(value * 100).toFixed(0)}</span>
                </div>
                <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: visible ? `${value * 100}%` : "0%",
                      background: color,
                      transition: "width 900ms cubic-bezier(0.25,0.46,0.45,0.94) 700ms",
                      borderRadius: 1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Floating diagram */}
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 2,
              padding: "1.5rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 700ms ease 700ms",
            }}
          >
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", marginBottom: "0.75rem" }}>Amount</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em", color: "#F4F4F0" }}>$4,820.00</div>
            <div style={{ fontSize: "0.5625rem", color: "#444", marginTop: "0.5rem", letterSpacing: "0.05em" }}>MCC: Electronics · IP: Lagos, NG · Card: US-issued</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
}
