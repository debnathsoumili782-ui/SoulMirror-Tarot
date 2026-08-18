from extensions import db


class Reading(db.Model):
    __tablename__ = "readings"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    reading_type = db.Column(
        db.String(50),
        nullable=False
    )

    question = db.Column(
        db.Text,
        nullable=False
    )

    card_name = db.Column(
        db.String(100),
        nullable=False
    )

    orientation = db.Column(
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