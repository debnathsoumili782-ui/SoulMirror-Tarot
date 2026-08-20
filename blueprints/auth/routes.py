from flask import render_template, request, redirect, url_for, current_app,flash
from . import auth
from extensions import bcrypt, db, mail
from models.user import User
from flask_login import login_user, login_required, current_user
from flask_login import logout_user
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
import secrets
from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = "728346101532-lcr0fn678gadem474nvi2qddojm49a3n.apps.googleusercontent.com"

def generate_reset_token(email):
    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )

    return serializer.dumps(
        email,
        salt="password-reset"
    )


def verify_reset_token(token, max_age=1800):
    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )

    try:
        email = serializer.loads(
            token,
            salt="password-reset",
            max_age=max_age
        )

        return email

    except Exception:
        return None


@auth.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():

    if request.method == "POST":

        email = request.form.get("email")

        user = User.query.filter_by(email=email).first()

        if not user:
            return render_template(
                "auth/forgot-password.html",
                error="No account found with this email address."
            )

        token = generate_reset_token(user.email)

        reset_url = url_for(
            "auth.reset_password",
            token=token,
            _external=True
        )

        msg = Message(
            subject="SoulMirror Tarot — Password Reset",
            recipients=[user.email]
        )

        msg.body = f"""
Hello {user.username},

We received a request to reset your SoulMirror Tarot password.

Click the link below to create a new password:

{reset_url}

This link will expire in 30 minutes.

If you did not request a password reset, you can safely ignore this email.

— SoulMirror Tarot
"""

        mail.send(msg)

        return render_template(
            "auth/forgot-password.html",
            success="Password reset link has been sent to your email."
        )

    return render_template("auth/forgot-password.html")

@auth.route("/reset-password/<token>", methods=["GET", "POST"])
def reset_password(token):

    email = verify_reset_token(token)

    if not email:
        return render_template(
            "auth/reset-password.html",
            error="This password reset link is invalid or has expired."
        )

    user = User.query.filter_by(email=email).first()

    if not user:
        return render_template(
            "auth/reset-password.html",
            error="User account could not be found."
        )

    if request.method == "POST":

        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if not password or not confirm_password:
            return render_template(
                "auth/reset-password.html",
                error="Please fill in both password fields."
            )

        if password != confirm_password:
            return render_template(
                "auth/reset-password.html",
                error="Passwords do not match."
            )

        if len(password) < 8:
            return render_template(
                "auth/reset-password.html",
                error="Password must be at least 8 characters long."
            )

        user.password = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

        db.session.commit()

        return render_template(
            "auth/reset-password.html",
            success="Your password has been reset successfully."
        )

    return render_template(
        "auth/reset-password.html"
    )


@auth.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")

        user = User.query.filter_by(email=email).first()

        if not user:

            flash(
                "Invalid email or password.",
                "error"
            )

            return redirect(
                url_for("auth.login")
            )

        if not bcrypt.check_password_hash(
            user.password,
            password
        ):

            flash(
                "Invalid email or password.",
                "error"
            )

            return redirect(
                url_for("auth.login")
            )

        login_user(user)

        return render_template(
            "auth/login-success.html"
        )

    return render_template("auth/login.html")


@auth.route("/login-success")
@login_required
def login_success():

    return render_template(
        "auth/login-success.html"
    )

@auth.route("/account-created")
@login_required
def account_created():

    return render_template(
        "auth/account-created.html",
        username=current_user.username
    )

@auth.route("/signup", methods=["GET", "POST"])
def signup():

    if request.method == "POST":

        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        # Password mismatch
        if password != confirm_password:

            flash(
                "Passwords do not match.",
                "error"
            )

            return redirect(
                url_for("auth.signup")
            )

        # Existing email
        existing_user = User.query.filter_by(
            email=email
        ).first()

        if existing_user:

            flash(
                "An account with this email already exists.",
                "error"
            )

            return redirect(
                url_for("auth.signup")
            )

        hashed_password = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

        new_user = User(
            username=username,
            email=email,
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        # Automatically log in the user
        login_user(new_user)

        return render_template(
            "auth/account-created.html",
            username=new_user.username
        )

    return render_template("auth/signup.html")

@auth.route("/google-login", methods=["POST"])
def google_login():

    token = request.json.get("credential")

    if not token:
        return {
            "success": False,
            "message": "Google credential missing."
        }, 400

    try:

        google_user = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = google_user.get("email")
        google_name = google_user.get("name") or email.split("@")[0]

        if not email:
            return {
                "success": False,
                "message": "Google account email not available."
            }, 400

        user = User.query.filter_by(email=email).first()

        # Existing user → Login
        if user:
            login_user(user)

            return {
                "success": True,
                "new_user": False
            }

        # New Google user → Create account
        username = google_name[:50]

        base_username = username
        counter = 1

        while User.query.filter_by(username=username).first():

            username = f"{base_username[:45]}{counter}"
            counter += 1

        random_password = secrets.token_urlsafe(32)

        hashed_password = bcrypt.generate_password_hash(
            random_password
        ).decode("utf-8")

        new_user = User(
            username=username,
            email=email,
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)

        return {
            "success": True,
            "new_user": True
        }


    except ValueError as e:

        print("GOOGLE TOKEN ERROR:", e)

        return {

            "success": False,

            "message": str(e)

        }, 401

    except Exception as e:

        print("Google Login Error:", e)

        return {
            "success": False,
            "message": str(e)
        }, 500

@auth.route("/logout")
def logout():

    logout_user()

    return redirect("/")