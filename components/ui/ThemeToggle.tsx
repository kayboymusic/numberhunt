'use client';
import { useGameStore } from '@/lib/store/gameStore';

export default function ThemeToggle() {
  const toggleTheme = useGameStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        w-10 h-10 sm:w-11 sm:h-11
        flex items-center justify-center
        bg-[var(--surface)] hover:bg-[#facc15]
        text-[var(--text)] hover:text-black
        border-2 border-black rounded-lg
        shadow-[3px_3px_0_0_#000]
        transition-colors duration-75
        cursor-pointer
        active:[transform:translate(3px,3px)] active:shadow-[0_0_0_0_#000]
      "
    >
      <SunIcon className="theme-icon-sun" />
      <MoonIcon className="theme-icon-moon" />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
