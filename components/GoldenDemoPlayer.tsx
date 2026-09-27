"use client";
import React, { useState, useEffect } from "react";

export interface GoldenStep {
  num: number;
  title: string;
  module: string;
  subtab?: string;
  narrative: string;
  systemAction: string;
  highlightData?: string;
}

export const GOLDEN_STEPS: GoldenStep[] = [
  {
    num: 1,
    title: "Open Account 360",
    module: "account360",
    subtab: "overview",
    narrative: "Authorized analyst loads Rahul Sharma (Account ••••4821, Premium Segment, 6Y 4M tenure).",
    systemAction: "Customer profile, balance (₹1,84,240), and KYC status loaded from approved sandbox connector.",
    highlightData: "Rahul Sharma • Premium • 6Y 4M Tenure",
  },
  {
    num: 2,
    title: "View Passbook Statement",
    module: "account360",
    subtab: "passbook",
    narrative: "Analyst reviews chronological ledger statement showing routine salary and grocery transactions.",
    systemAction: "Passbook renders historical events with date grouping and clean risk tags.",
    highlightData: "148,000 Salary Credit • Normal Risk",
  },
  {
    num: 3,
    title: "Observe Normal Behavior",
    module: "account360",
    subtab: "risk",
    narrative: "Learned behavioral baseline confirms typical payments of ₹1.5k–₹8k, daytime hours, resident Delhi/Gurgaon.",
    systemAction: "Behavioral baseline deviation remains calm at 14/100.",
    highlightData: "Resident Profile: iPhone 15 / MacBook Pro",
  },
  {
    num: 4,
    title: "New ₹84,000 Transfer Appears",
    module: "account360",
    subtab: "passbook",
    narrative: "Real-time payment event TX-92831 arrives via Instant Payment rail for ₹84,000 at 03:14 AM IST.",
    systemAction: "Real-time payment gateway triggers immediate event normalization.",
    highlightData: "TX-92831 • ₹84,000 • Instant Payment Rail",
  },
  {
    num: 5,
    title: "New Beneficiary Detected",
    module: "account360",
    subtab: "beneficiaries",
    narrative: "Recipient BEN-918 was registered just 2 minutes prior with 0 prior transactions.",
    systemAction: "Beneficiary intelligence identifies 7 connected accounts across 3 shared devices.",
    highlightData: "BEN-918 • 2 mins ago • 0 Prior Txns",
  },
  {
    num: 6,
    title: "New Device Detected",
    module: "account360",
    subtab: "devices",
    narrative: "Event origin traced to DEVICE-991 (Windows 11 / Headless Chrome), first seen 14 minutes ago.",
    systemAction: "Device intelligence detects canvas fingerprint collision with 12 other customer accounts.",
    highlightData: "DEVICE-991 • Headless Chrome • 12 Accounts Linked",
  },
  {
    num: 7,
    title: "Behavioral Deviation Rises",
    module: "account360",
    subtab: "risk",
    narrative: "Simultaneous deviation across amount, nocturnal timing, overseas IP (Dubai), and novel hardware.",
    systemAction: "Behavioral anomaly model spikes from 14/100 to 94/100 [CRITICAL].",
    highlightData: "Behavior Deviation: 94/100 Critical",
  },
  {
    num: 8,
    title: "Entity Graph Traversal",
    module: "account360",
    subtab: "network",
    narrative: "Graph query links DEVICE-991 and IP-17 across multiple card-testing attempts.",
    systemAction: "Graph engine establishes topological distance of 1 hop to confirmed fraud nodes.",
    highlightData: "Cluster IP-17 • Datacenter Tor Exit",
  },
  {
    num: 9,
    title: "Campaign Engine Links 17 Accounts",
    module: "campaigns",
    narrative: "Coordinated cluster engine attaches event to active Campaign #1842 (Credential Stuffing + ATO).",
    systemAction: "Campaign exposure recalculated to ₹18.4L across 31 tokenized cards.",
    highlightData: "Campaign #1842 • 17 Accounts • ₹18.4L Exposure",
  },
  {
    num: 10,
    title: "Multi-Model Risk Scores Update",
    module: "console",
    narrative: "Multi-model layer computes decoupled vectors: Fraud 82, ATO 67, APP 74, Novelty 92, Campaign 88.",
    systemAction: "Composite threat score evaluated at 84/100.",
    highlightData: "Composite Risk 84/100 • Novelty 92 • Campaign 88",
  },
  {
    num: 11,
    title: "Expected-Loss Optimizer Chooses STEP-UP",
    module: "console",
    narrative: "Decision optimizer calculates that a step-up challenge minimizes expected total financial loss.",
    systemAction: "Decision issued: STEP-UP AUTHENTICATION (3DS / Biometric).",
    highlightData: "Decision: STEP-UP (Expected Loss Minimized)",
  },
  {
    num: 12,
    title: "Authentication Fails",
    module: "console",
    narrative: "Attacker attempts SIM-swap / OTP interception, but device biometrics and 3DS challenge fail.",
    systemAction: "3DS CAVV returned bypass failure code ECI 07.",
    highlightData: "3DS Challenge Failed • ECI 07",
  },
  {
    num: 13,
    title: "Transaction Becomes BLOCK",
    module: "console",
    narrative: "Adaptive escalation immediately transitions transaction status from STEP-UP to BLOCK.",
    systemAction: "Instant payment rail halted; ₹84,000 preserved in customer account.",
    highlightData: "Final Action: BLOCK • ₹84,000 Preserved",
  },
  {
    num: 14,
    title: "Case Is Created",
    module: "cases",
    narrative: "Incident automatically packaged into Case #CS-4091 assigned to Fraud Investigation queue.",
    systemAction: "Case record created with High severity and automated entity bundle.",
    highlightData: "Case #CS-4091 • Severity: HIGH • Triaged",
  },
  {
    num: 15,
    title: "Evidence Is Attached",
    module: "investigate",
    narrative: "Evidence Vault binds tokenized PAN (••••4921), session telemetry, IP ASN, and device hashes.",
    systemAction: "Immutable evidence bundle cryptographically signed for dispute defense.",
    highlightData: "Evidence Vault: 11 Artifacts Sealed",
  },
  {
    num: 16,
    title: "Audit Event Recorded",
    module: "audit",
    narrative: "Chain of custody records: Consent CONS-92831, rule firing, decision logic, and investigator view.",
    systemAction: "WORM ledger writes SHA-256 block with zero tampering possibility.",
    highlightData: "Audit Block #89214 • Consent CONS-92831",
  },
  {
    num: 17,
    title: "Campaign Exposure Updates",
    module: "campaigns",
    narrative: "Campaign #1842 registers prevented loss of ₹84,000; total syndicate capture metrics increase.",
    systemAction: "Campaign defense telemetry feeds back into bank-wide threat radar.",
    highlightData: "Prevented Loss: ₹84,000 • Capture Rate 91%",
  },
  {
    num: 18,
    title: "Replay Shows Policy Alternative",
    module: "account360",
    subtab: "replay",
    narrative: "Risk manager runs Replay Engine to evaluate if looser thresholds would have caused fraud leakage.",
    systemAction: "Replay confirms threshold 75 correctly captured 88.4% of similar attacks.",
    highlightData: "Replay Simulation: ₹18.4L Loss Avoidance",
  },
  {
    num: 19,
    title: "Attack Lab Reproduces Pattern",
    module: "attacklab",
    narrative: "Adversarial simulation lab runs 10,000 synthetic ATO events with identical device farm dynamics.",
    systemAction: "Benchmark confirms multi-layer defense yields 37% lower expected loss than legacy rules.",
    highlightData: "Attack Lab Benchmark: -37% Expected Loss",
  },
  {
    num: 20,
    title: "Model & Rule Dashboard Measures Impact",
    module: "models",
    narrative: "Executive telemetry reflects real-time prevented fraud loss: ₹4.8Cr, 87.4% capture, 38.4ms latency.",
    systemAction: "End-to-end golden verification complete: All 11 modules successfully synchronized.",
    highlightData: "North Star: Minimize Loss & Preserve Customer Conversion",
  },
];

