from extensions import db


class LoveReading(db.Model):
    __tablename__ = "love_readings"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    question = db.Column(
        db.Text,
        nullable=False
    )

    card1_slug = db.Column(
        db.String(100),
        nullable=False
    )

    card1_orientation = db.Column(
        db.String(20),
        nullable=False
    )

    card2_slug = db.Column(
        db.String(100),
        nullable=False
    )

    card2_orientation = db.Column(
        db.String(20),
        nullable=False
    )

    card3_slug = db.Column(
        db.String(100),
        nullable=False
    )

    card3_orientation = db.Column(
        db.String(20),
        nullable=False
    )

    ai_reading = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


class DeepLoveReading(db.Model):
    __tablename__ = "deep_love_readings"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    question = db.Column(
        db.Text,
        nullable=False
    )

    card1_slug = db.Column(
        db.String(100),
        nullable=False
    )

    card1_orientation = db.Column(
        db.String(20),
        nullable=False
    )

    card2_slug = db.Column(
        db.String(100),
        nullable=False
    )

    card2_orientation = db.Column(
        db.String(20),
        nullable=False
    )

    card3_slug = db.Column(
        db.String(100),
        nullable=False
    )

    card3_orientation = db.Column(
        db.String(20),
        nullable=False
    )

    card4_slug = db.Column(
        db.String(100),
        nullable=False
    )

    card4_orientation = db.Column(
        db.String(20),
        nullable=False
    )

    card5_slug = db.Column(
        db.String(100),
        nullable=False
    )

    card5_orientation = db.Column(
        db.String(20),
        nullable=False
    )

    ai_reading = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )