"use client";
import { useState, useMemo, useRef } from "react";
import Link from "next/link";

export interface Transaction {
  id: string;
  date: string;         // ISO date "2024-11-14"
  time: string;         // "14:32"
  merchant: string;
  category: string;
  amount: number;       // positive = debit, negative = credit
  currency: string;
  decision: "ALLOW" | "REVIEW" | "BLOCK" | "STEP-UP" | "3DS";
  riskScore: number;    // 0–100
  country: string;
  channel: "card" | "wire" | "ach" | "wallet";
}

interface Props {
  transactions: Transaction[];
  onSelectTransaction?: (txn: Transaction) => void;
}

// ── Color helpers ─────────────────────────────────────────────────────────────

const DECISION_COLOR: Record<string, string> = {
  ALLOW: "#39FF88",
  REVIEW: "#FFA31A",
  BLOCK: "#FF4D4D",
  "STEP-UP": "#FFA31A",
  "3DS": "#FFA31A",
};

function riskColor(score: number): string {
  if (score >= 70) return "#FF4D4D";
  if (score >= 40) return "#FFA31A";
  return "#39FF88";
}

function fmtAmount(amount: number, currency: string): string {
  const abs = Math.abs(amount);
  const formatted = abs >= 1000 ? `${(abs / 1000).toFixed(1)}K` : abs.toFixed(2);
  return `${amount < 0 ? "+" : "-"}${currency} ${formatted}`;
}

// ── Calendar Heatmap ─────────────────────────────────────────────────────────

