"""
app.py — TransactionGuard
Streamlit demo UI — dark fintech command-center aesthetic.
Live transaction scoring with full explanation output.

Usage:
    streamlit run app.py
"""

import json
import random
import time
import uuid
from pathlib import Path

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# ── Page config ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="TransactionGuard — Risk Console",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Dark theme CSS ─────────────────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    :root {
        --black: #050505;
        --surface: #0F0F0F;
        --surface2: #1A1A1A;
        --surface3: #242424;
        --white: #F7F7F2;
        --green: #0ED39A;
        --green-dark: #066C54;
        --grey: #A1A1A1;
        --red: #FF4D4D;
        --amber: #F59E0B;
        --line: rgba(255,255,255,0.12);
    }

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
        background-color: var(--black);
        color: var(--white);
    }

    /* Hide Streamlit chrome */
    #MainMenu, footer, header { visibility: hidden; }

    .block-container { padding: 2rem 3rem; max-width: 1400px; }

    /* Custom header */
    .tg-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 1.5rem 0; border-bottom: 1px solid var(--line); margin-bottom: 2rem;
    }
    .tg-logo {
        font-size: 1.1rem; font-weight: 800; letter-spacing: .15em;
        color: var(--green); text-transform: uppercase;
    }
    .tg-nav { color: var(--grey); font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; }

    /* Metric card */
    .metric-card {
        background: var(--surface2); border: 1px solid var(--line);
        border-radius: 12px; padding: 1.5rem; text-align: center;
    }
    .metric-value { font-size: 2.4rem; font-weight: 800; letter-spacing: -.02em; }
    .metric-label { font-size: .7rem; color: var(--grey); text-transform: uppercase;
                    letter-spacing: .1em; margin-top: .3rem; }

    /* Decision badge */
    .badge-allow  { background: rgba(14,211,154,.15); color: var(--green);
                    border: 1px solid rgba(14,211,154,.4); }
    .badge-review { background: rgba(245,158,11,.15);  color: var(--amber);
                    border: 1px solid rgba(245,158,11,.4); }
    .badge-block  { background: rgba(255,77,77,.15);   color: var(--red);
                    border: 1px solid rgba(255,77,77,.4); }
    .badge { border-radius: 50px; padding: .35rem 1rem; font-size: .85rem;
             font-weight: 700; letter-spacing: .08em; display: inline-block; }

    /* Score bar */
    .score-bar-track { background: var(--surface3); border-radius: 4px; height: 8px; width: 100%; }
    .score-bar-fill  { border-radius: 4px; height: 8px; transition: width .5s ease; }

    /* Rule / feature tags */
    .rule-tag {
        display: inline-block; margin: .2rem;
        background: rgba(255,77,77,.1); border: 1px solid rgba(255,77,77,.3);
        color: var(--red); border-radius: 4px; padding: .2rem .6rem;
        font-size: .75rem; font-family: 'Inter', monospace;
    }
    .feat-tag {
        display: inline-block; margin: .2rem;
        background: rgba(14,211,154,.08); border: 1px solid rgba(14,211,154,.25);
        color: var(--green); border-radius: 4px; padding: .2rem .6rem;
        font-size: .75rem; font-family: 'Inter', monospace;
    }

    /* Section label */
    .section-label {
        font-size: .65rem; text-transform: uppercase; letter-spacing: .12em;
        color: var(--grey); margin-bottom: .5rem;
    }

    /* Input overrides */
    .stTextInput input, .stNumberInput input, .stSelectbox select {
        background: var(--surface2) !important; color: var(--white) !important;
        border: 1px solid var(--line) !important; border-radius: 8px !important;
    }
    .stButton > button {
        background: var(--green) !important; color: var(--black) !important;
        border: none !important; border-radius: 50px !important;
        font-weight: 700 !important; font-size: .9rem !important;
        padding: .6rem 2rem !important; letter-spacing: .05em !important;
    }
    .stButton > button:hover { opacity: .85; }

    /* Divider */
    hr { border-color: var(--line); margin: 1.5rem 0; }

    /* Table */
    .stDataFrame { border: 1px solid var(--line); border-radius: 8px; }

    h1, h2, h3 { color: var(--white); }
