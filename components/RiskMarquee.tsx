"use client";
import { useEffect, useRef } from "react";

const WORDS = [
  { text: "VELOCITY", color: "#39FF88" },
  { text: "*", color: "#444" },
  { text: "DEVICE", color: "#00F6FF" },
  { text: "*", color: "#444" },
  { text: "IDENTITY", color: "#E600FF" },
  { text: "*", color: "#444" },
  { text: "BEHAVIOR", color: "#FFA31A" },
  { text: "*", color: "#444" },
  { text: "GEO", color: "#39FF88" },
  { text: "*", color: "#444" },
  { text: "NETWORK", color: "#00F6FF" },
  { text: "*", color: "#444" },
  { text: "PAYMENT", color: "#E600FF" },
  { text: "*", color: "#444" },
  { text: "CHARGEBACK", color: "#FFA31A" },
  { text: "*", color: "#444" },
];

export default function RiskMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let raf: number;
    const speed = 0.5; // px per frame

    const loop = () => {
      x -= speed;
      const w = el.scrollWidth / 2;
      if (Math.abs(x) >= w) x = 0;
      el.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const renderWords = () =>
    WORDS.map((word, i) => (
      <span
        key={i}
        style={{
          color: word.color,
          marginRight: "1.5rem",
          flexShrink: 0,
          fontStyle: word.text === "*" ? "normal" : "normal",
          opacity: word.text === "*" ? 0.4 : 1,
        }}
      >
        {word.text}
      </span>
    ));

  return (
    <section
      style={{
        background: "#050505",
        padding: "6rem 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Small label above */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span style={{ fontSize: "0.5625rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888" }}>
          Risk Signals
        </span>
      </div>

      {/* Marquee */}
      <div style={{ position: "relative" }}>
        {/* Fade masks */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "8%",
          background: "linear-gradient(90deg, #050505, transparent)",
          zIndex: 1, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "8%",
          background: "linear-gradient(270deg, #050505, transparent)",
          zIndex: 1, pointerEvents: "none",
        }} />

        {/* Track */}
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div
            ref={trackRef}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              willChange: "transform",
            }}
          >
            {/* Doubled for seamless loop */}
            {renderWords()}
            {renderWords()}
          </div>
        </div>
      </div>
    </section>
  );
}
