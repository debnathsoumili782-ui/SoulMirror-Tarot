from flask import Flask

from config import Config
from extensions import db, bcrypt, migrate, login_manager, mail
from blueprints.auth import auth

from blueprints.main.routes import main


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    login_manager.init_app(app)
    mail.init_app(app)

    app.register_blueprint(main)
    app.register_blueprint(auth)
    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)