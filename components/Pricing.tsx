"use client";
import { useState } from "react";

const PLANS = [
  {
    num: "#1",
    name: "STARTER",
    price: "$299",
    period: "/ mo",
    txn: "2,000 tx / mo",
    features: ["Real-time scoring", "13 rule engine", "Audit log", "Email alerts", "Basic explainability"],
    featured: false,
    cta: "VIEW FEATURES",
  },
  {
    num: "#2",
    name: "GROWTH",
    price: "$899",
    period: "/ mo",
    txn: "20,000 tx / mo",
    features: ["Everything in Starter", "ML hybrid scoring", "Custom thresholds", "Webhook events", "Slack alerts", "Priority support"],
    featured: true,
    cta: "VIEW FEATURES",
  },
  {
    num: "#3",
    name: "SCALE",
    price: "CUSTOM",
    period: "",
    txn: "UNLIMITED",
    features: ["Everything in Growth", "Dedicated model training", "Custom rule authoring", "SLA guarantee", "White-glove onboarding"],
    featured: false,
    cta: "CONTACT US",
  },
];

export default function Pricing() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section
      id="pricing"
      style={{
        background: "#0ed39a",
        padding: "7rem 2.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div>
          <div className="label" style={{ color: "#066c54", marginBottom: "0.75rem" }}>Transaction Plans</div>
          <h2 style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            color: "#050505",
            lineHeight: 1.0,
          }}>
            PRICING
          </h2>
        </div>
        <p style={{ color: "#066c54", maxWidth: "280px", textAlign: "right", fontSize: "0.85rem", lineHeight: 1.6 }}>
          Transparent, volume-based pricing. No hidden fees. Cancel anytime.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {PLANS.map((plan, i) => (
          <div
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{
              background: plan.featured ? "#050505" : hover === i ? "#050505" : "#f7f7f2",
              borderRadius: "20px 20px 0 0",
              padding: "2.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              transition: "background 300ms ease, transform 250ms ease",
              transform: hover === i ? "translateY(-8px)" : "translateY(0)",
              cursor: "pointer",
              minHeight: "520px",
            }}
          >
            {/* Plan number + name */}
            <div>
              <div style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: plan.featured || hover === i ? "#0ed39a" : "#a1a1a1",
                marginBottom: "0.5rem",
              }}>
                {plan.num}
              </div>
              <div style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: plan.featured || hover === i ? "#f7f7f2" : "#050505",
              }}>
                {plan.name}
              </div>
            </div>

            {/* Price */}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "1.5rem" }}>
              <span style={{
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: plan.featured || hover === i ? "#0ed39a" : "#050505",
              }}>
                {plan.price}
              </span>
              {plan.period && (
                <span style={{ fontSize: "1rem", color: "#a1a1a1", marginLeft: "0.3rem" }}>
                  {plan.period}
                </span>
              )}
              <div style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#a1a1a1",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginTop: "0.3rem",
              }}>
                {plan.txn}
              </div>
            </div>

            {/* Features */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#0ed39a", fontSize: "0.75rem" }}>✓</span>
                  <span style={{
                    fontSize: "0.8rem",
                    color: plan.featured || hover === i ? "#a1a1a1" : "#050505",
                  }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              style={{
                background: plan.featured || hover === i ? "#0ed39a" : "#050505",
                color: "#050505",
                border: "none",
                borderRadius: "9999px",
                padding: "0.75rem 1.5rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
