"use client";
import { useState } from "react";

interface ModelVersion {
  version: string;
  architecture: string;
  trafficAllocation: string;
  status: "CHAMPION" | "CHALLENGER" | "RETIRED";
  rocAuc: number;
  precision: string;
  recall: string;
  fpr: string;
  p95Latency: string;
  trainedOn: string;
  driftStatus: "STABLE" | "WARNING" | "CRITICAL";
  psiScore: number;
}

const MODELS_DATA: ModelVersion[] = [
  {
    version: "v3.2.1-prod",
    architecture: "Hybrid XGBoost + Graph Embeddings",
    trafficAllocation: "98.4%",
    status: "CHAMPION",
    rocAuc: 0.942,
    precision: "87.4%",
    recall: "88.1%",
    fpr: "2.1%",
    p95Latency: "38.4ms",
    trainedOn: "1,200,000 txns (30d historical)",
    driftStatus: "STABLE",
    psiScore: 0.082,
  },
  {
    version: "v4.0.0-rc2",
    architecture: "Multi-Task LightGBM + Novelty Autoencoder",
    trafficAllocation: "1.6% (Canary)",
    status: "CHALLENGER",
    rocAuc: 0.961,
    precision: "89.8%",
    recall: "91.2%",
    fpr: "1.6%",
    p95Latency: "31.2ms",
    trainedOn: "2,500,000 txns (60d historical + synthetic attacks)",
    driftStatus: "STABLE",
    psiScore: 0.041,
  },
  {
    version: "v3.1.0-legacy",
    architecture: "RandomForest Baseline",
    trafficAllocation: "0.0%",
    status: "RETIRED",
    rocAuc: 0.891,
    precision: "79.2%",
    recall: "82.4%",
    fpr: "4.8%",
    p95Latency: "52.0ms",
    trainedOn: "800,000 txns",
    driftStatus: "WARNING",
    psiScore: 0.24,
  },
];

const FEATURE_DRIFT = [
  { feature: "device_novelty_score", psi: 0.28, status: "DRIFT_ALERT", note: "Adversary emulator burst (+41% in 2h)" },
  { feature: "geo_velocity_kmh", psi: 0.19, status: "MODERATE", note: "Holiday international travel shift" },
  { feature: "amount_log_ratio", psi: 0.06, status: "HEALTHY", note: "Standard distribution match" },
  { feature: "accounts_per_ip_24h", psi: 0.24, status: "DRIFT_ALERT", note: "Tor exit node concentration" },
  { feature: "inbound_to_outbound_delta", psi: 0.04, status: "HEALTHY", note: "Baseline liquidity flow" },
];

