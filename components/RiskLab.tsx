"use client";
import { useEffect, useRef } from "react";

const DOTS_COLS = 18;
const DOTS_ROWS = 10;

function DotGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dots = container.querySelectorAll<HTMLDivElement>(".dot");

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      dots.forEach((dot) => {
        const drect = dot.getBoundingClientRect();
        const dx = drect.left + drect.width / 2 - rect.left - mx;
        const dy = drect.top + drect.height / 2 - rect.top - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;
        const scale = dist < maxDist ? 1 + (1 - dist / maxDist) * 1.2 : 1;
        dot.style.transform = `scale(${scale})`;
        dot.style.opacity = dist < maxDist ? `${0.25 + (1 - dist / maxDist) * 0.75}` : "0.25";
      });
    };

    const onMouseLeave = () => {
      dots.forEach((dot) => {
        dot.style.transform = "scale(1)";
        dot.style.opacity = "0.25";
      });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${DOTS_COLS}, 1fr)`,
        gap: "10px",
        padding: "1rem",
      }}
    >
      {Array.from({ length: DOTS_COLS * DOTS_ROWS }).map((_, i) => (
        <div
          key={i}
          className="dot"
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#050505",
            opacity: 0.25,
            transition: "transform 150ms ease, opacity 150ms ease",
          }}
        />
      ))}
    </div>
  );
}

const ARTICLES = [
  {
    category: "Research",
    title: "REAL-TIME\nFRAUD DEFENSE\nFOR MODERN\nPAYMENTS",
    time: "12 hours ago",
    author: "Risk Ops",
  },
  {
    category: "Engineering",
    title: "HOW HYBRID\nML+RULES\nOUTPERFORM\nBLACK-BOX AI",
    time: "2 days ago",
    author: "ML Team",
  },
];

export default function RiskLab() {
  const currentIdx = 0;
  const article = ARTICLES[currentIdx];

  return (
    <section style={{ background: "#f7f7f2", padding: "7rem 0", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", minHeight: "520px" }}>
        {/* Left — "OUR RISK LAB" with dot grid */}
        <div
          style={{
            padding: "3rem 2.5rem",
            borderRight: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="label" style={{ color: "#a1a1a1", marginBottom: "1.5rem" }}>
              Knowledge Base
            </div>
            {["OUR", "RISK", "LAB"].map((word, i) => (
              <div
                key={i}
                style={{
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  color: "#050505",
                }}
              >
                {word}
              </div>
            ))}
          </div>
          <DotGrid />
        </div>

        {/* Right — article panel */}
        <div
          style={{
            padding: "3rem 3rem",
            background: "#050505",
            color: "#f7f7f2",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Category */}
          <div style={{
            display: "inline-block",
            background: "#0ed39a",
            color: "#050505",
            padding: "0.3rem 0.9rem",
            borderRadius: "9999px",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            alignSelf: "flex-start",
          }}>
            {article.category}
          </div>

          {/* Large title */}
          <div style={{
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            whiteSpace: "pre-line",
            margin: "2rem 0",
          }}>
            {article.title}
          </div>

          {/* Bottom row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "1.25rem",
          }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {["←", "→"].map((arrow, i) => (
                <button
                  key={i}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#f7f7f2",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "background 200ms ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0ed39a")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {arrow}
                </button>
              ))}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#a1a1a1", letterSpacing: "0.05em" }}>
              {article.time} · {article.author}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
