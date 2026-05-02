'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/lib/store/gameStore';
import { TileStatus } from '@/lib/engine/feedback';
import ShareButtons from '@/components/ui/ShareButtons';

const EMOJI: Record<TileStatus, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
};

function celebrate() {
  const colors = [
    '#ff3366', // hot pink
    '#00d9ff', // cyan
    '#b537f2', // purple
    '#ff8c00', // orange
    '#facc15', // bright yellow
    '#06ffa5', // mint
    '#ff3838', // red
    '#538d4e', // brand green
  ];

  confetti({
    particleCount: 90,
    angle: 90,
    spread: 110,
    startVelocity: 38,
    origin: { x: 0.5, y: -0.05 },
    colors,
    gravity: 0.9,
    ticks: 400,
    disableForReducedMotion: true,
  });

  const end = Date.now() + 1800;
  const interval = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 5,
      angle: 90,
      spread: 60,
      startVelocity: 25,
      origin: { x: Math.random(), y: -0.05 },
      colors,
      gravity: 0.8,
      ticks: 300,
      disableForReducedMotion: true,
    });
  }, 80);

  return () => window.clearInterval(interval);
}

export default function WinModal() {
  const { gameStatus, guesses, statuses, streak, solution, mode } = useGameStore();
  const hasWon = gameStatus === 'won';

  useEffect(() => {
    if (!hasWon) return;
    return celebrate();
  }, [hasWon]);

  if (!hasWon) return null;

  const shareText = [
    `NumberHunt ${new Date().toLocaleDateString()} (${mode})`,
    `${guesses.length}/6`,
    '',
    ...statuses.map((row) => row.map((s) => EMOJI[s]).join('')),
  ].join('\n');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-[var(--text)] font-display tracking-wide mb-1">Brilliant!</h2>
        <p className="text-[var(--text-muted)] font-mono text-sm mb-4">
          Solved in <span className="text-[var(--text)] font-bold">{guesses.length}</span> attempt{guesses.length !== 1 ? 's' : ''}
        </p>

        <div className="flex flex-col items-center gap-0.5 mb-4">
          {statuses.map((row, ri) => (
            <div key={ri} className="flex gap-0.5">
              {row.map((s, ci) => (
                <div
                  key={ci}
                  className={`w-3 h-3 rounded-sm ${
                    s === 'correct' ? 'bg-[#538d4e]' : s === 'present' ? 'bg-[#b59f3b]' : 'bg-[var(--tile-absent)]'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="bg-[var(--surface-2)] rounded-lg p-3 mb-4 font-mono text-center">
          <p className="text-[var(--text-muted)] text-xs mb-1">The solution was</p>
          <p className="text-[var(--text)] text-lg font-bold tracking-widest">{solution}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 text-[var(--text-muted)] font-mono text-sm">
          <span>🔥</span>
          <span>Streak: <span className="text-[var(--text)] font-bold">{streak}</span></span>
        </div>

        <p className="text-[var(--text-muted)] font-mono text-xs mb-2 uppercase tracking-wider">Share to</p>
        <ShareButtons text={shareText} />

        <p className="text-[var(--text-subtle)] font-mono text-xs mt-4">Come back tomorrow for a new puzzle!</p>
      </div>
    </div>
  );
}
