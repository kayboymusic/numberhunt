'use client';
import { useGameStore } from '@/lib/store/gameStore';

export default function LoseModal() {
  const { gameStatus, solution } = useGameStore();
  if (gameStatus !== 'lost') return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
      <div className="bg-[#1a1a1b] border border-[#3a3a3c] rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="text-4xl mb-2">💔</div>
        <h2 className="text-xl font-bold text-white font-display tracking-wide mb-1">Not this time</h2>
        <p className="text-[#818384] font-mono text-sm mb-6">Better luck tomorrow!</p>

        <div className="bg-[#111113] rounded-lg p-3 mb-6 font-mono text-center">
          <p className="text-[#818384] text-xs mb-1">The solution was</p>
          <p className="text-white text-lg font-bold tracking-widest">{solution}</p>
        </div>

        <p className="text-[#3a3a3c] font-mono text-xs">Come back tomorrow for a new puzzle!</p>
      </div>
    </div>
  );
}
