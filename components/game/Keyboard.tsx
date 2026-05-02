'use client';
import { useGameStore } from '@/lib/store/gameStore';
import { TileStatus } from '@/lib/engine/feedback';
import { useEffect } from 'react';

const ROWS = [
  ['7', '8', '9', '+', '-'],
  ['4', '5', '6', '*', '/'],
  ['1', '2', '3', '0', '=', '⌫', 'Enter'],
];

const STATUS_PRIORITY: Record<TileStatus, number> = { correct: 3, present: 2, absent: 1 };

const KEY_STYLES: Record<TileStatus, string> = {
  correct: 'bg-[#538d4e] text-white border-[#538d4e]',
  present: 'bg-[#b59f3b] text-white border-[#b59f3b]',
  absent: 'bg-[var(--tile-absent)] text-white border-[var(--tile-absent)] opacity-70',
};

export default function Keyboard() {
  const { addChar, deleteChar, submitGuess, guesses, statuses, gameStatus } = useGameStore();

  // Build best status for each character
  const charStatus: Record<string, TileStatus> = {};
  guesses.forEach((guess, gi) => {
    guess.split('').forEach((ch, ci) => {
      const s = statuses[gi]?.[ci];
      if (!s) return;
      const existing = charStatus[ch];
      if (!existing || STATUS_PRIORITY[s] > STATUS_PRIORITY[existing]) {
        charStatus[ch] = s;
      }
    });
  });

  // Physical keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      const key = e.key;
      if (key === 'Backspace') { deleteChar(); return; }
      if (key === 'Enter') { submitGuess(); return; }
      if ('0123456789+-*/='.includes(key)) { addChar(key); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [addChar, deleteChar, submitGuess, gameStatus]);

  const handleKey = (key: string) => {
    if (gameStatus !== 'playing') return;
    if (key === '⌫') { deleteChar(); return; }
    if (key === 'Enter') { submitGuess(); return; }
    addChar(key);
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 items-center w-full">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 sm:gap-1.5 justify-center w-full px-1">
          {row.map((key) => {
            const status = charStatus[key];
            const isWide = key === 'Enter' || key === '⌫';
            return (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className={`
                  font-mono font-bold text-sm sm:text-base
                  rounded border
                  transition-all duration-150 active:scale-95
                  py-3 sm:py-4
                  ${isWide ? 'px-2 sm:px-4 text-xs sm:text-sm flex-1 max-w-[64px] sm:max-w-none' : 'flex-1 max-w-[44px] sm:w-12 sm:max-w-none sm:flex-initial'}
                  ${status ? KEY_STYLES[status] : 'bg-[var(--key-default)] text-[var(--key-default-text)] border-[var(--key-default)] hover:bg-[var(--key-default-hover)]'}
                `}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
