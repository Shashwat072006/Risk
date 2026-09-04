"use client";
import { useEffect, useRef, useState } from "react";
import FloatingMeta from "./FloatingMeta";

// ── Layer definitions ────────────────────────────────────────────────────────
const LAYERS = [
  { id: "bg",       depth: 0.02 },
  { id: "grid",     depth: 0.04 },
  { id: "green",    depth: 0.09 },
  { id: "center",   depth: 0.06 },
  { id: "purple",   depth: 0.12 },
  { id: "device",   depth: 0.08 },
  { id: "nodes",    depth: 0.05 },
  { id: "card",     depth: 0.10 },
  { id: "graph",    depth: 0.07 },
  { id: "labels",   depth: 0.03 },
  { id: "foreground", depth: 0.13 },
];

const FLOAT = [
  { id: "green",      amp: 4,  dur: 6000 },
  { id: "purple",     amp: 7,  dur: 8000 },
  { id: "center",     amp: 3,  dur: 5500 },
  { id: "nodes",      amp: 2,  dur: 7000 },
  { id: "labels",     amp: 1,  dur: 4500 },
  { id: "foreground", amp: 5,  dur: 9000 },
];

interface HeroWorldProps {
  mode?: "default" | "final";
}

export default function HeroWorld({ mode = "default" }: HeroWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse]     = useState({ x: 0, y: 0 });
  const [entered, setEntered] = useState(false);
  // mounted flag: keep all animated styles at their SSR-neutral value until
  // the client is hydrated, then allow the RAF loop to take over.
  const [mounted, setMounted] = useState(false);
  const rafRef   = useRef<number>(0);
  const startRef = useRef(0); // set after mount to avoid SSR mismatch

  // ── After hydration: start animations
  useEffect(() => {
    startRef.current = Date.now();
    setMounted(true);
    const t = setTimeout(() => setEntered(true), 80);

    // Force a re-render on each frame so layerStyle() values update live
    const loop = () => { rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Cursor parallax (only on client)
  useEffect(() => {
    if (!mounted) return;
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setMouse({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mounted]);

  // ── Returns {transform, transition} for a layer — neutral until mounted
  const layerStyle = (id: string): React.CSSProperties => {
    if (!mounted) return {};
    const layer  = LAYERS.find((l) => l.id === id);
    const depth  = layer?.depth ?? 0.05;
    const f      = FLOAT.find((l) => l.id === id);
    const floatY = f
      ? Math.sin(((Date.now() - startRef.current) / f.dur) * Math.PI * 2) * f.amp
      : 0;
    return {
      transform: `translate(${mouse.x * depth * -60}px, ${mouse.y * depth * -40 + floatY}px)`,
      transition: "transform 80ms linear",
    };
  };

  const isFinal = mode === "final";

  return (
    <section
      id={isFinal ? "live" : undefined}
      ref={containerRef}
      suppressHydrationWarning
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 600,
        background: "#050505",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Layer 01: Background grid ────────────────────────────────── */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(57,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57,255,136,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          ...layerStyle("grid"),
        }}
      />

      {/* ── Layer 03: Green holographic panel ───────────────────────── */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          top: "15%",
          right: "8%",
          width: 220,
          height: 140,
          border: "1px solid rgba(57,255,136,0.35)",
          borderRadius: 2,
          background: "rgba(57,255,136,0.04)",
          display: "flex",
          flexDirection: "column",
          padding: "0.75rem 1rem",
          gap: "0.5rem",
          ...layerStyle("green"),
        }}
      >
        <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", color: "#39FF88", textTransform: "uppercase" }}>
          Device Graph
        </div>
        <svg width="100%" height="80" viewBox="0 0 200 80" style={{ opacity: 0.8 }}>
          <circle cx="20" cy="40" r="3" fill="#39FF88" />
          <circle cx="80" cy="20" r="3" fill="#39FF88" />
          <circle cx="80" cy="60" r="3" fill="#E600FF" />
          <circle cx="140" cy="40" r="3" fill="#00F6FF" />
          <circle cx="185" cy="30" r="2" fill="#39FF88" opacity="0.5" />
          <circle cx="185" cy="55" r="2" fill="#E600FF" opacity="0.5" />
          <line x1="20" y1="40" x2="80" y2="20" stroke="#39FF88" strokeWidth="0.5" opacity="0.5" />
          <line x1="20" y1="40" x2="80" y2="60" stroke="#E600FF" strokeWidth="0.5" opacity="0.5" />
          <line x1="80" y1="20" x2="140" y2="40" stroke="#39FF88" strokeWidth="0.5" opacity="0.5" />
          <line x1="80" y1="60" x2="140" y2="40" stroke="#E600FF" strokeWidth="0.5" opacity="0.5" />
          <line x1="140" y1="40" x2="185" y2="30" stroke="#00F6FF" strokeWidth="0.5" opacity="0.4" />
          <line x1="140" y1="40" x2="185" y2="55" stroke="#00F6FF" strokeWidth="0.5" opacity="0.4" />
          <text x="12" y="56" fontSize="5" fill="#39FF88" opacity="0.6">USER</text>
          <text x="66" y="14" fontSize="5" fill="#39FF88" opacity="0.6">DEVICE</text>
          <text x="64" y="75" fontSize="5" fill="#E600FF" opacity="0.6">PAYMENT</text>
          <text x="125" y="36" fontSize="5" fill="#00F6FF" opacity="0.6">ML</text>
        </svg>
      </div>

      {/* ── Layer 06: Payment card (right) ───────────────────────────── */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          bottom: "18%",
          right: "14%",
          width: 160,
          height: 95,
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)",
          borderRadius: 8,
          border: "1px solid rgba(230,0,255,0.3)",
          padding: "0.875rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 0 40px rgba(230,0,255,0.15)",
          ...layerStyle("device"),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ width: 20, height: 14, background: "#FFA31A", borderRadius: 2, opacity: 0.9 }} />
          <div style={{ fontSize: "0.45rem", letterSpacing: "0.1em", color: "#E600FF" }}>INTERCEPTED</div>
        </div>
        <div style={{ fontSize: "0.5rem", letterSpacing: "0.25em", color: "rgba(244,244,240,0.5)", fontFamily: "monospace" }}>
          •••• •••• •••• 4821
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.35)", letterSpacing: "0.06em" }}>CARD HOLDER</div>
          <div style={{ fontSize: "0.45rem", color: "#E600FF", letterSpacing: "0.06em" }}>RISK 82</div>
        </div>
      </div>

      {/* ── Layer 08: Floating transaction card (left) ───────────────── */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          left: "6%",
          top: "28%",
          width: 170,
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          padding: "0.875rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          ...layerStyle("card"),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.5rem", letterSpacing: "0.12em", color: "#888", textTransform: "uppercase" }}>Transaction</span>
          <span style={{ fontSize: "0.5rem", color: "#39FF88", letterSpacing: "0.05em" }}>#TX-948201</span>
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>$4,820.00</div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4444", display: "block", flexShrink: 0 }} />
          <span style={{ fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#ff4444" }}>BLOCKED</span>
        </div>
        <div style={{ fontSize: "0.45rem", color: "#555", letterSpacing: "0.06em" }}>
          velocity_5m · device_novelty · geo_anomaly
        </div>
      </div>

      {/* ── Layer 09: Orange line graph (bottom-left) ────────────────── */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          bottom: "12%",
          left: "8%",
          ...layerStyle("graph"),
        }}
      >
        <svg width="200" height="60" viewBox="0 0 200 60">
          <polyline
            points="0,50 20,45 40,30 60,35 80,20 100,25 120,10 140,18 160,8 180,14 200,5"
            fill="none"
            stroke="#FFA31A"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <polyline
            points="0,50 20,45 40,30 60,35 80,20 100,25 120,10 140,18 160,8 180,14 200,5"
            fill="rgba(255,163,26,0.08)"
            stroke="none"
          />
          <text x="0" y="58" fontSize="5" fill="#FFA31A" opacity="0.5" letterSpacing="0.1em">RISK VELOCITY</text>
        </svg>
      </div>

      {/* ── Layer 10: Magenta light slash ───────────────────────────── */}
      {/* suppressHydrationWarning because transform uses mouse.x (client-only) */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: "3px",       // string, not number — avoids SSR "3px" vs number 3 mismatch
          height: "30%",
          background: "linear-gradient(180deg, transparent, #E600FF, transparent)",
          opacity: 0.25,
          // Only compute mouse-driven transform on client; neutral on SSR
          transform: mounted
            ? `translateX(-50%) rotate(22deg) translateX(${mouse.x * -8}px)`
            : "translateX(-50%) rotate(22deg)",
          ...layerStyle("purple"),
        }}
      />

      {/* ── Layer 11: Small floating labels ─────────────────────────── */}
      <div
        suppressHydrationWarning
        style={{ position: "absolute", inset: 0, ...layerStyle("labels") }}
      >
        {[
          { x: "12%", y: "55%", label: "◌ DEVICE",   color: "#39FF88" },
          { x: "72%", y: "70%", label: "◎ IDENTITY",  color: "#00F6FF" },
          { x: "28%", y: "80%", label: "≋ VELOCITY",  color: "#FFA31A" },
          { x: "88%", y: "48%", label: "⌖ GEO",       color: "#E600FF" },
        ].map((lbl) => (
          <div
            key={lbl.label}
            style={{
              position: "absolute",
              left: lbl.x,
              top: lbl.y,
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: lbl.color,
              textTransform: "uppercase",
              opacity: 0.65,
            }}
          >
            {lbl.label}
          </div>
        ))}
      </div>

      {/* ── HERO TYPOGRAPHY ─────────────────────────────────────────── */}
      <div
        suppressHydrationWarning
        className="hero-type-center"
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        {/* Top meta */}
        <div
          style={{
            fontSize: "0.5625rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#39FF88",
            marginBottom: "1.5rem",
            opacity: entered ? 1 : 0,
            transform: entered ? "none" : "translateY(12px)",
            transition: "opacity 600ms ease 100ms, transform 600ms ease 100ms",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#39FF88", display: "inline-block" }} />
          {isFinal ? "RISK ENGINE LIVE" : "FRAUD + CHARGEBACK DEFENSE"}
        </div>

        {/* Giant headline */}
        {(isFinal
          ? ["REAL-TIME", "RISK", "OVERVIEW"]
          : ["REAL-TIME", "TRANSACTION RISK", "MIDDLEWARE"]
        ).map((line, i) => (
          <div
            key={line}
            style={{
              fontSize: "clamp(3.5rem, 11vw, 9rem)",
              fontWeight: 700,
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
              color: "#F4F4F0",
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(20px)",
              transition: `opacity 700ms ease ${100 + i * 80}ms, transform 700ms ease ${100 + i * 80}ms`,
            }}
          >
            {line}
          </div>
        ))}

        {/* Live stats */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            justifyContent: "center",
            marginTop: "2.5rem",
            opacity: entered ? 1 : 0,
            transition: "opacity 700ms ease 450ms",
          }}
        >
          <FloatingMeta label="Transactions"    value="1.42M"  accent="#39FF88" />
          <FloatingMeta label="Median Decision" value="42ms"   accent="#00F6FF" />
          <FloatingMeta label="Availability"    value="98.7%"  accent="#FFA31A" />
        </div>

        {/* CTA */}
        {!isFinal && (
          <div
            style={{
              marginTop: "2.5rem",
              opacity: entered ? 1 : 0,
              transition: "opacity 700ms ease 550ms",
            }}
          >
            <a href="#engine" className="arrow-btn">
              Explore the engine <span className="arr">→</span>
            </a>
          </div>
        )}
      </div>

      {/* ── Scroll hint ──────────────────────────────────────────────── */}
      {!isFinal && (
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            opacity: entered ? 0.4 : 0,
            transition: "opacity 700ms ease 800ms",
          }}
        >
          <div
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(180deg, rgba(57,255,136,0), rgba(57,255,136,0.6))",
            }}
          />
        </div>
      )}
    </section>
  );
}
