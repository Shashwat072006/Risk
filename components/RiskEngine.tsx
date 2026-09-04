"use client";
import { useEffect, useRef, useState } from "react";
import EngineCard from "./EngineCard";

const CARDS = [
  {
    num: "01",
    title: "RULE ENGINE",
    subtitle: "Deterministic controls",
    accent: "#39FF88",
    items: ["velocity_5m — txn rate check", "device_novelty — new fingerprint", "geo_anomaly — location mismatch", "high_value_new — amount threshold"],
  },
  {
    num: "02",
    title: "FEATURE ENGINE",
    subtitle: "Real-time context",
    accent: "#00F6FF",
    items: ["Device fingerprint + IP reputation", "User velocity & behavioral history", "Merchant + payment profile", "Geo-distance from last known"],
  },
  {
    num: "03",
    title: "MODEL ENGINE",
    subtitle: "Adaptive ML scoring",
    accent: "#E600FF",
    items: ["XGBoost hybrid scorer", "Rule weight: 0.40 · ML weight: 0.60", "Feature set 8.2 · 13 signals", "SHAP explainability layer"],
  },
  {
    num: "04",
    title: "DECISION ENGINE",
    subtitle: "One outcome in ms",
    accent: "#FFA31A",
    items: ["ALLOW  — score < 0.35", "REVIEW — score 0.35–0.70", "BLOCK  — score > 0.70", "Audit log written on every txn"],
  },
];

const ROW_ITEMS = [
  { label: "Rules", body: "Deterministic controls that act immediately." },
  { label: "Model", body: "Adaptive scoring based on historical behavior." },
  { label: "Signals", body: "Real-time context from device, identity, network, payment and velocity." },
  { label: "Decision", body: "One explainable outcome in milliseconds." },
];

export default function RiskEngine() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="engine"
      ref={ref}
      style={{ background: "#050505", padding: "8rem 2.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Top layout: heading left + rows right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", marginBottom: "5rem", alignItems: "start" }}>
        {/* Left: Giant stacked heading */}
        <div>
          {["MEET", "THE", "RISK", "ENGINE."].map((word, i) => (
            <div
              key={word}
              style={{
                fontSize: "clamp(4rem, 9vw, 7.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.055em",
                lineHeight: 0.88,
                color: i === 2 ? "#39FF88" : "#F4F4F0",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(28px)",
                transition: `opacity 700ms ease ${i * 90}ms, transform 700ms ease ${i * 90}ms`,
              }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* Right: Explanation rows */}
        <div style={{ paddingTop: "1rem" }}>
          {ROW_ITEMS.map(({ label, body }, i) => (
            <div
              key={label}
              style={{
                padding: "1.5rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transition: `opacity 600ms ease ${200 + i * 80}ms, transform 600ms ease ${200 + i * 80}ms`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
                <div style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#39FF88", flexShrink: 0, paddingTop: "0.125rem" }}>
                  {label}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#666", lineHeight: 1.6 }}>{body}</div>
                <div style={{ fontSize: "0.6rem", color: "#333", flexShrink: 0 }}>→</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Engine Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          opacity: visible ? 1 : 0,
          transition: "opacity 700ms ease 500ms",
        }}
      >
        {CARDS.map((card) => (
          <EngineCard key={card.num} {...card} />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 3rem !important; }
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
