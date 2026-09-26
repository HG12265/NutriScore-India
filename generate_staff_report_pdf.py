"""
NutriScore AI (India) - Executive Technical Whitepaper & Staff Training Guide
Generates a publication-quality, professional PDF document explaining:
- Complete end-to-end system architecture
- All features and how each feature works
- Exact mathematical calculation formulas & scoring steps
- Applied Indian scientific standards (ICMR-NIN 2024, Revised RDAs, IFCT 2017)
- Staff presentation guidelines & quick reference
"""

import sys
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
    ListFlowable,
    ListItem
)
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and print 'Page X of Y' and running header."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#065f46"))

        # Top Running Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(
                42,
                A4[1] - 28,
                "NUTRISCORE AI (INDIA) — STAFF TECHNICAL & OPERATIONAL WHITEPAPER",
            )
            self.drawRightString(
                A4[0] - 42, A4[1] - 28, "ICMR-NIN 2024 & IFCT 2017 STANDARD"
            )
            self.setStrokeColor(colors.HexColor("#10b981"))
            self.setLineWidth(1)
            self.line(42, A4[1] - 32, A4[0] - 42, A4[1] - 32)

        # Bottom Running Footer (All Pages)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 42, 24, footer_text)
        self.drawString(
            42,
            24,
            "NutriScore AI • Exclusively Calibrated to ICMR-NIN 2024 Dietary Guidelines & Revised RDAs",
        )
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(42, 34, A4[0] - 42, 34)

        self.restoreState()


