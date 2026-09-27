"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── PRD §4 Navigation Structure ──────────────────────────────────────────
const PRIMARY_NAV = [
  { href: "/command-center", label: "Overview",       icon: "⊞", badge: "LIVE" },
  { href: "/accounts",       label: "Accounts",       icon: "⊙" },
  { href: "/transactions",   label: "Transactions",   icon: "⇄" },
  { href: "/alerts",         label: "Alerts",         icon: "◉", badge: "5" },
  { href: "/investigate",    label: "Investigations", icon: "⊘" },
  { href: "/cases",          label: "Cases",          icon: "⊟" },
  { href: "/campaigns",      label: "Campaigns",      icon: "⊛", badge: "ACTIVE" },
  { href: "/reports",        label: "Reports",        icon: "≡" },
];

const RISK_ENGINE_NAV = [
  { href: "/rules",       label: "Rules",      icon: "⊕" },
  { href: "/models",      label: "Models",     icon: "⊗" },
  { href: "/simulator",   label: "Simulator",  icon: "◈" },
  { href: "/attack-lab",  label: "Attack Lab", icon: "◬" },
  { href: "/monitoring",  label: "Monitoring", icon: "⊶" },
];

const ADMIN_NAV = [
  { href: "/consents",  label: "Consents", icon: "⊜" },
  { href: "/evidence",  label: "Evidence", icon: "⊝" },
  { href: "/audit",     label: "Audit",    icon: "⊞" },
];

// All nav routes that map INTO the command-center consolidated app
// (since command-center is the main SPA hub, links to these still go to /command-center?tab=...)
const COMMAND_CENTER_ROUTES: Record<string, string> = {
  "/accounts":      "/command-center?tab=account360",
  "/transactions":  "/command-center?tab=console",
  "/alerts":        "/command-center?tab=alerts",
  "/investigate":   "/command-center?tab=investigate",
  "/cases":         "/command-center?tab=cases",
  "/campaigns":     "/command-center?tab=campaigns",
  "/reports":       "/command-center?tab=metrics",
  "/rules":         "/command-center?tab=rules",
  "/models":        "/command-center?tab=models",
  "/simulator":     "/command-center?tab=policysim",
  "/attack-lab":    "/command-center?tab=attacklab",
  "/monitoring":    "/command-center?tab=metrics",
  "/consents":      "/command-center?tab=audit",
  "/evidence":      "/command-center?tab=investigate",
  "/audit":         "/command-center?tab=audit",
};

function resolveHref(href: string): string {
  return COMMAND_CENTER_ROUTES[href] ?? href;
}

function isActive(href: string, pathname: string): boolean {
  if (href === "/command-center") {
    return pathname === "/command-center" || pathname === "/";
  }
  // For remapped routes, check if it's the current page or if ?tab= matches
  if (pathname === "/command-center" && typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    const mapped = COMMAND_CENTER_ROUTES[href];
    if (mapped) {
      const expectedTab = mapped.split("tab=")[1];
      return tab === expectedTab;
    }
  }
  return pathname.startsWith(href);
}

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  collapsed: boolean;
  pathname: string;
}

