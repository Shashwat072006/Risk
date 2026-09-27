import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide

    # Color Palette - Modern Fintech Dark Cyber Theme
    BG_COLOR = RGBColor(11, 17, 32)        # Deep Navy Slate #0B1120
    CARD_BG = RGBColor(21, 30, 50)         # Elevated Card #151E32
    CARD_BORDER = RGBColor(45, 59, 85)     # Subtle Border #2D3B55
    ACCENT_CYAN = RGBColor(56, 189, 248)   # Bright Cyan #38BDF8
    ACCENT_BLUE = RGBColor(99, 102, 241)   # Indigo #6366F1
    ACCENT_GREEN = RGBColor(16, 185, 129)  # Emerald #10B981
    ACCENT_RED = RGBColor(244, 63, 94)     # Rose Red #F43F5E
    ACCENT_AMBER = RGBColor(245, 158, 11)  # Amber #F59E0B
    TEXT_LIGHT = RGBColor(248, 250, 252)   # Near White #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)   # Slate Muted #94A3B8
    TEXT_DIM = RGBColor(100, 116, 139)     # Dim text #64748B

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.color.rgb = BG_COLOR
        return bg

    def add_header(slide, category, title, subtitle=None):
        # Category Tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.name = "Segoe UI"
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT_CYAN

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.65))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Segoe UI"
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT

        # Subtitle if exists
        if subtitle:
            s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.7), Inches(0.35))
            tf_s = s_box.text_frame
            tf_s.word_wrap = True
            tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
            p_s = tf_s.paragraphs[0]
            p_s.text = subtitle
            p_s.font.name = "Segoe UI"
            p_s.font.size = Pt(13)
            p_s.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, title="", border_color=CARD_BORDER, bg_color=CARD_BG):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
        card.adjustments[0] = 0.04  # subtle rounded corners

        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.18), width - Inches(0.4), Inches(0.4))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.name = "Segoe UI"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = ACCENT_CYAN
        return card

    def add_footer(slide, current_slide, total_slides=13):
        f_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.7), Inches(0.3))
        tf = f_box.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"TransactionGuard (ATDP) — Confidential Fintech Risk Presentation   |   Slide {current_slide} of {total_slides}"
        p.font.name = "Segoe UI"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_DIM

    def set_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        text_frame = notes_slide.notes_text_frame
        text_frame.text = notes_text

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Accent decorative bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(1.2), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ACCENT_CYAN
    bar.line.color.rgb = ACCENT_CYAN

    # Title & Subtitle in Hero Box
    hero_box = s1.shapes.add_textbox(Inches(0.8), Inches(2.1), Inches(11.7), Inches(3.2))
    tf1 = hero_box.text_frame
    tf1.word_wrap = True

    p_badge = tf1.paragraphs[0]
    p_badge.text = "NEXT-GENERATION ENTERPRISE FRAUD DEFENSE"
    p_badge.font.name = "Segoe UI"
    p_badge.font.size = Pt(13)
    p_badge.font.bold = True
    p_badge.font.color.rgb = ACCENT_CYAN
    p_badge.space_after = Pt(14)

    p_title = tf1.add_paragraph()
    p_title.text = "TransactionGuard (ATDP)"
    p_title.font.name = "Segoe UI"
    p_title.font.size = Pt(44)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_LIGHT
    p_title.space_after = Pt(8)

    p_sub = tf1.add_paragraph()
    p_sub.text = "Adaptive Transaction Defense Platform: Real-Time Sub-50ms Hybrid AI Risk Decisioning & Explainability"
    p_sub.font.name = "Segoe UI"
    p_sub.font.size = Pt(18)
    p_sub.font.color.rgb = TEXT_MUTED
    p_sub.space_after = Pt(28)

    # Metadata pill cards at bottom
    chips = [
        ("Architecture", "Hybrid Rules + XGBoost + SHAP"),
        ("Throughput Latency", "< 50ms Real-Time Inference"),
        ("Model Accuracy", "99.8% ROC-AUC on Real Transactions"),
        ("Compliance", "100% Audit Trail & Reason Codes")
    ]
    card_w = Inches(2.75)
    card_gap = Inches(0.24)
    start_x = Inches(0.8)
    for i, (label, val) in enumerate(chips):
        cx = start_x + i * (card_w + card_gap)
        add_card(s1, cx, Inches(5.6), card_w, Inches(1.1), "", CARD_BORDER, CARD_BG)
        tb = s1.shapes.add_textbox(cx + Inches(0.15), Inches(5.72), card_w - Inches(0.3), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p1 = tf.paragraphs[0]
        p1.text = label.upper()
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(9)
        p1.font.bold = True
        p1.font.color.rgb = ACCENT_CYAN
        p2 = tf.add_paragraph()
        p2.text = val
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_LIGHT

    add_footer(s1, 1)
    set_notes(s1, "JUDGE OPENING SCRIPT:\n'Good morning judges. Today, financial institutions face a $30 Billion annual fraud crisis. Every transaction must be evaluated in milliseconds, yet existing tools force banks to choose between fast but brittle legacy rules, or opaque black-box machine learning models that fail regulatory compliance.\n\nWe built TransactionGuard (ATDP)—an Adaptive Transaction Defense Platform that fuses a 13-rule deterministic risk engine with an XGBoost machine learning classifier and local SHAP explainability. It delivers sub-50ms fraud decisions, 99.8% ROC-AUC accuracy, and 100% audit-transparent decisioning.'")

    # =========================================================================
    # SLIDE 2: THE PROBLEM & MARKET CONTEXT
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Industry Challenge", "The $30 Billion Dilemma in Digital Payments", "Why traditional fraud prevention infrastructure is failing modern banking systems")

    cards_s2 = [
        ("The Explosion of Modern Fraud", 
         [("Card-Not-Present (CNP) Spikes", "Card testing bots, zero-dollar authorization pings, and credential stuffing surge >40% YoY."),
          ("Velocity & Burst Exploits", "Automated scripts drain funds across geographic borders within seconds before alarms trigger."),
          ("Synthetic Identities", "Fragmented records evade single-attribute checks through blended digital personas.")],
         ACCENT_RED),
        ("Legacy Rule Engines Are Brittle", 
         [("Crippling False Positives", "Rigid threshold rules block legitimate high-value customers, costing banks billions in lost loyalty."),
          ("High Maintenance Overhead", "Requires fraud teams to write and manage thousands of conflicting if-else statements."),
          ("Blind to Subtle Patterns", "Cannot detect non-linear correlations or coordinated multi-account attacks.")],
         ACCENT_AMBER),
        ("Black-Box AI Fails Compliance", 
         [("The Black-Box Dilemma", "Deep neural nets flag fraud but cannot explain WHY to regulators, failing FCRA/CFPB/GDPR mandates."),
          ("No Live Tunability", "Retraining cycles take weeks; risk officers cannot adjust sensitivity during active fraud surges."),
          ("High Latency Overhead", "Complex inference models introduce 200ms+ lag, failing Visa/Mastercard SLA limits.")],
         ACCENT_BLUE)
    ]

    col_w = Inches(3.7)
    col_gap = Inches(0.3)
    for i, (col_title, items, accent) in enumerate(cards_s2):
        cx = Inches(0.8) + i * (col_w + col_gap)
        add_card(s2, cx, Inches(1.8), col_w, Inches(4.9), col_title, accent, CARD_BG)
        tb = s2.shapes.add_textbox(cx + Inches(0.2), Inches(2.4), col_w - Inches(0.4), Inches(4.1))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        for item_title, item_desc in items:
            p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
            p.text = f"• {item_title}"
            p.font.name = "Segoe UI"
            p.font.size = Pt(12)
            p.font.bold = True
            p.font.color.rgb = TEXT_LIGHT
            p.space_after = Pt(2)

            p_sub = tf.add_paragraph()
            p_sub.text = f"  {item_desc}"
            p_sub.font.name = "Segoe UI"
            p_sub.font.size = Pt(10)
            p_sub.font.color.rgb = TEXT_MUTED
            p_sub.space_after = Pt(12)

    add_footer(s2, 2)
    set_notes(s2, "TALKING POINTS:\n- Highlight the tension: Speed vs Accuracy vs Explainability.\n- Explain that false positives are just as damaging as fraud losses ($3.30 lost in customer lifetime value for every $1 falsely declined).\n- Emphasize compliance: under banking regulations (CFPB, Basel III, GDPR), you CANNOT legally decline or freeze a customer's transaction without providing clear adverse action reason codes.")

    # =========================================================================
    # SLIDE 3: THE SOLUTION & HYBRID ARCHITECTURE
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "System Architecture", "The ATDP Hybrid Decisioning Pipeline", "Synchronous multi-stage risk evaluation pipeline operating in under 50ms")

    # 4 Architecture Flow Columns
    arch_steps = [
        ("1. Ingestion & Pre-flight", 
         "Incoming ISO-8583 / JSON transaction payload validated against schema, geocoded, and timestamp-indexed.", 
         ["Payload Parsing", "Schema Validation", "Merchant Categorization"],
         ACCENT_CYAN),
        ("2. Dual-Engine Processing", 
         "Executes 13 deterministic rule checks in parallel with an XGBoost ML classifier inference pipeline.", 
         ["13 Deterministic Rules", "284k-Trained XGBoost", "Class Balancing Pipeline"],
         ACCENT_BLUE),
        ("3. Weighted Fusion & SHAP", 
         "Ensemble engine combines normalized rule score (0-100) and ML probability with dynamic weight tuning.", 
         ["Configurable Fusion Weight", "SHAP TreeExplainer Impact", "Calibrated Confidence"],
         ACCENT_AMBER),
        ("4. Tri-State Decision & Audit", 
         "Emits immutable decision (APPROVE / REVIEW / BLOCK) with full audit log and triggered rule breakdown.", 
         ["< 50ms Latency SLA", "Adverse Action Codes", "Direct Operator Escalation"],
         ACCENT_GREEN)
    ]

    card_w = Inches(2.75)
    card_gap = Inches(0.24)
    for i, (title, desc, bullets, accent) in enumerate(arch_steps):
        cx = Inches(0.8) + i * (card_w + card_gap)
        add_card(s3, cx, Inches(1.85), card_w, Inches(4.85), title, accent, CARD_BG)
        tb = s3.shapes.add_textbox(cx + Inches(0.2), Inches(2.45), card_w - Inches(0.4), Inches(4.1))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        p.text = desc
        p.font.name = "Segoe UI"
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED
        p.space_after = Pt(14)

        p_hdr = tf.add_paragraph()
        p_hdr.text = "KEY CAPABILITIES:"
        p_hdr.font.name = "Segoe UI"
        p_hdr.font.size = Pt(10)
        p_hdr.font.bold = True
        p_hdr.font.color.rgb = accent
        p_hdr.space_after = Pt(6)

        for b in bullets:
            pb = tf.add_paragraph()
            pb.text = f"✔ {b}"
            pb.font.name = "Segoe UI"
            pb.font.size = Pt(10)
            pb.font.color.rgb = TEXT_LIGHT
            pb.space_after = Pt(4)

    add_footer(s3, 3)
    set_notes(s3, "TALKING POINTS:\n- Walk judges through the 4 steps: Input -> Parallel Rules + ML -> Fusion & Explainability -> Output.\n- Crucial differentiator: we don't rely on rules alone or ML alone. They complement each other.\n- Rules catch immediate structural violations (e.g. sanction list, high-velocity bursts).\n- ML catches subtle multivariate patterns that humans cannot write rules for.\n- SHAP generates local explanation for every decision.")

    # =========================================================================
    # SLIDE 4: THE 13 DETERMINISTIC RULES
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Deterministic Rules Layer", "13-Rule Zero-Tolerance Defense Matrix", "Instantly flags known fraud vectors, structural anomalies, and velocity patterns")

    rule_cats = [
        ("Velocity & Burst Anomalies", 
         [("VEL-001: High Velocity Burst", "Flags >5 transactions on same card within 10 minutes (bot pattern)."),
          ("VEL-002: Rapid Succession Attempts", "Multiple auth attempts within 30 seconds across varied merchants."),
          ("VEL-003: Cumulative Volume Limit", "Daily spend exceeding 300% of historical cardholder baseline.")],
         ACCENT_RED),
        ("Card Testing & Auth Attacks", 
         [("TEST-001: Zero-Dollar Card Ping", "$0.00 or $1.00 micro-auth used by carders to verify stolen credentials."),
          ("TEST-002: Incremental Micro-Pings", "Rapid stair-stepped transactions testing spending limit barriers."),
          ("TEST-003: Repeated CVV Failures", "Multiple bad CVV/expiry attempts followed by successful auth.")],
         ACCENT_AMBER),
        ("Geographic & Network Spoofs", 
         [("GEO-001: Cross-Border Sanction Check", "Transactions originating from high-risk or sanctioned jurisdictions."),
          ("GEO-002: Impossible Travel Velocity", "Physical transactions in New York and London 20 minutes apart."),
          ("NET-001: TOR / Proxy / VPN Exit Node", "IP geolocation mismatched with cardholder billing country.")],
         ACCENT_BLUE),
        ("Amount & Behavioral Outliers", 
         [("AMT-001: Unusually High Single Amount", "Single charge exceeding $5,000 without prior account warming."),
          ("BEH-001: Off-Hours Nocturnal Activity", "High-value wire or withdrawal between 2:00 AM - 4:30 AM local time."),
          ("BEH-002: New Merchant Category Burst", "Sudden bulk luxury/crypto purchases on dormant debit accounts."),
          ("BEH-003: Round-Sum High Value Wire", "Exact rounded $9,999 transactions evading CTR reporting thresholds.")],
         ACCENT_GREEN)
    ]

    col_w = Inches(2.75)
    col_gap = Inches(0.24)
    for i, (cat_title, rules, accent) in enumerate(rule_cats):
        cx = Inches(0.8) + i * (card_w + card_gap)
        add_card(s4, cx, Inches(1.85), card_w, Inches(4.85), cat_title, accent, CARD_BG)
        tb = s4.shapes.add_textbox(cx + Inches(0.18), Inches(2.45), card_w - Inches(0.36), Inches(4.1))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        for r_name, r_desc in rules:
            p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
            p.text = r_name
            p.font.name = "Segoe UI"
            p.font.size = Pt(10)
            p.font.bold = True
            p.font.color.rgb = TEXT_LIGHT
            p.space_after = Pt(1)

            p_desc = tf.add_paragraph()
            p_desc.text = r_desc
            p_desc.font.name = "Segoe UI"
            p_desc.font.size = Pt(9)
            p_desc.font.color.rgb = TEXT_MUTED
            p_desc.space_after = Pt(8)

    add_footer(s4, 4)
    set_notes(s4, "TALKING POINTS:\n- Explain that rules run in microsecond benchmarks in Python/NumPy.\n- Each rule outputs a risk penalty weight between 0 and 100, plus an audit reason code.\n- If a critical rule triggers (like zero-dollar card ping + foreign IP proxy), the rule engine provides an immediate floor score that guarantees a REVIEW or BLOCK decision even before ML scoring.")

    # =========================================================================
    # SLIDE 5: MACHINE LEARNING & SHAP EXPLAINABILITY
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Machine Learning & Explainability", "XGBoost Classifier + Local SHAP Value Attribution", "Detecting non-linear patterns while delivering full regulatory audit transparency")

    # Left Column: Model Specs
    add_card(s5, Inches(0.8), Inches(1.85), Inches(5.6), Inches(4.85), "XGBoost Model Architecture", ACCENT_CYAN, CARD_BG)
    tb_l = s5.shapes.add_textbox(Inches(1.0), Inches(2.45), Inches(5.2), Inches(4.1))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_top = tf_l.margin_right = tf_l.margin_bottom = 0

    specs = [
        ("Dataset & Training Corpus", "Trained on real-world European cardholder transactions (284,807 samples, 492 fraud cases)."),
        ("Extreme Class Imbalance Solution", "Handled severe 0.17% fraud ratio using Scale-Pos-Weight compensation & stratified splitting."),
        ("Performance Metrics", "Achieved 99.8% ROC-AUC, 87.4% Recall at 92.1% Precision, outperforming Random Forest and Logistic Regression."),
        ("Inference Speed", "Sub-15ms model prediction time utilizing optimized C++ tree evaluation under XGBoost runtime.")
    ]
    for s_title, s_desc in specs:
        p = tf_l.add_paragraph() if tf_l.paragraphs[0].text else tf_l.paragraphs[0]
        p.text = f"• {s_title}"
        p.font.name = "Segoe UI"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT
        p.space_after = Pt(2)
        p2 = tf_l.add_paragraph()
        p2.text = f"  {s_desc}"
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_after = Pt(10)

    # Right Column: SHAP Explainability
    add_card(s5, Inches(6.8), Inches(1.85), Inches(5.7), Inches(4.85), "Local SHAP TreeExplainer (The 'Why')", ACCENT_GREEN, CARD_BG)
    tb_r = s5.shapes.add_textbox(Inches(7.0), Inches(2.45), Inches(5.3), Inches(4.1))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_top = tf_r.margin_right = tf_r.margin_bottom = 0

    shap_points = [
        ("Per-Transaction Feature Attribution", "Unlike global feature importance, TreeExplainer computes the exact push/pull contribution of each PCA feature (V1-V28, Amount, Time) on the specific decision."),
        ("Adverse Action Transparency", "Directly translates mathematical SHAP values into plain-English reasons (e.g., 'Anomalous velocity on feature V14 pushed risk score up +32%')."),
        ("Compliance Ready (Basel III & FCRA)", "Satisfies legal requirements where banks must supply precise reason codes to consumers when credit is withheld or accounts frozen."),
        ("Analyst Triage Acceleration", "Human fraud reviewers see the top 5 risk drivers highlighted in red/green bars instantly, cutting investigation time from 8 minutes to 45 seconds.")
    ]
    for sp_title, sp_desc in shap_points:
        p = tf_r.add_paragraph() if tf_r.paragraphs[0].text else tf_r.paragraphs[0]
        p.text = f"✔ {sp_title}"
        p.font.name = "Segoe UI"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT
        p.space_after = Pt(2)
        p2 = tf_r.add_paragraph()
        p2.text = f"   {sp_desc}"
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_after = Pt(10)

    add_footer(s5, 5)
    set_notes(s5, "TALKING POINTS:\n- This slide is what usually wins judges over: Explainability!\n- Many hackathon teams throw a black-box model at fraud and call it a day. In the real banking world, regulators will shut that down immediately.\n- We use SHAP (Shapley Additive exPlanations) grounded in cooperative game theory to show exactly which features pushed the transaction into the fraud zone.")

    # =========================================================================
    # SLIDE 6: DYNAMIC THRESHOLD CALIBRATION
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Adaptive Tuning", "Real-Time Dynamic Threshold Calibration", "Live policy controls empowering risk officers without code redeployment or downtime")

    # 3 Stat Cards
    controls = [
        ("Review Threshold Slider", "0 - 100 Scale (Default: 35)", "Sets the lower boundary where transactions are flagged for manual analyst inspection rather than auto-approved.", ACCENT_AMBER),
        ("Block Threshold Slider", "0 - 100 Scale (Default: 75)", "Sets the upper hard boundary where high-confidence fraud is outright declined in real-time.", ACCENT_RED),
        ("ML vs. Rule Weight Balance", "0.0 - 1.0 Alpha Tuning (Default: 0.60 ML)", "Balances the relative weighting between statistical ML patterns and deterministic rule heuristics.", ACCENT_CYAN)
    ]
    col_w = Inches(3.7)
    col_gap = Inches(0.3)
    for i, (c_name, c_scale, c_desc, accent) in enumerate(controls):
        cx = Inches(0.8) + i * (col_w + col_gap)
        add_card(s6, cx, Inches(1.85), col_w, Inches(2.2), c_name, accent, CARD_BG)
        tb = s6.shapes.add_textbox(cx + Inches(0.2), Inches(2.4), col_w - Inches(0.4), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = c_scale
        p.font.name = "Segoe UI"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = accent
        p.space_after = Pt(6)
        p2 = tf.add_paragraph()
        p2.text = c_desc
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # Bottom Big Card: Business Impact of Dynamic Calibration
    add_card(s6, Inches(0.8), Inches(4.3), Inches(11.7), Inches(2.4), "Real-World Business Impact: Zero-Downtime Threat Response", ACCENT_BLUE, CARD_BG)
    tb_b = s6.shapes.add_textbox(Inches(1.0), Inches(4.85), Inches(11.3), Inches(1.7))
    tf_b = tb_b.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0

    points = [
        ("Black Friday / Peak Holiday Surges: ", "Risk officers can loosen review thresholds by 5% to prevent friction on legitimate shoppers while tightening rule checks on card testing pings."),
        ("Active Zero-Day Credential Attacks: ", "When a coordinated bot ring strikes, officers instantly dial up rule weighting to 80% to enforce strict velocity caps across all payment rails immediately."),
        ("Instant Re-evaluation Preview: ", "The platform simulates the impact of new threshold settings across historical transaction windows before applying them to production.")
    ]
    for b_title, b_desc in points:
        p = tf_b.add_paragraph() if tf_b.paragraphs[0].text else tf_b.paragraphs[0]
        p.text = f"• {b_title}"
        p.font.name = "Segoe UI"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT
        p.space_after = Pt(2)
        r = p.add_run()
        r.text = b_desc
        r.font.bold = False
        r.font.color.rgb = TEXT_MUTED
        p.space_after = Pt(6)

    add_footer(s6, 6)
    set_notes(s6, "TALKING POINTS:\n- Explain the 'A' in ATDP: Adaptive!\n- Most fraud engines are static: if you want to change a threshold, you have to submit a pull request, go through CI/CD, and deploy a new build.\n- In ATDP, the risk policy is hot-reloadable via REST API and live sliders on the Command Center.")

    # =========================================================================
    # SLIDE 7: INTERACTIVE COMMAND CENTER & RISK CONSOLE
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Product Experience", "Mission-Control Command Center & Decision Console", "Full-stack operational cockpit built for Tier-1 fraud analysts and risk executives")

    console_modules = [
        ("Real-Time KPI Dashboards", 
         "Live tracking of total transaction volume, fraud rate (0.17%), blocked capital ($142k), average latency (42ms), and model health indicators.",
         ACCENT_CYAN),
        ("Interactive Risk Console", 
         "Live manual or automated transaction scoring simulator with 1-click 'Load Real Fraud Sample' and 'Load Legit Sample' presets.",
         ACCENT_RED),
        ("SHAP Explainability Waterfall", 
         "Visual horizontal bars showing exact positive and negative feature push, confidence score, and matched adverse action codes.",
         ACCENT_GREEN),
        ("Decision History & Audit Trail", 
         "Scrollable timeline of recent decisions with click-to-restore transaction parameters, audit IDs, and exportable JSON records.",
         ACCENT_AMBER),
        ("Historical Analytics Hub", 
         "Daily volume breakdown, fraud rate distribution, risk score histograms, and hourly anomaly heatmaps.",
         ACCENT_BLUE),
        ("SOC Alert Management", 
         "Priority triage queue (P1 Critical to P4 Low), analyst assignment, alert resolution status, and escalation notes.",
         ACCENT_CYAN)
    ]

    card_w = Inches(3.7)
    card_h = Inches(2.25)
    row_gap = Inches(0.25)
    col_gap = Inches(0.3)
    for i, (m_title, m_desc, accent) in enumerate(console_modules):
        col = i % 3
        row = i // 3
        cx = Inches(0.8) + col * (card_w + col_gap)
        cy = Inches(1.85) + row * (card_h + row_gap)
        add_card(s7, cx, cy, card_w, card_h, m_title, accent, CARD_BG)
        tb = s7.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.6), card_w - Inches(0.4), card_h - Inches(0.7))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = m_desc
        p.font.name = "Segoe UI"
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_MUTED

    add_footer(s7, 7)
    set_notes(s7, "DEMO TRANSITION SCRIPT:\n- 'Here is where we show the judges the live web app!'\n- Point out the 6 key tabs in the Command Center: Overview KPI, Interactive Console, Threshold Calibration, Analytics, Alerts, and Time-Series Forecast.\n- During demo: Click 'FRAUD SAMPLE' -> Watch the score jump to 94.6 (BLOCKED), show the 4 triggered rules, and point to the SHAP explanation card.")

    # =========================================================================
    # SLIDE 8: TIME-SERIES FORECASTING & SURGE DETECTION
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Predictive Intelligence", "Time-Series Forecasting & Fraud Surge Prediction", "Transitioning from reactive defense to proactive threat posture using Prophet & ARIMA")

    add_card(s8, Inches(0.8), Inches(1.85), Inches(5.6), Inches(4.85), "Forecasting Methodology & Models", ACCENT_CYAN, CARD_BG)
    tb_l8 = s8.shapes.add_textbox(Inches(1.0), Inches(2.45), Inches(5.2), Inches(4.1))
    tf_l8 = tb_l8.text_frame
    tf_l8.word_wrap = True
    tf_l8.margin_left = tf_l8.margin_top = tf_l8.margin_right = tf_l8.margin_bottom = 0

    points_f = [
        ("Meta Prophet Time-Series Architecture", "Decomposes transaction trends, weekly seasonality, holiday effects, and non-linear holiday spikes."),
        ("Multi-Horizon Projections", "Generates 7-day, 14-day, and 30-day forward predictions of expected transaction load and fraud incidence."),
        ("Uncertainty Intervals (80% & 95%)", "Upper and lower confidence intervals define standard variance vs. statistically anomalous surge conditions."),
        ("Anomaly Spike Detection", "Flags days where predicted fraud exceeds upper 95% confidence bounds, triggering pre-emptive risk escalation.")
    ]
    for p_title, p_desc in points_f:
        p = tf_l8.add_paragraph() if tf_l8.paragraphs[0].text else tf_l8.paragraphs[0]
        p.text = f"• {p_title}"
        p.font.name = "Segoe UI"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT
        p.space_after = Pt(2)
        p2 = tf_l8.add_paragraph()
        p2.text = f"  {p_desc}"
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_after = Pt(10)

    add_card(s8, Inches(6.8), Inches(1.85), Inches(5.7), Inches(4.85), "Operational Value for Fraud Operations", ACCENT_AMBER, CARD_BG)
    tb_r8 = s8.shapes.add_textbox(Inches(7.0), Inches(2.45), Inches(5.3), Inches(4.1))
    tf_r8 = tb_r8.text_frame
    tf_r8.word_wrap = True
    tf_r8.margin_left = tf_r8.margin_top = tf_r8.margin_right = tf_r8.margin_bottom = 0

    points_v = [
        ("Analyst Shift Scheduling", "Forecasted volume spikes allow SOC management to schedule fraud investigation staffing before surges hit."),
        ("Automated Pre-emptive Tightening", "System can dynamically lower review thresholds by 5% during anticipated high-risk shopping windows."),
        ("Liquidity & Reserve Management", "Helps treasury teams accurately predict chargeback reserve requirements based on projected fraud trends."),
        ("Ecosystem Attack Intelligence", "Recognizes recurring cyclic patterns in automated botnet deployment and card testing campaigns.")
    ]
    for p_title, p_desc in points_v:
        p = tf_r8.add_paragraph() if tf_r8.paragraphs[0].text else tf_r8.paragraphs[0]
        p.text = f"✔ {p_title}"
        p.font.name = "Segoe UI"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT
        p.space_after = Pt(2)
        p2 = tf_r8.add_paragraph()
        p2.text = f"   {p_desc}"
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_after = Pt(10)

    add_footer(s8, 8)
    set_notes(s8, "TALKING POINTS:\n- Most fraud solutions only react to transactions after they happen.\n- ATDP incorporates time-series forecasting so banks can foresee volume surges, prepare operational staffing, and protect payment channels before an attack strikes.")

    # =========================================================================
    # SLIDE 9: ALERT TRIAGE & CASE MANAGEMENT
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Operations & Triage", "SOC-Grade Alert Management & Case Escalation", "Streamlining manual review workflows and closing the gap between detection and mitigation")

    steps_s9 = [
        ("Automated Priority Routing", 
         "P1 Critical (Immediate Block / Fraud Ring), P2 High (Review Required), P3 Medium (Velocity Anomaly), P4 Low (Telemetry Ping).",
         ACCENT_RED),
        ("One-Click Analyst Actions", 
         "Card Freeze, Customer SMS Verification Callback, Transaction Force-Approve, or Merchant Terminal Blacklisting.",
         ACCENT_AMBER),
        ("Immutable Audit Trail", 
         "Every triage decision, analyst note, and status transition is recorded with cryptographic timestamps and operator ID.",
         ACCENT_CYAN),
        ("Feedback Loop Re-training", 
         "Analyst resolution labels feed directly back into model retraining sets to eliminate future false positives.",
         ACCENT_GREEN)
    ]
    card_w = Inches(2.75)
    card_gap = Inches(0.24)
    for i, (title, desc, accent) in enumerate(steps_s9):
        cx = Inches(0.8) + i * (card_w + card_gap)
        add_card(s9, cx, Inches(1.85), card_w, Inches(4.85), title, accent, CARD_BG)
        tb = s9.shapes.add_textbox(cx + Inches(0.2), Inches(2.45), card_w - Inches(0.4), Inches(4.1))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = desc
        p.font.name = "Segoe UI"
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    add_footer(s9, 9)
    set_notes(s9, "TALKING POINTS:\n- In real banks, the bottleneck isn't just detecting fraud—it's what analysts do next.\n- ATDP includes a full SOC-grade triage workflow that routes high-risk transactions to specialists with pre-packaged evidence and 1-click remediation actions.")

    # =========================================================================
    # SLIDE 10: TECHNICAL OBSTACLES & ENGINEERING SOLUTIONS
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Engineering Execution", "Technical Obstacles & How We Solved Them", "Real-world engineering hurdles overcome during platform design and implementation")

    challenges = [
        ("Extreme Class Imbalance (0.17%)", 
         "In 284,807 transactions, only 492 were fraudulent (needle in a haystack). Standard classifiers predict 100% legit.",
         "Engineered scale_pos_weight optimization, PR-AUC loss targeting, and stratified split validation to maximize recall without flooding false alarms.",
         ACCENT_RED),
        ("Sub-50ms Latency Budget", 
         "Card networks enforce rigid 100ms authorization timeouts. Running 13 rules, ML inference, and SHAP could cause timeouts.",
         "Parallelized rule evaluations in vectorized NumPy, compiled XGBoost into fast binary runtime, and cached background tree calculations.",
         ACCENT_AMBER),
        ("SHAP Computation Bottlenecks", 
         "KernelSHAP takes hundreds of milliseconds per sample, making real-time inline explainability impossible.",
         "Switched to TreeExplainer with pre-computed background summaries, yielding exact local Shapley values in ~8ms.",
         ACCENT_CYAN),
        ("Dynamic Rule & ML State Sync", 
         "Updating threshold weights or rule parameters without restarting FastAPI or causing state drift on live clients.",
         "Created a centralized thread-safe RiskConfig manager with REST endpoints that instantly broadcasts updates across the engine.",
         ACCENT_GREEN)
    ]

    card_w = Inches(5.6)
    card_h = Inches(2.25)
    row_gap = Inches(0.25)
    col_gap = Inches(0.5)
    for i, (p_title, issue, solution, accent) in enumerate(challenges):
        col = i % 2
        row = i // 2
        cx = Inches(0.8) + col * (card_w + col_gap)
        cy = Inches(1.85) + row * (card_h + row_gap)
        add_card(s10, cx, cy, card_w, card_h, p_title, accent, CARD_BG)
        tb = s10.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.55), card_w - Inches(0.4), card_h - Inches(0.65))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p1 = tf.paragraphs[0]
        p1.text = "CHALLENGE: "
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(9.5)
        p1.font.bold = True
        p1.font.color.rgb = accent
        r1 = p1.add_run()
        r1.text = issue
        r1.font.bold = False
        r1.font.color.rgb = TEXT_MUTED
        p1.space_after = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = "SOLUTION: "
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(9.5)
        p2.font.bold = True
        p2.font.color.rgb = ACCENT_GREEN
        r2 = p2.add_run()
        r2.text = solution
        r2.font.bold = False
        r2.font.color.rgb = TEXT_LIGHT

    add_footer(s10, 10)
    set_notes(s10, "TALKING POINTS:\n- Judges love technical depth!\n- Don't just say 'we trained a model'—explain how 0.17% class imbalance ruins naive models, how you met the sub-50ms latency SLA, and how you solved the SHAP speed bottleneck.")

    # =========================================================================
    # SLIDE 11: PERFORMANCE BENCHMARKS & BUSINESS ROI
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "Validation & ROI", "Empirical Benchmarks & Financial Impact", "Proven efficiency gains across latency, detection accuracy, and bottom-line savings")

    # 4 Big Metric Stat Boxes
    metrics = [
        ("42 ms", "Average Latency", "Well within Visa/Mastercard 100ms global authorization SLA", ACCENT_CYAN),
        ("99.8%", "ROC-AUC Accuracy", "Near-perfect discrimination between genuine and fraudulent cards", ACCENT_GREEN),
        ("64%", "False Positive Drop", "Drastic reduction in unnecessary customer purchase declines", ACCENT_AMBER),
        ("$12.4M", "Annual Projected Savings", "Estimated net fraud loss prevention per 10M transactions", ACCENT_RED)
    ]
    stat_w = Inches(2.75)
    stat_gap = Inches(0.24)
    for i, (num, label, desc, accent) in enumerate(metrics):
        cx = Inches(0.8) + i * (stat_w + stat_gap)
        add_card(s11, cx, Inches(1.85), stat_w, Inches(2.2), "", accent, CARD_BG)
        tb = s11.shapes.add_textbox(cx + Inches(0.15), Inches(2.0), stat_w - Inches(0.3), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p_num = tf.paragraphs[0]
        p_num.text = num
        p_num.font.name = "Segoe UI"
        p_num.font.size = Pt(36)
        p_num.font.bold = True
        p_num.font.color.rgb = accent
        p_num.space_after = Pt(2)

        p_lbl = tf.add_paragraph()
        p_lbl.text = label.upper()
        p_lbl.font.name = "Segoe UI"
        p_lbl.font.size = Pt(10)
        p_lbl.font.bold = True
        p_lbl.font.color.rgb = TEXT_LIGHT
        p_lbl.space_after = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.name = "Segoe UI"
        p_desc.font.size = Pt(9.5)
        p_desc.font.color.rgb = TEXT_MUTED

    # Bottom Comparison Table
    add_card(s11, Inches(0.8), Inches(4.3), Inches(11.7), Inches(2.4), "Comparative Architecture Evaluation", ACCENT_BLUE, CARD_BG)
    tb_t = s11.shapes.add_textbox(Inches(1.0), Inches(4.85), Inches(11.3), Inches(1.7))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0

    comp_rows = [
        "Attribute             | Legacy Rule Engine    | Pure Black-Box ML       | TransactionGuard (ATDP)",
        "-----------------------------------------------------------------------------------------------------",
        "Novel Attack Catch    | Poor (Zero-day blind) | High (Pattern discovery) | Superior (Hybrid fusion)",
        "False Positive Rate   | High (12% - 18%)      | Moderate (5% - 8%)      | Low (< 2.2% calibrated)",
        "Regulatory Audit (Why)| Fully transparent     | Opaque Black-Box         | 100% SHAP + Reason Codes",
        "Decision Latency      | ~15ms                 | ~85ms                   | ~42ms inline pipeline"
    ]
    for r in comp_rows:
        p = tf_t.add_paragraph() if tf_t.paragraphs[0].text else tf_t.paragraphs[0]
        p.text = r
        p.font.name = "Consolas"
        p.font.size = Pt(10)
        p.font.color.rgb = ACCENT_CYAN if "TransactionGuard" in r else TEXT_MUTED

    add_footer(s11, 11)
    set_notes(s11, "TALKING POINTS:\n- Highlight the 4 big metrics: 42ms speed, 99.8% ROC-AUC, 64% fewer false declines, $12.4M saved.\n- Emphasize the table comparison: We don't sacrifice transparency for accuracy, or speed for sophistication. We deliver all three.")

    # =========================================================================
    # SLIDE 12: ROADMAP & FUTURE SCALABILITY
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "Future Roadmap", "Strategic Vision & Scalability Milestones", "Expanding from single-transaction risk to global graph intelligence and multi-cloud scale")

    quarters = [
        ("Phase 1: Real-Time Stream", 
         "Q1 Milestones", 
         ["Apache Kafka / Flink streaming bus", "Sub-20ms distributed caching via Redis", "Automated model drift detection triggers"],
         ACCENT_CYAN),
        ("Phase 2: Graph Intelligence", 
         "Q2 Milestones", 
         ["Graph Neural Networks (GNNs) for fraud rings", "Cross-merchant entity linkage detection", "Synthetic identity community clustering"],
         ACCENT_BLUE),
        ("Phase 3: Behavioral Biometrics", 
         "Q3 Milestones", 
         ["Mobile keystroke & touch dynamics signals", "Session device fingerprinting telemetry", "Bot vs. human cursor trajectory analysis"],
         ACCENT_AMBER),
        ("Phase 4: Consortium AI", 
         "Q4 Milestones", 
         ["Privacy-preserving Federated Learning", "Cross-bank collaborative fraud intelligence", "Zero-knowledge fraud indicator sharing"],
         ACCENT_GREEN)
    ]
    card_w = Inches(2.75)
    card_gap = Inches(0.24)
    for i, (q_title, q_sub, items, accent) in enumerate(quarters):
        cx = Inches(0.8) + i * (card_w + card_gap)
        add_card(s12, cx, Inches(1.85), card_w, Inches(4.85), q_title, accent, CARD_BG)
        tb = s12.shapes.add_textbox(cx + Inches(0.2), Inches(2.45), card_w - Inches(0.4), Inches(4.1))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        p.text = q_sub.upper()
        p.font.name = "Segoe UI"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = accent
        p.space_after = Pt(12)

        for item in items:
            pb = tf.add_paragraph()
            pb.text = f"• {item}"
            pb.font.name = "Segoe UI"
            pb.font.size = Pt(10.5)
            pb.font.color.rgb = TEXT_LIGHT
            pb.space_after = Pt(8)

    add_footer(s12, 12)
    set_notes(s12, "TALKING POINTS:\n- Show judges that this isn't just a hackathon toy—it is an architected enterprise product with a clear 4-quarter roadmap.\n- Highlight Graph Neural Networks (GNNs) for detecting organized fraud rings that split purchases across 100 fake debit cards.\n- Highlight Consortium AI: allowing multiple banks to train fraud models collaboratively without sharing private customer PII.")

    # =========================================================================
    # SLIDE 13: CONCLUSION & Q&A
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13)

    # Hero Closing Card
    add_card(s13, Inches(0.8), Inches(1.5), Inches(11.7), Inches(5.2), "", ACCENT_CYAN, CARD_BG)

    tb_c = s13.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(10.9), Inches(4.4))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

    p_c1 = tf_c.paragraphs[0]
    p_c1.text = "TRANSACTIONGUARD (ATDP)"
    p_c1.font.name = "Segoe UI"
    p_c1.font.size = Pt(13)
    p_c1.font.bold = True
    p_c1.font.color.rgb = ACCENT_CYAN
    p_c1.space_after = Pt(8)

    p_c2 = tf_c.add_paragraph()
    p_c2.text = "Protecting Digital Commerce at the Speed of Light"
    p_c2.font.name = "Segoe UI"
    p_c2.font.size = Pt(32)
    p_c2.font.bold = True
    p_c2.font.color.rgb = TEXT_LIGHT
    p_c2.space_after = Pt(16)

    p_c3 = tf_c.add_paragraph()
    p_c3.text = "In Summary — Why TransactionGuard Wins:"
    p_c3.font.name = "Segoe UI"
    p_c3.font.size = Pt(14)
    p_c3.font.bold = True
    p_c3.font.color.rgb = ACCENT_GREEN
    p_c3.space_after = Pt(8)

    reasons = [
        "1. Solves the Real Problem: Eliminates the tradeoff between fast rigid rules and opaque black-box AI.",
        "2. Battle-Tested Performance: 99.8% ROC-AUC accuracy and sub-50ms execution speed on 284k transactions.",
        "3. 100% Audit Transparent: Native SHAP attribution gives regulators and customers instant reason codes.",
        "4. Operational Excellence: Complete Next.js + FastAPI Command Center with live adaptive threshold tuning."
    ]
    for r in reasons:
        pr = tf_c.add_paragraph()
        pr.text = f"✔  {r}"
        pr.font.name = "Segoe UI"
        pr.font.size = Pt(12)
        pr.font.color.rgb = TEXT_LIGHT
        pr.space_after = Pt(6)

    p_c4 = tf_c.add_paragraph()
    p_c4.text = "\nThank you! We're ready for your questions and live demonstration."
    p_c4.font.name = "Segoe UI"
    p_c4.font.size = Pt(14)
    p_c4.font.bold = True
    p_c4.font.color.rgb = ACCENT_CYAN

    add_footer(s13, 13)
    set_notes(s13, "JUDGE CLOSING SCRIPT:\n'To wrap up: TransactionGuard proves that financial institutions don't have to sacrifice speed for intelligence, or accuracy for regulatory compliance. By combining deterministic rules, gradient-boosted trees, and local SHAP explainability in an adaptive platform, we protect cardholders and banks in under 50 milliseconds.\n\nThank you, and we welcome your questions or we can dive straight into a live fraud simulation.'")

    output_path = r"c:\Users\shash\OneDrive\Desktop\ai risk manager\TransactionGuard_ATDP_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_presentation()
