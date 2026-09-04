"use client";

interface CounterfactualItem {
  removed_signal: string;
  without_score: number;
  without_decision: string;
}

interface CounterfactualPanelProps {
  current_score: number;
  current_decision: string;
  items: CounterfactualItem[];
}

const DECISION_COLORS: Record<string, string> = {
  ALLOW:  "#39FF88",
  REVIEW: "#FFA31A",
  BLOCK:  "#FF4D4D",
  "STEP-UP": "#00F6FF",
  "3DS":  "#00F6FF",
};

export default function CounterfactualPanel({
  current_score,
  current_decision,
  items,
}: CounterfactualPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <div
        style={{
          fontSize: "0.5rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.35)",
          marginBottom: "1rem",
        }}
      >
        Counterfactual Analysis — "What if?"
      </div>

      {/* Current state */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.875rem 1rem",
          background: "rgba(255,255,255,0.03)",
          borderLeft: `3px solid ${DECISION_COLORS[current_decision] ?? "#F4F4F0"}`,
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            fontSize: "0.5rem",
            color: "rgba(244,244,240,0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            minWidth: 52,
          }}
        >
          Current
        </div>
        <div style={{ flex: 1, fontSize: "0.6875rem", color: "rgba(244,244,240,0.6)" }}>
          All signals present
        </div>
        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: DECISION_COLORS[current_decision] ?? "#F4F4F0",
            letterSpacing: "-0.03em",
            minWidth: 32,
            textAlign: "right",
          }}
        >
          {current_score}
        </div>
        <div
          style={{
            fontSize: "0.5rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: DECISION_COLORS[current_decision] ?? "#F4F4F0",
            padding: "0.2rem 0.5rem",
            border: `1px solid ${DECISION_COLORS[current_decision] ?? "#F4F4F0"}44`,
            minWidth: 52,
            textAlign: "center",
          }}
        >
          {current_decision}
        </div>
      </div>

      {/* Counterfactual rows */}
      {items.map((item, i) => {
        const delta = item.without_score - current_score;
        const col = DECISION_COLORS[item.without_decision] ?? "#F4F4F0";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.875rem 1rem",
              borderLeft: `3px solid ${col}44`,
              borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <div
              style={{
                fontSize: "0.5rem",
                color: "rgba(244,244,240,0.25)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                minWidth: 52,
              }}
            >
              Without
            </div>
            <div style={{ flex: 1, fontSize: "0.6875rem", color: "rgba(244,244,240,0.55)" }}>
              {item.removed_signal}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: delta < 0 ? "#39FF88" : "#FF4D4D",
                fontFamily: "monospace",
                minWidth: 40,
                textAlign: "right",
              }}
            >
              {delta < 0 ? "" : "+"}{delta}
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: col,
                letterSpacing: "-0.03em",
                minWidth: 32,
                textAlign: "right",
              }}
            >
              {item.without_score}
            </div>
            <div
              style={{
                fontSize: "0.5rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: col,
                padding: "0.2rem 0.5rem",
                border: `1px solid ${col}33`,
                minWidth: 52,
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              {item.without_decision}
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div
          style={{
            fontSize: "0.625rem",
            color: "rgba(244,244,240,0.2)",
            fontStyle: "italic",
            padding: "1rem",
          }}
        >
          Score a transaction to see counterfactual breakdown
        </div>
      )}
    </div>
  );
}

export type { CounterfactualItem };
