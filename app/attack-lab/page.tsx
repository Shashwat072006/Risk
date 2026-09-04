"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SCENARIOS = [
  {
    id: "card_testing",
    label: "Card Testing",
    desc: "10,000 events · 500 cards · 35 IP ranges",
    color: "#FFA31A",
    baseline: { detection: 61, fp: 12, loss: 100 },
    withGraph: { detection: 82, fp: 7, loss: 63 },
    withCampaign: { detection: 91, fp: 4, loss: 42 },
    withAdaptive: { detection: 94, fp: 2, loss: 31 },
  },
  {
    id: "ato",
    label: "Account Takeover",
    desc: "10,000 events · 500 identities · 125 devices",
    color: "#E600FF",
    baseline: { detection: 54, fp: 9, loss: 100 },
    withGraph: { detection: 77, fp: 6, loss: 58 },
    withCampaign: { detection: 88, fp: 3, loss: 38 },
    withAdaptive: { detection: 93, fp: 1.5, loss: 28 },
  },
  {
    id: "mule_network",
    label: "Mule Network",
    desc: "5,000 events · 200 accounts · 40 beneficiaries",
    color: "#00F6FF",
    baseline: { detection: 41, fp: 15, loss: 100 },
    withGraph: { detection: 73, fp: 8, loss: 52 },
    withCampaign: { detection: 84, fp: 5, loss: 39 },
    withAdaptive: { detection: 90, fp: 2, loss: 27 },
  },
  {
    id: "credential_stuffing",
    label: "Credential Stuffing",
    desc: "50,000 events · 1,200 accounts · 300 IPs",
    color: "#FF4D4D",
    baseline: { detection: 67, fp: 11, loss: 100 },
    withGraph: { detection: 85, fp: 6, loss: 55 },
    withCampaign: { detection: 92, fp: 3, loss: 36 },
    withAdaptive: { detection: 96, fp: 1, loss: 22 },
  },
  {
    id: "velocity_attack",
    label: "Velocity Attack",
    desc: "8,000 events · 80 devices · 200 cards",
    color: "#39FF88",
    baseline: { detection: 74, fp: 6, loss: 100 },
    withGraph: { detection: 88, fp: 4, loss: 49 },
    withCampaign: { detection: 93, fp: 2, loss: 34 },
    withAdaptive: { detection: 97, fp: 1, loss: 19 },
  },
  {
    id: "app_scam",
    label: "APP / Social Engineering",
    desc: "2,000 events · 200 victims · customer-authorized",
    color: "#FFA31A",
    baseline: { detection: 28, fp: 5, loss: 100 },
    withGraph: { detection: 52, fp: 4, loss: 74 },
    withCampaign: { detection: 67, fp: 3, loss: 57 },
    withAdaptive: { detection: 79, fp: 2, loss: 42 },
  },
];

const LAYERS = [
  { key: "baseline",    label: "Baseline ML",          color: "rgba(244,244,240,0.2)" },
  { key: "withGraph",   label: "+ Entity Graph",        color: "#00F6FF" },
  { key: "withCampaign",label: "+ Campaign Detector",   color: "#E600FF" },
  { key: "withAdaptive",label: "+ Adaptive Policy",     color: "#39FF88" },
];

type LayerKey = "baseline" | "withGraph" | "withCampaign" | "withAdaptive";

