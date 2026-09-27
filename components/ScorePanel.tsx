"use client";
import { useEffect, useRef, useState } from "react";

interface ScorePanelProps {
  score: number;        // 0–100
  decision: string | null;
  latencyMs?: number;
  ruleScore?: number;
  mlProb?: number;
  animating?: boolean;
}

const DECISION_COLORS: Record<string, { fg: string; bg: string; border: string }> = {
  ALLOW:    { fg: "#39FF88", bg: "rgba(57,255,136,0.08)",  border: "rgba(57,255,136,0.3)" },
  REVIEW:   { fg: "#FFA31A", bg: "rgba(255,163,26,0.08)",  border: "rgba(255,163,26,0.3)" },
  BLOCK:    { fg: "#FF4D4D", bg: "rgba(255,77,77,0.08)",   border: "rgba(255,77,77,0.3)" },
  "STEP-UP":{ fg: "#FFA31A", bg: "rgba(255,163,26,0.08)",  border: "rgba(255,163,26,0.3)" },
  "3DS":    { fg: "#FFA31A", bg: "rgba(255,163,26,0.08)",  border: "rgba(255,163,26,0.3)" },
  OTP:      { fg: "#FFA31A", bg: "rgba(255,163,26,0.08)",  border: "rgba(255,163,26,0.3)" },
};

export default function ScorePanel({
  score,
  decision,
  latencyMs,
  ruleScore,
  mlProb,
  animating,
}: ScorePanelProps) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (animating || decision === null) return;
    const duration = 900;
    const target = score;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startRef.current) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(target * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score, decision, animating]);

  const col = (decision && DECISION_COLORS[decision]) ? DECISION_COLORS[decision] : DECISION_COLORS.ALLOW;

  const barColor = (pct: number) => {
    if (pct < 40) return "#39FF88";
    if (pct < 65) return "#FFA31A";
    return "#FF4D4D";
  };

  return (
    <div
      suppressHydrationWarning
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Giant score number */}
      <div style={{ textAlign: "center" }}>
        <div
          suppressHydrationWarning
          style={{
            fontSize: "clamp(6rem, 16vw, 10rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: decision ? barColor(score) : "#333",
            fontVariantNumeric: "tabular-nums",
            transition: "color 400ms ease",
          }}
        >
          {displayed}
        </div>
        <div
          style={{
            fontSize: "0.5625rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(244,244,240,0.4)",
            marginTop: "0.25rem",
          }}
        >
          Risk Score / 100
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div
          style={{
            height: 6,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            suppressHydrationWarning
            style={{
              height: "100%",
              width: `${displayed}%`,
              background: barColor(displayed),
              borderRadius: 3,
              transition: "width 900ms cubic-bezier(.2,.8,.2,1), background 400ms ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            color: "rgba(244,244,240,0.3)",
            textTransform: "uppercase",
          }}
        >
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      </div>

      {/* Decision badge */}
      {decision && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.5rem 2rem",
              background: col.bg,
              border: `1px solid ${col.border}`,
              color: col.fg,
              fontSize: "1rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {decision}
          </div>
        </div>
      )}

      {/* Score breakdown */}
      {decision && ruleScore !== undefined && mlProb !== undefined && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
            gap: 0,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.5rem",
          }}
        >
          {[
            { label: "Rules (40%)", value: Math.round(ruleScore * 100) },
            null,
            { label: "ML Prob (60%)", value: Math.round(mlProb * 100) },
            null,
            { label: "Final Score", value: score },
          ].map((item, i) =>
            item === null ? (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)" }} />
            ) : (
              <div key={i} style={{ textAlign: "center", padding: "0 1rem" }}>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: i === 4 ? barColor(score) : "#F4F4F0",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: "0.5rem",
                    letterSpacing: "0.1em",
                    color: "rgba(244,244,240,0.4)",
                    textTransform: "uppercase",
                    marginTop: "0.25rem",
                  }}
                >
                  {item.label}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Latency badge */}
      {latencyMs !== undefined && (
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              fontSize: "0.5625rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#39FF88",
              fontWeight: 600,
            }}
          >
          {latencyMs.toFixed(1)} ms decision latency
          </span>
        </div>
      )}
    </div>
  );
}
