"use client";
export default function Footer() {
  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "3rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem",
      }}
    >
      <div style={{
        fontSize: "0.9rem",
        fontWeight: 800,
        letterSpacing: "0.15em",
        color: "#0ed39a",
        textTransform: "uppercase",
      }}>
        RISK//01 · TransactionGuard
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        {["Privacy", "Security", "GitHub", "Docs"].map((link) => (
          <a
            key={link}
            href="#"
            style={{
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#a1a1a1",
              textDecoration: "none",
              transition: "color 200ms ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f7f7f2")}
            onMouseLeave={e => (e.currentTarget.style.color = "#a1a1a1")}
          >
            {link}
          </a>
        ))}
      </div>

      <div style={{ fontSize: "0.7rem", color: "#a1a1a1", letterSpacing: "0.05em" }}>
        © 2026 TransactionGuard · Razorpay AI Buildathon
      </div>
    </footer>
  );
}
