'use client';
import { useGameStore } from '@/lib/store/gameStore';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { mode, setMode } = useGameStore();

  return (
    <header className="w-full pb-3 mb-4">
      <div className="relative flex flex-col items-center gap-3 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] text-[var(--text)] font-display">
          NUMBERHUNT
        </h1>

        <div className="flex items-center gap-0.5 bg-[var(--surface)] rounded-full border border-[var(--border)] p-0.5">
          <button
            onClick={() => setMode('easy')}
            className={`text-xs px-3 py-1 rounded-full font-mono font-semibold transition-all ${
              mode === 'easy'
                ? 'bg-[#538d4e] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setMode('hard')}
            className={`text-xs px-3 py-1 rounded-full font-mono font-semibold transition-all ${
              mode === 'hard'
                ? 'bg-[#b59f3b] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Hard
          </button>
        </div>

        <div className="absolute right-4 top-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
