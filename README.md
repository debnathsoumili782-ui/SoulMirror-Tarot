# 🌙 SoulMirror Tarot

### AI-Powered Tarot Reading & Self-Reflection Platform

SoulMirror Tarot is a full-stack web application that combines a digital tarot experience with AI-assisted interpretations, personalized readings, and a mystical interactive interface.

Built with **Python, Flask, HTML, CSS, JavaScript, and SQLite**, SoulMirror provides multiple tarot reading experiences while allowing users to securely manage their accounts and revisit their previous readings.

---

## ✨ Features

### 🔮 Multiple Reading Experiences

SoulMirror offers different reading formats designed for different types of questions and situations:

- 🃏 Single Card Reading
- ❤️ Simple Love Reading
- 💞 Deep Love Reading
- ❓ Yes / No Reading
- ⏳ Time Oracle
- 💼 Career Reading
- 💰 Money Reading
- 🧭 Decision Reading
- 🧘 Spiritual Guidance
- 🌟 Daily Card

---

### 🤖 AI-Assisted Tarot Interpretations

SoulMirror uses an AI-assisted reading system to interpret tarot cards in the context of the user's question.

The application maintains a structured tarot knowledge base containing card-specific information such as:

- Upright meanings
- Reversed meanings
- Keywords
- Timing guidance
- Yes/No guidance
- Card correspondences
- Affirmations

The interpretation system uses the selected card and the user's question to generate a contextual reading.

---

### 🃏 Complete 78-Card Tarot Deck

The project includes a structured tarot knowledge base covering the complete traditional 78-card deck:

**Major Arcana**
- 22 cards

**Minor Arcana**
- 14 Cups
- 14 Pentacles
- 14 Swords
- 14 Wands

Each card is represented using structured JSON data.

---

### 🔐 Authentication

SoulMirror includes a complete user authentication system.

Users can:

- Create an account
- Log in using email and password
- Continue with Google
- Log out securely
- Maintain personalized reading history

Google authentication is implemented using **Google OAuth 2.0 / Google Identity Services**.

---

### 📖 Personalized Reading History

Authenticated users can revisit their previous readings.

The history system stores information including:

- Reading type
- User question
- Selected tarot card
- Card orientation
- AI-generated interpretation
- Reading timestamp

Users can also:

- View previous readings
- Download readings as PDF
- Delete individual readings

All timestamps displayed in the reading history are converted to **Indian Standard Time (IST)**.

---

### 📄 PDF Export

Users can export their readings as PDF documents for offline reference and personal reflection.

---

### 🌙 Mystical Interactive UI

The interface is designed around a dark celestial aesthetic featuring:

- Cosmic backgrounds
- Tarot card visuals
- Animated effects
- Star particles
- Interactive card experiences
- Responsive layouts
- Themed reading pages

The frontend is built using standard web technologies without React or other frontend frameworks.

---

## 🛠️ Tech Stack

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-Login
- Flask-Bcrypt

### Frontend

- HTML5
- CSS3
- JavaScript
- Jinja2 Templates

### Database

- SQLite
- SQLAlchemy ORM
- Flask-Migrate / Alembic

### Authentication

- Google OAuth 2.0
- Google Identity Services

### AI

- Python-based AI service architecture
- Structured tarot knowledge base
- Context-aware tarot interpretation

### PDF

- Python PDF generation service

---

## 📸 Screenshots

### 🏠 Landing Page — Before Login

![SoulMirror Tarot Landing Page](docs/screenshots/home-before-login.png)

The SoulMirror Tarot landing page introduces the platform with its celestial tarot-themed interface and provides access to the main reading experience.

---

### 🔐 Authentication

#### Create Account

![SoulMirror Tarot Sign Up](docs/screenshots/signup.png)

Users can create a personalized SoulMirror Tarot account using their username, email address, and password.

#### Login & Google Authentication

![SoulMirror Tarot Login](docs/screenshots/login.png)

The login interface supports email/password authentication as well as Google authentication.

---

### 🔮 Reading Selection

![SoulMirror Tarot Reading Selection](docs/screenshots/reading-selection.png)

Users can choose from multiple tarot reading experiences based on the type of guidance they are looking for.

Available reading experiences include:

