"use client";
import React, { useState } from "react";

export interface DeviceRecord {
  id: string;
  name: string;
  osBrowser: string;
  firstSeen: string;
  lastSeen: string;
  accountsConnected: number;
  customersCount: number;
  confirmedFraudLinks: number;
  deviceRisk: number;
  status: "CRITICAL" | "VERIFIED_RESIDENT";
  fingerprintHash: string;
  isEmulator: boolean;
  screenRes: string;
}

const DEVICES_DATA: DeviceRecord[] = [
  {
    id: "DEVICE-991",
    name: "Unrecognized Windows Workstation",
    osBrowser: "Windows 11 / Chrome 128 (Tokenized Canvas)",
    firstSeen: "14 minutes ago (05 Sep 2026 14:28)",
    lastSeen: "2 minutes ago (05 Sep 2026 14:42)",
    accountsConnected: 12,
    customersCount: 9,
    confirmedFraudLinks: 3,
    deviceRisk: 94,
    status: "CRITICAL",
    fingerprintHash: "fp_99182ab7c41098ef",
    isEmulator: true,
    screenRes: "1920x1080 (Headless Profile)",
  },
  {
    id: "DEV-IPHONE-15",
    name: "Rahul's iPhone 15 Pro",
    osBrowser: "iOS 18.0 / Native Mobile App v4.12",
    firstSeen: "2 years ago (14 Mar 2024)",
    lastSeen: "Today 11:20 AM",
    accountsConnected: 1,
    customersCount: 1,
    confirmedFraudLinks: 0,
    deviceRisk: 8,
    status: "VERIFIED_RESIDENT",
    fingerprintHash: "fp_ios_4821_a838bf",
    isEmulator: false,
    screenRes: "1179x2556 (Retina OLED)",
  },
  {
    id: "DEV-MACBOOK-M2",
    name: "MacBook Pro 14 (Work)",
    osBrowser: "macOS 15.1 / Safari 18.0",
    firstSeen: "1.5 years ago (10 Oct 2024)",
    lastSeen: "Yesterday 18:22 PM",
    accountsConnected: 1,
    customersCount: 1,
    confirmedFraudLinks: 0,
    deviceRisk: 6,
    status: "VERIFIED_RESIDENT",
    fingerprintHash: "fp_mac_4821_ee9102",
    isEmulator: false,
    screenRes: "3024x1964 (Liquid Retina)",
  },
];

export default function DeviceIntelligence() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceRecord>(DEVICES_DATA[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[
          { label: "LINKED DEVICES", val: "3 Total", sub: "2 Resident, 1 Novel", color: "#F4F4F0" },
          { label: "NOVEL DEVICE VELOCITY", val: "+1 New (14m ago)", sub: "DEVICE-991 added", color: "#FF4D4D" },
          { label: "CROSS-ACCOUNT LINKS", val: "12 Accounts", sub: "Shared hardware pool", color: "#FF4D4D" },
          { label: "DEVICE ANOMALY TIER", val: "CRITICAL 94", sub: "Headless Canvas match", color: "#FF4D4D" },
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

      {/* Main Grid: Device List vs Selected Device Forensic Inspection */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1.5rem" }}>
        {/* Device List */}
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
            REGISTERED DEVICE INVENTORY
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {DEVICES_DATA.map((d) => {
              const isSelected = selectedDevice.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDevice(d)}
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
                      <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#F4F4F0" }}>{d.name}</span>
                      {d.status === "CRITICAL" ? (
                        <span style={{ fontSize: "0.5625rem", padding: "0.1rem 0.35rem", background: "rgba(255,77,77,0.2)", color: "#FF4D4D", border: "1px solid rgba(255,77,77,0.4)", borderRadius: "2px", fontFamily: "monospace" }}>
                          [ALERT] NOVEL
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.5625rem", padding: "0.1rem 0.35rem", background: "rgba(57,255,136,0.1)", color: "#39FF88", borderRadius: "2px", fontFamily: "monospace" }}>
                          RESIDENT
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.5)", marginTop: "0.2rem" }}>
                      {d.osBrowser} • Seen: {d.lastSeen}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        fontWeight: 800,
                        color: d.deviceRisk >= 80 ? "#FF4D4D" : "#39FF88",
                      }}
                    >
                      RISK {d.deviceRisk}
                    </div>
                    <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.15rem", fontFamily: "monospace" }}>
                      {d.accountsConnected > 1 ? `${d.accountsConnected} ACCOUNTS` : "SINGLE USER"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Device Deep Forensic Card (PRD §13) */}
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
                DEVICE FORENSIC TELEMETRY // PRD §13
              </div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#F4F4F0", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedDevice.name}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "rgba(244,244,240,0.5)", marginTop: "0.15rem" }}>
                Hardware ID: {selectedDevice.id} • Hash: {selectedDevice.fingerprintHash}
              </div>
            </div>

            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 800,
                fontFamily: "monospace",
                color: selectedDevice.deviceRisk >= 80 ? "#FF4D4D" : "#39FF88",
                background: selectedDevice.deviceRisk >= 80 ? "rgba(255,77,77,0.15)" : "rgba(57,255,136,0.15)",
                border: `1px solid ${selectedDevice.deviceRisk >= 80 ? "#FF4D4D" : "#39FF88"}`,
                padding: "0.3rem 0.6rem",
                borderRadius: "3px",
              }}
            >
              DEVICE RISK: {selectedDevice.deviceRisk}
            </div>
          </div>

          {/* 6 Grid Specs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>ACCOUNTS CONNECTED</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: selectedDevice.accountsConnected > 1 ? "#FF4D4D" : "#F4F4F0", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedDevice.accountsConnected} Accounts
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                Shared hardware across unrelated accounts
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>CUSTOMERS IDENTIFIED</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: selectedDevice.customersCount > 1 ? "#FF4D4D" : "#F4F4F0", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedDevice.customersCount} Unique Identities
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                Device farm syndication signal
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>CONFIRMED FRAUD LINKS</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: selectedDevice.confirmedFraudLinks > 0 ? "#FF4D4D" : "#39FF88", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedDevice.confirmedFraudLinks} Accounts Blocked
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                Direct edges to Campaign #1842
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem", borderRadius: "3px" }}>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>EMULATOR / HEADLESS PROFILE</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: selectedDevice.isEmulator ? "#FF4D4D" : "#39FF88", fontFamily: "monospace", marginTop: "0.25rem" }}>
                {selectedDevice.isEmulator ? "TRUE (Automated VM)" : "FALSE (Hardware)"}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)", marginTop: "0.2rem" }}>
                WebGL vendor & canvas entropy check
              </div>
            </div>
          </div>

          <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px", fontSize: "0.6875rem", fontFamily: "monospace", color: "rgba(244,244,240,0.7)" }}>
            <span style={{ color: "#FFA31A" }}>PRD §13 GUIDANCE:</span> A shared device is a signal, not proof of fraud. Multiple accounts sharing hardware requires contextual corroboration (e.g. rapid beneficiary additions or velocity burst).
          </div>
        </div>
      </div>
    </div>
  );
}
