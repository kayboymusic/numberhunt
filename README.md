# NumberHunt

A daily math equation guessing game — Wordle/Nerdle/Mathler-inspired gameplay with a minimalist UI.

Players have 6 attempts to guess a hidden 8-character mathematical equation. Each guess reveals which characters are correct, misplaced, or absent.

## Modes

- **Easy** — the target result is shown (e.g. *"Find the calculation that equals 79"*).
- **Hard** — no clues. Guess the equation from scratch.

## Tech Stack

- Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
- Zustand (state) with localStorage persistence
- Static daily puzzle JSON bundled with the app

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Layout

```
app/                    Next.js app router (layout, page, globals)
components/
  game/                 GameBoard · GameRow · GameTile · Keyboard
  modals/               WinModal · LoseModal
  ui/                   Header · Toast
lib/
  engine/               evaluator · validator · feedback
  store/                Zustand store + persistence
  utils/                date helpers
data/puzzles.json       Daily puzzles indexed by date
```

## Equation Rules

- Exactly 8 characters
- Exactly one `=`
- Allowed: digits `0–9`, operators `+ - * /`
- No parentheses
- LHS must equal RHS
