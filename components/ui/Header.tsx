'use client';
import { useGameStore } from '@/lib/store/gameStore';
import ThemeToggle from './ThemeToggle';
import ShareTrigger from './ShareTrigger';

export default function Header() {
  const { mode, setMode, toggleHelp } = useGameStore();

  return (
    <header className="w-full px-4 py-3 mb-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <ThemeToggle />
        <h1 className="text-xl sm:text-2xl font-bold tracking-[0.15em] text-[var(--text)] font-display whitespace-nowrap">
          NUMBERHUNT
        </h1>
        <ShareTrigger />
      </div>

      <div className="flex justify-center items-center gap-2">
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

        <button
          onClick={toggleHelp}
          aria-label="How to play"
          className="
            w-7 h-7 flex items-center justify-center
            bg-[var(--surface)] hover:bg-[#facc15]
            text-[var(--text)] hover:text-black
            border-2 border-black rounded-full
            shadow-[2px_2px_0_0_#000]
            active:[transform:translate(2px,2px)] active:shadow-[0_0_0_0_#000]
            transition-colors duration-75
            cursor-pointer
            font-mono font-bold text-sm leading-none
          "
        >
          ?
        </button>
      </div>
    </header>
  );
}
