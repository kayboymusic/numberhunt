'use client';
import { useGameStore } from '@/lib/store/gameStore';
import GameRow from './GameRow';

export default function GameBoard() {
  const { guesses, statuses, currentGuess, gameStatus } = useGameStore();
  const MAX = 6;
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
        <GameRow key={i} guess={row.guess} statuses={row.statuses} isActive={row.isActive} />
      ))}
    </div>
  );
}