export default function ModelsPage() {
  const [models, setModels] = useState<ModelVersion[]>(MODELS_DATA);
  const [toast, setToast] = useState<string | null>(null);

  const champion = models.find((m) => m.status === "CHAMPION")!;
  const challenger = models.find((m) => m.status === "CHALLENGER")!;

  function handlePromoteChallenger() {
    setModels((prev) =>
      prev.map((m) => {
        if (m.version === challenger.version) {
          return { ...m, status: "CHAMPION", trafficAllocation: "100.0%" };
        }
        if (m.version === champion.version) {
          return { ...m, status: "RETIRED", trafficAllocation: "0.0%" };
        }
        return m;
      })
    );
    setToast(`Challenger (${challenger.version}) successfully promoted to Champion in Production.`);
    setTimeout(() => setToast(null), 5000);
  }

  function handleRollback() {
    setToast("Rollback initiated: Reverting traffic allocation to Champion baseline v3.2.1-prod.");
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <main style={{ background: "#050505", minHeight: "100vh", color: "#F4F4F0" }}>
      <div className="grain-overlay" aria-hidden="true" />
      

      {/* Hero */}
      <section
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "3rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
            <div>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#39FF88", marginBottom: "0.75rem" }}>
                PRD Sections 22 & 25
              </div>
              <h1
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  color: "#F4F4F0",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Model Governance &
                <br />
                Threat Drift
              </h1>
              <p style={{ maxWidth: 640, fontSize: "0.875rem", color: "rgba(244,244,240,0.5)", lineHeight: 1.6, marginTop: "1rem" }}>
                Champion vs Challenger shadow evaluation, real-time feature drift monitors, automated safety promotion gates, and instant zero-downtime rollbacks.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleRollback}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,77,77,0.4)",
                  color: "#FF4D4D",
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Emergency Rollback
              </button>
              <button
                onClick={handlePromoteChallenger}
                style={{
                  background: "#39FF88",
                  border: "none",
                  color: "#050505",
                  padding: "0.75rem 1.75rem",
                  fontSize: "0.6875rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Promote Challenger to Champion →
              </button>
            </div>
          </div>

          {toast && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(57, 255, 136, 0.1)",
                border: "1px solid #39FF88",
                color: "#39FF88",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              [OK] {toast}
            </div>
          )}
        </div>
      </section>

      {/* Threat Drift Alert Banner */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 2.5rem", background: "rgba(255,77,77,0.06)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.875rem", color: "#FF4D4D", fontWeight: 800 }}>[ALERT] THREAT DRIFT DETECTED:</span>
            <span style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.8)" }}>
              Device novelty feature drift increased <strong>+41%</strong> over the last 2 hours. Active cluster matches Campaign #1842.
            </span>
          </div>
          <span style={{ fontSize: "0.625rem", color: "#FFA31A", fontFamily: "monospace", letterSpacing: "0.08em" }}>
            Population Stability Index (PSI): 0.28 (ALERT THRESHOLD: 0.25)
          </span>
        </div>
      </section>

      {/* Champion vs Challenger Side-by-Side Benchmarking */}
      <section style={{ padding: "3rem 2.5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1.5rem" }}>
          Side-by-Side Model Architecture Comparison
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Champion Card */}
          <div style={{ background: "#0A0A0A", border: "1px solid #39FF88", padding: "2.5rem", position: "relative" }}>
            <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "rgba(57,255,136,0.15)", border: "1px solid #39FF88", color: "#39FF88", fontSize: "0.5625rem", fontWeight: 800, padding: "0.3rem 0.8rem", letterSpacing: "0.1em" }}>
              CHAMPION (PRODUCTION - {champion.trafficAllocation})
            </div>
            <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Active Release</div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.25rem 0 1rem", fontFamily: "monospace", color: "#F4F4F0" }}>
              {champion.version}
            </h2>
            <div style={{ fontSize: "0.8125rem", color: "rgba(244,244,240,0.7)", marginBottom: "2rem" }}>
              {champion.architecture}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase" }}>ROC-AUC</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#39FF88" }}>{champion.rocAuc}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase" }}>Precision</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F4F4F0" }}>{champion.precision}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase" }}>Recall</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F4F4F0" }}>{champion.recall}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase" }}>P95 Latency SLA</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#39FF88" }}>{champion.p95Latency}</div>
              </div>
            </div>
          </div>

          {/* Challenger Card */}
          <div style={{ background: "#0A0A0A", border: "1px solid #FFA31A", padding: "2.5rem", position: "relative" }}>
            <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "rgba(255,163,26,0.15)", border: "1px solid #FFA31A", color: "#FFA31A", fontSize: "0.5625rem", fontWeight: 800, padding: "0.3rem 0.8rem", letterSpacing: "0.1em" }}>
              CHALLENGER (CANARY - {challenger.trafficAllocation})
            </div>
            <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Candidate Release</div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.25rem 0 1rem", fontFamily: "monospace", color: "#F4F4F0" }}>
              {challenger.version}
            </h2>
            <div style={{ fontSize: "0.8125rem", color: "rgba(244,244,240,0.7)", marginBottom: "2rem" }}>
              {challenger.architecture}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase" }}>ROC-AUC (+0.019)</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#39FF88" }}>{challenger.rocAuc}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase" }}>Precision (+2.4%)</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F4F4F0" }}>{challenger.precision}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase" }}>Recall (+3.1%)</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F4F4F0" }}>{challenger.recall}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", textTransform: "uppercase" }}>P95 Latency SLA (-7.2ms)</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#39FF88" }}>{challenger.p95Latency}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Drift Monitor */}
      <section style={{ padding: "0 2.5rem 3rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0A0A0A" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "#F4F4F0" }}>
              Real-Time Feature Drift & Population Stability (PRD Section 25)
            </h3>
            <p style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.4)", margin: "0.25rem 0 0" }}>
              Tracks whether live inference feature distributions deviate from training data baselines using Kolmogorov-Smirnov and PSI metrics.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "240px 140px 180px 1fr",
              padding: "1rem 2rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(244,244,240,0.4)",
            }}
          >
            <div>Feature Signal</div>
            <div>PSI Score</div>
            <div>Drift Status</div>
            <div>Threat Observability Note</div>
          </div>

          {FEATURE_DRIFT.map((f) => (
            <div
              key={f.feature}
              style={{
                display: "grid",
                gridTemplateColumns: "240px 140px 180px 1fr",
                padding: "1.25rem 2rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                alignItems: "center",
                fontSize: "0.75rem",
              }}
            >
              <div style={{ fontFamily: "monospace", color: "#F4F4F0", fontWeight: 600 }}>{f.feature}</div>
              <div style={{ fontFamily: "monospace", color: f.psi > 0.2 ? "#FF4D4D" : f.psi > 0.1 ? "#FFA31A" : "#39FF88", fontWeight: 700 }}>
                {f.psi.toFixed(2)}
              </div>
              <div>
                <span
                  style={{
                    padding: "0.25rem 0.6rem",
                    background: f.status === "DRIFT_ALERT" ? "rgba(255,77,77,0.15)" : f.status === "MODERATE" ? "rgba(255,163,26,0.15)" : "rgba(57,255,136,0.15)",
                    border: `1px solid ${f.status === "DRIFT_ALERT" ? "#FF4D4D" : f.status === "MODERATE" ? "#FFA31A" : "#39FF88"}`,
                    color: f.status === "DRIFT_ALERT" ? "#FF4D4D" : f.status === "MODERATE" ? "#FFA31A" : "#39FF88",
                    fontSize: "0.5625rem",
                    fontWeight: 800,
                  }}
                >
                  {f.status}
                </span>
              </div>
              <div style={{ color: "rgba(244,244,240,0.6)", fontSize: "0.75rem" }}>
                {f.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Promotion Gates */}
      <section style={{ padding: "0 2.5rem 5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
          <div style={{ fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#39FF88", marginBottom: "0.5rem" }}>
            Automated Promotion Safety Gates (Bank-Grade Standards)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginTop: "1rem" }}>
            {[
              { gate: "Latency SLA Breach (<50ms)", result: "PASSED (31.2ms)", color: "#39FF88" },
              { gate: "ROC-AUC Improvement (>= 0.90)", result: "PASSED (0.961)", color: "#39FF88" },
              { gate: "False Positive Threshold (<2.5%)", result: "PASSED (1.6%)", color: "#39FF88" },
              { gate: "Adversary Bias Invariance", result: "PASSED (0.992)", color: "#39FF88" },
            ].map((g) => (
              <div key={g.gate} style={{ background: "#050505", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.5)" }}>{g.gate}</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: g.color, marginTop: "0.5rem" }}>{g.result}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </main>
  );
}
