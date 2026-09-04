"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ── Node definitions ──────────────────────────────────────────────────────────
const NODES = [
  {
    id: "user",     x: 160, y: 200, label: "USER",     icon: "U", color: "#39FF88",
    r: 22, tier: 1,
    desc: "Account age, prior chargebacks, trust score",
  },
  {
    id: "device",   x: 380, y: 100, label: "DEVICE",   icon: "D", color: "#00F6FF",
    r: 20, tier: 1,
    desc: "Fingerprint, age, novelty, multi-account detection",
  },
  {
    id: "payment",  x: 600, y: 100, label: "PAYMENT",  icon: "P", color: "#FFA31A",
    r: 20, tier: 1,
    desc: "Card BIN, amount, merchant risk tier, pattern",
  },
  {
    id: "network",  x: 820, y: 200, label: "NETWORK",  icon: "+", color: "#E600FF",
    r: 20, tier: 1,
    desc: "IP fanout, VPN/proxy, accounts per IP",
  },
  {
    id: "geo",      x: 260, y: 310, label: "GEO",      icon: "G", color: "#39FF88",
    r: 16, tier: 2,
    desc: "Billing vs IP country mismatch, high-risk region",
  },
  {
    id: "velocity", x: 490, y: 280, label: "VELOCITY", icon: "V", color: "#00F6FF",
    r: 18, tier: 2,
    desc: "Txn/hour, declines/hour, burst detection",
  },
  {
    id: "identity", x: 720, y: 310, label: "IDENTITY", icon: "I", color: "#E600FF",
    r: 16, tier: 2,
    desc: "Cards on device, failed-then-success, account age",
  },
  {
    id: "ml",       x: 490, y: 430, label: "ML MODEL", icon: "ML", color: "#F4F4F0",
    r: 26, tier: 3,
    desc: "XGBoost · 16 features · scale_pos_weight=4 · trained on 960 samples",
  },
  {
    id: "decision", x: 490, y: 540, label: "DECISION", icon: ">", color: "#39FF88",
    r: 22, tier: 4,
    desc: "ALLOW (<40) · REVIEW (40-65) · BLOCK (>65) in <50ms",
  },
];

const EDGES: Array<{ a: string; b: string; animated?: boolean }> = [
  { a: "user",    b: "geo" },
  { a: "user",    b: "velocity" },
  { a: "device",  b: "velocity" },
  { a: "device",  b: "identity" },
  { a: "payment", b: "velocity" },
  { a: "payment", b: "identity" },
  { a: "network", b: "identity" },
  { a: "network", b: "velocity" },
  { a: "geo",      b: "ml", animated: true },
  { a: "velocity", b: "ml", animated: true },
  { a: "identity", b: "ml", animated: true },
  { a: "user",    b: "ml", animated: true },
  { a: "device",  b: "ml", animated: true },
  { a: "payment", b: "ml", animated: true },
  { a: "network", b: "ml", animated: true },
  { a: "ml",      b: "decision", animated: true },
];

// Which nodes are connected to a given node
const connectedTo = (id: string) =>
  new Set(
    EDGES.flatMap(({ a, b }) => (a === id ? [b] : b === id ? [a] : []))
  );

// ── Animated pulse dot travelling along an edge ───────────────────────────────
interface PulseDot {
  id: number;
  edge: string;   // "a-b"
  t: number;      // 0 → 1
  speed: number;
  color: string;
}

let _dotId = 0;

