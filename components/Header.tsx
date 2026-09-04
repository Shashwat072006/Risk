"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const LANDING_LINKS = [
  { label: "Live",     href: "/#live" },
  { label: "Engine",   href: "/#engine" },
  { label: "Signals",  href: "/#collage" },
  { label: "Lab",      href: "/#lab" },
];

const CONSOLE_LINKS = [
  { label: "Command Center", href: "/command-center", color: "#39FF88" },
  { label: "Console",        href: "/risk-console",   color: "#39FF88" },
  { label: "Investigate",    href: "/investigate",    color: "#00F6FF" },
  { label: "Campaigns",      href: "/campaigns",      color: "#FF4D4D" },
  { label: "Cases",          href: "/cases",          color: "#00F6FF" },
  { label: "Attack Lab",     href: "/attack-lab",     color: "#E600FF" },
  { label: "Metrics",        href: "/metrics",        color: "rgba(244,244,240,0.6)" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav-header${scrolled ? " scrolled" : ""}`} suppressHydrationWarning>
      {/* Brand */}
      <Link href="/" className="nav-brand" suppressHydrationWarning style={{ textDecoration: "none" }}>
        RISK//01
      </Link>

      {/* Desktop landing links */}
      <nav className="nav-links hidden-mobile" suppressHydrationWarning>
        {LANDING_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="nav-link">
            {link.label}
          </a>
        ))}

        <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.12)", display: "inline-block", margin: "0 0.25rem" }} />

        {CONSOLE_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nav-link"
            style={{ color: link.color, fontWeight: link.label === "Command Center" || link.label === "Console" ? 600 : 400 }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <Link href="/command-center" className="nav-cta hidden-mobile">
        Command Center
      </Link>
    </header>
  );
}
