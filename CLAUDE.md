# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev            # Next.js dev server (Turbopack) on :3000
npm run build          # Production build
npm run lint           # ESLint
npx tsc --noEmit       # Type-check without emit
```

There are no tests in this project yet.

## Architecture

NumberHunt is a fully client-side daily math-puzzle game. State, validation, and puzzle data all live in the browser; the only server role is serving static assets.

### Layered structure

- `lib/engine/` — pure logic, no React imports.
  - `evaluator.ts` — hand-rolled tokenizer → reducer that respects `* /` before `+ -`. **Never replace with `eval()`** — the validator runs on user input. Throws on division by zero / bad tokens.
  - `validator.ts` — gates every guess. Enforces: exact length (passed in by caller — 8 for easy, 10 for hard), exactly one `=`, allowed alphabet `[0-9+\-*/=]`, no leading zeros, and `evaluate(LHS) === evaluate(RHS)` (within `1e-9` for floats).
  - `feedback.ts` — two-pass Wordle algorithm (`correct` → `present` → `absent`) with a `consumed` mask so duplicate digits don't double-count.
- `lib/store/gameStore.ts` — single Zustand store, the only mutable game state.
  - Wrapped in `persist` middleware → localStorage key `numberhunt-state`.
  - `partialize` deliberately persists `solution` + `target` alongside guesses so the locked-out state survives reload (the win/lose modal still has the answer).
  - `loadGame()` is the daily-reset gate — called once from `app/page.tsx` on mount; if the stored `date !== getTodayKey()` it wipes gameplay state and pulls today's puzzle. Setting `mode` also reloads the puzzle for that mode.
  - `EQUATION_LENGTH` (exported) maps mode → solution length: easy=8, hard=10. `addChar`/`submitGuess` and `GameBoard`/`GameRow` all read this — adding a new mode means updating this map and nothing else.
- `data/puzzles.json` — `{ "YYYY-MM-DD": { easy: { target, solution }, hard: { solution } } }`. Easy solutions **must be exactly 8 chars**, hard solutions **must be exactly 10 chars** — the validator rejects anything else, so a malformed puzzle bricks that day. Guard with: `node -e "const p=require('./data/puzzles.json'); for (const [d,v] of Object.entries(p)) { if (v.easy.solution.length!==8) console.log('easy',d,v.easy.solution.length); if (v.hard.solution.length!==10) console.log('hard',d,v.hard.solution.length); }"`
- `scripts/gen-hard-puzzles.js` — regenerates `hard.solution` for every date in `puzzles.json`. Mixes 5 buckets (`AB*CD=EFGH`, `ABC+DE=FGH`, `ABC-DE=FGH`, `AB*C+D=EFG`, `A+B+C+D=EF`) seeded for determinism. Run after editing the script: `node scripts/gen-hard-puzzles.js`.
- `components/game/` — presentational; all state comes from `useGameStore`. `GameTile` does the CSS 3D flip via `.flipped` class on the `.tile` element (front/back faces with `backface-visibility: hidden`).
- `components/game/Keyboard.tsx` — owns the global `keydown` listener. Adding new keys means updating both the on-screen `ROWS` array and the physical-keyboard allowlist string.

### Tailwind v4 conventions (important)

This project uses **Tailwind CSS v4** — there is no `tailwind.config.js`. All theme config lives in `app/globals.css` via the `@theme` directive (e.g. `--font-mono` is wired to `var(--font-jetbrains)` set by `next/font` in `app/layout.tsx`).

Do **not** add `@import url('https://fonts.googleapis.com/...')` to `globals.css`. Tailwind v4 inlines `@import "tailwindcss"` in place, which puts subsequent `@import url(...)` rules after CSS rules — invalid CSS and the build fails. Always load fonts through `next/font/google` and expose them as variables in `@theme`.

### CSS cache gotcha

Turbopack aggressively caches CSS — if styles look stale after a CSS edit (especially after deleting rules like a body pseudo-element), kill the dev server, `rm -rf .next/`, and restart. Verify by `curl`-ing the served chunk under `/_next/static/chunks/` and grepping for the rule you expect to be gone.