export default function AttackLabPage() {
  const [selected, setSelected] = useState(SCENARIOS[0]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  function runSim() {
    setRunning(true);
    setDone(false);
    setTimeout(() => { setRunning(false); setDone(true); }, 2500);
  }

  const layers = LAYERS.map((l) => ({
    ...l,
    data: selected[l.key as LayerKey] as { detection: number; fp: number; loss: number },
  }));

  return (
    <main style={{ background: "#050505", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />

      <section
        style={{
          paddingTop: "8rem",
          paddingBottom: "4rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#E600FF", marginBottom: "1rem" }}>
            Risk Simulation Lab
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F4F4F0", textTransform: "uppercase", margin: 0 }}>
            Attack
            <br />
            Simulation Lab
          </h1>
          <p style={{ maxWidth: 560, fontSize: "0.8125rem", color: "rgba(244,244,240,0.45)", lineHeight: 1.65, marginTop: "1.25rem" }}>
            Run controlled attack scenarios against the detection stack. See how each layer —
            ML baseline, entity graph, campaign detector, and adaptive policy — improves detection
            and reduces expected loss.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 2.5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "start" }}>

          {/* Scenario selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "0.5rem" }}>
              Attack Scenario
            </div>
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelected(s); setDone(false); }}
                style={{
                  padding: "1rem 1.25rem",
                  background: selected.id === s.id ? `${s.color}10` : "transparent",
                  border: selected.id === s.id ? `1px solid ${s.color}44` : "1px solid rgba(255,255,255,0.06)",
                  borderLeft: selected.id === s.id ? `3px solid ${s.color}` : "3px solid transparent",
                  color: selected.id === s.id ? "#F4F4F0" : "rgba(244,244,240,0.5)",
                  fontSize: "0.5625rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 150ms ease",
                }}
              >
                <div style={{ fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: "0.45rem", color: "rgba(244,244,240,0.3)", marginTop: "0.25rem", letterSpacing: "0.06em" }}>{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Results panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Config + run */}
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: selected.color, letterSpacing: "-0.02em" }}>{selected.label}</div>
                <div style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.4)", marginTop: "0.375rem" }}>{selected.desc}</div>
              </div>
              <button
                onClick={runSim}
                disabled={running}
                style={{
                  padding: "0.875rem 2rem",
                  background: running ? "rgba(57,255,136,0.05)" : "rgba(57,255,136,0.1)",
                  border: "1px solid rgba(57,255,136,0.4)",
                  color: running ? "rgba(57,255,136,0.4)" : "#39FF88",
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: running ? "not-allowed" : "pointer",
                  transition: "all 200ms ease",
                }}
              >
                {running ? "Running Simulation..." : "Run Simulation"}
              </button>
            </div>

            {/* Layer comparison */}
            <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.35)", marginBottom: "1.5rem" }}>
                Detection Stack — Layer by Layer
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 80px 80px", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.45rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.2)" }}>Layer</div>
                <div style={{ fontSize: "0.45rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.2)" }}>Detection Rate</div>
                <div style={{ fontSize: "0.45rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.2)", textAlign: "right" }}>FP %</div>
                <div style={{ fontSize: "0.45rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.2)", textAlign: "right" }}>Loss Index</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {layers.map((l, i) => (
                  <div key={l.key} style={{ display: "grid", gridTemplateColumns: "180px 1fr 80px 80px", gap: "0.5rem", alignItems: "center", opacity: done || l.key === "baseline" ? 1 : 0.25, transition: "opacity 600ms ease" }}>
                    <div>
                      <div style={{ fontSize: "0.5625rem", fontWeight: 600, color: l.color }}>{l.label}</div>
                    </div>
                    <div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                        <div
                          style={{
                            width: done || l.key === "baseline" ? `${l.data.detection}%` : "0%",
                            height: "100%",
                            background: l.color,
                            borderRadius: 3,
                            transition: `width ${600 + i * 300}ms cubic-bezier(.2,.8,.2,1)`,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.5)", marginTop: "0.25rem" }}>{l.data.detection}%</div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.625rem", color: l.data.fp < 5 ? "#39FF88" : "#FFA31A", fontWeight: 600, fontFamily: "monospace" }}>
                      {l.data.fp}%
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.625rem", color: l.data.loss < 50 ? "#39FF88" : "rgba(244,244,240,0.5)", fontWeight: 600, fontFamily: "monospace" }}>
                      {l.data.loss === 100 ? "baseline" : `-${100 - l.data.loss}%`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final result highlight */}
            {done && (
              <div
                style={{
                  background: "rgba(57,255,136,0.05)",
                  border: "1px solid rgba(57,255,136,0.25)",
                  padding: "1.75rem 2rem",
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "2rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#39FF88", letterSpacing: "-0.04em" }}>
                    {selected.withAdaptive.detection}%
                  </div>
                  <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginTop: "0.375rem" }}>
                    Detection Rate (Full Stack)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#39FF88", letterSpacing: "-0.04em" }}>
                    {selected.withAdaptive.fp}%
                  </div>
                  <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginTop: "0.375rem" }}>
                    False Positive Rate
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#39FF88", letterSpacing: "-0.04em" }}>
                    -{100 - selected.withAdaptive.loss}%
                  </div>
                  <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginTop: "0.375rem" }}>
                    Expected Loss Reduction
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
