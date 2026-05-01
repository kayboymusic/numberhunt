'use client';
import { useGameStore } from '@/lib/store/gameStore';

export default function LoseModal() {
  const { gameStatus, solution } = useGameStore();
  if (gameStatus !== 'lost') return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="text-4xl mb-2">💔</div>
        <h2 className="text-xl font-bold text-[var(--text)] font-display tracking-wide mb-1">Not this time</h2>
        <p className="text-[var(--text-muted)] font-mono text-sm mb-6">Better luck tomorrow!</p>

        <div className="bg-[var(--surface-2)] rounded-lg p-3 mb-6 font-mono text-center">
          <p className="text-[var(--text-muted)] text-xs mb-1">The solution was</p>
          <p className="text-[var(--text)] text-lg font-bold tracking-widest">{solution}</p>
        </div>

        <p className="text-[var(--text-subtle)] font-mono text-xs">Come back tomorrow for a new puzzle!</p>
      </div>
    </div>
  );
}
