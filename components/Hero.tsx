"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
      .fromTo(
        headlineRef.current?.querySelectorAll(".headline-line") ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
        "-=0.3"
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );
  }, []);

  return (
    <section
      id="overview"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 2.5rem 4rem",
        overflow: "hidden",
        background: "linear-gradient(160deg, #050505 60%, #061c14 100%)",
      }}
    >
      {/* Three.js canvas fills the section */}
      <HeroCanvas />

      {/* Year badge top-right */}
      <div
        style={{
          position: "absolute",
          top: "7rem",
          right: "2.5rem",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#a1a1a1",
        }}
      >
        2026
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>
        {/* Label */}
        <div
          ref={labelRef}
          className="label"
          style={{ marginBottom: "1.5rem", opacity: 0 }}
        >
          Real-Time Middleware · Razorpay AI Buildathon 2026
        </div>

        {/* Headline */}
        <div ref={headlineRef}>
          {["REAL-TIME", "TRANSACTION RISK", "& CHARGEBACK", "DEFENSE"].map((line, i) => (
            <div
              key={i}
              className="headline-line"
              style={{
                fontSize: "clamp(3rem, 8vw, 7.5rem)",
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: i === 2 ? "#0ed39a" : "#f7f7f2",
                opacity: 0,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Sub-copy + CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "2.5rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <p
            ref={subRef}
            style={{
              color: "#a1a1a1",
              maxWidth: "420px",
              lineHeight: 1.6,
              fontSize: "0.95rem",
              opacity: 0,
            }}
          >
            The intelligence layer between your payment flow and financial loss.
            Every transaction scored, explained, and decided in milliseconds.
          </p>

          <div ref={ctaRef} style={{ display: "flex", gap: "1rem", opacity: 0 }}>
            <a
              href="#contact"
              className="arrow-pill"
              style={{ color: "#f7f7f2", borderColor: "rgba(255,255,255,0.25)" }}
            >
              Contact <span className="pill-arrow">→</span>
            </a>
            <a
              href="#overview"
              className="arrow-pill"
              style={{ background: "#0ed39a", color: "#050505", border: "none" }}
            >
              Explore <span className="pill-arrow">↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom hairline */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "rgba(255,255,255,0.08)",
        }}
      />
    </section>
  );
}
