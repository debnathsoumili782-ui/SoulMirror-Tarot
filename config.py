import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")

os.makedirs(INSTANCE_DIR, exist_ok=True)


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    SQLALCHEMY_DATABASE_URI = (
        "sqlite:///" + os.path.join(INSTANCE_DIR, "soulmirror.db")
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True

    MAIL_USERNAME = os.getenv(
        "MAIL_USERNAME",
        "soulmirrortarot1221@gmail.com"
    )

    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_DEFAULT_SENDER = os.getenv(
        "MAIL_DEFAULT_SENDER",
        "soulmirrortarot1221@gmail.com"
    )