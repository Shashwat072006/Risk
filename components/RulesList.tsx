"use client";

interface RuleHit {
  rule_id: string;
  description: string;
  weight: number;
  triggered: boolean;
}

interface RulesListProps {
  rules: RuleHit[];
}

export default function RulesList({ rules }: RulesListProps) {
  const triggered = rules.filter((r) => r.triggered);
  const passed    = rules.filter((r) => !r.triggered);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Triggered rules */}
      <div>
        <div
          style={{
            fontSize: "0.5rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#FF4D4D",
            marginBottom: "0.75rem",
          }}
        >
          Rules Triggered ({triggered.length})
        </div>
        {triggered.length === 0 ? (
          <div style={{ fontSize: "0.75rem", color: "rgba(244,244,240,0.3)", fontStyle: "italic" }}>
            No rules triggered
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {triggered.map((rule) => (
              <div
                key={rule.rule_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  background: "rgba(255,77,77,0.06)",
                  border: "1px solid rgba(255,77,77,0.2)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#FF4D4D",
                    minWidth: 28,
                    fontFamily: "monospace",
                  }}
                >
                  {rule.rule_id}
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "#F4F4F0",
                    flex: 1,
                  }}
                >
                  {rule.description}
                </span>
                {/* Weight bar */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: 48,
                      height: 3,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${rule.weight * 100}%`,
                        height: "100%",
                        background: "#FF4D4D",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.5rem",
                      color: "rgba(244,244,240,0.4)",
                      letterSpacing: "0.06em",
                      minWidth: 28,
                      textAlign: "right",
                    }}
                  >
                    {(rule.weight * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Passed rules (collapsed) */}
      {passed.length > 0 && (
        <div>
          <div
            style={{
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#39FF88",
              marginBottom: "0.75rem",
            }}
          >
            Rules Passed ({passed.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {passed.map((rule) => (
              <span
                key={rule.rule_id}
                style={{
                  padding: "0.2rem 0.6rem",
                  background: "rgba(57,255,136,0.04)",
                  border: "1px solid rgba(57,255,136,0.12)",
                  color: "rgba(57,255,136,0.5)",
                  fontSize: "0.5rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.06em",
                }}
              >
                {rule.rule_id}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