</style>
""", unsafe_allow_html=True)


# ── Model loader (cached) ──────────────────────────────────────────────────────

@st.cache_resource(show_spinner="Loading risk engine...")
def load_engine():
    """Train model if not already saved."""
    model_path = "hybrid_scorer.joblib"
    if not Path(model_path).exists():
        from data_generator import generate_dataset
        from risk_engine import HybridScorer
        if not Path("transactions.csv").exists():
            generate_dataset()
        df = pd.read_csv("transactions.csv")
        scorer = HybridScorer()
        scorer.fit(df)
        scorer.save(model_path)

    from decision_engine import load_engine as _load
    return _load(model_path=model_path)


@st.cache_data(show_spinner=False)
def load_eval_results():
    if Path("eval_results.json").exists():
        with open("eval_results.json") as f:
            return json.load(f)
    return {}


@st.cache_data(show_spinner=False)
def load_log():
    if Path("evidence_log.csv").exists():
        return pd.read_csv("evidence_log.csv")
    return pd.DataFrame()


# ── Sample transactions for demo ───────────────────────────────────────────────

SAMPLES = {
    "Card-testing burst (HIGH RISK)": {
        "amount": 4.99,
        "merchant_category": "gaming",
        "merchant_risk_tier": 3,
        "billing_country": "US",
        "ip_country": "NG",
        "account_age_days": 1,
        "device_age_days": 0,
        "prior_declines_1h": 8,
        "txn_count_1h": 10,
        "txn_count_24h": 14,
        "cards_on_device_7d": 6,
        "accounts_on_ip_24h": 9,
        "is_vpn_or_proxy": 1,
        "failed_then_success": 1,
        "is_new_device": 1,
        "hour_of_day": 3,
    },
    "Normal purchase (LOW RISK)": {
        "amount": 79.99,
        "merchant_category": "e-commerce",
        "merchant_risk_tier": 2,
        "billing_country": "US",
        "ip_country": "US",
        "account_age_days": 450,
        "device_age_days": 200,
        "prior_declines_1h": 0,
        "txn_count_1h": 1,
        "txn_count_24h": 2,
        "cards_on_device_7d": 1,
        "accounts_on_ip_24h": 1,
        "is_vpn_or_proxy": 0,
        "failed_then_success": 0,
        "is_new_device": 0,
        "hour_of_day": 14,
    },
    "New device + high value (REVIEW)": {
        "amount": 1249.00,
        "merchant_category": "electronics",
        "merchant_risk_tier": 3,
        "billing_country": "IN",
        "ip_country": "AE",
        "account_age_days": 12,
        "device_age_days": 0,
        "prior_declines_1h": 1,
        "txn_count_1h": 2,
        "txn_count_24h": 4,
        "cards_on_device_7d": 3,
        "accounts_on_ip_24h": 3,
        "is_vpn_or_proxy": 1,
        "failed_then_success": 0,
        "is_new_device": 1,
        "hour_of_day": 2,
    },
}


# ── Helpers ────────────────────────────────────────────────────────────────────

def score_color(score: float) -> str:
    if score < 0.35:  return "#0ED39A"
    if score < 0.70:  return "#F59E0B"
    return "#FF4D4D"


def decision_badge(decision: str) -> str:
    cls = f"badge-{decision.lower()}"
    return f'<span class="badge {cls}">{decision}</span>'


# ── Header ─────────────────────────────────────────────────────────────────────

st.markdown("""
<div class="tg-header">
    <div class="tg-logo">RISK//01 &nbsp; TransactionGuard</div>
    <div class="tg-nav">Overview &nbsp;·&nbsp; Transactions &nbsp;·&nbsp; Rules &nbsp;·&nbsp; Models &nbsp;·&nbsp; Chargebacks</div>