interface GoldenDemoPlayerProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  onClose?: () => void;
}

export default function GoldenDemoPlayer({
  currentStepIndex,
  onSelectStep,
  onClose,
}: GoldenDemoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentStep = GOLDEN_STEPS[currentStepIndex] || GOLDEN_STEPS[0];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentStepIndex < GOLDEN_STEPS.length - 1) {
          onSelectStep(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, onSelectStep]);

  return (
    <div
      style={{
        background: "rgba(8,10,16,0.98)",
        border: "1px solid rgba(0,246,255,0.4)",
        borderRadius: "6px",
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
      }}
    >
      {/* Top Header & Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.625rem",
              padding: "0.2rem 0.5rem",
              background: "rgba(0,246,255,0.15)",
              color: "#00F6FF",
              border: "1px solid rgba(0,246,255,0.35)",
              borderRadius: "2px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            END-TO-END GOLDEN DEMO // PRD §56
          </span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F4F4F0", fontFamily: "monospace" }}>
            STEP {currentStep.num} OF 20: {currentStep.title.toUpperCase()}
          </span>
        </div>

        {/* Player Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => onSelectStep(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: currentStepIndex === 0 ? "rgba(244,244,240,0.2)" : "#F4F4F0",
              padding: "0.25rem 0.6rem",
              borderRadius: "3px",
              fontSize: "0.625rem",
              fontFamily: "monospace",
              cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
            }}
          >
            &lt; PREV
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? "rgba(255,163,26,0.2)" : "rgba(57,255,136,0.2)",
              border: `1px solid ${isPlaying ? "#FFA31A" : "#39FF88"}`,
              color: isPlaying ? "#FFA31A" : "#39FF88",
              padding: "0.25rem 0.6rem",
              borderRadius: "3px",
              fontSize: "0.625rem",
              fontWeight: 700,
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            {isPlaying ? "[PAUSE]" : "[AUTO-PLAY]"}
          </button>
          <button
            onClick={() => onSelectStep(Math.min(GOLDEN_STEPS.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === GOLDEN_STEPS.length - 1}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: currentStepIndex === GOLDEN_STEPS.length - 1 ? "rgba(244,244,240,0.2)" : "#F4F4F0",
              padding: "0.25rem 0.6rem",
              borderRadius: "3px",
              fontSize: "0.625rem",
              fontFamily: "monospace",
              cursor: currentStepIndex === GOLDEN_STEPS.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            NEXT &gt;
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(244,244,240,0.4)",
                fontSize: "0.75rem",
                cursor: "pointer",
                padding: "0 0.4rem",
              }}
            >
              x
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (20 segments) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 1fr)", gap: "2px", height: "4px" }}>
        {GOLDEN_STEPS.map((s, idx) => (
          <div
            key={s.num}
            onClick={() => onSelectStep(idx)}
            style={{
              height: "100%",
              background:
                idx === currentStepIndex
                  ? "#00F6FF"
                  : idx < currentStepIndex
                  ? "#39FF88"
                  : "rgba(255,255,255,0.08)",
              cursor: "pointer",
              borderRadius: "1px",
              transition: "background 0.2s ease",
            }}
            title={`Step ${s.num}: ${s.title}`}
          />
        ))}
      </div>

      {/* Step Narrative & Telemetry */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          alignItems: "center",
          gap: "1rem",
          background: "rgba(255,255,255,0.02)",
          padding: "0.6rem 0.85rem",
          borderRadius: "4px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>NARRATIVE EVENT:</div>
          <div style={{ fontSize: "0.75rem", color: "#F4F4F0", marginTop: "0.15rem" }}>
            {currentStep.narrative}
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.5625rem", color: "#00F6FF", fontFamily: "monospace" }}>DEFENSE SYSTEM ACTION:</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.85)", marginTop: "0.15rem" }}>
            {currentStep.systemAction}
          </div>
        </div>

        {currentStep.highlightData && (
          <div
            style={{
              background: "rgba(0,246,255,0.08)",
              border: "1px solid rgba(0,246,255,0.25)",
              borderRadius: "3px",
              padding: "0.4rem 0.75rem",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: "0.5rem", color: "#00F6FF", fontFamily: "monospace" }}>TELEMETRY SIGNAL</div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#F4F4F0", fontFamily: "monospace" }}>
              {currentStep.highlightData}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
