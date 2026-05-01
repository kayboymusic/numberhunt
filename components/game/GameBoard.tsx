'use client';
import { useGameStore, EQUATION_LENGTH } from '@/lib/store/gameStore';
import GameRow from './GameRow';

const MAX = 6;

export default function GameBoard() {
  const { guesses, statuses, currentGuess, gameStatus, mode } = useGameStore();
  const cols = EQUATION_LENGTH[mode];
  const rows = Array.from({ length: MAX }, (_, i) => {
    if (i < guesses.length) {
      return { guess: guesses[i], statuses: statuses[i], isActive: false };
    }
    if (i === guesses.length && gameStatus === 'playing') {
      return { guess: currentGuess, statuses: undefined, isActive: true };
    }
    return { guess: '', statuses: undefined, isActive: false };
  });

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row, i) => (
        <GameRow key={i} guess={row.guess} statuses={row.statuses} isActive={row.isActive} length={cols} />
      ))}
    </div>
  );
}
