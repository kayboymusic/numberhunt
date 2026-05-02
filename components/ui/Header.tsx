'use client';
import { useGameStore } from '@/lib/store/gameStore';
import ThemeToggle from './ThemeToggle';
import ShareTrigger from './ShareTrigger';

export default function Header() {
  const { mode, setMode } = useGameStore();

  return (
    <header className="w-full px-4 py-3 mb-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <ThemeToggle />
        <h1 className="text-xl sm:text-2xl font-bold tracking-[0.15em] text-[var(--text)] font-display whitespace-nowrap">
          NUMBERHUNT
        </h1>
        <ShareTrigger />
      </div>

      <div className="flex justify-center">
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
      </div>
    </header>
  );
}