function CalendarHeatmap({ transactions, onDayClick }: { transactions: Transaction[]; onDayClick: (date: string) => void }) {
  const txByDay = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => {
      map[t.date] = (map[t.date] ?? 0) + 1;
    });
    return map;
  }, [transactions]);

  const maxCount = Math.max(...Object.values(txByDay), 1);

  // Build 12 weeks of days ending today
  const today = new Date("2024-12-01");
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 83); // 12 weeks back

  const cells: { date: string; count: number }[] = [];
  const cur = new Date(startDate);
  while (cur <= today) {
    const d = cur.toISOString().split("T")[0];
    cells.push({ date: d, count: txByDay[d] ?? 0 });
    cur.setDate(cur.getDate() + 1);
  }

  // Group by week
  const weeks: { date: string; count: number }[][] = [];
  let week: { date: string; count: number }[] = [];
  cells.forEach((cell, i) => {
    week.push(cell);
    if ((i + 1) % 7 === 0) { weeks.push(week); week = []; }
  });
  if (week.length > 0) weeks.push(week);

  function heatColor(count: number): string {
    if (count === 0) return "rgba(255,255,255,0.04)";
    const t = count / maxCount;
    if (t > 0.66) return `rgba(255,77,77,${0.5 + t * 0.4})`;
    if (t > 0.33) return `rgba(255,163,26,${0.4 + t * 0.4})`;
    return `rgba(57,255,136,${0.2 + t * 0.5})`;
  }

  return (
    <div>
      <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,244,240,0.3)", marginBottom: "0.75rem" }}>
        Activity — Last 12 Weeks (click day to filter)
      </div>
      <div style={{ display: "flex", gap: "3px", alignItems: "flex-start" }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginRight: "4px" }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ width: 10, height: 10, fontSize: "0.4375rem", color: "rgba(244,244,240,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {d}
            </div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((wk, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {wk.map((cell, di) => (
              <button
                key={di}
                title={`${cell.date}: ${cell.count} txn${cell.count !== 1 ? "s" : ""}`}
                onClick={() => cell.count > 0 && onDayClick(cell.date)}
                style={{
                  width: 10, height: 10,
                  background: heatColor(cell.count),
                  border: "none",
                  cursor: cell.count > 0 ? "pointer" : "default",
                  padding: 0,
                  transition: "transform 100ms ease",
                }}
                onMouseEnter={(e) => { if (cell.count > 0) (e.target as HTMLElement).style.transform = "scale(1.4)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
        <span style={{ fontSize: "0.4375rem", color: "rgba(244,244,240,0.2)" }}>Low</span>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map(t => (
          <div key={t} style={{ width: 10, height: 10, background: t < 0.35 ? `rgba(57,255,136,${0.2 + t})` : t < 0.65 ? `rgba(255,163,26,${0.4 + t * 0.4})` : `rgba(255,77,77,${0.5 + t * 0.4})` }} />
        ))}
        <span style={{ fontSize: "0.4375rem", color: "rgba(244,244,240,0.2)" }}>High</span>
      </div>
    </div>
  );
}

// ── Statement Panel ───────────────────────────────────────────────────────────

function StatementPanel({ transactions }: { transactions: Transaction[] }) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<"30d" | "90d" | "all">("30d");

  const filtered = useMemo(() => {
    if (range === "all") return transactions;
    const days = range === "30d" ? 30 : 90;
    const cutoff = new Date("2024-12-01");
    cutoff.setDate(cutoff.getDate() - days);
    const cutStr = cutoff.toISOString().split("T")[0];
    return transactions.filter(t => t.date >= cutStr);
  }, [transactions, range]);

  // Group by month
  const byMonth = useMemo(() => {
    const map: Record<string, Transaction[]> = {};
    filtered.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!map[month]) map[month] = [];
      map[month].push(t);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const totalDebit  = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalCredit = filtered.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const avgDaily    = filtered.length > 0 ? totalDebit / Math.max(1, range === "30d" ? 30 : range === "90d" ? 90 : 180) : 0;
  const peakSingle  = Math.max(...filtered.map(t => Math.abs(t.amount)), 0);

  function monthLabel(ym: string): string {
    const [y, m] = ym.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  }

  return (
    <div>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: open ? "rgba(255,163,26,0.08)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "rgba(255,163,26,0.3)" : "rgba(255,255,255,0.08)"}`,
          color: open ? "#FFA31A" : "rgba(244,244,240,0.5)",
          fontSize: "0.5625rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "0.5rem 1rem", cursor: "pointer",
          transition: "all 200ms ease",
        }}
      >
        <span style={{ fontSize: "0.75rem" }}>{open ? "▲" : "▼"}</span>
        Statement Export
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          marginTop: "0.75rem",
          background: "#080808",
          border: "1px solid rgba(255,163,26,0.2)",
          padding: "2rem",
        }}>
          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFA31A", marginBottom: "0.25rem" }}>
                Statement Period
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["30d", "90d", "all"] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: range === r ? "rgba(255,163,26,0.15)" : "transparent",
                      border: `1px solid ${range === r ? "#FFA31A" : "rgba(255,255,255,0.1)"}`,
                      color: range === r ? "#FFA31A" : "rgba(244,244,240,0.4)",
                      fontSize: "0.5625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                      cursor: "pointer", transition: "all 200ms ease",
                    }}
                  >{r === "all" ? "All Time" : r === "30d" ? "30 Days" : "90 Days"}</button>
                ))}
              </div>
            </div>
            <button
              onClick={() => window.print()}
              style={{
                padding: "0.5rem 1.25rem",
                background: "rgba(255,163,26,0.1)", border: "1px solid rgba(255,163,26,0.3)",
                color: "#FFA31A", fontSize: "0.5625rem", fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase", cursor: "pointer",
              }}
            >
              Print / Download
            </button>
          </div>

          {/* Summary totals */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Total Debits", value: `$${(totalDebit / 1000).toFixed(1)}K`, color: "#FF4D4D" },
              { label: "Total Credits", value: `$${(totalCredit / 1000).toFixed(1)}K`, color: "#39FF88" },
              { label: "Avg Daily Spend", value: `$${avgDaily.toFixed(0)}`, color: "#FFA31A" },
              { label: "Peak Transaction", value: `$${peakSingle.toFixed(0)}`, color: "#F5F4EF" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{label}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color, letterSpacing: "-0.02em" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Monthly grouped list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {byMonth.map(([month, txns]) => {
              const monthTotal = txns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
              return (
                <div key={month}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "baseline",
                    padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    marginBottom: "0.75rem",
                  }}>
                    <span style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFA31A" }}>
                      {monthLabel(month)}
                    </span>
                    <span style={{ fontSize: "0.5625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>
                      {txns.length} transactions · ${monthTotal.toFixed(2)} spent
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {txns.sort((a, b) => b.date.localeCompare(a.date)).map(t => (
                      <div key={t.id} style={{
                        display: "grid", gridTemplateColumns: "90px 1fr 80px 60px",
                        gap: "1rem", alignItems: "center",
                        padding: "0.5rem 0.75rem",
                        fontFamily: "monospace",
                        fontSize: "0.6875rem",
                        background: "rgba(255,255,255,0.01)",
                        borderLeft: `2px solid ${DECISION_COLOR[t.decision] ?? "#888"}33`,
                      }}>
                        <span style={{ color: "rgba(244,244,240,0.35)" }}>{t.date}</span>
                        <span style={{ color: "rgba(244,244,240,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.merchant}</span>
                        <span style={{ color: t.amount > 0 ? "#FF4D4D" : "#39FF88", textAlign: "right", fontWeight: 600 }}>
                          {fmtAmount(t.amount, t.currency)}
                        </span>
                        <span style={{ color: DECISION_COLOR[t.decision] ?? "#888", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.06em", textAlign: "right" }}>
                          {t.decision}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function TransactionHistory({ transactions, onSelectTransaction }: Props) {
  const [search, setSearch] = useState("");
  const [decFilter, setDecFilter] = useState<string>("all");
  const [chanFilter, setChanFilter] = useState<string>("all");
  const [amtMin, setAmtMin] = useState<string>("");
  const [amtMax, setAmtMax] = useState<string>("");
  const [sortCol, setSortCol] = useState<"date" | "amount" | "riskScore">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 25;

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.merchant.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (decFilter !== "all") list = list.filter(t => t.decision === decFilter);
    if (chanFilter !== "all") list = list.filter(t => t.channel === chanFilter);
    if (amtMin) list = list.filter(t => Math.abs(t.amount) >= parseFloat(amtMin));
    if (amtMax) list = list.filter(t => Math.abs(t.amount) <= parseFloat(amtMax));
    if (dateFilter) list = list.filter(t => t.date === dateFilter);

    list.sort((a, b) => {
      let av: number, bv: number;
      if (sortCol === "date") { av = new Date(a.date + "T" + a.time).getTime(); bv = new Date(b.date + "T" + b.time).getTime(); }
      else if (sortCol === "amount") { av = Math.abs(a.amount); bv = Math.abs(b.amount); }
      else { av = a.riskScore; bv = b.riskScore; }
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return list;
  }, [transactions, search, decFilter, chanFilter, amtMin, amtMax, sortCol, sortDir, dateFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSort(col: typeof sortCol) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
    setPage(0);
  }

  function SortArrow({ col }: { col: typeof sortCol }) {
    if (sortCol !== col) return <span style={{ opacity: 0.2 }}>↕</span>;
    return <span style={{ color: "#FFA31A" }}>{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  const totals = useMemo(() => ({
    debits: filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    credits: filtered.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
    avgRisk: filtered.length > 0 ? Math.round(filtered.reduce((s, t) => s + t.riskScore, 0) / filtered.length) : 0,
  }), [filtered]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Calendar heatmap */}
      <div style={{ background: "#080808", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
        <CalendarHeatmap
          transactions={transactions}
          onDayClick={(date) => {
            setDateFilter(prev => prev === date ? null : date);
            setPage(0);
            tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
        {dateFilter && (
          <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.5625rem", color: "#FFA31A" }}>Filtered: {dateFilter}</span>
            <button
              onClick={() => { setDateFilter(null); setPage(0); }}
              style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.4)", background: "none", border: "1px solid rgba(255,255,255,0.1)", padding: "0.125rem 0.5rem", cursor: "pointer" }}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div ref={tableRef} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search merchant, ID…"
          style={{
            background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)",
            color: "#F4F4F0", padding: "0.5rem 0.875rem",
            fontSize: "0.6875rem", outline: "none", width: 200,
          }}
        />
        <select
          value={decFilter}
          onChange={e => { setDecFilter(e.target.value); setPage(0); }}
          style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F4F0", padding: "0.5rem 0.75rem", fontSize: "0.6875rem", outline: "none" }}
        >
          <option value="all">All Decisions</option>
          {["ALLOW", "REVIEW", "BLOCK", "STEP-UP", "3DS"].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={chanFilter}
          onChange={e => { setChanFilter(e.target.value); setPage(0); }}
          style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F4F0", padding: "0.5rem 0.75rem", fontSize: "0.6875rem", outline: "none" }}
        >
          <option value="all">All Channels</option>
          {["card", "wire", "ach", "wallet"].map(c => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
        <input
          value={amtMin}
          onChange={e => { setAmtMin(e.target.value); setPage(0); }}
          placeholder="Min $"
          type="number"
          style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F4F0", padding: "0.5rem 0.75rem", fontSize: "0.6875rem", width: 80, outline: "none" }}
        />
        <input
          value={amtMax}
          onChange={e => { setAmtMax(e.target.value); setPage(0); }}
          placeholder="Max $"
          type="number"
          style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F4F0", padding: "0.5rem 0.75rem", fontSize: "0.6875rem", width: 80, outline: "none" }}
        />
        {(search || decFilter !== "all" || chanFilter !== "all" || amtMin || amtMax || dateFilter) && (
          <button
            onClick={() => { setSearch(""); setDecFilter("all"); setChanFilter("all"); setAmtMin(""); setAmtMax(""); setDateFilter(null); setPage(0); }}
            style={{ background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.5rem 0.875rem", cursor: "pointer" }}
          >
            Clear Filters
          </button>
        )}

        {/* Statement toggle — far right */}
        <div style={{ marginLeft: "auto" }}>
          <StatementPanel transactions={transactions} />
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: "flex", gap: "2rem", padding: "0.875rem 1.25rem", background: "#080808", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div><span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Showing </span><span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F4F4F0" }}>{filtered.length}</span><span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)" }}> / {transactions.length}</span></div>
        <div><span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Total Debits </span><span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF4D4D" }}>${(totals.debits / 1000).toFixed(1)}K</span></div>
        <div><span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Credits </span><span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#39FF88" }}>${(totals.credits / 1000).toFixed(1)}K</span></div>
        <div><span style={{ fontSize: "0.5rem", color: "rgba(244,244,240,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Avg Risk </span><span style={{ fontSize: "0.75rem", fontWeight: 700, color: riskColor(totals.avgRisk) }}>{totals.avgRisk}</span></div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { label: "Date / Time", col: "date" as const, sortable: true },
                { label: "Transaction ID", sortable: false },
                { label: "Merchant", sortable: false },
                { label: "Category", sortable: false },
                { label: "Channel", sortable: false },
                { label: "Amount", col: "amount" as const, sortable: true },
                { label: "Decision", sortable: false },
                { label: "Risk", col: "riskScore" as const, sortable: true },
                { label: "Country", sortable: false },
                { label: "", sortable: false },
              ].map((h) => (
                <th
                  key={h.label}
                  onClick={() => h.sortable && h.col && toggleSort(h.col)}
                  style={{
                    padding: "0.875rem 1rem",
                    textAlign: "left",
                    fontSize: "0.5rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(244,244,240,0.3)",
                    cursor: h.sortable ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h.label} {h.sortable && h.col && <SortArrow col={h.col} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((t, i) => {
              const dc = DECISION_COLOR[t.decision] ?? "#888";
              return (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    transition: "background 150ms ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,163,26,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)")}
                >
                  <td style={{ padding: "0.875rem 1rem", color: "rgba(244,244,240,0.5)", fontFamily: "monospace", fontSize: "0.6875rem", whiteSpace: "nowrap" }}>
                    {t.date}<br />
                    <span style={{ fontSize: "0.5625rem", opacity: 0.6 }}>{t.time}</span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontFamily: "monospace", fontSize: "0.625rem", color: "rgba(244,244,240,0.35)" }}>{t.id}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#F4F4F0", fontWeight: 500, whiteSpace: "nowrap" }}>{t.merchant}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "rgba(244,244,240,0.45)", fontSize: "0.625rem" }}>{t.category}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,244,240,0.4)", padding: "0.125rem 0.375rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {t.channel}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontFamily: "monospace", fontWeight: 700, color: t.amount > 0 ? "#FF4D4D" : "#39FF88", whiteSpace: "nowrap" }}>
                    {fmtAmount(t.amount, t.currency)}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{
                      fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: dc, padding: "0.2rem 0.5rem",
                      background: `${dc}14`, border: `1px solid ${dc}33`,
                    }}>
                      {t.decision}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.08)", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${t.riskScore}%`, background: riskColor(t.riskScore), transition: "width 400ms ease" }} />
                      </div>
                      <span style={{ fontSize: "0.625rem", fontWeight: 700, color: riskColor(t.riskScore) }}>{t.riskScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.625rem", color: "rgba(244,244,240,0.4)", fontFamily: "monospace" }}>{t.country}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    {onSelectTransaction ? (
                      <button
                        onClick={() => onSelectTransaction(t)}
                        style={{
                          background: "none", border: "none", cursor: "pointer", padding: 0,
                          fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                          color: "#39FF88", whiteSpace: "nowrap",
                        }}
                      >
                        Investigate →
                      </button>
                    ) : (
                      <Link
                        href={`/command-center?tab=investigate&id=${t.id}`}
                        style={{ fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#39FF88", textDecoration: "none", whiteSpace: "nowrap" }}
                      >
                        Investigate →
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pageData.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(244,244,240,0.2)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            No transactions match filters
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ padding: "0.375rem 0.875rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: page === 0 ? "rgba(244,244,240,0.2)" : "#F4F4F0", fontSize: "0.5625rem", cursor: page === 0 ? "not-allowed" : "pointer" }}
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => {
            const p = i; // simplified
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  padding: "0.375rem 0.625rem", minWidth: 32,
                  background: page === p ? "rgba(255,163,26,0.15)" : "transparent",
                  border: `1px solid ${page === p ? "#FFA31A" : "rgba(255,255,255,0.1)"}`,
                  color: page === p ? "#FFA31A" : "rgba(244,244,240,0.5)",
                  fontSize: "0.5625rem", cursor: "pointer",
                }}
              >
                {p + 1}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{ padding: "0.375rem 0.875rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: page >= totalPages - 1 ? "rgba(244,244,240,0.2)" : "#F4F4F0", fontSize: "0.5625rem", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
