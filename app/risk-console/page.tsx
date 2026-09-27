"use client";
import { useState, useCallback } from "react";
import TransactionForm, { TxnFormData, DEFAULT_FORM } from "@/components/TransactionForm";
import ScorePanel from "@/components/ScorePanel";
import RulesList from "@/components/RulesList";
import FeatureBar from "@/components/FeatureBar";

const API = "http://localhost:8000";

interface RuleHit {
  rule_id: string;
  description: string;
  weight: number;
  triggered: boolean;
}

interface ScoreResult {
  transaction_id: string;
  risk_score: number;
  risk_score_pct: number;
  decision: "ALLOW" | "REVIEW" | "BLOCK";
  rule_score: number;
  ml_prob: number;
  triggered_rules: RuleHit[];
  top_features: { feature: string; value: number }[];
  explanation: string;
  latency_ms: number;
}

export default function RiskConsolePage() {
  const [formKey, setFormKey] = useState(0);          // force re-mount form on sample load
  const [formData, setFormData] = useState<TxnFormData>(DEFAULT_FORM);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleSubmit = useCallback(async (data: TxnFormData) => {
    setLoading(true);
    setError(null);
    setAnimating(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Scoring failed");
      }
      const json: ScoreResult = await res.json();
      setResult(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
      setAnimating(false);
    }
  }, []);

  const handleLoadSample = useCallback(async (type: "fraud" | "legit") => {
    setError(null);
    try {
      const res = await fetch(`${API}/api/sample?type=${type}`);
      if (!res.ok) throw new Error("Failed to load sample");
      const sample = await res.json();
      // Remove non-form fields
      const { is_fraud, ...clean } = sample;
      void is_fraud;
      setFormData({ ...DEFAULT_FORM, ...clean });
      setFormKey((k) => k + 1);
      // Auto-score
      await handleSubmit({ ...DEFAULT_FORM, ...clean });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sample load failed");
    }
  }, [handleSubmit]);

  const decisionColor = result
    ? result.decision === "ALLOW" ? "#39FF88"
    : result.decision === "REVIEW" ? "#FFA31A"
    : "#FF4D4D"
    : "transparent";

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
            Risk Engine Live
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
            Transaction
            <br />
            Risk Console
          </h1>
          <p
            style={{
              maxWidth: 480,
              fontSize: "0.875rem",
              color: "rgba(244,244,240,0.5)",
              lineHeight: 1.7,
              marginTop: "1.5rem",
            }}
          >
            Submit any transaction to the live HybridScorer — rule-based (40%) + XGBoost (60%).
            Every decision returns a full explanation with triggered rules and ML feature attribution.
          </p>
        </div>
      </section>

      {/* Console */}
      <section style={{ padding: "4rem 2.5rem", maxWidth: 1200, margin: "0 auto" }}>
        {error && (
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "rgba(255,77,77,0.08)",
              border: "1px solid rgba(255,77,77,0.3)",
              color: "#FF4D4D",
              fontSize: "0.75rem",
              marginBottom: "2rem",
              fontFamily: "monospace",
            }}
          >
            [ERROR] {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left — form */}
          <div>
            <TransactionForm
              key={formKey}
              onSubmit={handleSubmit}
              onLoadSample={handleLoadSample}
              loading={loading}
            />
          </div>

          {/* Right — results */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {/* Score panel */}
            <div
              style={{
                background: "#0A0A0A",
                border: `1px solid ${result ? decisionColor + "33" : "rgba(255,255,255,0.06)"}`,
                padding: "2.5rem",
                transition: "border-color 400ms ease",
                position: "relative",
              }}
            >
              {/* Decision stripe on left */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  background: result ? decisionColor : "transparent",
                  transition: "background 400ms ease",
                }}
              />

              {!result && !loading && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    color: "rgba(244,244,240,0.2)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Submit a transaction to see results
                </div>
              )}
              {loading && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    color: "#39FF88",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  ⟳ Scoring...
                </div>
              )}
              {result && (
                <ScorePanel
                  score={result.risk_score_pct}
                  decision={result.decision}
                  latencyMs={result.latency_ms}
                  ruleScore={result.rule_score}
                  mlProb={result.ml_prob}
                  animating={animating}
                />
              )}
            </div>

            {/* Transaction ID + explanation */}
            {result && (
              <div
                style={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.5rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(244,244,240,0.35)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Transaction / {result.transaction_id}
                </div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(244,244,240,0.8)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {result.explanation}
                </p>
              </div>
            )}

            {/* Rules + features side by side */}
            {result && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    background: "#0A0A0A",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "2rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(244,244,240,0.4)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Rule Engine (40%)
                  </div>
                  <RulesList rules={result.triggered_rules} />
                </div>
                <div
                  style={{
                    background: "#0A0A0A",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "2rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(244,244,240,0.4)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    ML Model (60%)
                  </div>
                  <FeatureBar features={result.top_features} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      
    </main>
  );
}
