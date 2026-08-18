from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_required, current_user, logout_user
from models.love_reading import LoveReading, DeepLoveReading
from models.reading import Reading
from extensions import db
from datetime import date, timedelta
from types import SimpleNamespace
from flask import session
from flask import abort
from models.journal import Journal
from services.pdf_service import generate_reading_pdf
from flask import flash, url_for
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text

from reading.card_loader import (
    load_card,
    load_all_cards,
    get_random_cards,
    random_orientation,
    load_time_card,
    get_random_time_cards,
    get_daily_card
)
from services.ai_service import (
    generate_reading,
    generate_guidance_reading,
    generate_single_reading,
    generate_love_reading_ai,
    generate_deep_love_reading_ai,
    generate_time_reading
)
main = Blueprint("main", __name__)

@main.route("/")
def home():
    return render_template("index.html")
@main.route("/premium")
def premium():
    return render_template("premium.html")

from datetime import timedelta

@main.route("/history")
@login_required
def history():
    readings = (
        Reading.query
        .filter_by(user_id=current_user.id)
        .order_by(Reading.created_at.desc())
        .all()
    )

    love_readings = (
        LoveReading.query
        .filter_by(user_id=current_user.id)
        .order_by(LoveReading.created_at.desc())
        .all()
    )

    deep_love_readings = (
        DeepLoveReading.query
        .filter_by(user_id=current_user.id)
        .order_by(DeepLoveReading.created_at.desc())
        .all()
    )

    all_readings = (
            [(r.created_at, "regular", r) for r in readings]
            + [(r.created_at, "love", r) for r in love_readings]
            + [(r.created_at, "deep-love", r) for r in deep_love_readings]
    )

    all_readings.sort(
        key=lambda x: x[0],
        reverse=True
    )

    history_items = []

    for created_at, reading_type, reading in all_readings:

        if reading_type == "regular":

            history_items.append(
                SimpleNamespace(
                    id=reading.id,
                    reading_type=reading.reading_type,
                    question=reading.question,
                    card_name=reading.card_name,
                    orientation=reading.orientation,
                    created_at=created_at,
                    display_time=(
                        created_at + timedelta(hours=5, minutes=30)
                        if created_at else None
                    )
                )
            )

        elif reading_type == "love":

            history_items.append(
                SimpleNamespace(
                    id=reading.id,
                    reading_type="simple-love",
                    question=reading.question,
                    card_name="3-Card Love Reading",
                    orientation="love",
                    created_at=created_at,
                    display_time=(
                        created_at + timedelta(hours=5, minutes=30)
                        if created_at else None
                    )
                )
            )

        elif reading_type == "deep-love":

            history_items.append(
                SimpleNamespace(
                    id=reading.id,
                    reading_type="deep-love",
                    question=reading.question,
                    card_name="5-Card Deep Love Reading",
                    orientation="love",
                    created_at=created_at,
                    display_time=(
                        created_at + timedelta(hours=5, minutes=30)
                        if created_at else None
                    )
                )
            )

    for reading in readings:

        if reading.created_at:
            reading.display_time = (
                reading.created_at +
                timedelta(hours=5, minutes=30)
            )

    return render_template(
        "history.html",
        readings=history_items
    )

@main.route("/delete-reading/<int:reading_id>", methods=["POST"])
@login_required
def delete_reading(reading_id):

    reading = Reading.query.get_or_404(reading_id)

    if reading.user_id != current_user.id:
        abort(403)

    db.session.delete(reading)
    db.session.commit()

    flash("Reading deleted successfully.", "success")

    return redirect(url_for("main.history"))
@main.route("/reading-types")
def reading_types():
    return render_template("reading-types.html")
@main.route("/card-library")
@login_required
def card_library():

    cards = load_all_cards()

    return render_template(
        "card-library.html",
        cards=cards
    )
@main.route("/daily-card")
@login_required
def daily_card():

    today = str(date.today())

    if session.get("daily_date") != today:

        card = get_daily_card()

        session["daily_date"] = today
        session["daily_card"] = card

    else:

        card = session["daily_card"]

    return render_template(
        "daily-card.html",
        card=card
    )
@main.route("/yes-no")
def yes_no():

    cards = get_random_cards()

    return render_template(
        "yes-no.html",
        cards=cards
    )

@main.route("/time-oracle")
@login_required
def time_oracle():

    cards = get_random_time_cards()

    print("TIME ORACLE:", len(cards))

    return render_template(
        "time-oracle.html",
        cards=cards
    )

