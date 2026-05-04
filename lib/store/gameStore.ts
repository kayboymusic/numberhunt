'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodayKey } from '../utils/date';
import { validateGuess } from '../engine/validator';
import { getFeedback, TileStatus } from '../engine/feedback';
import puzzles from '../../data/puzzles.json';

export type GameStatus = 'playing' | 'won' | 'lost';
export type GameMode = 'easy' | 'hard';
export type Theme = 'light' | 'dark';
export type AuthMode = 'guest' | 'google';

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
  hasStarted: boolean;
  theme: Theme;
  showHelp: boolean;
  authMode: AuthMode | null;
  userImage: string | null;
  userName: string | null;
  showAuthModal: boolean;
}

interface GameActions {
  addChar: (char: string) => void;
  deleteChar: () => void;
  submitGuess: () => void;
  setMode: (mode: GameMode) => void;
  clearToast: () => void;
  loadGame: () => void;
  start: () => void;
  toggleTheme: () => void;
  toggleHelp: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInAsGuest: () => void;
  setGoogleAuth: (image: string | null, name: string | null) => void;
  signOut: () => void;
}

type GameStore = GameState & GameActions;

const MAX_ATTEMPTS = 6;

export const EQUATION_LENGTH: Record<GameMode, number> = {
  easy: 8,
  hard: 10,
};

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
      hasStarted: false,
      theme: 'dark',
      showHelp: false,
      authMode: null,
      userImage: null,
      userName: null,
      showAuthModal: false,

      start: () => {
        const { authMode } = get();
        if (!authMode) {
          set({ showAuthModal: true });
          return;
        }
        set({ hasStarted: true });
      },

      toggleHelp: () => set((s) => ({ showHelp: !s.showHelp })),

      openAuthModal: () => set({ showAuthModal: true }),
      closeAuthModal: () => set({ showAuthModal: false }),

      signInAsGuest: () =>
        set({
          authMode: 'guest',
          userImage: null,
          userName: null,
          showAuthModal: false,
          hasStarted: true,
        }),

      setGoogleAuth: (image, name) =>
        set({
          authMode: 'google',
          userImage: image,
          userName: name,
          showAuthModal: false,
          hasStarted: true,
        }),

      signOut: () =>
        set({
          authMode: null,
          userImage: null,
          userName: null,
          hasStarted: false,
        }),

      toggleTheme: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next === 'dark');
        }
        set({ theme: next });
      },

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
        const { currentGuess, gameStatus, mode } = get();
        if (gameStatus !== 'playing') return;
        if (currentGuess.length >= EQUATION_LENGTH[mode]) return;
        set({ currentGuess: currentGuess + char });
      },

      deleteChar: () => {
        const { currentGuess, gameStatus } = get();
        if (gameStatus !== 'playing') return;
        set({ currentGuess: currentGuess.slice(0, -1) });
      },

      submitGuess: () => {
        const { currentGuess, solution, guesses, statuses, gameStatus, streak, mode } = get();
        if (gameStatus !== 'playing') return;

        if (currentGuess.length !== EQUATION_LENGTH[mode]) {
          set({ toast: 'Not enough characters' });
          return;
        }

        const validation = validateGuess(currentGuess, EQUATION_LENGTH[mode]);
        if (!validation.valid) {
          set({ toast: validation.reason });
          return;
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
        theme: state.theme,
        authMode: state.authMode,
        userImage: state.userImage,
        userName: state.userName,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Guests only "stick" if they've made a guess today.
        // Without an entry, we boot them back to the auth modal on every refresh.
        const today = getTodayKey();
        const hasEntryToday = state.date === today && state.guesses.length > 0;
        if (state.authMode === 'guest' && !hasEntryToday) {
          state.authMode = null;
          state.userImage = null;
          state.userName = null;
          state.hasStarted = false;
        } else if (state.authMode) {
          // Authed (google, or guest with an entry) — skip start screen.
          state.hasStarted = true;
        }
      },
    }
  )
);