- Single Card Reading
- Simple Love Reading
- Deep Love Reading
- Yes / No Guidance
- Time Oracle
- Career Reading
- Money Reading
- Spiritual Guidance
- Decision Reading

---

### 🃏 Reading Result

![SoulMirror Tarot Reading Result](docs/screenshots/reading-result.png)

A generated tarot reading presents the selected card, its orientation, and the contextual interpretation for the user's question.

---

### ❤️ Simple Love Reading

![SoulMirror Tarot Simple Love Reading](docs/screenshots/simple-love.png)

A three-card love reading designed to explore relationship-related questions and emotional situations.

---

### 💜 Deep Love Reading

![SoulMirror Tarot Deep Love Reading](docs/screenshots/deep-love.png)

A five-card deep love spread exploring different dimensions of a relationship, including:

- Your Energy
- Their Energy
- The Challenge
- The Bridge
- The Outcome

---

### 📖 Reading History

![SoulMirror Tarot Reading History](docs/screenshots/reading-history.png)

Authenticated users can revisit their previous tarot readings from their personalized reading history.

The history interface allows users to:

- View previous readings
- Export readings as PDF
- Select multiple readings
- Manage saved reading records

---

### 🃏 Card Library

SoulMirror Tarot includes a visual card library containing the complete traditional 78-card tarot deck.

#### Major Arcana

![SoulMirror Tarot Major Arcana](docs/screenshots/card-library%20(1).png)

The Major Arcana section provides access to the 22 Major Arcana cards.

#### Cups

![SoulMirror Tarot Cups](docs/screenshots/card-library%20(2).png)

The Cups collection contains the 14 cards of the Cups suit.

#### Wands

![SoulMirror Tarot Wands](docs/screenshots/card-library%20(3).png)

The Wands collection contains the 14 cards of the Wands suit.

#### Swords

![SoulMirror Tarot Swords](docs/screenshots/card-library%20(4).png)

The Swords collection contains the 14 cards of the Swords suit.

#### Pentacles

![SoulMirror Tarot Pentacles](docs/screenshots/card-library%20(5).png)

The Pentacles collection contains the 14 cards of the Pentacles suit.

The Card Library also provides:

- Card search
- Arcana filtering
- Suit-based filtering
- Visual card browsing

---

### 📓 Journal

![SoulMirror Tarot Journal](docs/screenshots/journal.png)

The Journal provides a personal space for users to record thoughts, reflections, and experiences alongside their tarot journey.

---

### ℹ️ About SoulMirror Tarot

![SoulMirror Tarot About Page](docs/screenshots/about.png)

The About page introduces the concept and purpose behind SoulMirror Tarot and its approach to tarot-based self-reflection.

---

## 🏗️ Project Architecture

```text
SoulMirror-Tarot/
│
├── ai/
│   ├── engine.py
│   ├── generator.py
│   ├── knowledge.py
│   ├── memory.py
│   └── prompts.py
│
├── blueprints/
│   ├── admin/
│   ├── auth/
│   ├── dashboard/
│   ├── main/
│   └── reading/
│
├── data/
│   ├── tarot/
│   └── time-oracle/
│
├── database/
│
├── migrations/
│
├── models/
│   ├── card.py
│   ├── journal.py
│   ├── love_reading.py
│   ├── reading.py
│   ├── spread.py
│   ├── subscription.py
│   └── user.py
│
├── reading/
│   ├── card_loader.py
│   └── daily_card.py
│
├── services/
│   ├── ai_service.py
│   └── pdf_service.py
│
├── static/
│   ├── css/
│   ├── images/
│   └── js/
│
├── templates/
│
├── utils/
│
├── app.py
├── config.py
├── extensions.py
├── requirements.txt
└── .gitignore

## 🔄 Application Flow

User
 │
 ▼
Authentication
 │
 ├── Email / Password
 │
 └── Google OAuth
 │
 ▼
SoulMirror Dashboard
 │
 ▼
Choose Reading Type
 │
 ▼
Enter Question
 │
 ▼
Tarot Card Selection
 │
 ▼
AI-Assisted Interpretation
 │
 ▼
Reading Result
 │
 ├── Save Reading
 ├── Download PDF
 └── View Later
