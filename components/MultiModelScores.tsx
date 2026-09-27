"use client";

interface ModelScore {
  label: string;
  score: number;
  color: string;
  desc: string;
}

interface MultiModelScoresProps {
  scores: ModelScore[];
}

const DEFAULT_SCORES: ModelScore[] = [
  { label: "Fraud",       score: 0,  color: "#FF4D4D", desc: "Card-testing / payment fraud" },
  { label: "ATO",         score: 0,  color: "#FF4D4D", desc: "Account takeover" },
  { label: "Chargeback",  score: 0,  color: "#FFA31A", desc: "Dispute risk" },
  { label: "Novelty",     score: 0,  color: "#FFA31A", desc: "Behavioral anomaly" },
  { label: "Campaign",    score: 0,  color: "#39FF88", desc: "Coordinated attack correlation" },
];

export default function MultiModelScores({ scores }: MultiModelScoresProps) {
  const display = scores.length > 0 ? scores : DEFAULT_SCORES;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div
        style={{
          fontSize: "0.5rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.35)",
          marginBottom: "0.25rem",
        }}
      >
        Multi-Model Risk Scores
      </div>

      {display.map((m) => (
        <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: m.color,
                }}
              >
                {m.label}
              </span>
              <span
                style={{
                  fontSize: "0.5rem",
                  color: "rgba(244,244,240,0.25)",
                  letterSpacing: "0.04em",
                }}
              >
                {m.desc}
              </span>
            </div>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: m.score > 65 ? "#FF4D4D" : m.score > 40 ? "#FFA31A" : m.color,
                letterSpacing: "-0.02em",
                fontFamily: "monospace",
                minWidth: 28,
                textAlign: "right",
              }}
            >
              {m.score}
            </span>
          </div>
          <div
            style={{
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${m.score}%`,
                height: "100%",
                background: m.color,
                borderRadius: 2,
                opacity: 0.85,
                transition: "width 700ms cubic-bezier(.2,.8,.2,1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export { DEFAULT_SCORES };
export type { ModelScore };