@main.route("/single-card")
@login_required
def single_card():

    cards = get_random_cards()

    return render_template(
        "single-card.html",
        cards=cards
    )
@main.route("/simple-love")
@login_required
def simple_love():

    cards = get_random_cards()

    return render_template(
        "simple-love.html",
        cards=cards
    )
@main.route("/deep-love")
@login_required
def deep_love():
    cards = get_random_cards()
    return render_template(
        "deep-love.html",
        cards=cards
    )

@main.route("/money-reading")
@login_required
def money_reading():

    cards = get_random_cards(26)

    return render_template(
        "money-reading.html",
        cards=cards
    )
@main.route("/spiritual-reading")
@login_required
def spiritual_reading():

    cards = get_random_cards(26)

    return render_template(
        "spiritual-reading.html",
        cards=cards
    )
@main.route("/decision-reading")
@login_required
def decision_reading():

    cards = get_random_cards(26)

    return render_template(
        "decision-reading.html",
        cards=cards
    )

@main.route("/dashboard")
@login_required
def dashboard():

    total_readings = Reading.query.filter_by(
        user_id=current_user.id
    ).count()

    total_journals = Journal.query.filter_by(
        user_id=current_user.id
    ).count()

    recent_reading = (
        Reading.query
        .filter_by(user_id=current_user.id)
        .order_by(Reading.created_at.desc())
        .first()
    )

    recent_journal = (
        Journal.query
        .filter_by(user_id=current_user.id)
        .order_by(Journal.created_at.desc())
        .first()
    )

    return render_template(
        "dashboard/dashboard.html",
        total_readings=total_readings,
        total_journals=total_journals,
        recent_reading=recent_reading,
        recent_journal=recent_journal
    )

@main.route("/generate-reading", methods=["POST"])
@login_required
def generate_reading_route():

    question = request.form.get("question")
    card_slug = request.form.get("card_slug")

    card = load_card(card_slug)

    reading_type = request.form.get("reading_type", "yes-no")
    reading_type = reading_type

    orientation = request.form.get("orientation", "upright")

    if orientation not in ["upright", "reversed"]:
        orientation = "upright"

    card["orientation"] = orientation

    try:
        ai_reading = generate_reading(
            question,
            card
        )

    except Exception as e:
        print(e)

        ai_reading = """
        <h2>⚠️ AI Temporarily Unavailable</h2>

        <p>
        The AI service is temporarily unavailable because the API quota has been reached.
        </p>

        <p>
        Your selected card has been saved successfully.
        Please try again after the quota resets.
        </p>
        """

    new_reading = Reading(
        user_id=current_user.id,
        reading_type="yes-no",
        question=question,
        card_name=card["name"],
        orientation=card["orientation"],
        ai_reading=ai_reading
    )

    db.session.add(new_reading)
    db.session.commit()

    return redirect(
        url_for(
            "main.yes_no_reading",
            reading_id=new_reading.id
        )
    )

@main.route("/yes-no-reading/<int:reading_id>")
@login_required
def yes_no_reading(reading_id):

    reading = Reading.query.get_or_404(reading_id)

    if reading.user_id != current_user.id:
        abort(403)

    card = load_card(slugify(reading.card_name))
    card["orientation"] = reading.orientation

    return render_template(
        "reading.html",
        question=reading.question,
        card=card,
        ai_reading=reading.ai_reading,
        reading_type=reading.reading_type
    )

@main.route("/generate-single-reading", methods=["POST"])
@login_required
def generate_single_reading_route():

    question = request.form.get("question")
    card_slug = request.form.get("card_slug")
    card = load_card(card_slug)
    orientation = request.form.get("orientation", "upright")

    if orientation not in ["upright", "reversed"]:
        orientation = "upright"

    card["orientation"] = orientation

    try:
        ai_reading = generate_single_reading(
            question,
            card
        )

    except Exception as e:
        print(e)

        ai_reading = """
        <h2>⚠️ AI Temporarily Unavailable</h2>

        <p>
        The AI service is temporarily unavailable because the API quota has been reached.
        </p>

        <p>
        Your selected card has been saved successfully.
        Please try again after the quota resets.
        </p>
        """

    new_reading = Reading(
        user_id=current_user.id,
        reading_type="single",
        question=question,
        card_name=card["name"],
        orientation=card["orientation"],
        ai_reading=ai_reading
    )

    db.session.add(new_reading)
    db.session.commit()
    print(new_reading.id)

    return redirect(
        url_for(
            "main.single_reading",
            reading_id=new_reading.id
        )
    )

