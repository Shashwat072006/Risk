"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  { label: "Decision Confidence", value: "98.7%", sub: "average model certainty" },
  { label: "Fraud Prevented", value: "$4,403", sub: "per 1,000 transactions" },
  { label: "Avg Latency", value: "< 12ms", sub: "scoring + decision" },
  { label: "Recall", value: "≥ 85%", sub: "on held-out test set" },
];

export default function AbstractTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.querySelectorAll(".metric-float") ?? [],
        { opacity: 0, y: 30, scale: 0.93 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 75%" },
        }
      );

      // Subtle grid camera pan
      gsap.to(gridRef.current, {
        backgroundPosition: "20px 20px",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#050505",
        padding: "8rem 2.5rem",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Perspective grid background */}
      <div
        ref={gridRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(14,211,154,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(14,211,154,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(600px) rotateX(12deg)",
          transformOrigin: "50% 100%",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative" }}>
        <div className="label" style={{ marginBottom: "1rem" }}>Risk Signals</div>
        <div style={{ fontSize: "0.8rem", color: "#a1a1a1", letterSpacing: "0.05em" }}>
          ↓
        </div>
      </div>

      {/* Floating metric cards */}
      <div
        ref={cardsRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          maxWidth: "960px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {METRICS.map((m, i) => (
          <div
            key={i}
            className="metric-float"
            style={{
              background: "rgba(15,15,15,0.9)",
              border: "1px solid rgba(14,211,154,0.2)",
              borderRadius: "16px",
              padding: "2rem 1.75rem",
              opacity: 0,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="label" style={{ marginBottom: "0.75rem" }}>{m.label}</div>
            <div style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#0ed39a",
              lineHeight: 1,
              marginBottom: "0.5rem",
            }}>
              {m.value}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#a1a1a1", letterSpacing: "0.04em" }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
