'use client';
import { useGameStore } from '@/lib/store/gameStore';
import ThemeToggle from './ThemeToggle';
import ShareTrigger from './ShareTrigger';
import ProfileAvatar from '@/components/auth/ProfileAvatar';

const GRID = 5;

export default function StartScreen() {
  const start = useGameStore((s) => s.start);
  const toggleHelp = useGameStore((s) => s.toggleHelp);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ShareTrigger />
        <ProfileAvatar />
      </div>

      <button
        onClick={toggleHelp}
        className="
          mb-4
          font-mono font-semibold text-sm
          text-[var(--text)] hover:text-black
          bg-[var(--surface)] hover:bg-[#facc15]
          border-2 border-black rounded-full
          shadow-[3px_3px_0_0_#000]
          px-4 py-1.5
          active:[transform:translate(3px,3px)] active:shadow-[0_0_0_0_#000]
          transition-colors duration-75
          cursor-pointer
          inline-flex items-center gap-2
        "
      >
        How to play
        <span aria-hidden className="font-bold">?</span>
      </button>

      <div className="relative">
        <div
          className="grid border-[3px] border-black"
          style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: GRID * GRID }).map((_, i) => (
            <div
              key={i}
              className="bg-[#538d4e] border-[1.5px] border-black aspect-square"
              style={{ width: 'clamp(48px, calc((100vw - 40px) / 5), 76px)' }}
            />
          ))}
        </div>

        <button
          onClick={start}
          className="
            absolute top-1/2 left-1/2
            bg-white hover:bg-[#facc15] text-black font-display font-bold tracking-widest
            text-lg sm:text-xl
            px-8 sm:px-10 py-4
            border-[3px] border-black rounded-2xl
            shadow-[6px_6px_0_0_#000]
            active:bg-[#facc15] active:shadow-[0_0_0_0_#000]
            transition-[background-color,box-shadow,transform] duration-75
            cursor-pointer
            flex items-center gap-3 whitespace-nowrap
            [transform:translate(-50%,-50%)]
            active:[transform:translate(calc(-50%+6px),calc(-50%+6px))]
          "
        >
          START GAME
          <span aria-hidden className="inline-block translate-y-[1px]">▶</span>
        </button>
      </div>
    </div>
  );
}
