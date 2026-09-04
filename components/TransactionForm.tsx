"use client";
import { useState } from "react";

const MERCHANT_CATEGORIES = [
  "e-commerce", "gaming", "travel", "food_delivery",
  "electronics", "fashion", "groceries", "streaming",
];
const MERCHANT_RISK_TIER: Record<string, number> = {
  gaming: 3, electronics: 3, travel: 2, "e-commerce": 2,
  food_delivery: 1, fashion: 1, groceries: 1, streaming: 1,
};
const COUNTRIES = ["US", "GB", "IN", "SG", "AE", "NG", "PK", "BD", "RU", "CN"];

export interface TxnFormData {
  transaction_id: string;
  amount: number;
  merchant_category: string;
  merchant_risk_tier: number;
  billing_country: string;
  ip_country: string;
  account_age_days: number;
  device_age_days: number;
  prior_declines_1h: number;
  txn_count_1h: number;
  txn_count_24h: number;
  cards_on_device_7d: number;
  accounts_on_ip_24h: number;
  is_vpn_or_proxy: number;
  failed_then_success: number;
  is_new_device: number;
  hour_of_day: number;
}

const DEFAULT_FORM: TxnFormData = {
  transaction_id: "TX-DEMO0001",
  amount: 89.99,
  merchant_category: "e-commerce",
  merchant_risk_tier: 2,
  billing_country: "US",
  ip_country: "US",
  account_age_days: 365,
  device_age_days: 180,
  prior_declines_1h: 0,
  txn_count_1h: 1,
  txn_count_24h: 3,
  cards_on_device_7d: 1,
  accounts_on_ip_24h: 1,
  is_vpn_or_proxy: 0,
  failed_then_success: 0,
  is_new_device: 0,
  hour_of_day: 14,
};

interface Props {
  onSubmit: (data: TxnFormData) => void;
  onLoadSample: (type: "fraud" | "legit") => void;
  loading?: boolean;
}

export default function TransactionForm({ onSubmit, onLoadSample, loading }: Props) {
  const [form, setForm] = useState<TxnFormData>(DEFAULT_FORM);

  const set = (k: keyof TxnFormData, v: number | string) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "merchant_category") {
        next.merchant_risk_tier = MERCHANT_RISK_TIER[v as string] ?? 1;
      }
      if (k === "device_age_days") {
        next.is_new_device = Number(v) < 2 ? 1 : 0;
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Sync form when parent loads a sample
  const updateFromSample = (sample: Partial<TxnFormData>) => {
    setForm((prev) => ({ ...prev, ...sample }));
  };

  // Expose update to parent via imperative handle — handled by parent passing data back
  // (parent will update form via key prop if needed)

  const field = (label: string, key: keyof TxnFormData, type: "number" | "text" = "number", step?: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label
        style={{
          fontSize: "0.5rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.45)",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        step={step}
        value={form[key] as string | number}
        onChange={(e) =>
          set(key, type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
        }
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F4F4F0",
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          outline: "none",
          width: "100%",
          fontFamily: "monospace",
          boxSizing: "border-box",
        }}
      />
    </div>
  );

  const selectField = (label: string, key: keyof TxnFormData, options: string[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label
        style={{
          fontSize: "0.5rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.45)",
        }}
      >
        {label}
      </label>
      <select
        value={form[key] as string}
        onChange={(e) => set(key, e.target.value)}
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F4F4F0",
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
          outline: "none",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  const toggleField = (label: string, key: keyof TxnFormData) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
      <label
        style={{
          fontSize: "0.5rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.45)",
        }}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => set(key, form[key] ? 0 : 1)}
        style={{
          width: 40,
          height: 22,
          background: form[key] ? "rgba(57,255,136,0.2)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${form[key] ? "rgba(57,255,136,0.4)" : "rgba(255,255,255,0.12)"}`,
          borderRadius: 11,
          cursor: "pointer",
          position: "relative",
          transition: "background 200ms ease, border-color 200ms ease",
          padding: 0,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: form[key] ? 20 : 3,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: form[key] ? "#39FF88" : "rgba(255,255,255,0.3)",
            transition: "left 200ms ease, background 200ms ease",
          }}
        />
      </button>
    </div>
  );

  const sectionHead = (text: string) => (
    <div
      style={{
        fontSize: "0.5rem",
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(244,244,240,0.3)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: "0.5rem",
        marginTop: "0.5rem",
      }}
    >
      {text}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Sample loaders */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={() => onLoadSample("fraud")}
          style={{
            flex: 1,
            padding: "0.625rem",
            background: "rgba(255,77,77,0.08)",
            border: "1px solid rgba(255,77,77,0.3)",
            color: "#FF4D4D",
            fontSize: "0.5625rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          FRAUD SAMPLE
        </button>
        <button
          type="button"
          onClick={() => onLoadSample("legit")}
          style={{
            flex: 1,
            padding: "0.625rem",
            background: "rgba(57,255,136,0.08)",
            border: "1px solid rgba(57,255,136,0.3)",
            color: "#39FF88",
            fontSize: "0.5625rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          LEGIT SAMPLE
        </button>
      </div>

      {sectionHead("Transaction")}
      {field("Amount (USD)", "amount", "number", "0.01")}
      {selectField("Merchant Category", "merchant_category", MERCHANT_CATEGORIES)}
      {field("Merchant Risk Tier (1–3)", "merchant_risk_tier")}

      {sectionHead("Geography")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {selectField("Billing Country", "billing_country", COUNTRIES)}
        {selectField("IP Country", "ip_country", COUNTRIES)}
      </div>

      {sectionHead("Account & Device")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {field("Account Age (days)", "account_age_days")}
        {field("Device Age (days)", "device_age_days")}
      </div>

      {sectionHead("Velocity Signals")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {field("Txn Count (1h)", "txn_count_1h")}
        {field("Txn Count (24h)", "txn_count_24h")}
        {field("Prior Declines (1h)", "prior_declines_1h")}
        {field("Cards on Device (7d)", "cards_on_device_7d")}
        {field("Accounts on IP (24h)", "accounts_on_ip_24h")}
        {field("Hour of Day", "hour_of_day")}
      </div>

      {sectionHead("Flags")}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {toggleField("VPN / Proxy", "is_vpn_or_proxy")}
        {toggleField("Failed then Success", "failed_then_success")}
        {toggleField("New Device", "is_new_device")}
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: "0.5rem",
          padding: "0.875rem",
          background: loading ? "rgba(57,255,136,0.1)" : "#39FF88",
          border: "none",
          color: loading ? "#39FF88" : "#050505",
          fontSize: "0.6875rem",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 200ms ease, color 200ms ease",
        }}
      >
        {loading ? "Scoring..." : "Score Transaction"}
      </button>
    </form>
  );
}

export { DEFAULT_FORM };
export type { TxnFormData as FormData };
