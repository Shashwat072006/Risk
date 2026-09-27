"use client";
import { useRef, useState } from "react";

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const inputStyle = (field: string) => ({
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${focused === field ? "#0ed39a" : "rgba(255,255,255,0.2)"}`,
    color: "#f7f7f2",
    fontSize: "1rem",
    padding: "0.75rem 0",
    width: "100%",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 250ms ease",
  });

  return (
    <section
      id="contact"
      style={{
        background: "#050505",
        padding: "8rem 2.5rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "700px" }}>
        <div className="label" style={{ marginBottom: "1.5rem" }}>Talk to Risk Ops</div>
        <h2 style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
          lineHeight: 1.0,
          marginBottom: "3rem",
          color: "#f7f7f2",
        }}>
          GET<br /><span style={{ color: "#0ed39a" }}>ACCESS</span>
        </h2>

        {sent ? (
          <div style={{
            padding: "2.5rem",
            border: "1px solid rgba(14,211,154,0.3)",
            borderRadius: "16px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "1.25rem", color: "#39FF88", fontWeight: 800, marginBottom: "0.5rem" }}>[ACKNOWLEDGED]</div>
            <div style={{ color: "#0ed39a", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.05em" }}>
              MESSAGE SENT
            </div>
            <div style={{ color: "#a1a1a1", marginTop: "0.5rem", fontSize: "0.85rem" }}>
              Our risk ops team will be in touch within 24 hours.
            </div>
          </div>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); setSent(true); }}
            style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
          >
            <div>
              <label className="label" htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                required
                style={inputStyle("name")}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
              />
            </div>

            <div>
              <label className="label" htmlFor="company" style={{ display: "block", marginBottom: "0.5rem" }}>
                Company / Email
              </label>
              <input
                id="company"
                type="text"
                placeholder="company@example.com"
                required
                style={inputStyle("company")}
                onFocus={() => setFocused("company")}
                onBlur={() => setFocused(null)}
              />
            </div>

            <div>
              <label className="label" htmlFor="message" style={{ display: "block", marginBottom: "0.5rem" }}>
                Tell us about your payment flow
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Describe your transaction volume, fraud challenges, and what you're looking to solve..."
                required
                style={{ ...inputStyle("message"), resize: "none" as const }}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "#f7f7f2",
                  color: "#050505",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.85rem 2rem",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#0ed39a";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#f7f7f2";
                }}
              >
                Send
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "28px", height: "28px",
                  background: "#050505", color: "#f7f7f2",
                  borderRadius: "50%", fontSize: "0.9rem",
                }}>
                  →
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
