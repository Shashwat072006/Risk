"use client";

interface Feature {
  feature: string;
  value: number;
}

interface FeatureBarProps {
  features: Feature[];
}

const FEATURE_LABELS: Record<string, string> = {
  amount_log:         "Amount (log)",
  merchant_risk_tier: "Merchant Risk Tier",
  account_age_days:   "Account Age",
  device_age_days:    "Device Age",
  prior_declines_1h:  "Prior Declines (1h)",
  txn_count_1h:       "Txn Count (1h)",
  txn_count_24h:      "Txn Count (24h)",
  cards_on_device_7d: "Cards on Device (7d)",
  accounts_on_ip_24h: "Accounts on IP (24h)",
  is_vpn_or_proxy:    "VPN / Proxy",
  failed_then_success:"Failed then Success",
  is_new_device:      "New Device",
  hour_of_day:        "Hour of Day",
  geo_mismatch:       "Geo Mismatch",
  amount_zscore:      "Amount Z-Score",
  velocity_score:     "Velocity Score",
};

export default function FeatureBar({ features }: FeatureBarProps) {
  if (!features || features.length === 0) {
    return (
      <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.3)", fontStyle: "italic" }}>
        No feature data available
      </div>
    );
  }

  const maxVal = Math.max(...features.map((f) => Math.abs(f.value)), 0.001);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      <div
        style={{
          fontSize: "0.5rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(244,244,240,0.4)",
          marginBottom: "0.25rem",
        }}
      >
        Top ML Feature Contributions
      </div>
      {features.map((f, i) => {
        const pct = (Math.abs(f.value) / maxVal) * 100;
        const label = FEATURE_LABELS[f.feature] ?? f.feature.replace(/_/g, " ");
        return (
          <div key={f.feature} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Rank */}
            <span
              style={{
                fontSize: "0.5rem",
                fontWeight: 600,
                color: "rgba(244,244,240,0.25)",
                minWidth: 14,
                textAlign: "right",
              }}
            >
              {i + 1}
            </span>
            {/* Label */}
            <span
              style={{
                fontSize: "0.625rem",
                color: "rgba(244,244,240,0.7)",
                minWidth: 140,
                letterSpacing: "0.02em",
              }}
            >
              {label}
            </span>
            {/* Bar */}
            <div
              style={{
                flex: 1,
                height: 4,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: i === 0 ? "#E600FF" : i === 1 ? "#FFA31A" : "#00F6FF",
                  borderRadius: 2,
                  transition: "width 600ms ease",
                }}
              />
            </div>
            {/* Value */}
            <span
              style={{
                fontSize: "0.5rem",
                fontFamily: "monospace",
                color: "rgba(244,244,240,0.35)",
                minWidth: 40,
                textAlign: "right",
              }}
            >
              {f.value.toFixed(3)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
