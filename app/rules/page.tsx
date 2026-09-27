"use client";
import { useState } from "react";

interface RuleItem {
  id: string;
  name: string;
  description: string;
  category: "VELOCITY" | "GEO" | "DEVICE" | "ENTITY_GRAPH" | "MULE" | "AMOUNT";
  stage: "PRODUCTION" | "CANARY" | "SHADOW" | "REVIEW" | "DRAFT";
  action: "BLOCK" | "ALLOW" | "INCREASE_RISK" | "FORCE_STEP_UP" | "CREATE_CASE";
  weight: number;
  hitCount24h: number;
  falsePositiveRate: string;
  preventedLoss: string;
  owner: string;
  approver: string;
  condition: string;
}

const INITIAL_RULES: RuleItem[] = [
  {
    id: "R-01",
    name: "impossible_travel_egress",
    description: "Impossible physical travel: >1500km displacement in <60 minutes from prior location.",
    category: "GEO",
    stage: "PRODUCTION",
    action: "INCREASE_RISK",
    weight: 0.95,
    hitCount24h: 342,
    falsePositiveRate: "1.2%",
    preventedLoss: "₹28.4L",
    owner: "analyst_18",
    approver: "risk_mgr_03",
    condition: "geo_velocity_kmh > 800 AND session_delta_min < 60",
  },
  {
    id: "R-02",
    name: "burst_post_credential_change",
    description: "High-velocity outflow (>₹50k) initiated within 15 minutes of password/MFA update.",
    category: "VELOCITY",
    stage: "PRODUCTION",
    action: "FORCE_STEP_UP",
    weight: 0.92,
    hitCount24h: 129,
    falsePositiveRate: "0.8%",
    preventedLoss: "₹42.1L",
    owner: "analyst_04",
    approver: "risk_mgr_01",
    condition: "time_since_pwd_reset_min < 15 AND amount > 50000",
  },
  {
    id: "R-03",
    name: "entity_campaign_cluster_match",
    description: "Device or IP linked to an active coordinated fraud campaign cluster (graph distance <= 1).",
    category: "ENTITY_GRAPH",
    stage: "PRODUCTION",
    action: "BLOCK",
    weight: 0.98,
    hitCount24h: 88,
    falsePositiveRate: "0.3%",
    preventedLoss: "₹64.5L",
    owner: "graph_lead_02",
    approver: "vp_risk_compliance",
    condition: "campaign_link_degree > 0 AND campaign_confidence >= 0.85",
  },
  {
    id: "R-04",
    name: "mule_rapid_drainage_ratio",
    description: "Account balance drained by >90% via instant payments within 30 minutes of inbound deposit.",
    category: "MULE",
    stage: "PRODUCTION",
    action: "CREATE_CASE",
    weight: 0.94,
    hitCount24h: 53,
    falsePositiveRate: "1.9%",
    preventedLoss: "₹19.2L",
    owner: "analyst_21",
    approver: "risk_mgr_03",
    condition: "drainage_rate > 0.90 AND inflow_to_outflow_min < 30",
  },
  {
    id: "R-05",
    name: "sim_box_emulator_fingerprint",
    description: "Device telemetry matches virtualized Android emulator or known SIM-box farm signature.",
    category: "DEVICE",
    stage: "CANARY",
    action: "BLOCK",
    weight: 0.91,
    hitCount24h: 76,
    falsePositiveRate: "2.1%",
    preventedLoss: "₹14.0L",
    owner: "sec_eng_09",
    approver: "risk_mgr_01",
    condition: "emulator_flags_count >= 3 OR sim_box_confidence > 0.88",
  },
  {
    id: "R-06",
    name: "novel_crypto_offramp_burst",
    description: "P2P or crypto exchange merchant category code initiated from unverified mobile device.",
    category: "AMOUNT",
    stage: "SHADOW",
    action: "FORCE_STEP_UP",
    weight: 0.84,
    hitCount24h: 215,
    falsePositiveRate: "3.4%",
    preventedLoss: "₹9.8L (Est)",
    owner: "analyst_18",
    approver: "Pending Risk Approval",
    condition: "mcc_category == 'CRYPTO_P2P' AND device_age_days < 3",
  },
  {
    id: "R-07",
    name: "dormant_account_resurrection",
    description: "Account inactive for >180 days suddenly executes transfer exceeding 5x historic max.",
    category: "VELOCITY",
    stage: "REVIEW",
    action: "FORCE_STEP_UP",
    weight: 0.79,
    hitCount24h: 0,
    falsePositiveRate: "--",
    preventedLoss: "--",
    owner: "analyst_07",
    approver: "Pending Peer Review",
    condition: "account_dormant_days > 180 AND amount > (5 * max_historic_amount)",
  },
  {
    id: "R-08",
    name: "high_risk_asn_vpn_egress",
    description: "Transaction originating from known commercial datacenter ASN without residential lease.",
    category: "GEO",
    stage: "DRAFT",
    action: "INCREASE_RISK",
    weight: 0.65,
    hitCount24h: 0,
    falsePositiveRate: "--",
    preventedLoss: "--",
    owner: "analyst_18",
    approver: "Drafting",
    condition: "ip_datacenter_flag == true AND vpn_confidence > 0.95",
  },
];

