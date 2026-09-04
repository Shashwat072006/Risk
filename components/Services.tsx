"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLS = [
  "Velocity", "Device Graph", "Geo Risk", "Payment Signals",
  "Behavior", "Historical Fraud", "BIN Analysis", "IP Reputation",
];

const CAPABILITIES = [
  "*REAL-TIME SCORING",
  "*BEHAVIOR ANALYSIS",
  "*CHARGEBACK PREDICTION",
  "*RULE ORCHESTRATION",
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pillsRef.current?.querySelectorAll(".pill") ?? [],
        { opacity: 0, scale: 0.82, y: 18 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.55, stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: pillsRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        capRef.current?.querySelectorAll(".cap-line") ?? [],
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: capRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#f7f7f2",
        color: "#050505",
        padding: "7rem 2.5rem",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5rem" }}>
        <h2 style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
          lineHeight: 1.0,
        }}>
          RISK ENGINE
        </h2>
        <a
          href="#"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#050505", textDecoration: "none",
            padding: "0.5rem 1.25rem",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "9999px",
            transition: "background 200ms ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#050505"; e.currentTarget.style.color = "#f7f7f2"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#050505"; }}
        >
          Explore <span style={{ transition: "transform 200ms", display: "inline-block" }}>→</span>
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        {/* Left — capability list */}
        <div ref={capRef}>
          {CAPABILITIES.map((c, i) => (
            <div
              key={i}
              className="cap-line"
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                padding: "1rem 0",
                borderBottom: i < CAPABILITIES.length - 1 ? "1px solid rgba(0,0,0,0.12)" : "none",
                opacity: 0,
              }}
            >
              {c}
            </div>
          ))}
        </div>

        {/* Right — floating pills around abstract center */}
        <div
          ref={pillsRef}
          style={{ position: "relative", height: "320px" }}
        >
          {/* Center abstract shape */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 120, height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0ed39a22, #0ed39a55)",
            border: "1px solid #0ed39a55",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 72, height: 72,
            borderRadius: "50%",
            background: "#0ed39a",
          }} />

          {/* Pills scattered around */}
          {PILLS.map((pill, i) => {
            const positions = [
              { top: "4%", left: "12%" }, { top: "12%", right: "5%" },
              { top: "38%", left: "0%" }, { top: "38%", right: "0%" },
              { bottom: "30%", left: "8%" }, { bottom: "25%", right: "8%" },
              { bottom: "5%", left: "22%" }, { bottom: "8%", right: "20%" },
            ];
            const pos = positions[i] || { top: "50%", left: "50%" };
            return (
              <div
                key={pill}
                className="pill"
                style={{
                  position: "absolute",
                  ...pos,
                  background: "#050505",
                  color: "#f7f7f2",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  opacity: 0,
                }}
              >
                {pill}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
