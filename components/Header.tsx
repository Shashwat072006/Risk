"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// PRD v4 Primary Navigation (§4)
const PRIMARY_NAV = [
  { label: "OVERVIEW",        href: "/command-center?tab=command",     tab: "command" },
  { label: "ACCOUNTS",        href: "/account-360",                     tab: "account360" },
  { label: "TRANSACTIONS",    href: "/command-center?tab=console",     tab: "console" },
  { label: "ALERTS",          href: "/command-center?tab=alerts",      tab: "alerts" },
  { label: "INVESTIGATIONS",  href: "/command-center?tab=investigate", tab: "investigate" },
  { label: "CASES",           href: "/command-center?tab=cases",       tab: "cases" },
  { label: "CAMPAIGNS",       href: "/command-center?tab=campaigns",   tab: "campaigns" },
  { label: "REPORTS",         href: "/command-center?tab=metrics",     tab: "metrics" },
];

// PRD v4 Specialist Navigation (§4)
const RISK_ENGINE_LINKS = [
  { label: "Rules",       href: "/command-center?tab=rules" },
  { label: "Models",      href: "/command-center?tab=models" },
  { label: "Simulator",   href: "/command-center?tab=policysim" },
  { label: "Attack Lab",  href: "/command-center?tab=attacklab" },
  { label: "Monitoring",  href: "/command-center?tab=metrics" },
];

const ADMIN_LINKS = [
  { label: "Consents",    href: "/account-360?tab=consent" },
  { label: "Evidence",    href: "/command-center?tab=investigate&sub=evidence" },
  { label: "Audit",       href: "/command-center?tab=audit" },
  { label: "Settings",    href: "/command-center?tab=rules" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const riskRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "command";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    const onClickOutside = (e: MouseEvent) => {
      if (riskRef.current && !riskRef.current.contains(e.target as Node)) setRiskOpen(false);
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false);
    };
    window.addEventListener("click", onClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClickOutside);
    };
  }, []);

  const isNavActive = (item: typeof PRIMARY_NAV[0]) => {
    if (item.label === "ACCOUNTS") return pathname.startsWith("/account-360");
    return pathname.startsWith("/command-center") && currentTab === item.tab;
  };

  return (
    <header className={`nav-header${scrolled ? " scrolled" : ""}`} suppressHydrationWarning>
      {/* Institution Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <Link href="/" className="nav-brand" suppressHydrationWarning style={{ textDecoration: "none" }}>
          RISK//01
        </Link>
        <span style={{ fontSize: "0.5625rem", fontFamily: "monospace", color: "var(--muted, #929292)", letterSpacing: "0.12em" }}>
          ATDP BANK OS
        </span>
      </div>

      {/* Primary Navigation (§4) */}
      <nav className="nav-links hidden-mobile" suppressHydrationWarning style={{ gap: "1.25rem" }}>
        {PRIMARY_NAV.map((link) => {
          const active = isNavActive(link);
          return (
            <Link
              key={link.label}
              href={link.href}
              className="nav-link"
              style={{
                fontSize: "0.625rem",
                letterSpacing: "0.1em",
                fontWeight: active ? 700 : 500,
                color: active ? "var(--text, #F5F4EF)" : "var(--muted, #929292)",
                borderBottom: active ? "1px solid var(--accent, #39FF88)" : "1px solid transparent",
                paddingBottom: "0.2rem",
                transition: "all 150ms ease",
              }}
            >
              {link.label}
            </Link>
          );
        })}

        <span style={{ width: 1, height: 14, background: "var(--line, #282828)", display: "inline-block", margin: "0 0.15rem" }} />

        {/* Specialist Dropdown: RISK ENGINE */}
        <div ref={riskRef} style={{ position: "relative" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRiskOpen(!riskOpen);
              setAdminOpen(false);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.625rem",
              letterSpacing: "0.1em",
              fontWeight: 600,
              color: riskOpen ? "var(--text, #F5F4EF)" : "var(--muted, #929292)",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.2rem 0",
              textTransform: "uppercase",
              fontFamily: "inherit",
            }}
          >
            <span>RISK ENGINE</span>
            <span style={{ fontSize: "0.5rem", color: "var(--muted, #929292)" }}>▾</span>
          </button>

          {riskOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "0.5rem",
                background: "var(--surface, #101010)",
                border: "1px solid var(--line, #282828)",
                padding: "0.5rem 0",
                minWidth: "140px",
                zIndex: 1000,
                boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
              }}
            >
              {RISK_ENGINE_LINKS.map((sub) => (
                <Link
                  key={sub.label}
                  href={sub.href}
                  onClick={() => setRiskOpen(false)}
                  style={{
                    display: "block",
                    padding: "0.45rem 1rem",
                    fontSize: "0.625rem",
                    fontFamily: "monospace",
                    color: "var(--text, #F5F4EF)",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    transition: "background 120ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2, #151515)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Specialist Dropdown: ADMIN */}
        <div ref={adminRef} style={{ position: "relative" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAdminOpen(!adminOpen);
              setRiskOpen(false);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.625rem",
              letterSpacing: "0.1em",
              fontWeight: 600,
              color: adminOpen ? "var(--text, #F5F4EF)" : "var(--muted, #929292)",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.2rem 0",
              textTransform: "uppercase",
              fontFamily: "inherit",
            }}
          >
            <span>ADMIN</span>
            <span style={{ fontSize: "0.5rem", color: "var(--muted, #929292)" }}>▾</span>
          </button>

          {adminOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "0.5rem",
                background: "var(--surface, #101010)",
                border: "1px solid var(--line, #282828)",
                padding: "0.5rem 0",
                minWidth: "140px",
                zIndex: 1000,
                boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
              }}
            >
              {ADMIN_LINKS.map((sub) => (
                <Link
                  key={sub.label}
                  href={sub.href}
                  onClick={() => setAdminOpen(false)}
                  style={{
                    display: "block",
                    padding: "0.45rem 1rem",
                    fontSize: "0.625rem",
                    fontFamily: "monospace",
                    color: "var(--text, #F5F4EF)",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    transition: "background 120ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2, #151515)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Quick Access CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Link
          href="/account-360"
          className="hidden-mobile"
          style={{
            fontSize: "0.625rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text, #F5F4EF)",
            background: "var(--surface, #101010)",
            border: "1px solid var(--line, #282828)",
            padding: "0.375rem 0.85rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            borderRadius: "2px",
          }}
        >
          <span>ACCOUNT 360</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent, #39FF88)" }} />
        </Link>
      </div>
    </header>
  );
}