const STAGE_COLORS: Record<string, string> = {
  PRODUCTION: "#39FF88",
  CANARY: "#FFA31A",
  SHADOW: "#FFA31A",
  REVIEW: "#FFA31A",
  DRAFT: "rgba(244,244,240,0.4)",
};

const ACTION_COLORS: Record<string, string> = {
  BLOCK: "#FF4D4D",
  ALLOW: "#39FF88",
  INCREASE_RISK: "#FFA31A",
  FORCE_STEP_UP: "#FFA31A",
  CREATE_CASE: "#FF4D4D",
};

export default function RulesPage() {
  const [rules, setRules] = useState<RuleItem[]>(INITIAL_RULES);
  const [selectedStage, setSelectedStage] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeSegment, setActiveSegment] = useState<"RETAIL" | "PREMIUM" | "CORPORATE" | "CROSS_BORDER">("RETAIL");
  const [modalOpen, setModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [newRuleAction, setNewRuleAction] = useState<RuleItem["action"]>("FORCE_STEP_UP");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filteredRules = rules.filter((r) => {
    const stageMatch = selectedStage === "ALL" || r.stage === selectedStage;
    const catMatch = selectedCategory === "ALL" || r.category === selectedCategory;
    return stageMatch && catMatch;
  });

  function handleCreateDraft() {
    if (!newRuleName.trim() || !newRuleCondition.trim()) return;
    const created: RuleItem = {
      id: `R-0${rules.length + 1}`,
      name: newRuleName.trim(),
      description: newRuleDesc.trim() || "User-submitted rule definition",
      category: "VELOCITY",
      stage: "DRAFT",
      action: newRuleAction,
      weight: 0.8,
      hitCount24h: 0,
      falsePositiveRate: "--",
      preventedLoss: "--",
      owner: "analyst_current",
      approver: "Pending Peer Review",
      condition: newRuleCondition.trim(),
    };
    setRules([created, ...rules]);
    setModalOpen(false);
    setNewRuleName("");
    setNewRuleDesc("");
    setNewRuleCondition("");
    setToast(`Rule ${created.id} (${created.name}) created in DRAFT stage for Maker-Checker review.`);
    setTimeout(() => setToast(null), 4500);
  }

  function advanceStage(ruleId: string) {
    const sequence: RuleItem["stage"][] = ["DRAFT", "REVIEW", "SHADOW", "CANARY", "PRODUCTION"];
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        const currentIdx = sequence.indexOf(r.stage);
        if (currentIdx < sequence.length - 1) {
          const nextStage = sequence[currentIdx + 1];
          setToast(`Rule ${r.id} advanced to ${nextStage} stage (Maker-Checker approved).`);
          setTimeout(() => setToast(null), 4000);
          return { ...r, stage: nextStage };
        }
        return r;
      })
    );
  }

  return (
    <main style={{ background: "#050505", minHeight: "100vh", color: "#F4F4F0" }}>
      <div className="grain-overlay" aria-hidden="true" />
      

      {/* Hero */}
      <section
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "3rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
            <div>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#39FF88", marginBottom: "0.75rem" }}>
                PRD Sections 20, 21 & 43
              </div>
              <h1
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  color: "#F4F4F0",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Rule Governance &
                <br />
                Policy Engine
              </h1>
              <p style={{ maxWidth: 640, fontSize: "0.875rem", color: "rgba(244,244,240,0.5)", lineHeight: 1.6, marginTop: "1rem" }}>
                Deterministic risk controls with enterprise Maker-Checker approval governance. All rules are versioned, shadow-tested against historical traffic, and rolled out safely via canaries.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              style={{
                background: "#39FF88",
                border: "none",
                color: "#050505",
                padding: "0.75rem 1.75rem",
                fontSize: "0.6875rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              + Create New Rule
            </button>
          </div>

          {toast && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(57, 255, 136, 0.1)",
                border: "1px solid #39FF88",
                color: "#39FF88",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              [OK] {toast}
            </div>
          )}
        </div>
      </section>

      {/* Maker-Checker Pipeline Indicator */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem 2.5rem", background: "#080808" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", marginBottom: "1rem" }}>
            Maker-Checker Governance Lifecycle
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { stage: "DRAFT", label: "01. Analyst Draft", desc: "Local synthesis" },
              { stage: "REVIEW", label: "02. Peer Review", desc: "4-eye verification" },
              { stage: "SHADOW", label: "03. Shadow Mode", desc: "0% traffic replay" },
              { stage: "CANARY", label: "04. Canary Rollout", desc: "5% production" },
              { stage: "PRODUCTION", label: "05. Full Production", desc: "100% decisioning" },
            ].map((st, i) => (
              <div
                key={st.stage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem 1rem",
                  background: "#0D0D0D",
                  border: `1px solid ${STAGE_COLORS[st.stage]}44`,
                  flex: "1 1 180px",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: STAGE_COLORS[st.stage] }} />
                <div>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: STAGE_COLORS[st.stage] }}>{st.label}</div>
                  <div style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)" }}>{st.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Segments + Filter Controls */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 2.5rem" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          {/* Segment switches */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)" }}>
              Policy Segment:
            </span>
            {(["RETAIL", "PREMIUM", "CORPORATE", "CROSS_BORDER"] as const).map((seg) => (
              <button
                key={seg}
                onClick={() => setActiveSegment(seg)}
                style={{
                  background: activeSegment === seg ? "#F4F4F0" : "#0D0D0D",
                  color: activeSegment === seg ? "#050505" : "rgba(244,244,240,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  padding: "0.35rem 0.8rem",
                  cursor: "pointer",
                }}
              >
                {seg.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Filter by stage */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)" }}>
              Filter Stage:
            </span>
            {["ALL", "PRODUCTION", "CANARY", "SHADOW", "REVIEW", "DRAFT"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStage(st)}
                style={{
                  background: "none",
                  border: "none",
                  color: selectedStage === st ? "#39FF88" : "rgba(244,244,240,0.35)",
                  fontSize: "0.5625rem",
                  fontWeight: selectedStage === st ? 700 : 400,
                  cursor: "pointer",
                  padding: "0.2rem 0.4rem",
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Inventory Table */}
      <section style={{ padding: "3rem 2.5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0A0A0A" }}>
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 220px 1fr 140px 140px 100px 140px",
              padding: "1rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(244,244,240,0.4)",
            }}
          >
            <div>ID</div>
            <div>Rule Identifier</div>
            <div>Evaluation Condition</div>
            <div>Action</div>
            <div>Stage</div>
            <div>24h Hits</div>
            <div>Governance</div>
          </div>

          {/* Rows */}
          {filteredRules.map((r) => (
            <div
              key={r.id}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 220px 1fr 140px 140px 100px 140px",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                alignItems: "center",
                fontSize: "0.75rem",
              }}
            >
              <div style={{ fontFamily: "monospace", color: "#39FF88", fontWeight: 700 }}>{r.id}</div>
              <div>
                <div style={{ fontWeight: 600, color: "#F4F4F0" }}>{r.name}</div>
                <div style={{ fontSize: "0.625rem", color: "rgba(244,244,240,0.45)", marginTop: "0.2rem" }}>
                  {r.description}
                </div>
              </div>
              <div>
                <code
                  style={{
                    background: "#050505",
                    padding: "0.3rem 0.6rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#F5F4EF",
                    fontSize: "0.6875rem",
                    display: "inline-block",
                  }}
                >
                  {r.condition}
                </code>
              </div>
              <div>
                <span
                  style={{
                    padding: "0.25rem 0.6rem",
                    background: `${ACTION_COLORS[r.action]}15`,
                    border: `1px solid ${ACTION_COLORS[r.action]}44`,
                    color: ACTION_COLORS[r.action],
                    fontSize: "0.5625rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                  }}
                >
                  {r.action}
                </span>
              </div>
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: STAGE_COLORS[r.stage],
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: STAGE_COLORS[r.stage] }} />
                  {r.stage}
                </span>
              </div>
              <div style={{ fontFamily: "monospace", color: "#F4F4F0", fontWeight: 600 }}>
                {r.hitCount24h.toLocaleString()}
              </div>
              <div>
                {r.stage !== "PRODUCTION" ? (
                  <button
                    onClick={() => advanceStage(r.id)}
                    style={{
                      background: "rgba(57, 255, 136, 0.12)",
                      border: "1px solid #39FF88",
                      color: "#39FF88",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Advance Stage →
                  </button>
                ) : (
                  <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.3)" }}>
                    Approved ({r.approver})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Rule Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "2.5rem",
              width: "100%",
              maxWidth: 600,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Draft New Fraud Rule</h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.25rem" }}
              >
                X
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.5625rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(244,244,240,0.4)", display: "block", marginBottom: "0.5rem" }}>
                  Rule Name (snake_case)
                </label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. cross_border_atm_novelty_spike"
                  style={{
                    width: "100%",
                    background: "#050505",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "0.6rem 0.8rem",
                    color: "#F4F4F0",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.5625rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(244,244,240,0.4)", display: "block", marginBottom: "0.5rem" }}>
                  Description & Operational Intent
                </label>
                <input
                  type="text"
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  placeholder="e.g. Flag ATM withdrawals in novel countries exceeding ₹20k"
                  style={{
                    width: "100%",
                    background: "#050505",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "0.6rem 0.8rem",
                    color: "#F4F4F0",
                    fontSize: "0.75rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.5625rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(244,244,240,0.4)", display: "block", marginBottom: "0.5rem" }}>
                  Trigger Action
                </label>
                <select
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value as RuleItem["action"])}
                  style={{
                    width: "100%",
                    background: "#050505",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "0.6rem 0.8rem",
                    color: "#F4F4F0",
                    fontSize: "0.75rem",
                    outline: "none",
                  }}
                >
                  <option value="FORCE_STEP_UP">FORCE_STEP_UP (FIDO2 / Biometric)</option>
                  <option value="BLOCK">BLOCK (Hard Rejection)</option>
                  <option value="INCREASE_RISK">INCREASE_RISK (+Score)</option>
                  <option value="CREATE_CASE">CREATE_CASE (Investigator Triage)</option>
                  <option value="ALLOW">ALLOW (Whitelisted Policy)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.5625rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(244,244,240,0.4)", display: "block", marginBottom: "0.5rem" }}>
                  DSL Evaluation Expression
                </label>
                <textarea
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  placeholder="e.g. amount > 20000 AND channel == 'ATM' AND country_novelty == true"
                  rows={3}
                  style={{
                    width: "100%",
                    background: "#050505",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "0.6rem 0.8rem",
                    color: "#F5F4EF",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(244,244,240,0.6)",
                    padding: "0.6rem 1.25rem",
                    fontSize: "0.6875rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDraft}
                  style={{
                    background: "#39FF88",
                    border: "none",
                    color: "#050505",
                    padding: "0.6rem 1.5rem",
                    fontSize: "0.6875rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Submit for Peer Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </main>
  );
}
