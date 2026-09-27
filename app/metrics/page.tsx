"use client";
import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import ConfusionMatrix from "@/components/ConfusionMatrix";

const API = "http://localhost:8000";

interface Metrics {
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
  false_positive_rate: number;
  true_positives: number;
  true_negatives: number;
  false_positives: number;
  false_negatives: number;
  decision_threshold: number;
  test_size: number;
  goals: {
    precision_75: { target: string; met: boolean };
    recall_85: { target: string; met: boolean };
    fpr_10: { target: string; met: boolean };
  };
}

const fmt = (n: number, pct = true) =>
  pct ? `${(n * 100).toFixed(1)}%` : n.toFixed(4);

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/metrics`)
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => setError("Could not reach API. Is the FastAPI server running? (python api_server.py)"));
  }, []);

  const goalsMet = metrics
    ? Object.values(metrics.goals).filter((g) => g.met).length
    : 0;
  const goalsTotal = metrics ? Object.values(metrics.goals).length : 0;

  return (
    <main style={{ background: "#050505", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      

      {/* Page hero */}
      <section
        style={{
          paddingTop: "2rem",
          paddingBottom: "4rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#39FF88",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#39FF88",
              }}
            />
            Held-Out Test Set Results
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: "#F4F4F0",
              textTransform: "uppercase",
              margin: 0,
              userSelect: "none",
            }}
          >
            Evaluation
            <br />
            Metrics
          </h1>
          <p
            style={{
              maxWidth: 540,
              fontSize: "0.875rem",
              color: "rgba(244,244,240,0.5)",
              lineHeight: 1.7,
              marginTop: "1.5rem",
            }}
          >
            Precision / recall / F1 on a fixed 80/20 stratified held-out split. 
            Reported against PRD §8 success targets. Results computed by{" "}
            <code style={{ fontFamily: "monospace", color: "#39FF88", fontSize: "0.8rem" }}>
              evaluator.py
            </code>.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "4rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: "4rem" }}>

          {error && (
            <div
              style={{
                padding: "1.5rem",
                background: "rgba(255,77,77,0.08)",
                border: "1px solid rgba(255,77,77,0.3)",
                color: "#FF4D4D",
                fontSize: "0.75rem",
                fontFamily: "monospace",
              }}
            >
              [ERROR] {error}
            </div>
          )}

          {!metrics && !error && (
            <div style={{ color: "rgba(244,244,240,0.3)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
              Loading metrics...
            </div>
          )}

          {metrics && (
            <>
              {/* Goal summary banner */}
              <div
                style={{
                  padding: "1.5rem 2rem",
                  background: goalsMet === goalsTotal ? "rgba(57,255,136,0.05)" : "rgba(255,163,26,0.05)",
                  border: `1px solid ${goalsMet === goalsTotal ? "rgba(57,255,136,0.2)" : "rgba(255,163,26,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: goalsMet === goalsTotal ? "#39FF88" : "#FFA31A",
                      marginBottom: "0.375rem",
                    }}
                  >
                    PRD §8 Goal Check
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#F4F4F0" }}>
                    {goalsMet} / {goalsTotal} targets met
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {Object.entries(metrics.goals).map(([key, g]) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.375rem 0.875rem",
                        background: g.met ? "rgba(57,255,136,0.1)" : "rgba(255,77,77,0.1)",
                        border: `1px solid ${g.met ? "rgba(57,255,136,0.3)" : "rgba(255,77,77,0.3)"}`,
                      }}
                    >
                      <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: g.met ? "#39FF88" : "#FF4D4D" }}>
                        {g.met ? "[PASS]" : "[FAIL]"}
                      </span>
                      <span style={{ fontSize: "0.5rem", letterSpacing: "0.08em", color: "rgba(244,244,240,0.6)" }}>
                        {g.target}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics grid */}
              <div>
                <h2
                  style={{
                    fontSize: "0.5rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(244,244,240,0.4)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Core Metrics
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                  <MetricCard
                    label="Precision"
                    value={fmt(metrics.precision)}
                    target="≥ 75%"
                    met={metrics.goals.precision_75.met}
                    accent="#39FF88"
                  />
                  <MetricCard
                    label="Recall"
                    value={fmt(metrics.recall)}
                    target="≥ 85%"
                    met={metrics.goals.recall_85.met}
                    accent="#39FF88"
                  />
                  <MetricCard
                    label="F1 Score"
                    value={fmt(metrics.f1)}
                    accent="#FFA31A"
                    sub="Harmonic mean of Precision & Recall"
                  />
                  <MetricCard
                    label="ROC-AUC"
                    value={metrics.roc_auc.toFixed(4)}
                    accent="#FFA31A"
                    sub="Area under ROC curve"
                  />
                  <MetricCard
                    label="PR-AUC"
                    value={metrics.pr_auc.toFixed(4)}
                    accent="#39FF88"
                    sub="Area under Precision-Recall curve"
                  />
                  <MetricCard
                    label="False Positive Rate"
                    value={fmt(metrics.false_positive_rate)}
                    target="≤ 10%"
                    met={metrics.goals.fpr_10.met}
                    accent={metrics.false_positive_rate <= 0.1 ? "#39FF88" : "#FF4D4D"}
                  />
                </div>
              </div>

              {/* Test set info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>
                <div>
                  <h2
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(244,244,240,0.4)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Test Set
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[
                      { label: "Test Size", value: metrics.test_size.toString() },
                      { label: "Decision Threshold", value: metrics.decision_threshold.toString() },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "0.875rem 1rem",
                          background: "#0A0A0A",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#F4F4F0", fontFamily: "monospace" }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confusion matrix */}
                <div>
                  <h2
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(244,244,240,0.4)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Confusion Matrix
                  </h2>
                  <ConfusionMatrix
                    tp={metrics.true_positives}
                    tn={metrics.true_negatives}
                    fp={metrics.false_positives}
                    fn={metrics.false_negatives}
                  />
                </div>
              </div>

              {/* Architecture info */}
              <div
                style={{
                  padding: "2rem",
                  background: "#0A0A0A",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h2
                  style={{
                    fontSize: "0.5rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(244,244,240,0.4)",
                    marginBottom: "1.25rem",
                  }}
                >
                  Model Architecture
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
                  {[
                    {
                      title: "Rule Engine (40%)",
                      accent: "#FFA31A",
                      items: ["13 deterministic rules", "Velocity, device, geo, timing", "Instant, fully explainable", "Configurable thresholds"],
                    },
                    {
                      title: "ML Model (60%)",
                      accent: "#39FF88",
                      items: ["XGBoost classifier", "16 engineered features", "Trained on 960 samples", "scale_pos_weight=4 for imbalance"],
                    },
                    {
                      title: "Hybrid Scorer",
                      accent: "#39FF88",
                      items: ["final = 0.4×rules + 0.6×ML", "Threshold at 0.40 / 0.65", "ALLOW / REVIEW / BLOCK", "Full feature attribution"],
                    },
                  ].map((col) => (
                    <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: col.accent,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {col.title}
                      </div>
                      {col.items.map((item) => (
                        <div
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.6875rem",
                            color: "rgba(244,244,240,0.6)",
                          }}
                        >
                          <span style={{ color: col.accent, fontSize: "0.5rem" }}>→</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      
    </main>
  );
}
