"""
NutriScore AI - Publication-Quality PDF Documentation Generator
Creates an executive technical whitepaper on the ICMR-NIN 2020 & INDB
nutrient profiling algorithm, scoring formulas, and grade mappings.
"""

import sys
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
)
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and print 'Page X of Y' and header."""

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
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Top Running Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(
                45,
                A4[1] - 30,
                "NutriScore AI — Scientific Methodology & Algorithm Documentation",
            )
            self.drawRightString(
                A4[0] - 45, A4[1] - 30, "ICMR-NIN 2020 RDA & INDB Standard"
            )
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(45, A4[1] - 34, A4[0] - 45, A4[1] - 34)

        # Bottom Running Footer (All Pages)
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 45, 25, footer_text)
        self.drawString(
            45,
            25,
            "Confidential & Technical Whitepaper • NutriScore AI (Open Source: HG12265/NutriScore-India)",
        )
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(45, 36, A4[0] - 45, 36)

        self.restoreState()


def create_documentation_pdf(filename="NutriScore_AI_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=42,
        rightMargin=42,
        topMargin=45,
        bottomMargin=45,
    )

    styles = getSampleStyleSheet()

    # Custom Typography Styles
    c_primary = colors.HexColor("#0f172a")  # Slate 900
    c_emerald = colors.HexColor("#059669")  # Emerald 600
    c_dark_emerald = colors.HexColor("#065f46")
    c_rose = colors.HexColor("#e11d48")

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=c_primary,
        spaceAfter=4,
    )

    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        textColor=c_emerald,
        spaceAfter=12,
    )

    h1_style = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=c_dark_emerald,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )

    callout_style = ParagraphStyle(
        "Callout",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0f766e"),
    )

    table_header_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=0,
    )

    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#1e293b"),
    )

    table_cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0f172a"),
    )

    formula_style = ParagraphStyle(
        "FormulaStyle",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#047857"),
        alignment=1,
    )

    story = []

    # -------------------------------------------------------------
    # 1. DOCUMENT HEADER & BRANDING
    # -------------------------------------------------------------
    story.append(
        Paragraph("NUTRISCORE AI • TECHNICAL & SCIENTIFIC WHITEPAPER", subtitle_style)
    )
    story.append(
        Paragraph(
            "Indian Food Nutrient Profiling Engine:<br/>Algorithm, Methodology & Standards",
            title_style,
        )
    )

    # Metadata Bar Table
    meta_data = [
        [
            Paragraph("<b>Version:</b> 1.0.0 Production", table_cell_style),
            Paragraph("<b>Standard:</b> ICMR-NIN 2020 RDA & INDB", table_cell_style),
            Paragraph("<b>Author / Lead:</b> Gowtham", table_cell_style),
            Paragraph("<b>Codebase:</b> GitHub / HG12265", table_cell_style),
        ]
    ]
    t_meta = Table(meta_data, colWidths=[110, 150, 110, 140])
    t_meta.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
                ("PADDING", (0, 0), (-1, -1), 5),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 2. EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # -------------------------------------------------------------
    story.append(Paragraph("1. Executive Summary & Clinical Rationale", h1_style))
    story.append(
        Paragraph(
            "<b>NutriScore AI</b> is an evidence-based front-of-pack (FoP) nutritional profiling system calibrated "
            "specifically for traditional and contemporary Indian recipes. It establishes an objective, transparent, "
            "and clinically rigorous scoring mechanism that benchmarks foods against the <b>Indian Council of Medical Research "
            "(ICMR-NIN 2020) Recommended Dietary Allowances</b> and the <b>Anuvaad Indian Nutrient Databank (INDB)</b>.",
            body_style,
        )
    )

    # Callout Box: Why Western Nutri-Score Fails for India
    callout_data = [
        [
            Paragraph(
                "<b>Why Western Nutri-Score Fails in India:</b><br/>"
                "• <b>Omits Critical Micronutrients:</b> Traditional European Nutri-Score (FSA-NPS) measures only 4 negatives and 3 positives, "
                "giving zero credit to Iron, Calcium, Vitamin A, Vitamin C, or Potassium—the primary nutritional deficiencies affecting the Indian subcontinent.<br/>"
                "• <b>Unfair Penalty on Pulses (Dals):</b> European rules cap protein credit unless a recipe contains >80% fruit/vegetables, penalizing healthy lentil dishes.<br/>"
                "• <b>NutriScore AI Solution:</b> Implements a dual-step balanced algorithm (5 negative penalties, max 50 pts; 11 positive rewards, max 70 pts) "
                "normalized onto a continuous 0 to 100 Health Score and 5-color A to E grade.",
                callout_style,
            )
        ]
    ]
    t_callout = Table(callout_data, colWidths=[510])
    t_callout.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
                ("PADDING", (0, 0), (-1, -1), 8),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#86efac")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    story.append(t_callout)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 3. STEP 1: NEGATIVE SCORING TABLE (PENALTIES)
    # -------------------------------------------------------------
    story.append(
        Paragraph(
            "2. Step 1: Negative Nutrient Scoring (N) — Nutrients to Limit", h1_style
        )
    )
    story.append(
        Paragraph(
            "Negative nutrients correlate with chronic non-communicable diseases (NCDs) such as type-2 diabetes, "
            "hypertension, coronary heart disease, and obesity. In the primary <b>ICMR 16-Nutrient Model</b>, there are "
            "<b>5 negative nutrients</b>, each penalized from 0 to 10 points based on progressive cutoff thresholds (Max N = 50).",
            body_style,
        )
    )

    neg_table_data = [
        [
            Paragraph("Negative Nutrient", table_header_style),
            Paragraph("Unit", table_header_style),
            Paragraph("Max Pts", table_header_style),
            Paragraph("Optimal (0 pts)", table_header_style),
            Paragraph("Severe (10 pts)", table_header_style),
            Paragraph("Clinical Rationale & Disease Impact", table_header_style),
        ],
        [
            Paragraph("Energy Density", table_cell_bold),
            Paragraph("kcal/100g", table_cell_style),
            Paragraph("10", table_cell_style),
            Paragraph("≤ 80", table_cell_style),
            Paragraph("> 800", table_cell_style),
            Paragraph(
                "Excess caloric density directly drives adiposity and metabolic syndrome.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Free Sugars", table_cell_bold),
            Paragraph("g/100g", table_cell_style),
            Paragraph("10", table_cell_style),
            Paragraph("≤ 4.5", table_cell_style),
            Paragraph("> 45.0", table_cell_style),
            Paragraph(
                "Triggers acute glycemic spikes, hepatic de novo lipogenesis & insulin resistance.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Saturated Fat", table_cell_bold),
            Paragraph("g/100g", table_cell_style),
            Paragraph("10", table_cell_style),
            Paragraph("≤ 1.0", table_cell_style),
            Paragraph("> 10.0", table_cell_style),
            Paragraph(
                "Elevates serum LDL-cholesterol and atherosclerotic cardiovascular risk.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Sodium (Salt)", table_cell_bold),
            Paragraph("mg/100g", table_cell_style),
            Paragraph("10", table_cell_style),
            Paragraph("≤ 90", table_cell_style),
            Paragraph("> 900", table_cell_style),
            Paragraph(
                "Primary dietary determinant of systemic hypertension, stroke, and kidney strain.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Cholesterol", table_cell_bold),
            Paragraph("mg/100g", table_cell_style),
            Paragraph("10", table_cell_style),
            Paragraph("≤ 20", table_cell_style),
            Paragraph("> 200", table_cell_style),
            Paragraph(
                "Accelerates vascular plaque build-up and coronary artery calcification.",
                table_cell_style,
            ),
        ],
    ]

    t_neg = Table(neg_table_data, colWidths=[85, 50, 45, 65, 65, 200])
    t_neg.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#be123c")),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 4),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [colors.white, colors.HexColor("#fff1f2")],
                ),
            ]
        )
    )
    story.append(t_neg)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 4. STEP 2: POSITIVE SCORING TABLE (REWARDS)
    # -------------------------------------------------------------
    story.append(
        Paragraph(
            "3. Step 2: Positive Nutrient Scoring (P) — Nutrients to Encourage",
            h1_style,
        )
    )
    story.append(
        Paragraph(
            "Positive scoring recognizes essential macros, slow-digesting complex carbohydrates, healthy lipids, "
            "and vital micronutrients calibrated directly against the <b>ICMR-NIN 2020 RDA for Indians</b>. "
            "Every 5% of daily adult RDA awards 1 point, reaching the maximum 5 points at ≥ 25% RDA (Max P = 70).",
            body_style,
        )
    )

    pos_table_data = [
        [
            Paragraph("Positive Nutrient", table_header_style),
            Paragraph("Category", table_header_style),
            Paragraph("ICMR RDA", table_header_style),
            Paragraph("Max Pts", table_header_style),
            Paragraph("Max Cutoff (5 pts)", table_header_style),
            Paragraph("Nutritional Role in Indian Diet", table_header_style),
        ],
        [
            Paragraph("Protein", table_cell_bold),
            Paragraph("Macro", table_cell_style),
            Paragraph("54 g", table_cell_style),
            Paragraph("5", table_cell_style),
            Paragraph("> 8.0 g", table_cell_style),
            Paragraph(
                "Cellular repair, enzymatic function, muscle mass preservation.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Dietary Fibre", table_cell_bold),
            Paragraph("Macro", table_cell_style),
            Paragraph("30 g", table_cell_style),
            Paragraph("5", table_cell_style),
            Paragraph("> 4.7 g", table_cell_style),
            Paragraph(
                "Microbiome health, satiety, and blunt postprandial glucose spikes.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Complex Carbs", table_cell_bold),
            Paragraph("Macro", table_cell_style),
            Paragraph("Derived", table_cell_style),
            Paragraph("5", table_cell_style),
            Paragraph("> 25.0 g", table_cell_style),
            Paragraph(
                "Sustained glycemic energy (derived: Carbs - Free Sugars - Fibre).",
                table_cell_style,
            ),
        ],
        [
            Paragraph("MUFA & PUFA", table_cell_bold),
            Paragraph("Lipid", table_cell_style),
            Paragraph("30 g", table_cell_style),
            Paragraph("5 + 5", table_cell_style),
            Paragraph("> 5.0 g each", table_cell_style),
            Paragraph(
                "Essential unsaturated fatty acids; cardioprotective lipid ratios.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("EAAI Quality Bonus", table_cell_bold),
            Paragraph("Protein", table_cell_style),
            Paragraph("ICMR Index", table_cell_style),
            Paragraph("10", table_cell_style),
            Paragraph("Index ≥ 0.90", table_cell_style),
            Paragraph(
                "Rewards complementary amino acid profiles (e.g., Dal + Roti).",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Iron (Fe)", table_cell_bold),
            Paragraph("Micro", table_cell_style),
            Paragraph("19 mg", table_cell_style),
            Paragraph("5", table_cell_style),
            Paragraph("≥ 4.75 mg (25% RDA)", table_cell_style),
            Paragraph(
                "Hemoglobin synthesis; addresses widespread maternal & child anemia.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Calcium (Ca)", table_cell_bold),
            Paragraph("Micro", table_cell_style),
            Paragraph("1,000 mg", table_cell_style),
            Paragraph("5", table_cell_style),
            Paragraph("≥ 250 mg (25% RDA)", table_cell_style),
            Paragraph(
                "Skeletal mineral density, neuromuscular signaling, cardiac pacing.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Vitamin A", table_cell_bold),
            Paragraph("Micro", table_cell_style),
            Paragraph("1,000 mcg", table_cell_style),
            Paragraph("5", table_cell_style),
            Paragraph("≥ 250 mcg (25% RDA)", table_cell_style),
            Paragraph(
                "Vision cycle integrity, epithelial immunity, gene transcription.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Vitamin C", table_cell_bold),
            Paragraph("Micro", table_cell_style),
            Paragraph("80 mg", table_cell_style),
            Paragraph("5", table_cell_style),
            Paragraph("≥ 20 mg (25% RDA)", table_cell_style),
            Paragraph(
                "Potent antioxidant; triples bioavailability of non-heme plant iron.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("Potassium (K)", table_cell_bold),
            Paragraph("Micro", table_cell_style),
            Paragraph("3,500 mg", table_cell_style),
            Paragraph("5", table_cell_style),
            Paragraph("≥ 875 mg (25% RDA)", table_cell_style),
            Paragraph(
                "Intracellular osmolarity; counteracts vascular strain caused by sodium.",
                table_cell_style,
            ),
        ],
    ]

    t_pos = Table(pos_table_data, colWidths=[80, 45, 55, 40, 110, 180])
    t_pos.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0d9488")),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 3.5),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [colors.white, colors.HexColor("#f0fdfa")],
                ),
            ]
        )
    )
    story.append(t_pos)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 5. MATHEMATICAL FORMULA & NORMALIZATION
    # -------------------------------------------------------------
    story.append(
        Paragraph("4. Mathematical Formulation & Normalization (0–100)", h1_style)
    )
    story.append(
        Paragraph(
            "Unlike legacy systems that output arbitrary negative integers (e.g. -5 to +35), NutriScore AI normalizes "
            "the net balance between positive rewards (P) and negative penalties (N) onto an intuitive 0 to 100 percentage scale:",
            body_style,
        )
    )

    formula_data = [
        [
            Paragraph(
                "Health Score = 100 × [ (P - N + N_max) / (P_max + N_max) ]",
                formula_style,
            )
        ],
        [
            Paragraph(
                "For the ICMR 16-Nutrient Model: N_max = 50, P_max = 70, Total Scale Span = 120<br/>"
                "<b>Health Score = 100 × [ (P - N + 50) / 120 ]</b>",
                ParagraphStyle(
                    "SubFormula",
                    parent=styles["Normal"],
                    fontName="Helvetica",
                    fontSize=8.5,
                    alignment=1,
                    textColor=colors.HexColor("#065f46"),
                ),
            )
        ],
    ]
    t_formula = Table(formula_data, colWidths=[510])
    t_formula.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#ecfdf5")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#34d399")),
                ("PADDING", (0, 0), (-1, -1), 6),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ]
        )
    )
    story.append(t_formula)
    story.append(Spacer(1, 8))

    # -------------------------------------------------------------
    # 6. GRADE MAPPING (A TO E) TABLE
    # -------------------------------------------------------------
    story.append(
        Paragraph("5. 5-Color Nutri-Score Grade Classification (A to E)", h1_style)
    )
    story.append(
        Paragraph(
            "The continuous Health Score (0–100) is classified into 5 standardized tiers recognized internationally:",
            body_style,
        )
    )

    grade_table_data = [
        [
            Paragraph("Grade", table_header_style),
            Paragraph("Score Range", table_header_style),
            Paragraph("Color Code", table_header_style),
            Paragraph("Nutritional Interpretation & Dietary Guidance", table_header_style),
        ],
        [
            Paragraph("<b>Grade A</b>", table_cell_bold),
            Paragraph("<b>75 – 100</b>", table_cell_bold),
            Paragraph("<font color='#1b8a43'><b>■ Dark Green</b></font>", table_cell_style),
            Paragraph(
                "<b>Outstanding Nutritional Quality:</b> Dense in protein, fibre, and essential micronutrients. "
                "Negligible free sugars and saturated fats. Highly encouraged for daily staple consumption.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("<b>Grade B</b>", table_cell_bold),
            Paragraph("<b>60 – 74</b>", table_cell_bold),
            Paragraph("<font color='#85bb2f'><b>■ Light Green</b></font>", table_cell_style),
            Paragraph(
                "<b>Good Nutritional Quality:</b> Favorable nutrient density with balanced energy. "
                "Optimal as core components of everyday balanced Indian meals (e.g. Tadka Dal, Khichdi).",
                table_cell_style,
            ),
        ],
        [
            Paragraph("<b>Grade C</b>", table_cell_bold),
            Paragraph("<b>45 – 59</b>", table_cell_bold),
            Paragraph("<font color='#d97706'><b>■ Yellow</b></font>", table_cell_style),
            Paragraph(
                "<b>Moderate Nutritional Quality:</b> Standard baseline food. Provides calories and basic macronutrients "
                "but contains modest sodium or fats and lacks top-tier micronutrient density.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("<b>Grade D</b>", table_cell_bold),
            Paragraph("<b>30 – 44</b>", table_cell_bold),
            Paragraph("<font color='#ee8100'><b>■ Orange</b></font>", table_cell_style),
            Paragraph(
                "<b>Sub-optimal / Caution:</b> High in one or more risk nutrients (excess sodium, frying oil, or refined carbs). "
                "Recommend reducing portion sizes and frequency of intake.",
                table_cell_style,
            ),
        ],
        [
            Paragraph("<b>Grade E</b>", table_cell_bold),
            Paragraph("<b>0 – 29</b>", table_cell_bold),
            Paragraph("<font color='#e63e11'><b>■ Red</b></font>", table_cell_style),
            Paragraph(
                "<b>Poor Nutritional Quality:</b> Ultra-energy-dense, high saturated fats, refined sugar syrups, or excess sodium "
                "with virtually zero protective fibre or micronutrients (e.g. Gulab Jamun, deep-fried snacks).",
                table_cell_style,
            ),
        ],
    ]

    t_grade = Table(grade_table_data, colWidths=[65, 80, 85, 280])
    t_grade.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e293b")),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 4),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [colors.white, colors.HexColor("#f8fafc")],
                ),
            ]
        )
    )
    story.append(t_grade)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 7. COMPARATIVE CASE STUDIES
    # -------------------------------------------------------------
    story.append(
        Paragraph("6. Case Studies: Algorithm Evaluation on Indian Recipes", h1_style)
    )

    cases_data = [
        [
            Paragraph("Recipe", table_header_style),
            Paragraph("Key Nutrient Profile (per 100g)", table_header_style),
            Paragraph("Negative (N)", table_header_style),
            Paragraph("Positive (P)", table_header_style),
            Paragraph("Health Score", table_header_style),
            Paragraph("Resulting Grade", table_header_style),
        ],
        [
            Paragraph("<b>Moong Dal Tadka</b><br/>(Lentil Curry)", table_cell_bold),
            Paragraph(
                "120 kcal, 7.5g Protein, 4.2g Fibre, 0.5g Sugar, 0.8g Sat Fat, 180mg Na, 2.1mg Fe, 45mg Ca",
                table_cell_style,
            ),
            Paragraph("4 / 50 pts", table_cell_style),
            Paragraph("28 / 70 pts", table_cell_style),
            Paragraph("<b>61.7 / 100</b>", table_cell_bold),
            Paragraph("<font color='#85bb2f'><b>Grade B (Good)</b></font>", table_cell_bold),
        ],
        [
            Paragraph("<b>Gulab Jamun</b><br/>(Syrup Sweet)", table_cell_bold),
            Paragraph(
                "380 kcal, 38.0g Free Sugar, 9.5g Sat Fat, 2.8g Protein, 0.2g Fibre, 45mg Cholesterol",
                table_cell_style,
            ),
            Paragraph("36 / 50 pts", table_cell_style),
            Paragraph("3 / 70 pts", table_cell_style),
            Paragraph("<b>14.2 / 100</b>", table_cell_bold),
            Paragraph("<font color='#e63e11'><b>Grade E (Poor)</b></font>", table_cell_bold),
        ],
    ]

    t_cases = Table(cases_data, colWidths=[90, 200, 60, 60, 55, 45])
    t_cases.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#065f46")),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 4),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [colors.white, colors.HexColor("#f0fdf4")],
                ),
            ]
        )
    )
    story.append(t_cases)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 8. MULTI-MODEL COMPARISON (PAGE 3)
    # -------------------------------------------------------------
    story.append(Paragraph("7. Profiling Frameworks Comparison", h1_style))
    story.append(
        Paragraph(
            "NutriScore AI provides three selectable profiling algorithms to support both everyday consumer guidance "
            "and advanced biochemical research:",
            body_style,
        )
    )

    framework_data = [
        [
            Paragraph("Framework Model", table_header_style),
            Paragraph("Nutrient Scope", table_header_style),
            Paragraph("Penalty (N)", table_header_style),
            Paragraph("Reward (P)", table_header_style),
            Paragraph("Scale Span", table_header_style),
            Paragraph("Target Application & Clinical Context", table_header_style),
        ],
        [
            Paragraph("<b>ICMR 16-Nutrient</b><br/>(Default & Core)", table_cell_bold),
            Paragraph("16 Core INDB Components", table_cell_style),
            Paragraph("Max 50 pts (5 nutrients)", table_cell_style),
            Paragraph("Max 70 pts (11 nutrients)", table_cell_style),
            Paragraph("Span = 120 (0 to 100)", table_cell_style),
            Paragraph("<b>Consumer Standard:</b> Calibrated for traditional Indian meals; realistic distribution across B, C, and D tiers.", table_cell_style),
        ],
        [
            Paragraph("<b>Extended 39-Nutrient</b><br/>(INDB Research)", table_cell_bold),
            Paragraph("All 39 Lab Components", table_cell_style),
            Paragraph("Max 50 pts (5 nutrients)", table_cell_style),
            Paragraph("Max 165 pts (34 nutrients)", table_cell_style),
            Paragraph("Span = 215 (0 to 100)", table_cell_style),
            Paragraph("<b>Laboratory & Clinical:</b> Incorporates 8 trace minerals and 10 B-complex vitamins for full biochemical profiling.", table_cell_style),
        ],
        [
            Paragraph("<b>Official Nutri-Score</b><br/>(FSA-NPS Europe)", table_cell_bold),
            Paragraph("7 Packaged Components", table_cell_style),
            Paragraph("Max 40 pts (4 nutrients)", table_cell_style),
            Paragraph("Max 15 pts (3 nutrients)", table_cell_style),
            Paragraph("Score: N - P (-15 to +40)", table_cell_style),
            Paragraph("<b>International Benchmark:</b> Direct implementation of French Santé Publique standard for cross-continental comparison.", table_cell_style),
        ],
    ]

    t_framework = Table(framework_data, colWidths=[90, 75, 70, 70, 65, 140])
    t_framework.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#334155")),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 4),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [colors.white, colors.HexColor("#f8fafc")],
                ),
            ]
        )
    )
    story.append(t_framework)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 9. TECHNICAL ARCHITECTURE & DEPLOYMENT
    # -------------------------------------------------------------
    story.append(Paragraph("8. Technical Architecture & Live Deployment", h1_style))
    story.append(
        Paragraph(
            "• <b>Asynchronous REST Backend:</b> Python 3.11+ running FastAPI and Uvicorn. Implements strict Pydantic v2 validation contracts, "
            "dynamic CORS middleware, and automated unit testing (18/18 passing test suite).<br/>"
            "• <b>Reactive Single-Page Client:</b> React 18, TypeScript, Vite, and Tailwind CSS. Built with responsive mobile-first ergonomics, "
            "Recharts data visualization radar graphs, and real-time client-side input validation.<br/>"
            "• <b>Production Cloud Hosting:</b><br/>"
            "   - <b>Backend API:</b> Deployed on <b>Render.com</b> (<code>https://nutriscore-india.onrender.com</code>) with automated healthcheck keep-alive via <code>cron-job.org</code>.<br/>"
            "   - <b>Frontend UI:</b> Deployed globally on the <b>Vercel Edge Network</b> with custom SPA rewrite rules.<br/>"
            "   - <b>Open-Source Repository:</b> Publicly hosted on GitHub at <code>https://github.com/HG12265/NutriScore-India</code>.",
            body_style,
        )
    )

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated: {filename}")


if __name__ == "__main__":
    create_documentation_pdf()
