"use client";
import { useRef, useState } from "react";

const STEPS = [
  {
    num: "01",
    title: "TRANSACTION\nINTAKE",
    body: "Capture full transaction context — amount, merchant category, device fingerprint, IP geolocation, timestamp, and velocity metadata.",
    bg: "#f7f7f2",
    textColor: "#050505",
  },
  {
    num: "02",
    title: "FEATURE\nENRICHMENT",
    body: "Build behavioral and historical signals: velocity counters, geo distance, BIN risk, device-account fanout, and amount z-score.",
    bg: "#1a1a1a",
    textColor: "#f7f7f2",
  },
  {
    num: "03",
    title: "DECISION\nENGINE",
    body: "Combine 13 deterministic rules with XGBoost ML probability into a hybrid risk score. Apply merchant-tier thresholds.",
    bg: "#066c54",
    textColor: "#f7f7f2",
  },
  {
    num: "04",
    title: "PAYMENT\nOUTCOME",
    body: "Approve, challenge, or block — with a full human-readable explanation and contributing feature list. Log every decision.",
    bg: "#0ed39a",
    textColor: "#050505",
  },
];

export default function Process() {
  const [activeIdx, setActiveIdx] = useState(2);

  return (
    <section style={{ padding: "7rem 2.5rem", background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="label" style={{ marginBottom: "3rem" }}>Four-Step Process</div>

      {/* Cards row */}
      <div
        style={{
          display: "flex",
          gap: 0,
          height: "420px",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {STEPS.map((step, i) => (
          <div
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{
              flex: activeIdx === i ? 1.7 : 1,
              background: step.bg,
              color: step.textColor,
              padding: "2.5rem 2rem",
              cursor: "pointer",
              transition: "flex 750ms cubic-bezier(0.76, 0, 0.24, 1)",
              borderRight: i < STEPS.length - 1 ? "1px solid rgba(0,0,0,0.15)" : "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Number */}
            <div style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              opacity: 0.5,
              textTransform: "uppercase",
            }}>
              {step.num}
            </div>

            {/* Title */}
            <div style={{
              fontSize: activeIdx === i ? "clamp(1.4rem, 2.2vw, 2rem)" : "clamp(1rem, 1.5vw, 1.4rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
              transition: "font-size 500ms ease",
              whiteSpace: "pre-line",
            }}>
              {step.title}
            </div>

            {/* Body copy — only visible when active */}
            <div style={{
              fontSize: "0.82rem",
              lineHeight: 1.65,
              opacity: activeIdx === i ? 0.8 : 0,
              maxHeight: activeIdx === i ? "200px" : "0",
              overflow: "hidden",
              transition: "opacity 400ms ease 200ms, max-height 600ms ease",
            }}>
              {step.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
