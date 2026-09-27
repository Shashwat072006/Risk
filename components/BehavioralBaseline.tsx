"use client";
import { useState } from "react";

export interface BaselineDimension {
  label: string;
  baseline: number; // 0–1 normalized
  current: number;  // 0–1 normalized
  rawBaseline: string;
  rawCurrent: string;
  unit: string;
}

interface Props {
  dimensions: BaselineDimension[];
  period?: string;
}

// ── Radar polygon math ────────────────────────────────────────────────────────

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleIndex: number,
  total: number
): [number, number] {
  const angle = (Math.PI * 2 * angleIndex) / total - Math.PI / 2;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function buildPolygonPoints(
  cx: number,
  cy: number,
  maxR: number,
  values: number[],
  total: number
): string {
  return values
    .map((v, i) => {
      const [x, y] = polarToCartesian(cx, cy, maxR * Math.max(v, 0.02), i, total);
      return `${x},${y}`;
    })
    .join(" ");
}

// ── Drift card ────────────────────────────────────────────────────────────────

function DriftCard({ dim, active, onClick }: { dim: BaselineDimension; active: boolean; onClick: () => void }) {
  const delta = dim.current - dim.baseline;
  const pct = dim.baseline > 0 ? Math.round((delta / dim.baseline) * 100) : 0;
  const isUp = delta > 0;
  const isAnomaly = Math.abs(pct) > 25;

  let statusColor = "#39FF88";
  let statusLabel = "Normal";
  if (Math.abs(pct) > 60) { statusColor = "#FF4D4D"; statusLabel = "Critical"; }
  else if (Math.abs(pct) > 25) { statusColor = "#FFA31A"; statusLabel = "Elevated"; }

  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "rgba(255,163,26,0.08)" : "#0A0A0A",
        border: `1px solid ${active ? "#FFA31A44" : isAnomaly ? "rgba(255,163,26,0.2)" : "rgba(255,255,255,0.06)"}`,
        padding: "1rem",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 200ms ease",
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
      }}
    >
      <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)" }}>
        {dim.label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.125rem", fontWeight: 800, color: statusColor, letterSpacing: "-0.02em" }}>
          {dim.rawCurrent}
        </span>
        <span style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.3)" }}>
          {dim.unit}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
        <span style={{
          fontSize: "0.625rem", fontWeight: 700,
          color: isAnomaly ? statusColor : "rgba(244,244,240,0.35)",
        }}>
          {isUp ? "▲" : "▼"} {Math.abs(pct)}%
        </span>
        <span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.2)", letterSpacing: "0.08em" }}>
          vs baseline {dim.rawBaseline}
        </span>
      </div>
      <div style={{
        display: "inline-block",
        marginTop: "0.25rem",
        fontSize: "0.5rem",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: statusColor,
        padding: "0.125rem 0.375rem",
        border: `1px solid ${statusColor}33`,
        background: `${statusColor}0A`,
        alignSelf: "flex-start",
      }}>
        {statusLabel}
      </div>
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function BehavioralBaseline({ dimensions, period = "Last 7 days" }: Props) {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const cx = 160, cy = 160, maxR = 120;
  const n = dimensions.length;

  const baselinePoints = buildPolygonPoints(cx, cy, maxR, dimensions.map(d => d.baseline), n);
  const currentPoints  = buildPolygonPoints(cx, cy, maxR, dimensions.map(d => d.current), n);

  // Axis tick rings at 25%, 50%, 75%, 100%
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "0.25rem" }}>
            Behavioral Baseline
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F4F4F0", letterSpacing: "-0.01em" }}>
            Profile Deviation Analysis
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 24, height: 2, background: "rgba(244,244,240,0.4)" }} />
            <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>30-day Baseline</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 24, height: 2, background: "#FFA31A", borderTop: "2px dashed #FFA31A" }} />
            <span style={{ fontSize: "0.5625rem", color: "#FFA31A", letterSpacing: "0.08em", textTransform: "uppercase" }}>{period}</span>
          </div>
        </div>
      </div>

      {/* Radar + Drift cards */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "2.5rem", alignItems: "start" }}>

        {/* Radar SVG */}
        <div style={{ background: "#080808", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <svg width={320} height={320} viewBox={`0 0 320 320`} style={{ overflow: "visible" }}>
            {/* Axis rings */}
            {rings.map((r, ri) => (
              <polygon
                key={ri}
                points={buildPolygonPoints(cx, cy, maxR, Array(n).fill(r), n)}
                fill="none"
                stroke={r === 1.0 ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)"}
                strokeWidth={1}
              />
            ))}

            {/* Axis spokes */}
            {dimensions.map((_, i) => {
              const [ex, ey] = polarToCartesian(cx, cy, maxR, i, n);
              return (
                <line
                  key={i}
                  x1={cx} y1={cy} x2={ex} y2={ey}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Baseline polygon */}
            <polygon
              points={baselinePoints}
              fill="rgba(244,244,240,0.04)"
              stroke="rgba(244,244,240,0.35)"
              strokeWidth={1.5}
            />

            {/* Current polygon */}
            <polygon
              points={currentPoints}
              fill="rgba(255,163,26,0.10)"
              stroke="#FFA31A"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />

            {/* Axis labels */}
            {dimensions.map((dim, i) => {
              const [lx, ly] = polarToCartesian(cx, cy, maxR + 22, i, n);
              const isHighlighted = highlighted === i;
              return (
                <text
                  key={i}
                  x={lx} y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHighlighted ? "#FFA31A" : "rgba(244,244,240,0.45)"}
                  fontSize={9}
                  fontWeight={isHighlighted ? 700 : 500}
                  letterSpacing={0.5}
                  style={{ textTransform: "uppercase", cursor: "pointer", transition: "fill 200ms ease" }}
                  onClick={() => setHighlighted(highlighted === i ? null : i)}
                >
                  {dim.label}
                </text>
              );
            })}

            {/* Vertex dots — current */}
            {dimensions.map((dim, i) => {
              const [px, py] = polarToCartesian(cx, cy, maxR * Math.max(dim.current, 0.02), i, n);
              const delta = dim.current - dim.baseline;
              const pct = dim.baseline > 0 ? Math.abs((delta / dim.baseline) * 100) : 0;
              const dotColor = pct > 60 ? "#FF4D4D" : pct > 25 ? "#FFA31A" : "#39FF88";
              return (
                <circle
                  key={i}
                  cx={px} cy={py} r={highlighted === i ? 5 : 3.5}
                  fill={dotColor}
                  stroke="#050505"
                  strokeWidth={1.5}
                  style={{ cursor: "pointer", transition: "r 200ms ease" }}
                  onClick={() => setHighlighted(highlighted === i ? null : i)}
                />
              );
            })}
          </svg>

          {/* Ring labels */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
            {["25%", "50%", "75%", "100%"].map(l => (
              <span key={l} style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.2)", letterSpacing: "0.08em" }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Drift cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {dimensions.map((dim, i) => (
            <DriftCard
              key={dim.label}
              dim={dim}
              active={highlighted === i}
              onClick={() => setHighlighted(highlighted === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* Highlighted detail */}
      {highlighted !== null && (
        <div style={{
          padding: "1.25rem 1.75rem",
          background: "rgba(255,163,26,0.05)",
          border: "1px solid rgba(255,163,26,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
              Selected — {dimensions[highlighted].label}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFA31A", letterSpacing: "-0.03em" }}>
              {dimensions[highlighted].rawCurrent} {dimensions[highlighted].unit}
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.08)" }} />
          <div>
            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>30-day average</div>
            <div style={{ fontSize: "1.125rem", fontWeight: 600, color: "rgba(244,244,240,0.6)" }}>
              {dimensions[highlighted].rawBaseline} {dimensions[highlighted].unit}
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.08)" }} />
          <div>
            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Deviation</div>
            <div style={{ fontSize: "1.125rem", fontWeight: 700, color: Math.abs(dimensions[highlighted].current - dimensions[highlighted].baseline) / (dimensions[highlighted].baseline || 1) > 0.25 ? "#FF4D4D" : "#39FF88" }}>
              {dimensions[highlighted].baseline > 0
                ? `${Math.round(((dimensions[highlighted].current - dimensions[highlighted].baseline) / dimensions[highlighted].baseline) * 100) > 0 ? "+" : ""}${Math.round(((dimensions[highlighted].current - dimensions[highlighted].baseline) / dimensions[highlighted].baseline) * 100)}%`
                : "N/A"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
