"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "IDENTIFY HIGH-RISK",
  "TRANSACTIONS BEFORE",
  "THEY BECOME FRAUD,",
  "LOSS OR CHARGEBACKS.",
];

export default function Positioning() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const offsets = [50, 35, 20, 5];
      linesRef.current?.querySelectorAll(".pos-line").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: offsets[i] },
          {
            opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
            delay: i * 0.11,
            scrollTrigger: { trigger: linesRef.current, start: "top 70%" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#050505",
        padding: "9rem 2.5rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem", alignItems: "end" }}>
        <div ref={linesRef}>
          {LINES.map((line, i) => (
            <div
              key={i}
              className="pos-line"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: i === 0 ? "#0ed39a" : "#f7f7f2",
                opacity: 0,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ paddingBottom: "0.5rem" }}>
          <p style={{ color: "#a1a1a1", lineHeight: 1.75, fontSize: "0.9rem", marginBottom: "2rem" }}>
            TransactionGuard intercepts every payment event and applies 13 deterministic
            rules and an XGBoost model trained on behavioral fraud patterns — delivering
            a bounded, auditable decision before settlement occurs.
          </p>
          <a
            href="#contact"
            className="arrow-pill"
            style={{ color: "#f7f7f2", borderColor: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}
          >
            See Architecture <span className="pill-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
