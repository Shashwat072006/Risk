"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LINKS = ["Overview", "Transactions", "Rules", "Models", "Chargebacks"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "1.25rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "background 350ms ease, backdrop-filter 350ms ease, border-bottom 350ms ease",
      }}
    >
      {/* Brand */}
      <div style={{
        fontSize: "0.9rem",
        fontWeight: 800,
        letterSpacing: "0.15em",
        color: "#0ed39a",
        textTransform: "uppercase",
        userSelect: "none",
      }}>
        RISK//01
      </div>

      {/* Desktop nav */}
      <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}
        className="hidden-mobile">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#a1a1a1",
              textDecoration: "none",
              transition: "color 200ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f7f7f2")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1a1")}
          >
            {link}
          </a>
        ))}
      </nav>

      {/* CTA pill */}
      <a
        href="#contact"
        className="arrow-pill"
        style={{
          background: "#0ed39a",
          color: "#050505",
          border: "none",
          fontSize: "0.75rem",
        }}
      >
        Get Access <span className="pill-arrow">→</span>
      </a>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
