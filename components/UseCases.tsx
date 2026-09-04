"use client";

const CASES = [
  {
    title: "FRAUD\nPREVENTION",
    category: "Real-Time Defense",
    desc: "Block card-testing bursts before the first successful charge completes.",
    accent: "#0ed39a",
    bg: "#0f1a15",
  },
  {
    title: "ACCOUNT\nTAKEOVER",
    category: "Identity Protection",
    desc: "Detect credential stuffing and device-account anomalies at login.",
    accent: "#f7f7f2",
    bg: "#1a1a1a",
  },
  {
    title: "CHARGEBACK\nDEFENSE",
    category: "Loss Prevention",
    desc: "Predict and prevent chargeback-prone transactions before settlement.",
    accent: "#0ed39a",
    bg: "#050505",
  },
  {
    title: "SEE ALL\nUSE CASES",
    category: "",
    desc: "",
    accent: "#0ed39a",
    bg: "#0ed39a",
    isCTA: true,
  },
];

export default function UseCases() {
  return (
    <section style={{ background: "#050505", padding: "7rem 2.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="label" style={{ marginBottom: "3rem" }}>Use Cases</div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 280px)",
        gap: "1rem",
        maxWidth: "900px",
      }}>
        {CASES.map((c, i) => (
          <div
            key={i}
            style={{
              background: c.bg,
              border: c.isCTA ? "none" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "transform 250ms ease, box-shadow 250ms ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${c.accent}22`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            {c.isCTA ? (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "#050505", textTransform: "uppercase" }}>
                  All Cases
                </div>
                <div style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 900, textTransform: "uppercase",
                  letterSpacing: "-0.02em", lineHeight: 1.0, color: "#050505",
                  whiteSpace: "pre-line",
                }}>
                  {c.title}
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "#050505", color: "#f7f7f2",
                  padding: "0.5rem 1.25rem", borderRadius: "9999px",
                  fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase", alignSelf: "flex-start",
                }}>
                  Explore <span>→</span>
                </div>
              </div>
            ) : (
              <>
                <div className="label" style={{ color: "#a1a1a1" }}>{c.category}</div>
                <div>
                  <div style={{
                    fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
                    fontWeight: 900, textTransform: "uppercase",
                    letterSpacing: "-0.02em", lineHeight: 1.0,
                    color: c.accent, marginBottom: "1rem",
                    whiteSpace: "pre-line",
                  }}>
                    {c.title}
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#a1a1a1", lineHeight: 1.6 }}>
                    {c.desc}
                  </p>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "transparent", color: c.accent,
                  border: `1px solid ${c.accent}44`,
                  padding: "0.4rem 1rem", borderRadius: "9999px",
                  fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase", alignSelf: "flex-start",
                  cursor: "pointer",
                }}>
                  View Case <span>→</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
