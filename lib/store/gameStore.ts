'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodayKey } from '../utils/date';
import { validateGuess } from '../engine/validator';
import { getFeedback, TileStatus } from '../engine/feedback';
import puzzles from '../../data/puzzles.json';

export type GameStatus = 'playing' | 'won' | 'lost';
export type GameMode = 'easy' | 'hard';

interface GameState {
  solution: string;
  target: number | null;
  mode: GameMode;
  date: string;
  currentGuess: string;
  guesses: string[];
  statuses: TileStatus[][];
  gameStatus: GameStatus;
  streak: number;
  lastPlayed: string;
  toast: string | null;
}

interface GameActions {
  addChar: (char: string) => void;
  deleteChar: () => void;
  submitGuess: () => void;
  setMode: (mode: GameMode) => void;
  clearToast: () => void;
  loadGame: () => void;
}

type GameStore = GameState & GameActions;

const MAX_ATTEMPTS = 6;

function getPuzzle(date: string, mode: GameMode): { solution: string; target: number | null } {
  const data = (puzzles as Record<string, { easy: { target: number; solution: string }; hard: { solution: string } }>)[date];
  if (!data) {
    // Fallback puzzle if date not found
    return { solution: '6*7+0=42', target: mode === 'easy' ? 42 : null };
  }
  if (mode === 'easy') {
    return { solution: data.easy.solution, target: data.easy.target };
  }
  return { solution: data.hard.solution, target: null };
}

function initialGameState(date: string, mode: GameMode): Pick<GameState, 'solution' | 'target' | 'currentGuess' | 'guesses' | 'statuses' | 'gameStatus'> {
  const { solution, target } = getPuzzle(date, mode);
  return {
    solution,
    target,
    currentGuess: '',
    guesses: [],
    statuses: [],
    gameStatus: 'playing',
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      solution: '',
      target: null,
      mode: 'easy',
      date: '',
      currentGuess: '',
      guesses: [],
      statuses: [],
      gameStatus: 'playing',
      streak: 0,
      lastPlayed: '',
      toast: null,

      loadGame: () => {
        const today = getTodayKey();
        const state = get();

        if (state.date !== today) {
          // New day — reset game
          const mode = state.mode;
          const { solution, target } = getPuzzle(today, mode);
          set({
            solution,
            target,
            date: today,
            currentGuess: '',
            guesses: [],
            statuses: [],
            gameStatus: 'playing',
            toast: null,
          });
        }
      },

      setMode: (mode) => {
        const today = getTodayKey();
        const { solution, target } = getPuzzle(today, mode);
        set({
          mode,
          solution,
          target,
          date: today,
          currentGuess: '',
          guesses: [],
          statuses: [],
          gameStatus: 'playing',
          toast: null,
        });
      },

      addChar: (char) => {
        const { currentGuess, gameStatus } = get();
        if (gameStatus !== 'playing') return;
        if (currentGuess.length >= 8) return;
        set({ currentGuess: currentGuess + char });
      },

      deleteChar: () => {
        const { currentGuess, gameStatus } = get();
        if (gameStatus !== 'playing') return;
        set({ currentGuess: currentGuess.slice(0, -1) });
      },

      submitGuess: () => {
        const { currentGuess, solution, guesses, statuses, gameStatus, streak, mode, target } = get();
        if (gameStatus !== 'playing') return;

        if (currentGuess.length !== 8) {
          set({ toast: 'Not enough characters' });
          return;
        }

        const validation = validateGuess(currentGuess);
        if (!validation.valid) {
          set({ toast: validation.reason });
          return;
        }

        // In easy mode, enforce the target result
        if (mode === 'easy' && target !== null) {
          const eqIdx = currentGuess.indexOf('=');
          const rhs = currentGuess.slice(eqIdx + 1);
          const { evaluate } = require('../engine/evaluator');
          try {
            const rhsVal = evaluate(rhs);
            if (Math.abs(rhsVal - target) > 1e-9) {
              set({ toast: `Equation must equal ${target}` });
              return;
            }
          } catch {
            set({ toast: 'Invalid equation' });
            return;
          }
        }

        const feedback = getFeedback(currentGuess, solution);
        const newGuesses = [...guesses, currentGuess];
        const newStatuses = [...statuses, feedback];
        const today = getTodayKey();

        if (currentGuess === solution) {
          const newStreak = streak + 1;
          set({
            guesses: newGuesses,
            statuses: newStatuses,
            currentGuess: '',
            gameStatus: 'won',
            streak: newStreak,
            lastPlayed: today,
            toast: null,
          });
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
          set({
            guesses: newGuesses,
            statuses: newStatuses,
            currentGuess: '',
            gameStatus: 'lost',
            streak: 0,
            lastPlayed: today,
            toast: null,
          });
        } else {
          set({
            guesses: newGuesses,
            statuses: newStatuses,
            currentGuess: '',
            toast: null,
          });
        }
      },

      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'numberhunt-state',
      partialize: (state) => ({
        mode: state.mode,
        date: state.date,
        guesses: state.guesses,
        statuses: state.statuses,
        gameStatus: state.gameStatus,
        streak: state.streak,
        lastPlayed: state.lastPlayed,
        solution: state.solution,
        target: state.target,
      }),
    }
  )
);
