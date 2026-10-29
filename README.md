# RecallMe — AI-Powered Active Recall & EdTech SaaS Platform

RecallMe is a modern, full-featured EdTech web application inspired by the UX precision of Notion and Linear combined with the habit-forming engagement mechanics of Duolingo. Built on cognitive neuroscience principles (Long-Term Potentiation, the Ebbinghaus forgetting curve, and the testing effect), RecallMe transforms lecture transcripts, syllabus chapters, and research papers into structured study decks and active recall quizzes.

## Key Design & UX Features

- **Modern SaaS Visual Style:** Pure white surfaces (`bg-white`), dark navy typography (`#0F172A`), and vibrant indigo/blue accents (`#4F46E5`, `#2563EB`).
- **Typography:** Modern grotesque sans-serif pairing with **Plus Jakarta Sans** and **Inter**. The outdated beige theme, serif fonts, and permanent sidebar have been replaced.
- **Top Navigation Bar:** Polished global header featuring brand mark, dynamic contextual links, Duolingo-style streak indicator (`🔥 7 Days`), quick note creator, and user profile avatar dropdown.
- **Interactive Gamification:** Daily streak tracker, retention velocity meters, and spaced repetition intervals.

## Application Architecture & Routes

| Route | View | Description |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Top navigation, hero section with interactive product preview, 3-step workflow, core feature grid, cognitive science retention comparison, call-to-action banner, and footer. |
| `/signup` | **Signup** | Name, university/study email, password, confirm password, live password strength meter, validation, and login link. |
| `/login` | **Login** | Email, password, show/hide password toggle, forgot password modal with reset link flow, and one-click demo login. |
| `/dashboard` | **Dashboard** | Personalized greeting, Duolingo-style streak banner, *"What did you learn today?"* content input, recent topics table with mastery bars, and retention velocity metrics. |
| `/create` | **Create** | Distraction-free editor with word and reading-time counter, pre-configured academic samples, generation checkboxes, and multi-stage synthesis progress indicator. |
| `/study/:id` | **Study Material** | Tabbed layout (*Structured Notes*, *Key Concepts*, *Glossary & Definitions*, *Quiz Preview*), interactive keyword definition popover, and one-click Markdown export. |
| `/quiz/:id` | **Recall Quiz** | Focused one-question-at-a-time testing layout, progress bar, timer, lettered options (`A-D`), and full keyboard shortcut support (`1-4`, `A-D`, `Enter`). |
| `/results` | **Results** | Retention score summary, qualitative mastery feedback, item-by-item answer review with detailed rationales, and retry actions. |
| `/library` | **My Library** | Searchable study repository with instant keyword filtering, subject domain pills, multi-criteria sorting (Recency, Retention score, Alphabetical), star bookmarking, and deletion. |
| `/history` | **Quiz History** | Historical record of completed quiz sessions, aggregate retention statistics, and retake shortcuts. |

## Technology Stack

- **Framework:** React 18
- **Routing:** React Router v6 (`react-router-dom`)
- **Styling:** Tailwind CSS 3 (modern white, slate & indigo palette)
- **Icons:** Lucide React
- **Fonts:** Plus Jakarta Sans & Inter (via Google Fonts)
- **Bundler:** Vite 5

## Getting Started (Full-Stack Setup)

### 1. Install Dependencies
```bash
# Install frontend & backend dependencies in one command
npm run install:all
```

### 2. Environment Configuration (Backend)
Copy `.env.example` to `.env` inside the `backend` folder:
```bash
cp backend/.env.example backend/.env
```
Add your free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/):
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If you run without an API key, RecallMe automatically activates its built-in cognitive synthesis fallback engine so the app remains 100% functional).*

### 3. Run the Application

#### Option A: One-Click Launcher (Windows)
Double-click **`start-all.bat`** in the project root to launch both the Express backend and React frontend simultaneously.

#### Option B: Terminal
Open two terminal tabs:

**Terminal 1 — Backend (Port 5000):**
```bash
cd backend
npm start
```

**Terminal 2 — Frontend (Port 3000 / 5173):**
```bash
npm run dev
```

Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

---

### Backend Testing Suite
To verify the SQLite database and Gemini generation endpoints directly:
```bash
cd backend
npm test
```
