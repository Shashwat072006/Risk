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
      className={`nav-header ${scrolled ? "scrolled" : ""}`}
      suppressHydrationWarning
    >
      {/* Brand */}
      <div
        className="nav-brand"
        suppressHydrationWarning
      >
        RISK//01
      </div>

      {/* Desktop nav */}
      <nav className="nav-links hidden-mobile" suppressHydrationWarning>
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="nav-link"
          >
            {link}
          </a>
        ))}
      </nav>

      {/* CTA pill */}
      <a
        href="#contact"
        className="arrow-pill nav-cta"
      >
        Get Access <span className="pill-arrow">→</span>
      </a>
    </header>
  );
}
