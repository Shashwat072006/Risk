"use client";
import React from "react";

export interface CardRecord {
  id: string;
  tokenizedPan: string;
  cardholderName: string;
  cardBrand: "VISA" | "RUPAY" | "MASTERCARD";
  type: "DEBIT" | "CREDIT";
  expiry: string;
  status: "ACTIVE" | "FROZEN" | "SUSPENDED";
  threeDsCavv: string;
  threeDsEci: string;
  monthlyLimit: number;
  spentThisMonth: number;
  chargebackCount: number;
  lastUsed: string;
  lastMerchant: string;
  riskTier: "NORMAL" | "HIGH";
}

const CARDS_DATA: CardRecord[] = [
  {
    id: "CARD-4921",
    tokenizedPan: "•••• •••• •••• 4921",
    cardholderName: "Rahul Sharma",
    cardBrand: "VISA",
    type: "DEBIT",
    expiry: "09/29",
    status: "ACTIVE",
    threeDsCavv: "AAABBBCCDDEEFF0011223344",
    threeDsEci: "05 (Fully Authenticated 3DS)",
    monthlyLimit: 500000,
    spentThisMonth: 86450,
    chargebackCount: 0,
    lastUsed: "05 Sep 2026 11:20 AM",
    lastMerchant: "Nature's Basket Connaught Place",
    riskTier: "NORMAL",
  },
  {
    id: "CARD-8104",
    tokenizedPan: "•••• •••• •••• 8104",
    cardholderName: "Rahul Sharma",
    cardBrand: "RUPAY",
    type: "CREDIT",
    expiry: "11/28",
    status: "ACTIVE",
    threeDsCavv: "RU992019488219AAFE0011",
    threeDsEci: "05 (Fully Authenticated 3DS)",
    monthlyLimit: 300000,
    spentThisMonth: 42000,
    chargebackCount: 0,
    lastUsed: "01 Sep 2026 17:45 PM",
    lastMerchant: "DLF Lease Direct Payment",
    riskTier: "NORMAL",
  },
];

export default function CardsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header telemetry */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[
          { label: "LINKED PAYMENT CARDS", val: "2 Cards Active", sub: "1 Visa Debit, 1 RuPay Credit", color: "#F5F4EF" },
          { label: "TOKENIZED PAN", val: "PCI-DSS 4.0", sub: "Zero raw PAN on filesystem", color: "#39FF88" },
          { label: "3DS CAVV COMPLIANCE", val: "ECI 05 Valid", sub: "Cryptographic liability shift", color: "#39FF88" },
          { label: "HISTORICAL CHARGEBACKS", val: "0 (0.0%)", sub: "Clean disputeless tenure", color: "#39FF88" },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "#101010",
              border: "1px solid #282828",
              borderRadius: "4px",
              padding: "1rem 1.25rem",
            }}
          >
            <div style={{ fontSize: "0.5625rem", fontFamily: "monospace", letterSpacing: "0.1em", color: "#929292" }}>
              {c.label}
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "monospace", color: c.color, marginTop: "0.25rem" }}>
              {c.val}
            </div>
            <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.25rem", fontFamily: "monospace" }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Cards Display Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
        {CARDS_DATA.map((card) => (
          <div
            key={card.id}
            style={{
              background: "#101010",
              border: "1px solid #282828",
              borderRadius: "6px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Visual Bank Card Preview */}
            <div
              style={{
                background:
                  card.cardBrand === "VISA"
                    ? "linear-gradient(135deg, #121820 0%, #070707 100%)"
                    : "linear-gradient(135deg, #20150d 0%, #070707 100%)",
                border: "1px solid #282828",
                borderRadius: "8px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.6875rem", fontFamily: "monospace", letterSpacing: "0.1em", color: "#929292" }}>
                  {card.type} CARD · {card.cardBrand}
                </span>
                <span style={{ fontSize: "0.5625rem", padding: "0.15rem 0.4rem", background: "rgba(57,255,136,0.15)", color: "#39FF88", borderRadius: "2px", fontFamily: "monospace" }}>
                  ● {card.status}
                </span>
              </div>

              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#F5F4EF", fontFamily: "monospace", letterSpacing: "0.15em" }}>
                {card.tokenizedPan}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: "0.5rem", color: "#929292", fontFamily: "monospace" }}>CARDHOLDER</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
                    {card.cardholderName.toUpperCase()}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.5rem", color: "#929292", fontFamily: "monospace" }}>EXPIRES</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#F5F4EF", fontFamily: "monospace" }}>
                    {card.expiry}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.6875rem", fontFamily: "monospace" }}>
              <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.6rem", borderRadius: "3px" }}>
                <span style={{ color: "#929292" }}>Monthly Limit:</span>
                <div style={{ color: "#F5F4EF", fontWeight: 700, marginTop: "0.2rem" }}>₹{card.monthlyLimit.toLocaleString("en-IN")}</div>
              </div>
              <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.6rem", borderRadius: "3px" }}>
                <span style={{ color: "#929292" }}>Spent This Month:</span>
                <div style={{ color: "#F5F4EF", fontWeight: 700, marginTop: "0.2rem" }}>₹{card.spentThisMonth.toLocaleString("en-IN")}</div>
              </div>
              <div style={{ background: "#151515", border: "1px solid #282828", padding: "0.6rem", borderRadius: "3px", gridColumn: "span 2" }}>
                <span style={{ color: "#929292" }}>3DS ECI & CAVV:</span>
                <div style={{ color: "#F5F4EF", marginTop: "0.2rem" }}>{card.threeDsEci}</div>
                <div style={{ fontSize: "0.5625rem", color: "#929292", marginTop: "0.1rem" }}>CAVV: {card.threeDsCavv}</div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => alert(`Temporary Freeze applied to ${card.tokenizedPan}`)}
                style={{
                  flex: 1,
                  background: "rgba(255,163,26,0.08)",
                  border: "1px solid rgba(255,163,26,0.3)",
                  color: "#FFA31A",
                  padding: "0.4rem",
                  borderRadius: "3px",
                  fontSize: "0.6875rem",
                  fontFamily: "monospace",
                  cursor: "pointer",
                }}
              >
                [Freeze Card]
              </button>
              <button
                onClick={() => alert(`Reset 3DS step-up limits for ${card.tokenizedPan}`)}
                style={{
                  flex: 1,
                  background: "#151515",
                  border: "1px solid #282828",
                  color: "#F5F4EF",
                  padding: "0.4rem",
                  borderRadius: "3px",
                  fontSize: "0.6875rem",
                  fontFamily: "monospace",
                  cursor: "pointer",
                }}
              >
                Set Limits
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
