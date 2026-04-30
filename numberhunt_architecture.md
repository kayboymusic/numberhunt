# NumberHunt — System Architecture & Detailed Design

---

## 1. Architecture Overview

NumberHunt follows a **hybrid client-first architecture**:

- **Frontend (Primary runtime)** → Game engine, UI, state
- **Edge/Backend (Optional but recommended)** → Puzzle delivery, validation, anti-cheat
- **Storage Layers** → Local (MVP) + Cloud (future)

### Architecture Style
- Client-heavy (Wordle-style)
- Stateless backend (for scale)
- Deterministic daily puzzle system

---

## 2. High-Level System Diagram

```
[ User Browser ]
      |
      v
[ Frontend App (Next.js) ]
      |
      |--- Game Engine (core logic)
      |--- State Manager (Zustand)
      |--- UI Layer
      |
      v
[ API Layer (Optional) ]
      |
      |--- Puzzle Service
      |--- Validation Service
      |--- Stats Service
      |
      v
[ Storage ]
   |--- LocalStorage (MVP)
   |--- DB (Future: Supabase/Postgres)
```

---

## 3. Core Systems Breakdown

---

## 3.1 Game Engine System (Frontend Core)

### Responsibilities
- Equation validation
- Expression evaluation
- Guess comparison
- Feedback generation
- Game state transitions

### Subsystems

#### 1. Input Processor
- Captures keyboard input
- Enforces allowed characters
- Handles backspace, submit

#### 2. Equation Validator
- Syntax validation
- Semantic validation
- Ensures valid math expression

#### 3. Evaluation Engine
- Tokenizer
- Parser (AST builder)
- Executor

#### 4. Feedback Engine
- Two-pass comparison algorithm
- Duplicate handling

#### 5. Game State Controller
- Controls game lifecycle:
  - idle → playing → win/lose → locked

---

### Internal Flow

```
User Input → Input Processor
           → Validator
           → Evaluation Engine
           → Feedback Engine
           → State Update
           → UI Render
```

---

## 3.2 Puzzle System

### Responsibilities
- Provide daily puzzles
- Ensure consistency across users
- Manage difficulty modes

---

### Option A (MVP): Static Puzzle Service

- JSON file hosted on CDN or bundled
- Indexed by date

```
/puzzles/2026.json
```

---

### Option B: Dynamic Puzzle Generator (Advanced)

#### Components

1. Seed Generator
- Input: current date
- Output: deterministic seed

2. Equation Generator
- Generates candidate expressions

3. Constraint Validator
- Length check
- Valid math check
- Difficulty filter

4. Ambiguity Resolver
- Ensures uniqueness

---

### Data Contract

```
{
  date: string,
  easy: {
    solution: string,
    target: number
  },
  hard: {
    solution: string
  }
}
```

---

## 3.3 State Management System

### Tool: Zustand

### State Domains

#### Game State
- currentGuess
- guesses[]
- statuses[][]
- attemptsLeft
- completed

#### Meta State
- mode
- date
- hintsUsed
- streak

---

### Persistence Strategy

- LocalStorage sync
- Hydration on load

```
loadState() → validate date → hydrate store
```

---

## 3.4 UI System

### Layers

1. Presentation Layer
- Grid
- Keyboard
- Modals

2. Interaction Layer
- Click handlers
- Keyboard bindings

3. Animation Layer
- Feedback transitions
- Tile flip animations

---

### Rendering Strategy
- Controlled components
- Derived UI from state

---

## 3.5 Input System

### Sources
- Physical keyboard
- On-screen keyboard

### Pipeline

```
Key Press → Normalize → Validate → Dispatch Action
```

---

## 3.6 Hint System

### Responsibilities
- Provide controlled assistance
- Maintain fairness

### Components
- Hint selector
- Reveal tracker
- Usage limiter

---

## 3.7 Daily Access System

### Responsibilities
- Enforce one play per day
- Reset progress

### Logic

```
if (storedDate !== today):
  resetGame()
```

---

## 3.8 Backend/API System (Optional but Recommended)

### Services

#### 1. Puzzle Service
- Returns daily puzzle

#### 2. Validation Service
- Re-check guesses (anti-cheat)

#### 3. Stats Service
- Tracks global metrics

---

### API Contracts

#### GET /api/puzzle
```
Response:
{
  date,
  easy: { target, length },
  hard: { length }
}
```

#### POST /api/validate
```
Request:
{ guess }

Response:
{ valid: boolean }
```

---

## 3.9 Storage System

### MVP
- LocalStorage only

### Future
- Postgres (Supabase)

### Data Models

#### User (future)
```
{
  id,
  streak,
  lastPlayed
}
```

#### Game Record
```
{
  date,
  mode,
  attempts,
  success,
  hintsUsed
}
```

---

## 3.10 Anti-Cheat System

### Techniques
- Do not expose solution plainly
- Encode or hash solution
- Server-side validation (future)

---

## 4. Data Flow (End-to-End)

```
App Load
  ↓
Get Today Key
  ↓
Fetch Puzzle
  ↓
Hydrate State
  ↓
User Input Loop
  ↓
Validation → Evaluation → Feedback
  ↓
Update State
  ↓
Persist State
  ↓
Game End
```

---

## 5. Performance Architecture

- Static assets via CDN
- Edge functions for API
- Minimal backend calls (1 per day)

---

## 6. Security Considerations

- Avoid client-side eval()
- Sanitize inputs
- Rate limit API

---

## 7. Scalability Strategy

### Phase 1 (MVP)
- Fully client-side

### Phase 2
- Add backend puzzle service

### Phase 3
- Add accounts + leaderboard

---

## 8. Deployment Architecture

- Frontend: Vercel
- API: Vercel Edge Functions
- DB: Supabase (future)

---

## 9. Observability

- Analytics: PostHog / Plausible
- Logs: Vercel logs

---

## 10. System Risks

- Puzzle predictability
- Reverse engineering solution
- Timezone inconsistencies

---

## 11. Future Systems

- Multiplayer engine (WebSockets)
- Puzzle editor
- AI-based difficulty tuning

---

## 12. Summary

Core architecture is:
- **Client-first game engine**
- **Deterministic puzzle system**
- **Optional backend for scale + integrity**

This ensures:
- Fast performance
- Low cost
- Easy scaling

