"use client";
import { useEffect, useRef, useState } from "react";

export default function ProtectSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#050505",
        padding: "8rem 2.5rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "5rem",
        alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: Editorial visual / security art */}
      <div
        style={{
          position: "relative",
          height: 520,
          opacity: visible ? 1 : 0,
          transition: "opacity 900ms ease 100ms",
        }}
      >
        {/* Main dark image block */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0a0a14, #08080f)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            transform: visible ? "none" : "scale(0.97)",
            transition: "transform 900ms ease 100ms",
          }}
        >
          {/* Shield SVG art */}
          <svg width="100%" height="100%" viewBox="0 0 400 520" style={{ opacity: 0.85 }}>
            {/* Background grid */}
            <defs>
              <pattern id="pg" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(57,255,136,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="520" fill="url(#pg)" />

            {/* Central shield outline */}
            <path
              d="M200 80 L310 130 L310 280 Q310 380 200 430 Q90 380 90 280 L90 130 Z"
              fill="none"
              stroke="rgba(57,255,136,0.2)"
              strokeWidth="1"
            />
            <path
              d="M200 100 L295 145 L295 275 Q295 365 200 408 Q105 365 105 275 L105 145 Z"
              fill="rgba(57,255,136,0.03)"
              stroke="rgba(57,255,136,0.08)"
              strokeWidth="0.5"
            />

            {/* Central check / risk icon */}
            <circle cx="200" cy="255" r="35" fill="none" stroke="rgba(57,255,136,0.3)" strokeWidth="1" />
            <circle cx="200" cy="255" r="20" fill="rgba(57,255,136,0.06)" stroke="rgba(57,255,136,0.2)" strokeWidth="0.5" />
            <text x="200" y="260" textAnchor="middle" fontSize="16" fill="#39FF88" opacity="0.8">→</text>

            {/* Floating data lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={100 + i * 40}
                y1={450}
                x2={100 + i * 40}
                y2={420 - i * 5}
                stroke={i % 2 === 0 ? "#39FF88" : "#E600FF"}
                strokeWidth="1"
                opacity="0.25"
              />
            ))}

            {/* Corner labels */}
            <text x="20" y="50" fontSize="6" fill="#39FF88" opacity="0.5" letterSpacing="0.1em">DEFENSE LAYER</text>
            <text x="290" y="490" fontSize="6" fill="#E600FF" opacity="0.5" letterSpacing="0.1em" textAnchor="end">RISK//ACTIVE</text>

            {/* Cyan corner accent */}
            <path d="M370 20 L395 20 L395 45" fill="none" stroke="#00F6FF" strokeWidth="1" opacity="0.4" />
            <path d="M5 475 L5 500 L30 500" fill="none" stroke="#00F6FF" strokeWidth="1" opacity="0.4" />
          </svg>

          {/* Live badge overlay */}
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(5,5,5,0.8)",
              border: "1px solid rgba(57,255,136,0.3)",
              borderRadius: 2,
              padding: "0.35rem 0.6rem",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#39FF88", flexShrink: 0, animation: "livePulse 2s infinite" }} />
            <span style={{ fontSize: "0.45rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#39FF88" }}>
              RISK//ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Right: Statement block */}
      <div>
        {/* Section number */}
        <div style={{ fontSize: "0.5rem", color: "#444", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
          02 / PROTECT
        </div>

        {/* Giant headline */}
        {["WE'RE BUILDING", "THE NEXT GENERATION", "OF TRANSACTION", "DEFENSE."].map((line, i) => (
          <div
            key={line}
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              color: "#F4F4F0",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(20px)",
              transition: `opacity 700ms ease ${i * 80}ms, transform 700ms ease ${i * 80}ms`,
            }}
          >
            {line}
          </div>
        ))}

        {/* Body */}
        <p
          style={{
            fontSize: "0.875rem",
            color: "#666",
            lineHeight: 1.65,
            marginTop: "2rem",
            maxWidth: 380,
            opacity: visible ? 1 : 0,
            transition: "opacity 700ms ease 380ms",
          }}
        >
          One decision layer for fraud detection, risk scoring, intervention, and feedback.
        </p>

        {/* CTA */}
        <div style={{ marginTop: "2rem", opacity: visible ? 1 : 0, transition: "opacity 700ms ease 450ms" }}>
          <a href="#collage" className="arrow-btn">
            Explore risk intelligence <span className="arr">→</span>
          </a>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            opacity: visible ? 1 : 0,
            transition: "opacity 700ms ease 500ms",
          }}
        >
          {[
            { label: "Fraud Types Caught", value: "4+" },
            { label: "Decision Accuracy", value: "100%" },
            { label: "Avg Latency", value: "42ms" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#F4F4F0" }}>{value}</div>
              <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#555" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 768px) {
          section { grid-template-columns: 1fr !important; padding: 5rem 1.25rem !important; }
          div[style*="height: 520px"] { height: 280px !important; }
        }
      `}</style>
    </section>
  );
}