def create_staff_documentation_pdf(filename="NutriScore_India_Staff_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=42,
        bottomMargin=42,
    )

    styles = getSampleStyleSheet()

    # Brand Colors
    c_primary = colors.HexColor("#0f172a")      # Slate 900
    c_emerald = colors.HexColor("#059669")      # Emerald 600
    c_dark_emerald = colors.HexColor("#064e3b") # Deep Emerald
    c_amber = colors.HexColor("#d97706")        # Amber 600
    c_slate = colors.HexColor("#334155")        # Slate 700
    c_light_bg = colors.HexColor("#f8fafc")     # Light Slate
    c_green_bg = colors.HexColor("#ecfdf5")     # Light Emerald
    c_border = colors.HexColor("#cbd5e1")

    # Typography Styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=21,
        leading=25,
        textColor=c_dark_emerald,
        spaceAfter=4,
    )

    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=c_slate,
        spaceAfter=12,
    )

    h1_style = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=c_dark_emerald,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12.5,
        textColor=c_slate,
        spaceAfter=6,
    )

    body_bold = ParagraphStyle(
        "Body_Bold",
        parent=body_style,
        fontName="Helvetica-Bold",
        textColor=c_primary,
    )

    callout_style = ParagraphStyle(
        "Callout_Text",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#064e3b"),
    )

    table_header_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10.5,
        textColor=colors.white,
        alignment=1,  # Center
    )

    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10.5,
        textColor=c_primary,
    )

    table_cell_center = ParagraphStyle(
        "TableCellCenter",
        parent=table_cell_style,
        alignment=1,
    )

    table_cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=table_cell_style,
        fontName="Helvetica-Bold",
    )

    story = []

    # =========================================================================
    # HEADER BANNER & DOCUMENT METADATA
    # =========================================================================
    badge_table = Table(
        [[
            Paragraph("<b>100% INDIAN SCIENTIFIC STANDARD</b>", ParagraphStyle("B1", fontName="Helvetica-Bold", fontSize=8, textColor=colors.HexColor("#065f46"))),
            Paragraph("<b>ICMR-NIN 2024 &bull; IFCT 2017 &bull; REVISED 2024 RDA</b>", ParagraphStyle("B2", fontName="Helvetica-Bold", fontSize=8, textColor=colors.HexColor("#92400e"), alignment=2))
        ]],
        colWidths=[240, 275]
    )
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#d1fae5")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#fef3c7")),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (0,0), (0,0), 'LEFT'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("NutriScore AI (India) — Technical & Operational Whitepaper", title_style))
    story.append(Paragraph(
        "<b>Comprehensive Staff Training & Implementation Guide:</b> System Architecture, Algorithm Engines, Feature Breakdown, Mathematical Formulations, and Clinical Nutrition Rules.",
        subtitle_style
    ))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_emerald, spaceBefore=0, spaceAfter=10))

    # Metadata Card
    meta_data = [
        [
            Paragraph("<b>Document Purpose:</b> Staff & Team Training Guide", table_cell_style),
            Paragraph("<b>Primary Standard:</b> ICMR-NIN 2024 Guidelines", table_cell_style),
            Paragraph("<b>Database:</b> MongoDB Atlas Cloud", table_cell_style),
        ],
        [
            Paragraph("<b>Author / System:</b> NutriScore AI Engineering", table_cell_style),
            Paragraph("<b>Dataset:</b> IFCT 2017 (528 Foods, 39 Nutrients)", table_cell_style),
            Paragraph("<b>Deployment:</b> Vercel + Render Cloud", table_cell_style),
        ]
    ]
    meta_table = Table(meta_data, colWidths=[175, 175, 165])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & SYSTEM OVERVIEW
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Why NutriScore-India Exists", h1_style))
    story.append(Paragraph(
        "Traditional nutrient profiling models (such as the French/European FSA Nutri-Score) were engineered for Western dietary patterns. "
        "When applied to traditional Indian cooking, European algorithms fail catastrophically: they heavily penalize healthy Indian staples (e.g. cold-pressed oils, lentils) "
        "while ignoring India's critical public health burdens: <b>protein quality bottlenecks (DIAAS), micro-nutrient deficiencies (anemia), and diabetes/hypertension risks</b>.",
        body_style
    ))
    story.append(Paragraph(
        "<b>NutriScore-India</b> is the country's first algorithmic nutritional profiling system developed <b>exclusively on official Indian government benchmarks</b>: "
        "the <i>Dietary Guidelines for Indians (ICMR-NIN 2024)</i>, the <i>Revised 2024 Recommended Dietary Allowances (RDA)</i>, and the <i>Indian Food Composition Tables (IFCT 2017)</i>. "
        "Foreign models have been completely eliminated.",
        body_style
    ))

    # Core Callout
    callout_data = [[
        Paragraph(
            "<b>Key Takeaway for Staff:</b> NutriScore-India does not merely assign an arbitrary letter grade. It acts as an <b>Intelligent Clinical Dietitian & Culinary Advisor</b>, "
            "evaluating biological protein quality, screening for chronic disease risks, and offering actionable, kitchen-ready recipe adjustments.",
            callout_style
        )
    ]]
    callout_table = Table(callout_data, colWidths=[515])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_green_bg),
        ('BOX', (0,0), (-1,-1), 1, c_emerald),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 2: THE TWO PROFILING MODES (PPQND vs FULL IFCT)
    # =========================================================================
    story.append(Paragraph("2. The Two Scientific Profiling Modes Explained", h1_style))
    story.append(Paragraph(
        "The system provides two distinct profiling operational modes selectable right from the top header:",
        body_style
    ))

    mode_table_data = [
        [
            Paragraph("<b>Evaluation Dimension</b>", table_header_style),
            Paragraph("<b>🌟 PPQND 7-Tier (Recommended)</b>", table_header_style),
            Paragraph("<b>📑 Full IFCT 39-Nutrient Standard</b>", table_header_style),
        ],
        [
            Paragraph("<b>Full Name</b>", table_cell_bold),
            Paragraph("Personalised Protein Quality & Nutrient Density", table_cell_style),
            Paragraph("Indian Food Composition Tables 39-Nutrient Model", table_cell_style),
        ],
        [
            Paragraph("<b>Primary Purpose</b>", table_cell_bold),
            Paragraph("Individual & family meal planning, clinical dietetics, recipe optimization.", table_cell_style),
            Paragraph("Food laboratories, academic research, industrial packaged food formulation.", table_cell_style),
        ],
        [
            Paragraph("<b>Demographic Calibration</b>", table_cell_bold),
            Paragraph("<b>11 Dynamic Life Stages</b> (Adult Male, Adult Female, Pregnant, Lactating, Adolescents, Children, Elderly, Athletes).", table_cell_style),
            Paragraph("<b>National Adult Standard</b> (Adult Moderate Work Baseline, 65kg reference man).", table_cell_style),
        ],
        [
            Paragraph("<b>Protein Analysis</b>", table_cell_bold),
            Paragraph("<b>Full DIAAS & 9 Essential Amino Acids</b> + Limiting Amino Acid bottleneck detection + Cereal-Pulse synergy index.", table_cell_style),
            Paragraph("Crude Total Protein Quantity (g) assessed against daily recommended reference allowance.", table_cell_style),
        ],
        [
            Paragraph("<b>Scoring System</b>", table_cell_bold),
            Paragraph("<b>7-Tier Grade ($A+, A, B, C, D, E, F$)</b> based on Benefit-Risk mathematical balance equation.", table_cell_style),
            Paragraph("<b>5-Tier Grade (A, B, C, D, E)</b> standard 5-color Nutri-Score.", table_cell_style),
        ],
        [
            Paragraph("<b>Output Panels</b>", table_cell_bold),
            Paragraph("4 Interactive Diagnostic Panels + Tailored Kitchen Balance Tips & Score Improvement Forecasts.", table_cell_style),
            Paragraph("Comprehensive Nutrient Contributors Breakdown (Top 5 positive & negative drivers).", table_cell_style),
        ],
    ]
    mode_table = Table(mode_table_data, colWidths=[115, 200, 200])
    mode_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark_emerald),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(mode_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 3: COMPLETE FEATURE-BY-FEATURE OPERATIONAL GUIDE
    # =========================================================================
    story.append(Paragraph("3. Feature-by-Feature Operational Guide (How Each Works)", h1_style))

    # Feature 3.1
    story.append(Paragraph("Feature 3.1: 11 Demographic Life Stages Selector (ICMR-NIN 2024)", h2_style))
    story.append(Paragraph(
        "A recipe cannot have the same health impact for an adult male, a pregnant mother, or a 2-year-old child. "
        "The system calibrates all nutrient requirements dynamically according to the chosen demographic profile:",
        body_style
    ))

    demo_table_data = [
        [
            Paragraph("<b>Demographic Profile</b>", table_header_style),
            Paragraph("<b>Reference</b>", table_header_style),
            Paragraph("<b>Protein RDA</b>", table_header_style),
            Paragraph("<b>Iron RDA</b>", table_header_style),
            Paragraph("<b>Key Clinical Priority (ICMR-NIN 2024)</b>", table_header_style),
        ],
        [
            Paragraph("<b>Adult Male</b>", table_cell_bold),
            Paragraph("19–59y (65kg)", table_cell_center),
            Paragraph("54.0 g", table_cell_center),
            Paragraph("19.0 mg", table_cell_center),
            Paragraph("Metabolic baseline, maintenance of lean skeletal mass.", table_cell_style),
        ],
        [
            Paragraph("<b>Adult Female</b>", table_cell_bold),
            Paragraph("19–59y (55kg)", table_cell_center),
            Paragraph("46.0 g", table_cell_center),
            Paragraph("<b>29.0 mg</b>", table_cell_center),
            Paragraph("<b>Elevated Iron RDA</b> to combat reproductive-age anemia.", table_cell_style),
        ],
        [
            Paragraph("<b>Pregnant Mother</b>", table_cell_bold),
            Paragraph("2nd / 3rd Tri", table_cell_center),
            Paragraph("67.0 g", table_cell_center),
            Paragraph("27.0 mg", table_cell_center),
            Paragraph("High anabolic demand, fetal tissue growth, folate & zinc.", table_cell_style),
        ],
        [
            Paragraph("<b>Lactating Mother</b>", table_cell_bold),
            Paragraph("0–6 months", table_cell_center),
            Paragraph("63.0 g", table_cell_center),
            Paragraph("23.0 mg", table_cell_center),
            Paragraph("Breastmilk synthesis, elevated calcium (1200mg) and vitamin A.", table_cell_style),
        ],
        [
            Paragraph("<b>Adolescent Female</b>", table_cell_bold),
            Paragraph("14–18y", table_cell_center),
            Paragraph("46.0 g", table_cell_center),
            Paragraph("<b>32.0 mg</b>", table_cell_center),
            Paragraph("<b>Highest national iron requirement</b> during pubertal growth spurt.", table_cell_style),
        ],
        [
            Paragraph("<b>Adolescent Male</b>", table_cell_bold),
            Paragraph("14–18y", table_cell_center),
            Paragraph("55.0 g", table_cell_center),
            Paragraph("22.0 mg", table_cell_center),
            Paragraph("Rapid lean muscle accretion, peak bone mineral density.", table_cell_style),
        ],
        [
            Paragraph("<b>Senior Citizen</b>", table_cell_bold),
            Paragraph("&gt; 60 years", table_cell_center),
            Paragraph("52.0 g", table_cell_center),
            Paragraph("19.0 mg", table_cell_center),
            Paragraph("Sarcopenia prevention, strict sodium & saturated fat moderation.", table_cell_style),
        ],
        [
            Paragraph("<b>Active Athlete</b>", table_cell_bold),
            Paragraph("High Demand", table_cell_center),
            Paragraph("85.0 g", table_cell_center),
            Paragraph("25.0 mg", table_cell_center),
            Paragraph("Elevated BCAAs (Leucine, Valine) for muscle protein synthesis.", table_cell_style),
        ],
    ]
    demo_table = Table(demo_table_data, colWidths=[105, 75, 65, 60, 210])
    demo_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark_emerald),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(demo_table)
    story.append(Spacer(1, 10))

    # Feature 3.2
    story.append(Paragraph("Feature 3.2: Protein Quality & Amino Acid Matrix (40% Total Weight)", h2_style))
    story.append(Paragraph(
        "In Indian diets, assessing only crude protein grams is clinically inadequate because plant proteins have limiting amino acids. "
        "According to <b>Liebig's Law of the Minimum</b>, protein synthesis in the human body is capped by whichever essential amino acid is present in the lowest concentration.",
        body_style
    ))
    story.append(Paragraph(
        "<b>1. Complementary Protein Matrix:</b> Evaluates traditional Indian culinary pairings that overcome single-source amino acid deficits: "
        "<br/>&bull; <i>Cereal + Pulse (Rice + Dal, Roti + Chana) [Synergy: 8/10]</i>: Lysine in pulses balances Lysine deficiency in cereals. "
        "<br/>&bull; <i>Pulse + Dairy (Palak Paneer, Dal + Curd) [Synergy: 9/10]</i>: Dairy adds complete bioavailable sulphur amino acids. "
        "<br/>&bull; <i>Single Cereal Grain alone (Plain Rice / Plain Bread) [Synergy: 2/10]</i>: Penalized due to severe Lysine bottleneck.",
        body_style
    ))
    story.append(Paragraph(
        "<b>2. Smart Auto-Estimation Checkbox:</b> Home cooks and chefs do not possess HPLC lab reports for amino acids in milligrams. "
        "When checked, the AI automatically computes all 9 Essential Amino Acids (Leucine, Lysine, Threonine, Histidine, Met+Cys, Tryptophan, Valine, Isoleucine, Phe+Tyr) "
        "using IFCT 2017 reference patterns calibrated to the entered protein grams and food source. If unchecked, laboratory scientists can type direct mg measurements.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Feature 3.3
    story.append(Paragraph("Feature 3.3: The Four Interactive Diagnostic Panels", h2_style))
    story.append(Paragraph(
        "Once calculated, results are cleanly grouped into four clinical diagnostic tabs for transparent interpretation:",
        body_style
    ))
    panels_info = [
        [Paragraph("<b>Panel Name</b>", table_header_style), Paragraph("<b>What it Evaluates & Clinical Importance</b>", table_header_style)],
        [
            Paragraph("<b>1. Protein Quality & DIAAS</b>", table_cell_bold),
            Paragraph("Displays the weighted amino acid score (out of 10), identifies the exact primary limiting amino acid bottleneck, and shows the complementarity synergy rating.", table_cell_style)
        ],
        [
            Paragraph("<b>2. Nutrient Density (PNS)</b>", table_cell_bold),
            Paragraph("Evaluates fulfilment percentages against ICMR-NIN 2024 daily allowances for Protein, Fibre, Calcium, Iron, Zinc, Potassium, Vitamin A, Vitamin C, and B12.", table_cell_style)
        ],
        [
            Paragraph("<b>3. Chronic Risk Load (NRS)</b>", table_cell_bold),
            Paragraph("Screens recipe penalization across Sodium (Salt), Saturated Fat, Added Free Sugars, Trans Fatty Acids, Cholesterol, and High Energy Density.", table_cell_style)
        ],
        [
            Paragraph("<b>4. Life-Stage Nutrition Guidance</b>", table_cell_bold),
            Paragraph("Presents tailored clinical advisories, including anemia risk warnings, cereal-pulse synergy tips, and exact score enhancement predictions.", table_cell_style)
        ],
    ]
    panels_table = Table(panels_info, colWidths=[140, 375])
    panels_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark_emerald),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(panels_table)
    story.append(Spacer(1, 10))

    # Feature 3.4
    story.append(Paragraph("Feature 3.4: Dietary Optimization & Balance Tips (Clinical Advisory Engine)", h2_style))
    story.append(Paragraph(
        "This engine transforms NutriScore-India from a passive calculator into an active health optimization tool. "
        "It scans the chemical composition of the food and issues immediate, practical culinary recommendations:",
        body_style
    ))
    story.append(Paragraph(
        "&bull; <b>Salt Reduction Advisory (ICMR Guideline 7):</b> When sodium exceeds 30% of the 2000mg upper limit (5g salt), it calculates: "
        "<i>'Sodium Moderation: Salt accounts for X% of daily limit. Reducing salt by 20% can improve NutriScore by +3 to +6 points.'</i><br/>"
        "&bull; <b>Healthy Oil Substitution (ICMR Guideline 9):</b> When saturated fat is elevated, it recommends substituting vanaspati/butter with traditional cold-pressed MUFA/PUFA oils (groundnut, mustard, sesame).<br/>"
        "&bull; <b>Non-Heme Iron Bioavailability (ICMR Guideline 11):</b> When iron is below 20% RDA in vulnerable women or mothers, it issues a synergy prompt: "
        "<i>'Pairing with a Vitamin C source (lemon, amla, tomato) enhances non-heme iron absorption.'</i><br/>"
        "&bull; <b>Dietary Fibre & Satiety (ICMR Guideline 3):</b> Flags low fiber (&lt;2.5g) and suggests incorporating millets, sprouts, or leafy greens.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Feature 3.5 & 3.6
    story.append(Paragraph("Feature 3.5: Preset Indian Recipes & Cloud History", h2_style))
    story.append(Paragraph(
        "&bull; <b>1-Click Presets:</b> Pre-loaded with iconic Indian recipes (Moong Dal Tadka, Vegetable Khichdi, Palak Paneer, Ragi Porridge) with accurate IFCT 2017 nutrient profiles.<br/>"
        "&bull; <b>MongoDB Atlas Cloud Database:</b> Complete transition from SQL to MongoDB Atlas. Every analysis is automatically saved with its demographic key, "
        "grade, amino acid score, and timestamp for auditing, research, and tracking meal progression.",
        body_style
    ))
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 4: MATHEMATICAL SCORING ENGINE & STEP-BY-STEP CALCULATION
    # =========================================================================
    story.append(Paragraph("4. Mathematical Scoring Methodology & Calculation Steps", h1_style))
    story.append(Paragraph(
        "The PPQND scoring engine operates through an objective, multi-stage mathematical pipeline:",
        body_style
    ))

    # Step 1
    story.append(Paragraph("Step 1: Positive Nutrient Score (PNS: Scale 0 to 100)", h2_style))
    story.append(Paragraph(
        "Positive components are scored from 0 to 10 points based on demographic RDA fulfilment percentages, then weighted as follows:",
        body_style
    ))

    pns_formula_box = [
        [
            Paragraph(
                "<b>PNS = 10 &times; [ (0.25 &times; AA_Score) + (0.10 &times; Protein_Qty) + (0.05 &times; Comp_Score) + "
                "(0.10 &times; Fibre_Score) + (0.15 &times; Minerals_Score) + (0.15 &times; Vitamins_Score) + "
                "(0.08 &times; Omega3_Score) + (0.06 &times; PUFA_Score) + (0.06 &times; MUFA_Score) ]</b>",
                ParagraphStyle("MathPNS", fontName="Courier-Bold", fontSize=7.5, leading=11, textColor=colors.HexColor("#065f46"))
            )
        ]
    ]
    t_pns = Table(pns_formula_box, colWidths=[515])
    t_pns.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_green_bg),
        ('BOX', (0,0), (-1,-1), 1, c_emerald),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_pns)
    story.append(Spacer(1, 8))

    # Step 2
    story.append(Paragraph("Step 2: Negative Chronic Risk Score (NRS: Scale 0 to 100)", h2_style))
    story.append(Paragraph(
        "Risk factors are scored from 0 to 10 penalty points against ICMR-NIN 2024 upper chronic limits:",
        body_style
    ))

    nrs_formula_box = [
        [
            Paragraph(
                "<b>NRS = 10 &times; [ (0.25 &times; Sodium_Pts) + (0.20 &times; SFA_Pts) + (0.20 &times; Sugar_Pts) + "
                "(0.15 &times; TransFat_Pts) + (0.10 &times; EnergyDensity_Pts) + (0.10 &times; Cholesterol_Pts) ]</b>",
                ParagraphStyle("MathNRS", fontName="Courier-Bold", fontSize=7.5, leading=11, textColor=colors.HexColor("#991b1b"))
            )
        ]
    ]
    t_nrs = Table(nrs_formula_box, colWidths=[515])
    t_nrs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fef2f2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#ef4444")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_nrs)
    story.append(Spacer(1, 8))

    # Step 3
    story.append(Paragraph("Step 3: Benefit-Risk Balance & Final NutriScore Equation", h2_style))
    story.append(Paragraph(
        "The overall health score reflects the biological net balance between positive density and negative disease risks. "
        "A baseline constant of 50.0 is utilized with an asymmetric 3:1 benefit-to-risk weighting ratio:",
        body_style
    ))

    final_formula_box = [
        [
            Paragraph(
                "<b>Net Balance = (0.75 &times; PNS) &minus; (0.25 &times; NRS)<br/>"
                "Final NutriScore = Bound( 50.0 + Net Balance, Min: 0.0, Max: 100.0 )</b>",
                ParagraphStyle("MathFinal", fontName="Courier-Bold", fontSize=8.5, leading=13, textColor=c_primary)
            )
        ]
    ]
    t_final = Table(final_formula_box, colWidths=[515])
    t_final.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_final)
    story.append(Spacer(1, 8))

    # Step 4 Grade Table
    story.append(Paragraph("Step 4: 7-Tier Grade Classification Matrix", h2_style))
    grades_data = [
        [
            Paragraph("<b>Grade</b>", table_header_style),
            Paragraph("<b>Score Range</b>", table_header_style),
            Paragraph("<b>Badge Color</b>", table_header_style),
            Paragraph("<b>Clinical Classification & Health Description</b>", table_header_style),
        ],
        [
            Paragraph("<b>A+</b>", table_cell_center),
            Paragraph("90.0 – 100.0", table_cell_center),
            Paragraph("Emerald (#059669)", table_cell_center),
            Paragraph("<b>Optimal Therapeutic Quality:</b> Complete amino acid spectrum, superior micronutrients, negligible chronic risk.", table_cell_style),
        ],
        [
            Paragraph("<b>A</b>", table_cell_center),
            Paragraph("80.0 – 89.9", table_cell_center),
            Paragraph("Green (#16a34a)", table_cell_center),
            Paragraph("<b>High Nutrient Density:</b> High protein quality with complete complementarity, protective lipids, daily staple.", table_cell_style),
        ],
        [
            Paragraph("<b>B</b>", table_cell_center),
            Paragraph("70.0 – 79.9", table_cell_center),
            Paragraph("Lime (#84cc16)", table_cell_center),
            Paragraph("<b>Good Quality Staple:</b> Balanced macronutrient and micronutrient density. Excellent foundation for Indian meals.", table_cell_style),
        ],
        [
            Paragraph("<b>C</b>", table_cell_center),
            Paragraph("60.0 – 69.9", table_cell_center),
            Paragraph("Amber (#eab308)", table_cell_center),
            Paragraph("<b>Moderate Quality:</b> Adequate calories, but contains moderate sodium/fats or lacks optimal micronutrient balance.", table_cell_style),
        ],
        [
            Paragraph("<b>D</b>", table_cell_center),
            Paragraph("50.0 – 59.9", table_cell_center),
            Paragraph("Orange (#f97316)", table_cell_center),
            Paragraph("<b>Nutritionally Imbalanced:</b> High refined carbohydrates, excess saturated fat, or insufficient dietary fibre.", table_cell_style),
        ],
        [
            Paragraph("<b>E</b>", table_cell_center),
            Paragraph("40.0 – 49.9", table_cell_center),
            Paragraph("Rose (#f43f5e)", table_cell_center),
            Paragraph("<b>Poor Nutritional Quality:</b> Substantial chronic risk penalty (excess salt/sugar). Requires culinary reformulation.", table_cell_style),
        ],
        [
            Paragraph("<b>F</b>", table_cell_center),
            Paragraph("&lt; 40.0", table_cell_center),
            Paragraph("Red (#dc2626)", table_cell_center),
            Paragraph("<b>Critical Risk Penalty:</b> High obesogenic load, ultra-processed profile, zero protective micronutrients.", table_cell_style),
        ],
    ]
    t_grades = Table(grades_data, colWidths=[45, 75, 95, 300])
    t_grades.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark_emerald),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_grades)
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 5: STAFF PRESENTATION QUICK REFERENCE / CHEAT SHEET
    # =========================================================================
    story.append(Paragraph("5. Staff Presentation Cheat Sheet (What to Say to Clients / Teams)", h1_style))
    story.append(Paragraph(
        "When explaining or demonstrating this system to culinary staff, dietitians, or management, highlight these 5 core messages:",
        body_style
    ))

    script_points = [
        [
            Paragraph("<b>1. It is 100% Indian:</b>", table_cell_bold),
            Paragraph("Tell the team that European models like France's Nutri-Score were built for pizza, cheese, and cereal boxes. NutriScore-India is built exclusively on ICMR-NIN 2024, Indian Food Composition Tables (IFCT 2017), and Indian cooking habits.", table_cell_style),
        ],
        [
            Paragraph("<b>2. It Evaluates Protein Quality, Not Just Quantity:</b>", table_cell_bold),
            Paragraph("Emphasize that 10g of protein from dal is not utilized the same as 10g from milk or eggs. The app checks 9 Essential Amino Acids, detects the limiting amino acid, and rewards the traditional Indian wisdom of Cereal + Pulse pairing (Rice + Dal).", table_cell_style),
        ],
        [
            Paragraph("<b>3. Tailored to 11 Life Stages:</b>", table_cell_bold),
            Paragraph("Explain that a pregnant mother needs 27mg of iron, an adolescent girl needs 32mg, and an adult man needs 19mg. The system automatically recalculates health scores and warnings based on who is eating the dish.", table_cell_style),
        ],
        [
            Paragraph("<b>4. It Teaches How to Cook Healthier:</b>", table_cell_bold),
            Paragraph("Point out the 'Dietary Optimization & Balance Tips' section. It doesn't just judge a recipe; it tells the cook: 'Cut 0.5g salt to gain +4 points' or 'Squeeze lemon juice to unlock the iron in this dal'.", table_cell_style),
        ],
        [
            Paragraph("<b>5. Cloud-Enabled & Ready for Scale:</b>", table_cell_bold),
            Paragraph("Powered by MongoDB Atlas, every analyzed recipe is stored securely in the cloud, ready for recipe databases, meal planning apps, and institutional kitchen integration.", table_cell_style),
        ],
    ]
    t_script = Table(script_points, colWidths=[135, 380])
    t_script.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_bg),
        ('BOX', (0,0), (-1,-1), 1, c_emerald),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_script)
    story.append(Spacer(1, 14))

    # Concluding Signature Block
    story.append(Paragraph(
        "<b>Summary:</b> NutriScore AI provides an evidence-based, scientifically unassailable framework for modern Indian nutrition. "
        "By fusing ICMR-NIN 2024 dietary guidelines with computational food chemistry, it empowers organizations and households to make informed, healthier food choices.",
        body_style
    ))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Documentation PDF successfully created: {filename}")


if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "NutriScore_India_Staff_Guide.pdf"
    create_staff_documentation_pdf(out_file)
