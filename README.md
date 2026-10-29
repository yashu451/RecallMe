# RecallMe — Active Recall & Structured Learning Platform

RecallMe is a production-grade, editorial EdTech web application designed for students and researchers. Drawing aesthetic and functional inspiration from Notion, Linear, and modern editorial publications, RecallMe converts complex reading materials, lecture transcripts, and syllabus excerpts into structured study decks and active recall quizzes.

## Key Design Principles

- **Warm Editorial Aesthetic:** Warm off-white background (`#FAF9F5`), crisp charcoal typography, and deep indigo (`#312E81`) used sparingly as an intentional accent.
- **Visual Restraint:** Replaces generic neon cards, emojis, and rainbow gradients with clean 1px hairline borders, high-legibility serif and sans typography, and structured content hierarchy.
- **Cognitive Science Foundations:** Built around the principles of Long-Term Potentiation (LTP), the Ebbinghaus forgetting curve, and the testing effect—facilitating active retrieval over passive re-reading.

## Application Architecture & Pages

1. **Home Dashboard (`HomeDashboard.jsx`):**
   - Contextual greeting with temporal relevance.
   - Prominent *"What did you learn today?"* rapid input box with prompt chips and direct synthesis.
   - Compact learning activity tracker with 7-day recall rhythm, retention average, and reviewed concept metrics.
   - Recently studied topics table with direct actions for review and testing.

2. **Create View (`CreateView.jsx`):**
   - Distraction-free editor for typing or pasting raw lecture notes, research excerpts, and articles.
   - Realistic sample presets (Cellular Respiration, Quantum Computing, Taylor Rule).
   - Custom generation toggles for Structured Notes, Key Concepts, Glossary & Definitions, and Active Recall Quizzes.

3. **Study Material Reader (`StudyMaterialView.jsx`):**
   - Clean reading layout with tabbed navigation: *Structured Notes*, *Key Concepts*, *Glossary & Definitions*, and *Quiz Questions Preview*.
   - Executive synthesis callout and section-by-section analysis.
   - Interactive term inspector with popover definitions.
   - One-click Markdown export and bookmarking.

4. **Recall Quiz (`RecallQuizView.jsx`):**
   - Focused, single-question testing interface.
   - Clear multiple-choice options with keyboard shortcuts (`1-4` / `A-D`, `Enter`).
   - Progress bar, timer, and question counters.

5. **Session Results (`QuizResultsView.jsx`):**
   - Accurate score summary, retention percentage, and qualitative mastery feedback.
   - Item-by-item answer review highlighting user selections, correct answers, and conceptual rationales.
   - Direct retry and study note review actions.

6. **My Library (`LibraryView.jsx`):**
   - Searchable repository with fuzzy keyword search across titles, summaries, and tags.
   - Academic domain filter pills and multi-criteria sorting (Recency, Retention Score, Alphabetical).
   - Favorite starring and topic deletion.

7. **Quiz History (`QuizHistoryView.jsx`):**
   - Historical records of completed recall sessions, average retention stats, and retake shortcuts.

## Technology Stack

- **Framework:** React 18
- **Bundler:** Vite 5
- **Styling:** Tailwind CSS 3 with custom editorial typography and warm palette
- **Icons:** Lucide React
- **Fonts:** Plus Jakarta Sans & Newsreader (via Google Fonts)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
