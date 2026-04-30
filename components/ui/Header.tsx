'use client';
import { useGameStore } from '@/lib/store/gameStore';

export default function Header() {
  const { mode, setMode, target, gameStatus } = useGameStore();

  return (
    <header className="w-full pb-3 mb-4">
      <div className="flex flex-col items-center gap-3 px-4">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white font-display">
          NUMBERHUNT
        </h1>

        {/* Mode toggle */}
        <div className="flex items-center gap-0.5 bg-[#1a1a1b] rounded-full border border-[#3a3a3c] p-0.5">
          <button
            onClick={() => setMode('easy')}
            className={`text-xs px-3 py-1 rounded-full font-mono font-semibold transition-all ${
              mode === 'easy'
                ? 'bg-[#538d4e] text-white'
                : 'text-[#818384] hover:text-white'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setMode('hard')}
            className={`text-xs px-3 py-1 rounded-full font-mono font-semibold transition-all ${
              mode === 'hard'
                ? 'bg-[#b59f3b] text-white'
                : 'text-[#818384] hover:text-white'
            }`}
          >
            Hard
          </button>
        </div>
      </div>

      {/* Target hint for easy mode */}
      {mode === 'easy' && target !== null && gameStatus === 'playing' && (
        <p className="text-center text-[#818384] text-sm font-mono mt-3">
          Find the hidden calculation that equals{' '}
          <span className="text-[#538d4e] font-bold text-base">{target}</span>
        </p>
      )}
    </header>
  );
}
