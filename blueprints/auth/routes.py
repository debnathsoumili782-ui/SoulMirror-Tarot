from flask import render_template, request, redirect
from . import auth
from extensions import bcrypt, db
from models.user import User
from flask_login import login_user, login_required, current_user
from flask_login import logout_user

import secrets
from google.oauth2 import id_token
from google.auth.transport import requests
GOOGLE_CLIENT_ID = "728346101532-lcr0fn678gadem474nvi2qddojm49a3n.apps.googleusercontent.com"


@auth.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")

        user = User.query.filter_by(email=email).first()

        if not user:
            return "Invalid email or password."

        if not bcrypt.check_password_hash(user.password, password):
            return "Invalid email or password."

        login_user(user)

        return render_template("auth/login-success.html")

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

        if password != confirm_password:
            return "Passwords do not match."

        existing_user = User.query.filter_by(email=email).first()

        if existing_user:
            return "An account with this email already exists."

        hashed_password = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

        print(hashed_password)
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
        print("========== SIGNUP ==========")
        print(username)
        print(email)
        print(password)
        print(confirm_password)
        print("============================")

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