export default function RiskCollage() {
  const [hovered, setHovered]   = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [mounted, setMounted]   = useState(false);
  const [dots, setDots]         = useState<PulseDot[]>([]);
  const [simActive, setSimActive] = useState(false);
  const [simDecision, setSimDecision] = useState<"ALLOW" | "REVIEW" | "BLOCK" | null>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── RAF loop for pulse dots ───────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      frameRef.current++;

      setDots((prev) => {
        // Move existing dots
        const moved = prev
          .map((d) => ({ ...d, t: d.t + d.speed * dt }))
          .filter((d) => d.t < 1);

        // Spawn new dots on animated edges occasionally
        const spawns: PulseDot[] = [];
        if (frameRef.current % 18 === 0) {
          const animEdges = EDGES.filter((e) => e.animated);
          const edge = animEdges[Math.floor(Math.random() * animEdges.length)];
          const na = NODES.find((n) => n.id === edge.a)!;
          spawns.push({
            id: ++_dotId,
            edge: `${edge.a}-${edge.b}`,
            t: 0,
            speed: 0.45 + Math.random() * 0.3,
            color: na.color,
          });
        }

        return [...moved, ...spawns];
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  // ── "Run simulation" — flood dots through whole graph ────────────────────
  const runSim = useCallback(() => {
    setSimActive(true);
    setSimDecision(null);

    // burst of dots
    const burst: PulseDot[] = EDGES.filter((e) => e.animated).flatMap((e) => {
      const na = NODES.find((n) => n.id === e.a)!;
      return Array.from({ length: 3 }, (_, i) => ({
        id: ++_dotId,
        edge: `${e.a}-${e.b}`,
        t: i * 0.12,
        speed: 0.55 + Math.random() * 0.2,
        color: na.color,
      }));
    });

    setDots((prev) => [...prev, ...burst]);

    // reveal decision after delay
    setTimeout(() => {
      const decisions: Array<"ALLOW" | "REVIEW" | "BLOCK"> = ["ALLOW", "REVIEW", "BLOCK"];
      setSimDecision(decisions[Math.floor(Math.random() * decisions.length)]);
      setTimeout(() => {
        setSimActive(false);
        setSimDecision(null);
      }, 3000);
    }, 2200);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const highlight = hovered ?? selected;
  const connected = highlight ? connectedTo(highlight) : null;

  const nodeOpacity = (id: string) => {
    if (!highlight) return 1;
    if (id === highlight) return 1;
    if (connected?.has(id)) return 0.85;
    return 0.15;
  };

  const edgeOpacity = (a: string, b: string) => {
    if (!highlight) return 0.25;
    if (a === highlight || b === highlight) return 0.9;
    return 0.04;
  };

  const edgeColor = (a: string, b: string) => {
    if (a === highlight || b === highlight) {
      const na = NODES.find((n) => n.id === a)!;
      return na.color;
    }
    return "rgba(255,255,255,0.15)";
  };

  const nodeScale = (id: string) => {
    if (!highlight) return 1;
    if (id === highlight) return 1.18;
    if (connected?.has(id)) return 1.05;
    return 0.92;
  };

  const pulse = (id: string, base: number) =>
    mounted ? base + Math.sin((Date.now() / 1400) + id.charCodeAt(0) * 0.8) * 2 : base;

  const activeNode = NODES.find((n) => n.id === (selected ?? hovered));

  const decisionColors = {
    ALLOW:  "#39FF88",
    REVIEW: "#FFA31A",
    BLOCK:  "#FF4D4D",
  };

  return (
    <section
      id="collage"
      style={{
        background: "#050505",
        padding: "8rem 2.5rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Section header ─────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.5rem",
              color: "#444",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            03 / INTELLIGENCE
          </div>
          <div
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: "#F4F4F0",
            }}
          >
            RISK SIGNAL
            <br />
            <span style={{ color: "#39FF88" }}>NETWORK</span>
          </div>
        </div>
        <div style={{ maxWidth: 340, textAlign: "right" }}>
          <p style={{ fontSize: "0.8125rem", color: "#555", lineHeight: 1.6, margin: 0 }}>
            Every fraud signal — velocity, device, geo, identity — flows into the ML model
            and produces a single explainable decision. Hover any node to trace its connections.
          </p>
          {/* Simulate button */}
          <button
            onClick={runSim}
            disabled={simActive}
            style={{
              marginTop: "1.25rem",
              padding: "0.6rem 1.5rem",
              background: simActive ? "rgba(57,255,136,0.05)" : "transparent",
              border: "1px solid rgba(57,255,136,0.4)",
              color: simActive ? "rgba(57,255,136,0.4)" : "#39FF88",
              fontSize: "0.5625rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: simActive ? "not-allowed" : "pointer",
              transition: "all 200ms ease",
            }}
          >
            {simActive ? "Processing..." : "Simulate Transaction"}
          </button>
        </div>
      </div>

      {/* ── Main canvas ────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* SVG graph */}
        <div
          style={{
            background: "#080808",
            border: "1px solid rgba(255,255,255,0.05)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Corner badge */}
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              zIndex: 10,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#39FF88",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#39FF88",
                fontWeight: 600,
              }}
            >
              Live Signal Graph
            </span>
          </div>

          {/* Decision overlay */}
          {simDecision && (
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                padding: "0.4rem 1rem",
                background: `${decisionColors[simDecision]}18`,
                border: `1px solid ${decisionColors[simDecision]}55`,
                color: decisionColors[simDecision],
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                zIndex: 10,
                animation: "none",
              }}
            >
              {simDecision}
            </div>
          )}

          <svg
            viewBox="0 0 1000 620"
            style={{ width: "100%", height: "auto", display: "block" }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Grid pattern */}
              <pattern id="cg2" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
              </pattern>

              {/* Glow filter for each node color */}
              {NODES.map((n) => (
                <filter key={`glow-${n.id}`} id={`glow-${n.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}

              {/* Radial gradient for ML node */}
              <radialGradient id="ml-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F4F4F0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#888" stopOpacity="0.3" />
              </radialGradient>

              {/* Arrow marker */}
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.2)" />
              </marker>
            </defs>

            {/* Background */}
            <rect width="1000" height="620" fill="url(#cg2)" />

            {/* Tier labels */}
            {[
              { y: 30,  label: "01 / INPUT SIGNALS",    x: 490 },
              { y: 250, label: "02 / DERIVED FEATURES", x: 490 },
              { y: 400, label: "03 / ML MODEL",         x: 490 },
              { y: 510, label: "04 / DECISION",         x: 490 },
            ].map((tier) => (
              <text
                key={tier.label}
                x={tier.x}
                y={tier.y}
                textAnchor="middle"
                fontSize="7"
                fill="rgba(255,255,255,0.1)"
                letterSpacing="0.15em"
                fontWeight="600"
              >
                {tier.label}
              </text>
            ))}

            {/* Horizontal tier dividers */}
            {[80, 250, 400, 500].map((y) => (
              <line
                key={y}
                x1="50" y1={y} x2="950" y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
                strokeDasharray="4 6"
              />
            ))}

            {/* ── Edges ──────────────────────────────────────────────── */}
            {EDGES.map(({ a, b, animated }) => {
              const na = NODES.find((n) => n.id === a)!;
              const nb = NODES.find((n) => n.id === b)!;
              const isActive = a === highlight || b === highlight;
              const col = edgeColor(a, b);
              const opacity = edgeOpacity(a, b);

              return (
                <g key={`${a}-${b}`}>
                  {/* Base line */}
                  <line
                    x1={na.x} y1={na.y}
                    x2={nb.x} y2={nb.y}
                    stroke={isActive ? col : "rgba(255,255,255,0.08)"}
                    strokeWidth={isActive ? 1.2 : 0.5}
                    opacity={opacity}
                    style={{ transition: "stroke 250ms ease, opacity 250ms ease, stroke-width 250ms ease" }}
                  />
                  {/* Animated edge glow when active */}
                  {isActive && (
                    <line
                      x1={na.x} y1={na.y}
                      x2={nb.x} y2={nb.y}
                      stroke={col}
                      strokeWidth="4"
                      opacity="0.08"
                      style={{ transition: "opacity 250ms ease" }}
                    />
                  )}
                </g>
              );
            })}

            {/* ── Pulse dots travelling along edges ──────────────────── */}
            {mounted && dots.map((dot) => {
              const [aId, bId] = dot.edge.split("-");
              const na = NODES.find((n) => n.id === aId);
              const nb = NODES.find((n) => n.id === bId);
              if (!na || !nb) return null;
              const x = na.x + (nb.x - na.x) * dot.t;
              const y = na.y + (nb.y - na.y) * dot.t;
              return (
                <g key={dot.id} suppressHydrationWarning>
                  {/* Glow */}
                  <circle cx={x} cy={y} r={5} fill={dot.color} opacity={0.15} />
                  {/* Core */}
                  <circle cx={x} cy={y} r={2.5} fill={dot.color} opacity={0.9 - dot.t * 0.3} />
                </g>
              );
            })}

            {/* ── Nodes ──────────────────────────────────────────────── */}
            {NODES.map((node) => {
              const scale = nodeScale(node.id);
              const opacity = nodeOpacity(node.id);
              const pR = pulse(node.id, node.r);
              const isHighlighted = node.id === highlight;
              const isConnected = connected?.has(node.id);

              return (
                <g
                  key={node.id}
                  suppressHydrationWarning
                  style={{
                    cursor: "pointer",
                    transition: "opacity 250ms ease",
                    opacity,
                  }}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected((s) => (s === node.id ? null : node.id))}
                >
                  {/* Outer glow ring (animated) */}
                  <circle
                    suppressHydrationWarning
                    cx="0" cy="0"
                    r={pR * 2.8}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="0.5"
                    opacity={isHighlighted ? 0.5 : 0.12}
                    style={{ transition: "opacity 250ms ease" }}
                  />

                  {/* Second ring */}
                  <circle
                    suppressHydrationWarning
                    cx="0" cy="0"
                    r={pR * 1.8}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="0.5"
                    opacity={isHighlighted ? 0.3 : 0.08}
                    style={{ transition: "opacity 250ms ease" }}
                  />

                  {/* Filled background glow */}
                  <circle
                    cx="0" cy="0"
                    r={node.r + 4}
                    fill={node.color}
                    opacity={isHighlighted ? 0.2 : isConnected ? 0.08 : 0.04}
                    style={{ transition: "opacity 250ms ease" }}
                  />

                  {/* Main circle */}
                  <circle
                    cx="0" cy="0"
                    r={node.r}
                    fill={node.id === "ml" ? "url(#ml-grad)" : node.color}
                    opacity={0.95}
                    style={{
                      transition: "r 250ms ease",
                    }}
                  />
                  {/* Scale transform on inner group */}
                  <g transform={`scale(${scale})`} style={{ transition: "transform 250ms ease" }}>
                    {/* Icon */}
                    <text
                      x="0" y="4"
                      textAnchor="middle"
                      fontSize={node.id === "ml" ? "12" : "10"}
                      fill={node.id === "ml" ? "#050505" : "#050505"}
                      fontWeight="800"
                      opacity="0.9"
                    >
                      {node.icon}
                    </text>
                  </g>

                  {/* Label */}
                  <text
                    x="0" y={node.r + 16}
                    textAnchor="middle"
                    fontSize="7.5"
                    fill={node.color}
                    opacity={isHighlighted ? 1 : 0.7}
                    letterSpacing="0.1em"
                    fontWeight="700"
                    style={{ transition: "opacity 250ms ease" }}
                  >
                    {node.label}
                  </text>

                  {/* Selected indicator */}
                  {selected === node.id && (
                    <circle
                      cx="0" cy="0"
                      r={node.r + 6}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.6"
                    />
                  )}
                </g>
              );
            })}

            {/* ── Decision outcomes ───────────────────────────────────── */}
            {[
              { x: 350, y: 592, label: "APPROVE", color: "#39FF88" },
              { x: 490, y: 592, label: "REVIEW",  color: "#FFA31A" },
              { x: 630, y: 592, label: "BLOCK",   color: "#FF4D4D" },
            ].map(({ x, y, label, color }) => {
              const isActive = simDecision === label || (!simDecision && label === "APPROVE");
              return (
                <g key={label}>
                  <rect
                    x={x - 46} y={y - 14}
                    width={92} height={20}
                    fill={color}
                    opacity={isActive ? 0.15 : 0.05}
                    rx="1"
                    style={{ transition: "opacity 400ms ease" }}
                  />
                  <rect
                    x={x - 46} y={y - 14}
                    width={92} height={20}
                    fill="none"
                    stroke={color}
                    strokeWidth={isActive ? 1 : 0.5}
                    opacity={isActive ? 0.7 : 0.25}
                    rx="1"
                    style={{ transition: "opacity 400ms ease, stroke-width 400ms ease" }}
                  />
                  <text
                    x={x} y={y + 1}
                    textAnchor="middle"
                    fontSize="7"
                    fill={color}
                    letterSpacing="0.12em"
                    fontWeight="700"
                    opacity={isActive ? 1 : 0.4}
                    style={{ transition: "opacity 400ms ease" }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Info panel ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Active node detail */}
          <div
            style={{
              background: "#0A0A0A",
              border: `1px solid ${activeNode ? activeNode.color + "33" : "rgba(255,255,255,0.06)"}`,
              padding: "1.5rem",
              minHeight: 160,
              transition: "border-color 300ms ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Accent left stripe */}
            <div
              style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: 2,
                background: activeNode ? activeNode.color : "transparent",
                transition: "background 300ms ease",
              }}
            />

            {!activeNode ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(244,244,240,0.2)",
                  textAlign: "center",
                }}
              >
                Hover or click a node<br />to inspect the signal
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: activeNode.color,
                      lineHeight: 1,
                    }}
                  >
                    {activeNode.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        color: activeNode.color,
                      }}
                    >
                      {activeNode.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.5rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(244,244,240,0.3)",
                        marginTop: "0.15rem",
                      }}
                    >
                      Tier {activeNode.tier} signal
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(244,244,240,0.65)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {activeNode.desc}
                </p>

                {/* Connected nodes */}
                <div style={{ marginTop: "1.25rem" }}>
                  <div
                    style={{
                      fontSize: "0.5rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(244,244,240,0.25)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Connected to
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {[...connectedTo(activeNode.id)].map((cid) => {
                      const cn = NODES.find((n) => n.id === cid)!;
                      return (
                        <span
                          key={cid}
                          style={{
                            fontSize: "0.5rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            padding: "0.2rem 0.5rem",
                            background: `${cn.color}11`,
                            border: `1px solid ${cn.color}33`,
                            color: cn.color,
                            cursor: "pointer",
                          }}
                          onMouseEnter={() => setHovered(cid)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          {cn.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Node legend */}
          <div
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.5rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(244,244,240,0.3)",
                marginBottom: "1rem",
              }}
            >
              Signal Legend
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {NODES.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    cursor: "pointer",
                    opacity: highlight && highlight !== n.id && !connected?.has(n.id) ? 0.3 : 1,
                    transition: "opacity 200ms ease",
                  }}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected((s) => (s === n.id ? null : n.id))}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: n.color,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.5625rem",
                      fontWeight: 600,
                      color: n.color,
                      letterSpacing: "0.08em",
                      minWidth: 64,
                    }}
                  >
                    {n.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.5rem",
                      color: "rgba(244,244,240,0.3)",
                      flex: 1,
                    }}
                  >
                    Tier {n.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "1.25rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {[
              { label: "Signal Nodes",  value: "9",   color: "#39FF88" },
              { label: "Edge Paths",    value: "16",  color: "#00F6FF" },
              { label: "Rules Engine",  value: "13×", color: "#E600FF" },
              { label: "ML Features",  value: "16×", color: "#FFA31A" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.5rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(244,244,240,0.3)",
                    marginTop: "0.25rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
