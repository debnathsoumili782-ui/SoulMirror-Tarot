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
