# NumberHunt — Product Requirements Document (PRD)

---

## 1. Overview

NumberHunt is a web-based daily math puzzle game combining:
- Grid-based UI inspired by Sumplete
- Equation-guessing mechanics similar to Nerdle and Mathler

Players guess a hidden valid mathematical equation within limited attempts. One puzzle is available per day.

---

## 2. Goals

- Build a daily habit-forming game
- Encourage logical reasoning and arithmetic thinking
- Deliver a simple, fast, and replayable experience

---

## 3. Core Gameplay

### 3.1 Objective
Guess the hidden equation within a fixed number of attempts.

---

### 3.2 Modes

#### Easy Mode
- Player is given a target result
- Example: “Find the hidden calculation that equals 79”
- Player must construct an equation that evaluates to the target

#### Hard Mode
- No target result is provided
- Player must deduce both equation and result

---

### 3.3 Equation Rules

- Fixed length (default: 8 characters)
- Must include exactly one `=`
- Allowed characters:
  - Digits: 0–9
  - Operators: +, -, *, /
- No parentheses
- Must be mathematically valid (LHS = RHS)

---

### 3.4 Attempts

- Max attempts: 6
- One puzzle per player per day

---

### 3.5 Feedback System

After each guess:
- Correct character & position → Green
- Correct character, wrong position → Yellow/Purple
- Not present → Grey

---

### 3.6 Hints System

- Limited hints per game (1–2)
- Types:
  - Reveal a correct character
  - Reveal correct position
  - Confirm operator presence

- Using hints reduces score value

---

## 4. UI/UX Requirements

### 4.1 Layout

- Grid-based interface
- Minimal, centered layout
- Input row for guesses
- Visual feedback in cells

---

### 4.2 Components

- Header (logo + mode toggle)
- Game grid
- On-screen keyboard
- Status bar (attempts, mode)
- Hint button
- Result modal

---

### 4.3 Game States

- Idle
- Active
- Win
- Lose
- Locked (played today)

---

## 5. Daily Puzzle System

### 5.1 Puzzle Delivery

- One puzzle per day
- Same puzzle for all users

---

### 5.2 Puzzle Structure

```
{
  date,
  easy: { target, solution },
  hard: { solution }
}
```

---

### 5.3 Reset Logic

- New puzzle every 24 hours
- Reset based on date change

---

## 6. Scoring & Progression

### 6.1 Metrics

- Attempts used
- Hints used
- Win/Loss

---

### 6.2 Streak System

- Daily streak tracking
- Broken if a day is missed

---

### 6.3 Sharing

- Emoji grid sharing
- No spoilers

---

## 7. Functional Requirements

### 7.1 Input Validation

- Validate syntax
- Validate math correctness
- Reject invalid equations

---

### 7.2 Game Logic

- Evaluate expressions
- Compare guesses
- Generate feedback

---

### 7.3 State Management

- Persist progress locally
- Track guesses and completion

---

### 7.4 Daily Lock

- Restrict to one play per day

---

## 8. Non-Functional Requirements

- Load time < 2s
- Mobile responsive
- Cross-browser support

---

## 9. Technical Overview

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- Zustand

---

### Backend (Optional)
- Serverless API
- Puzzle delivery
- Validation

---

### Storage
- LocalStorage (MVP)
- Database (future)

---

## 10. Risks

- Multiple valid solutions
- Invalid edge-case equations
- Users bypassing daily limit
- Division edge cases

---

## 11. Future Enhancements

- Multiplayer mode
- Leaderboards
- Custom puzzles
- Account system

---

## 12. Success Metrics

- Daily Active Users
- Retention rate
- Average attempts per game
- Hint usage rate
- Share rate

---

## 13. Summary

NumberHunt is a daily math puzzle game focused on simplicity, logic, and repeat engagement through a single daily challenge loop.
