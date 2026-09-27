"use client";
import React, { useState } from "react";

export interface NetworkProfile {
  ipAddressTokenized: string;
  clusterId: string;
  asn: string;
  isp: string;
  country: string;
  city: string;
  isVpnProxy: boolean;
  isTorExit: boolean;
  ipReputationScore: number;
  accountsObserved: number;
  fraudLinkedAccounts: number;
  velocityHourly: number;
  status: "CRITICAL" | "RESIDENT_SAFE";
}

const NETWORKS_DATA: NetworkProfile[] = [
  {
    ipAddressTokenized: "185.220.101.•• [Tokenized]",
    clusterId: "IP-17",
    asn: "AS200052 Datacamp S.R.L.",
    isp: "Commercial Datacenter Hosting",
    country: "United Arab Emirates",
    city: "Dubai",
    isVpnProxy: true,
    isTorExit: true,
    ipReputationScore: 92,
    accountsObserved: 17,
    fraudLinkedAccounts: 4,
    velocityHourly: 28,
    status: "CRITICAL",
  },
  {
    ipAddressTokenized: "122.161.44.•• [Tokenized]",
    clusterId: "IP-RESIDENT-01",
    asn: "AS24560 Bharti Airtel Ltd",
    isp: "Airtel Broadband Residential",
    country: "India",
    city: "Delhi / Gurgaon",
    isVpnProxy: false,
    isTorExit: false,
    ipReputationScore: 4,
    accountsObserved: 1,
    fraudLinkedAccounts: 0,
    velocityHourly: 1,
    status: "RESIDENT_SAFE",
  },
];

export default function NetworkIntelligence() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkProfile>(NETWORKS_DATA[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Banner KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[
          { label: "IP CLUSTER", val: selectedNetwork.clusterId, sub: "Network community identifier", color: selectedNetwork.status === "CRITICAL" ? "#FF4D4D" : "#39FF88" },
          { label: "ASN & HOSTING", val: selectedNetwork.asn.split(" ")[0], sub: selectedNetwork.isp, color: "#F4F4F0" },
          { label: "GEO DEVIATION", val: selectedNetwork.city + ", " + selectedNetwork.country.slice(0, 3).toUpperCase(), sub: "Baseline: Delhi, IN", color: selectedNetwork.status === "CRITICAL" ? "#FFA31A" : "#39FF88" },
          { label: "IP REPUTATION RISK", val: `${selectedNetwork.ipReputationScore} / 100`, sub: selectedNetwork.isTorExit ? "TOR Exit Node" : "Clean residential", color: selectedNetwork.status === "CRITICAL" ? "#FF4D4D" : "#39FF88" },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px",
              padding: "1rem 1.25rem",
            }}
          >
            <div style={{ fontSize: "0.5625rem", fontFamily: "monospace", letterSpacing: "0.1em", color: "rgba(244,244,240,0.4)" }}>
              {c.label}
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "monospace", color: c.color, marginTop: "0.25rem" }}>
              {c.val}
            </div>
            <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.25rem", fontFamily: "monospace" }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Network Cards & Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1.5rem" }}>
        {/* Network Log History */}
        <div
          style={{
            background: "rgba(10,10,12,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1.25rem",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              fontFamily: "monospace",
              color: "rgba(244,244,240,0.6)",
              letterSpacing: "0.08em",
            }}
          >
            OBSERVED IP SESSIONS (30 DAYS)
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {NETWORKS_DATA.map((n) => {
              const isSelected = selectedNetwork.clusterId === n.clusterId;
              return (
                <div
                  key={n.clusterId}
                  onClick={() => setSelectedNetwork(n)}
                  style={{
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: isSelected ? "rgba(57,255,136,0.08)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "background 0.15s ease",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#F4F4F0" }}>{n.ipAddressTokenized}</span>
                      {n.status === "CRITICAL" ? (
                        <span style={{ fontSize: "0.5625rem", padding: "0.1rem 0.35rem", background: "rgba(255,77,77,0.2)", color: "#FF4D4D", border: "1px solid rgba(255,77,77,0.4)", borderRadius: "2px", fontFamily: "monospace" }}>
                          [CLUSTER {n.clusterId}]
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.5625rem", padding: "0.1rem 0.35rem", background: "rgba(57,255,136,0.1)", color: "#39FF88", borderRadius: "2px", fontFamily: "monospace" }}>
                          RESIDENTIAL
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.5)", marginTop: "0.2rem" }}>
                      {n.city}, {n.country} • {n.asn}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        fontWeight: 800,
                        color: n.ipReputationScore >= 80 ? "#FF4D4D" : "#39FF88",
                      }}
                    >
                      RISK {n.ipReputationScore}
                    </div>
                    <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.15rem", fontFamily: "monospace" }}>
                      {n.accountsObserved > 1 ? `${n.accountsObserved} Linked Accounts` : "Single Account"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forensic Network Profile Card (PRD §14) */}
        <div
          style={{
            background: "rgba(10,10,12,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "4px",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.625rem", color: "#39FF88", fontFamily: "monospace" }}>
                NETWORK INTELLIGENCE & IP REPUTATION // PRD §14
              </div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F4F4F0", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedNetwork.ipAddressTokenized}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.5)", marginTop: "0.15rem" }}>
                {selectedNetwork.asn} • {selectedNetwork.isp}
              </div>
            </div>

            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 800,
                fontFamily: "monospace",
                color: selectedNetwork.ipReputationScore >= 80 ? "#FF4D4D" : "#39FF88",
                background: selectedNetwork.ipReputationScore >= 80 ? "rgba(255,77,77,0.15)" : "rgba(57,255,136,0.15)",
                border: `1px solid ${selectedNetwork.ipReputationScore >= 80 ? "#FF4D4D" : "#39FF88"}`,
                padding: "0.3rem 0.6rem",
                borderRadius: "3px",
              }}
            >
              IP SCORE: {selectedNetwork.ipReputationScore}
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>VPN / PROXY / TOR EXIT</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: selectedNetwork.isTorExit ? "#FF4D4D" : "#39FF88", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedNetwork.isTorExit ? "TOR EXIT DETECTED" : "DIRECT RESIDENTIAL"}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                Anonymization infrastructure flag
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>ACCOUNTS ON IP (CLUSTER)</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: selectedNetwork.accountsObserved > 1 ? "#FF4D4D" : "#F4F4F0", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedNetwork.accountsObserved} Accounts ({selectedNetwork.clusterId})
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                4 accounts already confirmed fraud
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>IP VELOCITY</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: selectedNetwork.velocityHourly > 10 ? "#FF4D4D" : "#39FF88", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedNetwork.velocityHourly} txns / hour
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                High frequency cross-border burst
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>GEO CORROBORATION</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: selectedNetwork.country !== "India" ? "#FFA31A" : "#39FF88", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedNetwork.city}, {selectedNetwork.country}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                Distance from resident profile: 2,190 km
              </div>
            </div>
          </div>

          <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px", fontSize: "0.6875rem", fontFamily: "monospace", color: "rgba(244,244,240,0.7)" }}>
            <span style={{ color: "#FFA31A" }}>PRD §14 DIRECTIVE:</span> Do not block solely on IP. Combine IP telemetry with device fingerprinting and behavioral deviation before finalizing intervention.
          </div>
        </div>
      </div>
    </div>
  );
}
