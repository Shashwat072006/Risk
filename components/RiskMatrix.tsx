"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RISKS = [
  {
    id: "CARD FRAUD",
    title: "Card-Testing Detection",
    desc: "Detect rapid sequential small-value transactions, BIN enumeration, and failure-then-success patterns in real time before the first successful charge completes.",
  },
  {
    id: "ACCOUNT TAKEOVER",
    title: "Account Takeover Signals",
    desc: "Identify suspicious login patterns, credential stuffing fingerprints, and device-account mismatches that precede account compromise and fraudulent transactions.",
  },
  {
    id: "PAYMENT VELOCITY",
    title: "Velocity Abuse Control",
    desc: "Track transactions per minute, per device, per IP — surfacing burst patterns and limiting financial exposure before velocity-abuse fraud scales.",
  },
  {
    id: "DEVICE RISK",
    title: "Device Graph Analysis",
    desc: "Map device-to-account fanout, detect emulator and root signals, and build device reputation scores that persist across sessions and merchants.",
  },
  {
    id: "GEO ANOMALY",
    title: "Geographic Anomaly Engine",
    desc: "Flag billing-to-IP country mismatches, impossible travel paths, and high-risk ASN origins that correlate with international card-not-present fraud.",
  },
  {
    id: "CHARGEBACK",
    title: "Chargeback Prediction",
    desc: "Score each transaction's chargeback probability using historical dispute patterns, merchant category risk tiers, and BIN-level outcome history.",
  },
  {
    id: "PROMO ABUSE",
    title: "Promo & Referral Abuse",
    desc: "Detect synthetic account clusters, multi-account promotion stacking, and coordinated referral fraud before promotional budgets are drained.",
  },
  {
    id: "BOT ACTIVITY",
    title: "Bot & Automation Detection",
    desc: "Identify headless browser fingerprints, automation timing patterns, and API abuse signatures that indicate programmatic fraud attacks.",
  },
  {
    id: "MONEY MOVEMENT",
    title: "Suspicious Money Movement",
    desc: "Surface structuring patterns, mule account routing, and layering behavior that may indicate money laundering through payment channels.",
  },
];

// Simple SVG network canvas
function NetworkSVG({ activeIndex }: { activeIndex: number }) {
  const nodes = [
    { cx: 50, cy: 20 }, { cx: 150, cy: 10 }, { cx: 250, cy: 25 },
    { cx: 20, cy: 110 }, { cx: 120, cy: 100 }, { cx: 220, cy: 95 },
    { cx: 80, cy: 185 }, { cx: 170, cy: 200 }, { cx: 260, cy: 180 },
  ];
  const edges = [
    [0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,7],[5,8],[6,7],[7,8],[0,4],[1,5],[4,8],
  ];
  const activeNode = activeIndex % nodes.length;

  return (
    <svg viewBox="0 0 280 210" style={{ width: "100%", height: "100%" }}>
      {edges.map(([a, b], i) => {
        const connected = a === activeNode || b === activeNode;
        return (
          <line
            key={i}
            x1={nodes[a].cx} y1={nodes[a].cy}
            x2={nodes[b].cx} y2={nodes[b].cy}
            stroke={connected ? "#0ed39a" : "rgba(255,255,255,0.15)"}
            strokeWidth={connected ? 1.5 : 0.8}
            style={{ transition: "stroke 400ms ease, stroke-width 400ms ease" }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx} cy={n.cy} r={i === activeNode ? 7 : 5}
          fill="none"
          stroke={i === activeNode ? "#0ed39a" : "rgba(255,255,255,0.3)"}
          strokeWidth={i === activeNode ? 2 : 1}
          style={{ transition: "all 400ms ease" }}
        />
      ))}
    </svg>
  );
}

export default function RiskMatrix() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        listRef.current?.querySelectorAll(".risk-row") ?? [],
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: "power2.out",
          scrollTrigger: { trigger: listRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "#050505", padding: "7rem 2.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="label" style={{ marginBottom: "3rem" }}>Risk Intelligence Matrix</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3rem", alignItems: "start" }}>
        {/* Left — risk list */}
        <div ref={listRef}>
          {RISKS.map((risk, i) => (
            <div
              key={risk.id}
              className="risk-row"
              onClick={() => setActive(i)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.85rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                cursor: "pointer",
                opacity: 0,
                transition: "color 200ms",
                color: active === i ? "#0ed39a" : "#f7f7f2",
              }}
              onMouseEnter={e => { if (active !== i) e.currentTarget.style.color = "#a1a1a1"; }}
              onMouseLeave={e => { if (active !== i) e.currentTarget.style.color = "#f7f7f2"; }}
            >
              <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {risk.id}
              </span>
              <span style={{ fontSize: "0.75rem", color: active === i ? "#0ed39a" : "#a1a1a1" }}>↗</span>
            </div>
          ))}
        </div>

        {/* Center — network */}
        <div style={{ height: "280px" }}>
          <NetworkSVG activeIndex={active} />
        </div>

        {/* Right — detail panel */}
        <div style={{ paddingTop: "1rem" }}>
          <div className="label" style={{ marginBottom: "1rem" }}>{RISKS[active].id}</div>
          <h3 style={{
            fontSize: "clamp(1.4rem, 2vw, 1.9rem)",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
            color: "#f7f7f2",
          }}>
            {RISKS[active].title}
          </h3>
          <p style={{ color: "#a1a1a1", lineHeight: 1.7, fontSize: "0.9rem" }}>
            {RISKS[active].desc}
          </p>
        </div>
      </div>
    </section>
  );
}
