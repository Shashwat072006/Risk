"use client";
import { useState, useCallback, useRef } from "react";

export interface FlowNode {
  id: string;
  label: string;
  type: "account" | "merchant" | "peer" | "flagged";
  volume: number;   // USD
  txnCount: number;
  riskScore: number; // 0–100
  country?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  volume: number;
  txnCount: number;
  riskScore: number; // 0–100
  direction: "out" | "in";
}

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
  centerId: string; // which node is center
}

// ── Color helpers ─────────────────────────────────────────────────────────────

function riskToColor(score: number, alpha = 1): string {
  if (score >= 70) return `rgba(255,77,77,${alpha})`;
  if (score >= 40) return `rgba(255,163,26,${alpha})`;
  return `rgba(57,255,136,${alpha})`;
}

function riskToEdgeColor(score: number): string {
  if (score >= 70) return "#FF4D4D";
  if (score >= 40) return "#FFA31A";
  return "#39FF88";
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

// ── Fixed layout positions ────────────────────────────────────────────────────

function computeLayout(
  nodes: FlowNode[],
  centerId: string,
  width: number,
  height: number
): Record<string, [number, number]> {
  const cx = width / 2;
  const cy = height / 2;
  const peripherals = nodes.filter(n => n.id !== centerId);
  const radius = Math.min(width, height) * 0.36;
  const positions: Record<string, [number, number]> = {};
  positions[centerId] = [cx, cy];
  peripherals.forEach((node, i) => {
    const angle = (Math.PI * 2 * i) / peripherals.length - Math.PI / 2;
    // Jitter radius slightly based on index to avoid crowding
    const r = radius + (i % 3 === 1 ? 30 : i % 3 === 2 ? -20 : 0);
    positions[node.id] = [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  return positions;
}

// ── Arrow marker defs ─────────────────────────────────────────────────────────

function Defs() {
  return (
    <defs>
      {(["green", "orange", "red"] as const).map(c => {
        const color = c === "green" ? "#39FF88" : c === "orange" ? "#FFA31A" : "#FF4D4D";
        return (
          <marker key={c} id={`arrow-${c}`} markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={color} opacity={0.8} />
          </marker>
        );
      })}
    </defs>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipState {
  node: FlowNode;
  x: number;
  y: number;
}

function NodeTooltip({ node, x, y }: TooltipState) {
  const riskColor = riskToColor(node.riskScore);
  return (
    <div
      style={{
        position: "absolute",
        left: x + 12,
        top: y - 8,
        background: "#111",
        border: `1px solid ${riskColor}55`,
        padding: "0.875rem 1.125rem",
        pointerEvents: "none",
        zIndex: 50,
        minWidth: 180,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "0.375rem" }}>
        {node.type}
      </div>
      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F4F4F0", marginBottom: "0.625rem", letterSpacing: "-0.01em" }}>
        {node.label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)" }}>Volume</span>
          <span style={{ fontSize: "0.5625rem", fontWeight: 600, color: "#F4F4F0" }}>{formatVolume(node.volume)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)" }}>Transactions</span>
          <span style={{ fontSize: "0.5625rem", fontWeight: 600, color: "#F4F4F0" }}>{node.txnCount}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)" }}>Risk Score</span>
          <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: riskColor }}>{node.riskScore}</span>
        </div>
        {node.country && (
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem" }}>
            <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)" }}>Country</span>
            <span style={{ fontSize: "0.5625rem", fontWeight: 600, color: "#F4F4F0" }}>{node.country}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function MoneyFlowGraph({ nodes, edges, centerId }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 640, H = 500;
  const positions = computeLayout(nodes, centerId, W, H);

  const handleNodeClick = useCallback((node: FlowNode) => {
    setSelectedNode(prev => prev === node.id ? null : node.id);
  }, []);

  // Filter edges for selected node
  const visibleEdges = selectedNode
    ? edges.filter(e => e.from === selectedNode || e.to === selectedNode)
    : edges;

  const getArrowMarker = (score: number) =>
    score >= 70 ? "url(#arrow-red)" : score >= 40 ? "url(#arrow-orange)" : "url(#arrow-green)";

  // Shorten edge so arrow doesn't overlap node circle
  function shortenEdge(x1: number, y1: number, x2: number, y2: number, trim: number): [number, number, number, number] {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [x1, y1, x2, y2];
    const ux = dx / len, uy = dy / len;
    return [x1 + ux * trim, y1 + uy * trim, x2 - ux * trim, y2 - uy * trim];
  }

  const centerNode = nodes.find(n => n.id === centerId);
  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const connectedEdges = selectedNode ? edges.filter(e => e.from === selectedNode || e.to === selectedNode) : [];
  const totalConnectedVolume = connectedEdges.reduce((s, e) => s + e.volume, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "0.25rem" }}>
            Money Flow Analysis
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F4F4F0", letterSpacing: "-0.01em" }}>
            Counterparty Network Graph
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            { color: "#39FF88", label: "Low Risk" },
            { color: "#FFA31A", label: "Medium Risk" },
            { color: "#FF4D4D", label: "High Risk / Flagged" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hint */}
      <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.25)", letterSpacing: "0.06em" }}>
        Click any node to highlight its connections and view flow details.
      </div>

      {/* Graph container */}
      <div style={{ position: "relative", background: "#080808", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block" }}
        >
          <Defs />

          {/* Grid subtle dots */}
          {Array.from({ length: 20 }).map((_, i) =>
            Array.from({ length: 16 }).map((_, j) => (
              <circle key={`${i}-${j}`} cx={i * 34} cy={j * 34} r={0.5} fill="rgba(255,255,255,0.04)" />
            ))
          )}

          {/* Edges */}
          {visibleEdges.map((edge, i) => {
            const [x1, y1] = positions[edge.from] ?? [W / 2, H / 2];
            const [x2, y2] = positions[edge.to]   ?? [W / 2, H / 2];
            const [sx1, sy1, sx2, sy2] = shortenEdge(x1, y1, x2, y2, 20);
            const color = riskToEdgeColor(edge.riskScore);
            const strokeW = Math.max(1, Math.min(4, edge.volume / 5000));
            const isActive = !selectedNode || edge.from === selectedNode || edge.to === selectedNode;
            return (
              <line
                key={i}
                x1={sx1} y1={sy1} x2={sx2} y2={sy2}
                stroke={color}
                strokeWidth={strokeW}
                strokeOpacity={isActive ? 0.7 : 0.1}
                markerEnd={getArrowMarker(edge.riskScore)}
                style={{ transition: "stroke-opacity 300ms ease" }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const [x, y] = positions[node.id] ?? [W / 2, H / 2];
            const isCenter = node.id === centerId;
            const isSelected = selectedNode === node.id;
            const isConnected = selectedNode
              ? edges.some(e => (e.from === selectedNode && e.to === node.id) || (e.to === selectedNode && e.from === node.id))
              : false;
            const isActive = !selectedNode || isSelected || isConnected || isCenter;
            const riskColor = riskToColor(node.riskScore);
            const r = isCenter ? 24 : node.type === "flagged" ? 18 : 16;

            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={(e) => {
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  const scaleX = W / rect.width;
                  const scaleY = H / rect.height;
                  setTooltip({
                    node,
                    x: (x / scaleX),
                    y: (y / scaleY),
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Halo for flagged / selected */}
                {(node.type === "flagged" || isSelected) && (
                  <circle
                    cx={x} cy={y}
                    r={r + 8}
                    fill="none"
                    stroke={isSelected ? "#FFA31A" : "#FF4D4D"}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    opacity={isActive ? 0.7 : 0.1}
                    style={{ transition: "opacity 300ms ease" }}
                  />
                )}
                {/* Main circle */}
                <circle
                  cx={x} cy={y} r={r}
                  fill={isCenter ? `${riskColor}1A` : `${riskColor}0D`}
                  stroke={isSelected ? "#FFA31A" : riskColor}
                  strokeWidth={isCenter ? 2 : 1.5}
                  opacity={isActive ? 1 : 0.2}
                  style={{ transition: "opacity 300ms ease" }}
                />
                {/* Label */}
                <text
                  x={x} y={y + r + 12}
                  textAnchor="middle"
                  fill={isActive ? "rgba(244,244,240,0.7)" : "rgba(244,244,240,0.15)"}
                  fontSize={isCenter ? 9 : 8}
                  fontWeight={isCenter ? 700 : 500}
                  letterSpacing={0.3}
                  style={{ transition: "fill 300ms ease", userSelect: "none" }}
                >
                  {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
                </text>
                {/* Volume label */}
                <text
                  x={x} y={y + 3}
                  textAnchor="middle"
                  fill={isActive ? riskColor : "transparent"}
                  fontSize={isCenter ? 8 : 7}
                  fontWeight={700}
                  style={{ transition: "fill 300ms ease", userSelect: "none" }}
                >
                  {formatVolume(node.volume)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <NodeTooltip {...tooltip} />
        )}
      </div>

      {/* Selected node detail strip */}
      {selectedNodeData && (
        <div style={{
          padding: "1.25rem 1.75rem",
          background: "rgba(255,163,26,0.04)",
          border: "1px solid rgba(255,163,26,0.2)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1.5rem",
        }}>
          <div>
            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Selected Node</div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#FFA31A" }}>{selectedNodeData.label}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Connected Volume</div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#F4F4F0" }}>{formatVolume(totalConnectedVolume)}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Connections</div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#F4F4F0" }}>{connectedEdges.length}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Risk Score</div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: riskToColor(selectedNodeData.riskScore) }}>{selectedNodeData.riskScore}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Node Type</div>
            <div style={{
              display: "inline-block",
              fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: riskToColor(selectedNodeData.riskScore),
              padding: "0.125rem 0.5rem",
              border: `1px solid ${riskToColor(selectedNodeData.riskScore)}33`,
              background: `${riskToColor(selectedNodeData.riskScore)}0A`,
            }}>
              {selectedNodeData.type}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