@main.route("/single-reading/<int:reading_id>")
@login_required
def single_reading(reading_id):

    reading = Reading.query.get_or_404(reading_id)

    print("Reading ID:", reading.id)
    print("Card:", reading.card_name)
    print("Orientation:", reading.orientation)

    slug = reading.card_name.lower().replace(" ", "-")
    card = load_card(slug)

    card["orientation"] = reading.orientation

    return render_template(
        "single-reading.html",
        question=reading.question,
        card=card,
        ai_reading=reading.ai_reading
    )

@main.route("/generate-love-reading", methods=["POST"])
@login_required
def generate_love_reading():

    question = request.form.get("question")

    card1_slug = request.form.get("card1")
    card2_slug = request.form.get("card2")
    card3_slug = request.form.get("card3")

    orientation1 = request.form.get("orientation1")
    orientation2 = request.form.get("orientation2")
    orientation3 = request.form.get("orientation3")

    print(orientation1)
    print(orientation2)
    print(orientation3)

    card1 = load_card(card1_slug)
    card2 = load_card(card2_slug)
    card3 = load_card(card3_slug)

    card1["orientation"] = orientation1
    card2["orientation"] = orientation2
    card3["orientation"] = orientation3

    try:
        ai_reading = generate_love_reading_ai(
            question,
            card1,
            card2,
            card3
        )

    except Exception as e:
        print(e)

        ai_reading = """
        <h2>⚠️ AI Temporarily Unavailable</h2>

        <p>
        The AI service is temporarily unavailable because the API quota has been reached.
        </p>

        <p>
        Your selected card has been saved successfully.
        Please try again after the quota resets.
        </p>
        """

    new_reading = LoveReading(
        user_id=current_user.id,
        question=question,

        card1_slug=card1_slug,
        card1_orientation=orientation1,

        card2_slug=card2_slug,
        card2_orientation=orientation2,

        card3_slug=card3_slug,
        card3_orientation=orientation3,

        ai_reading=ai_reading
    )

    db.session.add(new_reading)
    db.session.commit()

    return redirect(
        url_for(
            "main.love_reading",
            reading_id=new_reading.id
        )
    )
@main.route("/love-reading/<int:reading_id>")
@login_required
def love_reading(reading_id):

    reading = LoveReading.query.get_or_404(reading_id)

    card1 = load_card(reading.card1_slug)
    card2 = load_card(reading.card2_slug)
    card3 = load_card(reading.card3_slug)

    card1["orientation"] = reading.card1_orientation
    card2["orientation"] = reading.card2_orientation
    card3["orientation"] = reading.card3_orientation

    return render_template(
        "simple-love-reading.html",
        question=reading.question,
        card1=card1,
        card2=card2,
        card3=card3,
        ai_reading=reading.ai_reading
    )

@main.route("/generate-deep-love-reading", methods=["POST"])
@login_required
def generate_deep_love_reading():

    question = request.form.get("question")

    card1_slug = request.form.get("card1")
    card2_slug = request.form.get("card2")
    card3_slug = request.form.get("card3")
    card4_slug = request.form.get("card4")
    card5_slug = request.form.get("card5")

    orientation1 = request.form.get("orientation1")
    orientation2 = request.form.get("orientation2")
    orientation3 = request.form.get("orientation3")
    orientation4 = request.form.get("orientation4")
    orientation5 = request.form.get("orientation5")

    print(orientation1)
    print(orientation2)
    print(orientation3)
    print(orientation4)
    print(orientation5)



    card1 = load_card(card1_slug)
    card2 = load_card(card2_slug)
    card3 = load_card(card3_slug)
    card4 = load_card(card4_slug)
    card5 = load_card(card5_slug)

    card1["orientation"] = orientation1
    card2["orientation"] = orientation2
    card3["orientation"] = orientation3
    card4["orientation"] = orientation4
    card5["orientation"] = orientation5

    try:
        ai_reading = generate_deep_love_reading_ai(
            question,
            card1,
            card2,
            card3,
            card4,
            card5
        )

    except Exception as e:
        print(e)

        ai_reading = """
        <h2>⚠️ AI Temporarily Unavailable</h2>

        <p>
        The AI service is temporarily unavailable because the API quota has been reached.
        </p>

        <p>
        Your selected card has been saved successfully.
        Please try again after the quota resets.
        </p>
        """

    new_reading = DeepLoveReading(
        user_id=current_user.id,
        question=question,

        card1_slug=card1_slug,
        card1_orientation=orientation1,

        card2_slug=card2_slug,
        card2_orientation=orientation2,

        card3_slug=card3_slug,
        card3_orientation=orientation3,

        card4_slug=card4_slug,
        card4_orientation=orientation4,

        card5_slug=card5_slug,
        card5_orientation=orientation5,

        ai_reading=ai_reading
    )

    db.session.add(new_reading)
    db.session.commit()

    return redirect(
        url_for(
            "main.deep_love_reading",
            reading_id=new_reading.id
        )
    )

