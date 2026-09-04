"use client";

interface ConfusionMatrixProps {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
}

export default function ConfusionMatrix({ tp, tn, fp, fn }: ConfusionMatrixProps) {
  const total = tp + tn + fp + fn;
  const cells = [
    { label: "True Negative",  value: tn, sub: "Correctly allowed",  color: "#39FF88", bg: "rgba(57,255,136,0.08)"  },
    { label: "False Positive", value: fp, sub: "Wrongly blocked",     color: "#FFA31A", bg: "rgba(255,163,26,0.08)" },
    { label: "False Negative", value: fn, sub: "Missed fraud",        color: "#E600FF", bg: "rgba(230,0,255,0.08)"  },
    { label: "True Positive",  value: tp, sub: "Correctly blocked",   color: "#00F6FF", bg: "rgba(0,246,255,0.08)"  },
  ];

  return (
    <div>
      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 1fr",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <div />
        <div
          style={{
            textAlign: "center",
            fontSize: "0.5rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(244,244,240,0.4)",
            padding: "0.4rem 0",
          }}
        >
          Predicted: Legit
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: "0.5rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(244,244,240,0.4)",
            padding: "0.4rem 0",
          }}
        >
          Predicted: Fraud
        </div>
      </div>

      {/* Row 1 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 1fr",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "0.75rem",
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(244,244,240,0.4)",
          }}
        >
          Actual: Legit
        </div>
        {[cells[0], cells[1]].map((cell) => (
          <Cell key={cell.label} {...cell} total={total} />
        ))}
      </div>

      {/* Row 2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 1fr",
          gap: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "0.75rem",
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(244,244,240,0.4)",
          }}
        >
          Actual: Fraud
        </div>
        {[cells[2], cells[3]].map((cell) => (
          <Cell key={cell.label} {...cell} total={total} />
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginTop: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        {cells.map((cell) => (
          <div key={cell.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div
              style={{
                width: 8,
                height: 8,
                background: cell.color,
                borderRadius: 1,
              }}
            />
            <span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.5)", letterSpacing: "0.06em" }}>
              {cell.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({
  label, value, sub, color, bg, total,
}: {
  label: string; value: number; sub: string; color: string; bg: string; total: number;
}) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${color}22`,
        padding: "1.25rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        minHeight: 90,
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color }}>
        {label}
      </div>
      <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)" }}>
        {pct}% · {sub}
      </div>
    </div>
  );
}
