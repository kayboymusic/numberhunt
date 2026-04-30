'use client';
import { useGameStore } from '@/lib/store/gameStore';
import { TileStatus } from '@/lib/engine/feedback';

const EMOJI: Record<TileStatus, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
};

export default function WinModal() {
  const { gameStatus, guesses, statuses, streak, solution, mode } = useGameStore();
  if (gameStatus !== 'won') return null;

  const shareText = [
    `NumberHunt ${new Date().toLocaleDateString()} (${mode})`,
    `${guesses.length}/6`,
    '',
    ...statuses.map((row) => row.map((s) => EMOJI[s]).join('')),
  ].join('\n');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
      <div className="bg-[#1a1a1b] border border-[#3a3a3c] rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-white font-display tracking-wide mb-1">Brilliant!</h2>
        <p className="text-[#818384] font-mono text-sm mb-4">
          Solved in <span className="text-white font-bold">{guesses.length}</span> attempt{guesses.length !== 1 ? 's' : ''}
        </p>

        <div className="flex justify-center gap-1 mb-4">
          {statuses.map((row, ri) => (
            <div key={ri} className="flex flex-col gap-0.5">
              {row.map((s, ci) => (
                <div
                  key={ci}
                  className={`w-3 h-3 rounded-sm ${
                    s === 'correct' ? 'bg-[#538d4e]' : s === 'present' ? 'bg-[#b59f3b]' : 'bg-[#3a3a3c]'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="bg-[#111113] rounded-lg p-3 mb-4 font-mono text-center">
          <p className="text-[#818384] text-xs mb-1">The solution was</p>
          <p className="text-white text-lg font-bold tracking-widest">{solution}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 text-[#818384] font-mono text-sm">
          <span>🔥</span>
          <span>Streak: <span className="text-white font-bold">{streak}</span></span>
        </div>

        <button
          onClick={handleShare}
          className="w-full bg-[#538d4e] hover:bg-[#4a7d45] text-white font-mono font-bold py-2.5 rounded-lg transition-colors"
        >
          Share Result
        </button>

        <p className="text-[#3a3a3c] font-mono text-xs mt-4">Come back tomorrow for a new puzzle!</p>
      </div>
    </div>
  );
}