@main.route("/deep-love-reading/<int:reading_id>")
@login_required
def deep_love_reading(reading_id):
    reading = DeepLoveReading.query.get_or_404(reading_id)

    card1 = load_card(reading.card1_slug)
    card2 = load_card(reading.card2_slug)
    card3 = load_card(reading.card3_slug)
    card4 = load_card(reading.card4_slug)
    card5 = load_card(reading.card5_slug)

    card1["orientation"] = reading.card1_orientation
    card2["orientation"] = reading.card2_orientation
    card3["orientation"] = reading.card3_orientation
    card4["orientation"] = reading.card4_orientation
    card5["orientation"] = reading.card5_orientation

    return render_template(
        "deep-love-reading.html",
        question=reading.question,
        card1=card1,
        card2=card2,
        card3=card3,
        card4=card4,
        card5=card5,
        ai_reading=reading.ai_reading
    )

@main.route("/generate-time-reading", methods=["POST"])
@login_required
def generate_time_reading_route():

    question = request.form.get("question")
    card_slug = request.form.get("card_slug")

    card = load_time_card(card_slug)

    try:
        ai_reading = generate_time_reading(
            question,
            card
        )

    except Exception as e:
        print(e)

        ai_reading = """
        <h2>⚠️ AI Temporarily Unavailable</h2>

        <p>
        The AI service is temporarily unavailable because the API quota has been reached.
        </p>

        <p>
        Your selected card has been saved successfully.
        Please try again after the quota resets.
        </p>
        """

    new_reading = Reading(
        user_id=current_user.id,
        reading_type="time-oracle",
        question=question,
        card_name=card["name"],
        orientation="upright",
        ai_reading=ai_reading
    )

    db.session.add(new_reading)
    db.session.commit()

    return redirect(
        url_for(
            "main.time_reading",
            reading_id=new_reading.id
        )
    )

@main.route("/time-reading/<int:reading_id>")
@login_required
def time_reading(reading_id):

    reading = Reading.query.get_or_404(reading_id)

    if reading.user_id != current_user.id:
        abort(403)

    card = load_time_card(slugify(reading.card_name))

    return render_template(
        "time-reading.html",
        question=reading.question,
        card=card,
        ai_reading=reading.ai_reading
    )

@main.route("/card/<slug>")
@login_required
def card_details(slug):

    card = load_card(slug)

    card["slug"] = slug

    return render_template(
        "card-details.html",
        card=card
    )

@main.route("/career-reading")
@login_required
def career_reading():

    cards = get_random_cards(26)

    return render_template(
        "career-reading.html",
        cards=cards
    )

@main.route("/generate-guidance-reading", methods=["POST"])
@login_required
def generate_guidance_reading_route():

    question = request.form.get("question")
    card_slug = request.form.get("card_slug")

    card = load_card(card_slug)

    reading_type = request.form.get("reading_type", "career")

    orientation = request.form.get("orientation", "upright")

    if orientation not in ["upright", "reversed"]:
        orientation = "upright"

    card["orientation"] = orientation

    try:
        ai_reading = generate_guidance_reading(
            question,
            card,
            reading_type
        )

    except Exception as e:
        print(e)

        ai_reading = """
        <h2>⚠️ AI Temporarily Unavailable</h2>

        <p>
        The AI service is temporarily unavailable because the API quota has been reached.
        </p>

        <p>
        Your selected card has been saved successfully.
        Please try again after the quota resets.
        </p>
        """
    new_reading = Reading(
        user_id=current_user.id,
        reading_type=reading_type,
        question=question,
        card_name=card["name"],
        orientation=card["orientation"],
        ai_reading=ai_reading
    )

    db.session.add(new_reading)
    db.session.commit()

    return redirect(
        url_for(
            "main.guidance_reading",
            reading_id=new_reading.id
        )
    )