</div>
""", unsafe_allow_html=True)


# ── Hero banner ────────────────────────────────────────────────────────────────

col_h1, col_h2 = st.columns([2, 1])
with col_h1:
    st.markdown("""
    <div style="padding: 1rem 0 2rem;">
        <div class="section-label">Real-Time Middleware</div>
        <h1 style="font-size:3.5rem; font-weight:900; line-height:1.05;
                   letter-spacing:-.03em; margin:0; text-transform:uppercase;">
            REAL-TIME<br>TRANSACTION<br><span style="color:#0ED39A;">RISK ENGINE</span>
        </h1>
        <p style="color:#A1A1A1; margin-top:1rem; max-width:480px;">
            The intelligence layer between your payment flow and financial loss.
            Every transaction scored, explained, and decided in milliseconds.
        </p>
    </div>
    """, unsafe_allow_html=True)

with col_h2:
    eval_r = load_eval_results()
    if eval_r:
        st.markdown('<div class="section-label">Model Performance (held-out test set)</div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        with c1:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-value" style="color:#0ED39A;">{eval_r.get('recall',0):.0%}</div>
                <div class="metric-label">Recall</div>
            </div>""", unsafe_allow_html=True)
        with c2:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-value" style="color:#0ED39A;">{eval_r.get('precision',0):.0%}</div>
                <div class="metric-label">Precision</div>
            </div>""", unsafe_allow_html=True)
        st.markdown(f"""
        <div class="metric-card" style="margin-top:.75rem;">
            <div class="metric-value" style="color:#F7F7F2;">{eval_r.get('f1',0):.0%}</div>
            <div class="metric-label">F1 Score</div>
        </div>""", unsafe_allow_html=True)

st.markdown("<hr>", unsafe_allow_html=True)

# ── Main tabs ──────────────────────────────────────────────────────────────────

tab1, tab2, tab3 = st.tabs(["Score a Transaction", "Batch Analysis", "Audit Log"])


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 1 — Live Scoring
# ═══════════════════════════════════════════════════════════════════════════════

with tab1:
    st.markdown('<div class="section-label">Transaction Input</div>', unsafe_allow_html=True)

    # Quick-fill presets
    preset = st.selectbox("Load sample transaction", ["— custom —"] + list(SAMPLES.keys()))

    defaults = SAMPLES.get(preset, {}) if preset != "— custom —" else {}

    col_a, col_b, col_c = st.columns(3)
    with col_a:
        amount = st.number_input("Amount (USD)", min_value=0.01, max_value=99999.0,
                                 value=float(defaults.get("amount", 50.0)), step=0.01)
        merchant_category = st.selectbox("Merchant Category",
            ["e-commerce","gaming","travel","food_delivery","electronics","fashion","groceries","streaming"],
            index=["e-commerce","gaming","travel","food_delivery","electronics","fashion","groceries","streaming"]
                .index(defaults.get("merchant_category","e-commerce")))
        billing_country = st.text_input("Billing Country", value=defaults.get("billing_country","US"))
        ip_country      = st.text_input("IP Country",      value=defaults.get("ip_country","US"))

    with col_b:
        account_age_days = st.number_input("Account Age (days)", 0, 5000,
                                           int(defaults.get("account_age_days", 365)))
        device_age_days  = st.number_input("Device Age (days)",  0, 5000,
                                           int(defaults.get("device_age_days", 90)))
        prior_declines   = st.number_input("Prior Declines (1h)", 0, 20,
                                           int(defaults.get("prior_declines_1h", 0)))
        txn_count_1h     = st.number_input("Txn Count (1h)",      1, 50,
                                           int(defaults.get("txn_count_1h", 1)))

    with col_c:
        cards_on_device  = st.number_input("Cards on Device (7d)", 1, 20,
                                           int(defaults.get("cards_on_device_7d", 1)))
        accounts_on_ip   = st.number_input("Accounts on IP (24h)", 1, 20,
                                           int(defaults.get("accounts_on_ip_24h", 1)))
        is_vpn           = st.checkbox("VPN/Proxy detected",      bool(defaults.get("is_vpn_or_proxy", False)))
        failed_then_ok   = st.checkbox("Failed-then-success",     bool(defaults.get("failed_then_success", False)))
        is_new_device    = st.checkbox("New Device",              bool(defaults.get("is_new_device", False)))
        hour_of_day      = st.slider("Hour of Day (UTC)", 0, 23, int(defaults.get("hour_of_day", 12)))

    st.markdown("<br>", unsafe_allow_html=True)

    if st.button("▶  SCORE TRANSACTION"):
        engine = load_engine()

        MERCHANT_RISK = {"gaming":3,"travel":2,"electronics":3,
                         "e-commerce":2,"food_delivery":1,"fashion":1,"groceries":1,"streaming":1}

        txn = {
            "transaction_id": str(uuid.uuid4()),
            "amount": amount,
            "merchant_category": merchant_category,
            "merchant_risk_tier": MERCHANT_RISK.get(merchant_category, 2),
            "billing_country": billing_country.upper(),
            "ip_country": ip_country.upper(),
            "account_age_days": account_age_days,
            "device_age_days": device_age_days,
            "prior_declines_1h": prior_declines,
            "txn_count_1h": txn_count_1h,
            "txn_count_24h": txn_count_1h * 2,
            "cards_on_device_7d": cards_on_device,
            "accounts_on_ip_24h": accounts_on_ip,
            "is_vpn_or_proxy": int(is_vpn),
            "failed_then_success": int(failed_then_ok),
            "is_new_device": int(is_new_device),
            "hour_of_day": hour_of_day,
        }

        with st.spinner("Scoring..."):
            time.sleep(0.3)
            decision = engine.decide(txn)

        st.markdown("<hr>", unsafe_allow_html=True)
        st.markdown('<div class="section-label">Decision Output</div>', unsafe_allow_html=True)

        col_d1, col_d2, col_d3 = st.columns([1.5, 1, 1])
        with col_d1:
            st.markdown(f"### {decision_badge(decision.decision)}", unsafe_allow_html=True)
            st.markdown(f"<p style='color:#A1A1A1;margin-top:.5rem;'>{decision.reason_summary}</p>",
                        unsafe_allow_html=True)

        with col_d2:
            risk_pct = int(decision.risk_score * 100)
            color = score_color(decision.risk_score)
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-value" style="color:{color};">{risk_pct}</div>
                <div class="metric-label">Risk Score (0–100)</div>
            </div>""", unsafe_allow_html=True)

        with col_d3:
            st.markdown(f"""
            <div class="metric-card">
                <div style="font-size:1rem;font-weight:600;">Rule: {decision.rule_score:.0%}</div>
                <div style="font-size:1rem;font-weight:600;margin-top:.5rem;">ML:   {decision.ml_prob:.0%}</div>
                <div class="metric-label" style="margin-top:.5rem;">Component scores</div>
            </div>""", unsafe_allow_html=True)

        # Score bar
        color = score_color(decision.risk_score)
        st.markdown(f"""
        <div style="margin:1.5rem 0;">
            <div class="section-label">Risk Score</div>
            <div class="score-bar-track">
                <div class="score-bar-fill" style="width:{risk_pct}%;background:{color};"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:.3rem;">
                <span style="font-size:.7rem;color:#0ED39A;">ALLOW &lt; 35</span>
                <span style="font-size:.7rem;color:#F59E0B;">REVIEW 35–70</span>
                <span style="font-size:.7rem;color:#FF4D4D;">BLOCK &gt; 70</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Triggered rules
        if decision.triggered_rules:
            st.markdown('<div class="section-label" style="margin-top:1rem;">Triggered Rules</div>', unsafe_allow_html=True)
            tags = "".join(f'<span class="rule-tag">[RULE] {r}</span>' for r in decision.triggered_rules)
            st.markdown(tags, unsafe_allow_html=True)
        else:
            st.markdown('<div style="color:#A1A1A1;font-size:.85rem;">No rules triggered.</div>',
                        unsafe_allow_html=True)

        # Top ML features
        if decision.top_features:
            st.markdown('<div class="section-label" style="margin-top:1rem;">Top ML Signals</div>', unsafe_allow_html=True)
            tags = "".join(f'<span class="feat-tag">◈ {f}</span>' for f in decision.top_features)
            st.markdown(tags, unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 2 — Batch Analysis
# ═══════════════════════════════════════════════════════════════════════════════

with tab2:
    st.markdown('<div class="section-label">Batch Evaluation</div>', unsafe_allow_html=True)

    if st.button("▶  Run Full Evaluation"):
        with st.spinner("Training model + evaluating on held-out test set..."):
            from evaluator import run_evaluation
            results = run_evaluation()
            st.cache_data.clear()

        st.success("Evaluation complete!")

        c1, c2, c3, c4 = st.columns(4)
        metrics = [
            ("Precision", results["precision"], "#0ED39A"),
            ("Recall",    results["recall"],    "#0ED39A"),
            ("F1 Score",  results["f1"],        "#F7F7F2"),
            ("FPR",       results["false_positive_rate"], "#FF4D4D"),
        ]
        for col, (label, val, color) in zip([c1,c2,c3,c4], metrics):
            col.markdown(f"""
            <div class="metric-card">
                <div class="metric-value" style="color:{color};">{val:.0%}</div>
                <div class="metric-label">{label}</div>
            </div>""", unsafe_allow_html=True)

        # Confusion matrix
        cm_data = pd.DataFrame({
            "": ["Predicted LEGIT", "Predicted FRAUD"],
            "Actual LEGIT": [results["true_negatives"],  results["false_positives"]],
            "Actual FRAUD": [results["false_negatives"], results["true_positives"]],
        }).set_index("")
        st.markdown("<br><div class='section-label'>Confusion Matrix</div>", unsafe_allow_html=True)
        st.dataframe(cm_data, use_container_width=True)

    eval_r = load_eval_results()
    if eval_r:
        st.markdown("<hr><div class='section-label'>Last Saved Results</div>", unsafe_allow_html=True)
        cols = st.columns(5)
        for col, (k, label) in zip(cols, [
            ("precision","Precision"),("recall","Recall"),("f1","F1"),
            ("roc_auc","ROC-AUC"),("false_positive_rate","FPR"),
        ]):
            color = "#FF4D4D" if k == "false_positive_rate" else "#0ED39A"
            col.markdown(f"""
            <div class="metric-card">
                <div class="metric-value" style="color:{color};">{eval_r.get(k,0):.2%}</div>
                <div class="metric-label">{label}</div>
            </div>""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 3 — Audit Log
# ═══════════════════════════════════════════════════════════════════════════════

with tab3:
    st.markdown('<div class="section-label">Decision Audit Trail</div>', unsafe_allow_html=True)
    log = load_log()

    if log.empty:
        st.markdown('<p style="color:#A1A1A1;">No decisions logged yet. Score a transaction first.</p>',
                    unsafe_allow_html=True)
    else:
        # Summary pills
        counts = log["decision"].value_counts() if "decision" in log.columns else {}
        c1, c2, c3 = st.columns(3)
        for col, (label, cls) in zip([c1,c2,c3],
            [("ALLOW","badge-allow"),("REVIEW","badge-review"),("BLOCK","badge-block")]):
            col.markdown(f"""
            <div class="metric-card">
                <div class="metric-value">{counts.get(label,0)}</div>
                <div class="metric-label">{label}</div>
            </div>""", unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        # Distribution chart
        if "risk_score" in log.columns:
            fig = px.histogram(log, x="risk_score", nbins=30, color="decision",
                               color_discrete_map={"ALLOW":"#0ED39A","REVIEW":"#F59E0B","BLOCK":"#FF4D4D"},
                               title="Risk Score Distribution")
            fig.update_layout(
                paper_bgcolor="#0F0F0F", plot_bgcolor="#0F0F0F",
                font_color="#F7F7F2", title_font_size=14,
                margin=dict(l=10,r=10,t=40,b=10),
            )
            st.plotly_chart(fig, use_container_width=True)

        # Table
        display_cols = ["transaction_id","decision","risk_score","amount","merchant_category","timestamp"]
        avail = [c for c in display_cols if c in log.columns]
        st.dataframe(log[avail].tail(50).sort_values("timestamp", ascending=False)
                     if "timestamp" in log.columns else log[avail].tail(50),
                     use_container_width=True)