function NavItem({ href, label, icon, badge, collapsed, pathname }: NavItemProps) {
  const resolvedHref = resolveHref(href);
  const active = isActive(href, pathname);

  const badgeColor = badge === "LIVE" || badge === "ACTIVE"
    ? { bg: "rgba(57,255,136,0.15)", border: "rgba(57,255,136,0.3)", color: "#39FF88" }
    : { bg: "rgba(255,163,26,0.12)", border: "rgba(255,163,26,0.3)", color: "#FFA31A" };

  return (
    <Link
      href={resolvedHref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: collapsed ? "0.55rem 0" : "0.55rem 1rem",
        justifyContent: collapsed ? "center" : "flex-start",
        fontSize: "0.6875rem",
        fontWeight: active ? 700 : 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: active ? "#39FF88" : "#929292",
        textDecoration: "none",
        borderLeft: collapsed ? "none" : `2px solid ${active ? "#39FF88" : "transparent"}`,
        background: active ? "rgba(57,255,136,0.06)" : "transparent",
        transition: "all 150ms ease",
        whiteSpace: "nowrap",
        overflow: "hidden",
        borderRadius: collapsed ? "0" : "0",
        minHeight: "36px",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.color = "#F5F4EF";
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.color = "#929292";
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }
      }}
    >
      <span style={{ fontSize: "0.875rem", opacity: 0.8, flexShrink: 0 }}>{icon}</span>
      {!collapsed && (
        <>
          <span style={{ flex: 1 }}>{label}</span>
          {badge && (
            <span style={{
              fontSize: "0.45rem",
              fontWeight: 800,
              padding: "0.1rem 0.3rem",
              background: badgeColor.bg,
              border: `1px solid ${badgeColor.border}`,
              color: badgeColor.color,
              letterSpacing: "0.1em",
              flexShrink: 0,
            }}>
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function GroupLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) {
    return (
      <div style={{
        height: "1px",
        background: "#282828",
        margin: "0.5rem 0",
      }} />
    );
  }
  return (
    <div style={{
      padding: "0.75rem 1rem 0.25rem",
      fontSize: "0.5rem",
      fontWeight: 800,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "#3a3a3a",
    }}>
      {label}
    </div>
  );
}

export default function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/command-center";
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 52 : 220;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070707" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: sidebarWidth,
          background: "#101010",
          borderRight: "1px solid #282828",
          display: "flex",
          flexDirection: "column",
          zIndex: 200,
          overflowY: "auto",
          overflowX: "hidden",
          transition: "width 200ms ease",
        }}
      >
        {/* Brand / Logo */}
        <div style={{
          padding: collapsed ? "1rem 0" : "1rem",
          borderBottom: "1px solid #282828",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: "56px",
          flexShrink: 0,
        }}>
          {!collapsed && (
            <div>
              <div style={{
                fontSize: "0.5625rem",
                fontWeight: 900,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#39FF88",
                lineHeight: 1.2,
              }}>
                ATDP
              </div>
              <div style={{
                fontSize: "0.4375rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#535353",
                marginTop: "0.1rem",
              }}>
                Risk Operating System
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{
              fontSize: "0.5625rem",
              fontWeight: 900,
              letterSpacing: "0.1em",
              color: "#39FF88",
            }}>
              A
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              color: "#535353",
              cursor: "pointer",
              padding: "0.25rem",
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              display: "flex",
              alignItems: "center",
              transition: "color 150ms ease",
            }}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#929292"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#535353"}
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Live indicator */}
        {!collapsed && (
          <div style={{
            padding: "0.4rem 1rem",
            borderBottom: "1px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            flexShrink: 0,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#39FF88",
              display: "inline-block",
              boxShadow: "0 0 6px #39FF88",
              animation: "pulse 2s infinite",
            }} />
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
            <span style={{ fontSize: "0.4375rem", fontWeight: 700, letterSpacing: "0.14em", color: "#39FF88" }}>LIVE</span>
            <span style={{ fontSize: "0.4375rem", color: "#535353", marginLeft: "auto", letterSpacing: "0.08em" }}>
              {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
            </span>
          </div>
        )}

        {/* Primary Nav */}
        <nav style={{ flex: 1, paddingTop: "0.5rem" }}>
          <GroupLabel label="Primary" collapsed={collapsed} />
          {PRIMARY_NAV.map(item => (
            <NavItem key={item.href} {...item} collapsed={collapsed} pathname={pathname} />
          ))}

          <GroupLabel label="Risk Engine" collapsed={collapsed} />
          {RISK_ENGINE_NAV.map(item => (
            <NavItem key={item.href} {...item} collapsed={collapsed} pathname={pathname} />
          ))}

          <GroupLabel label="Admin" collapsed={collapsed} />
          {ADMIN_NAV.map(item => (
            <NavItem key={item.href} {...item} collapsed={collapsed} pathname={pathname} />
          ))}
        </nav>

        {/* Footer meta */}
        {!collapsed && (
          <div style={{
            padding: "0.75rem 1rem",
            borderTop: "1px solid #1f1f1f",
            flexShrink: 0,
          }}>
            <div style={{ fontSize: "0.4375rem", color: "#3a3a3a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.15rem" }}>
              Analyst Session
            </div>
            <div style={{ fontSize: "0.5rem", color: "#535353", letterSpacing: "0.06em" }}>
              analyst_021 · Risk Ops
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main style={{
        marginLeft: sidebarWidth,
        flex: 1,
        minWidth: 0,
        transition: "margin-left 200ms ease",
      }}>
        {children}
      </main>
    </div>
  );
}
