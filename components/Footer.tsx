"use client";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "2.5rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem",
      }}
    >
      {/* Brand */}
      <div
        className="nav-brand"
        suppressHydrationWarning
      >
        RISK//01
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {[
          { label: "Console", href: "/risk-console" },
          { label: "Metrics", href: "/metrics" },
          { label: "GitHub", href: "#" },
          { label: "Docs", href: "#" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="nav-link"
            style={{ fontSize: "0.5625rem" }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <div style={{ fontSize: "0.5rem", color: "#333", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        © 2026 TransactionGuard · Razorpay AI Buildathon
      </div>
    </footer>
  );
}
