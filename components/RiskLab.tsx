"use client";
import { useEffect, useRef, useState } from "react";

export default function RiskLab() {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="lab"
      ref={ref}
      style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8rem 0" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          minHeight: 560,
          alignItems: "stretch",
        }}
      >
        {/* Left: Text panel */}
        <div
          style={{
            padding: "4rem 2.5rem 4rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Section number */}
          <div style={{ fontSize: "0.5rem", color: "#444", letterSpacing: "0.12em" }}>06 / RESEARCH</div>

          {/* Giant stacked heading */}
          <div>
            {["RISK", "LAB"].map((word, i) => (
              <div
                key={word}
                style={{
                  fontSize: "clamp(5rem, 12vw, 9rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.06em",
                  lineHeight: 0.85,
                  color: i === 1 ? "#39FF88" : "#F4F4F0",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(24px)",
                  transition: `opacity 700ms ease ${i * 90}ms, transform 700ms ease ${i * 90}ms`,
                }}
              >
                {word}
              </div>
            ))}

            {/* Tagline */}
            <div
              style={{
                fontSize: "0.8125rem",
                color: "#555",
                lineHeight: 1.6,
                marginTop: "1.5rem",
                maxWidth: 340,
                opacity: visible ? 1 : 0,
                transition: "opacity 700ms ease 250ms",
              }}
            >
              Experiment. Evaluate. Deploy.
            </div>
            <div
              style={{
                fontSize: "0.8125rem",
                color: "#444",
                lineHeight: 1.6,
                maxWidth: 340,
                marginTop: "0.5rem",
                opacity: visible ? 1 : 0,
                transition: "opacity 700ms ease 320ms",
              }}
            >
              Research, evaluation and model iteration for real-time fraud, account takeover and chargeback risk.
            </div>
          </div>

          {/* Version badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 700ms ease 450ms",
            }}
          >
            {[
              { label: "Model v23", color: "#39FF88" },
              { label: "Rules v41", color: "#00F6FF" },
              { label: "Feature set 8.2", color: "#FFA31A" },
            ].map(({ label, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color,
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: color, display: "block", flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Large image / visual with slow zoom */}
        <div
          ref={imgRef}
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#080808",
            opacity: visible ? 1 : 0,
            transition: "opacity 900ms ease 100ms",
          }}
        >
          {/* Slow-zoom art block */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: visible ? "scale(1.04)" : "scale(1.00)",
              transition: "transform 2000ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 200ms",
            }}
          >
            {/* SVG editorial research art */}
            <svg width="100%" height="100%" viewBox="0 0 600 560" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="rg" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(57,255,136,0.05)" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="cg2" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#39FF88" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#050505" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="600" height="560" fill="#080808" />
              <rect width="600" height="560" fill="url(#rg)" />
              <rect width="600" height="560" fill="url(#cg2)" />

              {/* Model accuracy scatter plot */}
              {[
                [80, 120], [160, 90], [240, 140], [320, 80], [400, 110], [480, 70], [540, 90],
                [100, 200], [200, 180], [300, 160], [400, 175], [500, 155],
                [120, 300], [220, 280], [340, 260], [450, 270], [520, 255],
                [80, 400], [180, 380], [280, 370], [380, 360], [480, 375],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2}
                  fill={i % 4 === 0 ? "#39FF88" : i % 4 === 1 ? "#E600FF" : i % 4 === 2 ? "#00F6FF" : "#FFA31A"}
                  opacity={0.5 + (i % 3) * 0.2}
                />
              ))}

              {/* Trend line */}
              <path
                d="M80 400 Q200 340 300 280 Q400 220 480 130 Q520 100 540 80"
                fill="none"
                stroke="#39FF88"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="4 4"
              />

              {/* Axes */}
              <line x1="60" y1="30" x2="60" y2="450" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <line x1="60" y1="450" x2="570" y2="450" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

              {/* Axis labels */}
              <text x="45" y="240" fontSize="7" fill="#555" letterSpacing="0.08em" textAnchor="middle" transform="rotate(-90,45,240)">PRECISION</text>
              <text x="315" y="475" fontSize="7" fill="#555" letterSpacing="0.08em" textAnchor="middle">RECALL</text>

              {/* Version tag */}
              <rect x="460" y="30" width="90" height="20" rx="1" fill="none" stroke="rgba(57,255,136,0.3)" />
              <text x="505" y="43" fontSize="6.5" fill="#39FF88" textAnchor="middle" letterSpacing="0.08em">MODEL v23</text>
            </svg>
          </div>

          {/* Overlay gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #050505 0%, transparent 20%, transparent 80%, #050505 100%)" }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="1fr 1.2fr"] { grid-template-columns: 1fr !important; }
          div[style*="borderRight"] { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>
    </section>
  );
}