@main.route("/guidance-reading/<int:reading_id>")
@login_required
def guidance_reading(reading_id):

    reading = Reading.query.get_or_404(reading_id)

    slug = reading.card_name.lower().replace(" ", "-")

    card = load_card(slug)

    card["orientation"] = reading.orientation

    return render_template(
        "guidance-reading.html",
        question=reading.question,
        card=card,
        ai_reading=reading.ai_reading,
        reading_type=reading.reading_type
    )

@main.route("/journal")
@login_required
def journal():

    journals = Journal.query.filter_by(
        user_id=current_user.id
    ).order_by(
        Journal.created_at.desc()
    ).all()

    return render_template(
        "journal.html",
        journals=journals
    )

@main.route("/journal/new", methods=["GET", "POST"])
@login_required
def new_journal():

    if request.method == "POST":

        title = request.form.get("title")
        content = request.form.get("content")

        new_entry = Journal(
            user_id=current_user.id,
            title=title,
            content=content
        )

        db.session.add(new_entry)
        db.session.commit()

        flash("Journal entry created successfully.", "success")

        return redirect(url_for("main.journal"))

    return render_template("new_journal.html")

@main.route("/journal/<int:journal_id>/edit", methods=["GET", "POST"])
@login_required
def edit_journal(journal_id):

    journal = Journal.query.get_or_404(journal_id)

    if journal.user_id != current_user.id:
        abort(403)

    if request.method == "POST":

        journal.title = request.form.get("title")
        journal.content = request.form.get("content")

        db.session.commit()

        flash("Journal updated successfully.", "success")

        return redirect(url_for("main.view_journal", journal_id=journal.id))

    return render_template(
        "edit_journal.html",
        journal=journal
    )

@main.route("/journal/<int:journal_id>")
@login_required
def view_journal(journal_id):

    journal = Journal.query.get_or_404(journal_id)

    if journal.user_id != current_user.id:
        abort(403)

    return render_template(
        "view_journal.html",
        journal=journal
    )

@main.route("/journal/<int:journal_id>/delete", methods=["POST"])
@login_required
def delete_journal(journal_id):

    journal = Journal.query.get_or_404(journal_id)

    if journal.user_id != current_user.id:
        abort(403)

    db.session.delete(journal)
    db.session.commit()

    flash("Journal deleted successfully.", "success")

    return redirect(url_for("main.journal"))

@main.route("/about")
def about():
    return render_template("about.html")

@main.route("/download-reading/<int:reading_id>")
@login_required
def download_reading(reading_id):

    reading = Reading.query.get_or_404(reading_id)

    if reading.user_id != current_user.id:
        abort(403)

    return generate_reading_pdf(reading)

@main.route("/profile")
@login_required
def profile():

    total_readings = Reading.query.filter_by(
        user_id=current_user.id
    ).count()

    total_journals = Journal.query.filter_by(
        user_id=current_user.id
    ).count()

    yes_no = Reading.query.filter_by(
        user_id=current_user.id,
        reading_type="yes-no"
    ).count()

    single = Reading.query.filter_by(
        user_id=current_user.id,
        reading_type="single"
    ).count()

    time_oracle = Reading.query.filter_by(
        user_id=current_user.id,
        reading_type="time-oracle"
    ).count()

    career = Reading.query.filter_by(
        user_id=current_user.id,
        reading_type="career"
    ).count()

    money = Reading.query.filter_by(
        user_id=current_user.id,
        reading_type="money"
    ).count()

    spiritual = Reading.query.filter_by(
        user_id=current_user.id,
        reading_type="spiritual"
    ).count()

    decision = Reading.query.filter_by(
        user_id=current_user.id,
        reading_type="decision"
    ).count()
    simple_love = LoveReading.query.filter_by(
        user_id=current_user.id
    ).count()

    deep_love = DeepLoveReading.query.filter_by(
        user_id=current_user.id
    ).count()
    return render_template(
        "profile.html",
        total_readings=total_readings,
        total_journals=total_journals,
        yes_no=yes_no,
        single=single,
        time_oracle=time_oracle,
        career=career,
        money=money,
        spiritual=spiritual,
        decision=decision,
        simple_love=simple_love,
        deep_love=deep_love
    )

@main.route("/delete-account", methods=["POST"])
@login_required
def delete_account():

    user = current_user._get_current_object()

    logout_user()

    db.session.delete(user)
    db.session.commit()

    flash(
        "Your account has been deleted successfully.",
        "success"
    )

    return redirect(url_for("main.home"))

