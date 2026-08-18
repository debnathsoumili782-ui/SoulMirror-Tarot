from io import BytesIO
import os
from flask import send_file

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)
from reportlab.lib.units import inch

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    HRFlowable
)

def get_card_image(reading):

    filename = (
        reading.card_name.lower()
        .replace(" ", "-")
        .replace("'", "")
    ) + ".png"

    if reading.reading_type == "time-oracle":

        folder = os.path.join(
            "static",
            "images",
            "time-oracle"
        )

    else:

        card = reading.card_name.lower()

        if "cups" in card:
            folder = os.path.join(
                "static",
                "images",
                "cards",
                "cups"
            )

        elif "wands" in card:
            folder = os.path.join(
                "static",
                "images",
                "cards",
                "wands"
            )

        elif "swords" in card:
            folder = os.path.join(
                "static",
                "images",
                "cards",
                "swords"
            )

        elif "pentacles" in card:
            folder = os.path.join(
                "static",
                "images",
                "cards",
                "pentacles"
            )

        else:

            folder = os.path.join(
                "static",
                "images",
                "cards",
                "major"
            )

    path = os.path.join(folder, filename)

    if os.path.exists(path):
        return path

    return None

def generate_reading_pdf(reading):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=(8.27 * inch, 11.69 * inch),
        leftMargin=45,
        rightMargin=45,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=28,
        leading=32,
        textColor=HexColor("#6C3FD1"),
        spaceAfter=8,
    )

    heading_style = ParagraphStyle(
        "HeadingStyle",
        parent=styles["Heading2"],
        fontSize=16,
        textColor=HexColor("#6C3FD1"),
        spaceAfter=8,
    )

    body_style = ParagraphStyle(
        "BodyStyle",
        parent=styles["BodyText"],
        fontSize=11,
        leading=20,
    )

    story = []

    title = Paragraph(
        "<font color='#6C3FD1' size='28'><b>✦ SoulMirror Tarot ✦</b></font>",
        title_style
    )

    subtitle = Paragraph(
        "<font color='#777777' size='12'>Discover What Your Soul Already Knows</font>",
        body_style
    )

    story.append(title)
    story.append(subtitle)
    story.append(Spacer(1, 8))

    story.append(
        HRFlowable(
            width="100%",
            thickness=1,
            color=HexColor("#D4AF37"),
            spaceBefore=5,
            spaceAfter=18
        )
    )

    summary = [
        [
            Paragraph("<b>Reading Type</b>", styles["BodyText"]),
            Paragraph(reading.reading_type.replace("-", " ").title(), styles["BodyText"])
        ],
        [
            Paragraph("<b>Card</b>", styles["BodyText"]),
            Paragraph(reading.card_name, styles["BodyText"])
        ],
        [
            Paragraph("<b>Orientation</b>", styles["BodyText"]),
            Paragraph(reading.orientation.title(), styles["BodyText"])
        ],
        [
            Paragraph("<b>Date</b>", styles["BodyText"]),
            Paragraph(
                reading.created_at.strftime("%d %B %Y %I:%M %p"),
                styles["BodyText"]
            )
        ]
    ]
    table = Table(
        summary,
        colWidths=[1.8 * inch, 4.2 * inch]
    )
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), HexColor("#F2ECFF")),
        ("TEXTCOLOR", (0, 0), (-1, -1), HexColor("#222222")),
        ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#D6C8FF")),
        ("BOX", (0, 0), (-1, -1), 1, HexColor("#6C3FD1")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(table)
    story.append(Spacer(1, 25))

    image_path = get_card_image(reading)

    if image_path:
        img = Image(
            image_path,
            width=2.3 * inch,
            height=4 * inch
        )

        img.hAlign = "CENTER"

        story.append(img)

        story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            "<b>Your Question</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            reading.question,
            styles["BodyText"]
        )
    )

    story.append(Spacer(1, 18))

    story.append(
        Paragraph(
            "<b>Your Reading</b>",
            styles["Heading2"]
        )
    )

    reading_text = (
        reading.ai_reading

        .replace(
            "■ What This Card Signifies",
            "<br/><br/><font color='#6C3FD1'><b>WHAT THIS CARD SIGNIFIES</b></font><br/>"
        )

        .replace(
            "■ Reading For Your Question",
            "<br/><br/><font color='#6C3FD1'><b>READING FOR YOUR QUESTION</b></font><br/>"
        )

        .replace(
            "■ Guidance",
            "<br/><br/><font color='#6C3FD1'><b>GUIDANCE</b></font><br/>"
        )

        .replace(
            "■ Timing",
            "<br/><br/><font color='#6C3FD1'><b>TIMING</b></font><br/>"
        )

        .replace(
            "■ Affirmation",
            "<br/><br/><font color='#6C3FD1'><b>AFFIRMATION</b></font><br/>"
        )

        .replace("\r\n", "\n")
        .replace("\n\n", "<br/><br/>")
        .replace("\n", "<br/>")
    )

    story.append(
        Paragraph(
            reading_text,
            styles["BodyText"]
        )
    )

    story.append(Spacer(1, 18))
    story.append(Spacer(1, 30))

    story.append(
        Paragraph(
            "<font color='#777777'><i>Generated by SoulMirror Tarot</i></font>",
            styles["Normal"]
        )
    )

    doc.build(story)

    buffer.seek(0)

    filename = (
        f"{reading.reading_type}-"
        f"{reading.created_at.strftime('%Y-%m-%d')}.pdf"
    )

    return send_file(
        buffer,
        as_attachment=True,
        download_name=filename,
        mimetype="application/pdf"
    )