'use client';
import { useState } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { buildShareText } from '@/lib/utils/share';
import ShareButtons from './ShareButtons';

export default function ShareTrigger() {
  const [open, setOpen] = useState(false);
  const { gameStatus, mode, guesses, statuses } = useGameStore();

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareText = buildShareText({
    gameStatus,
    mode,
    guesses,
    statuses,
    origin,
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Share"
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
        <ShareIcon />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-sm
              bg-[var(--surface)] text-[var(--text)]
              border-[3px] border-black rounded-xl p-6
              shadow-[6px_6px_0_0_#000]
            "
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="
                absolute top-3 right-3
                w-8 h-8 flex items-center justify-center
                bg-white text-black hover:bg-[#facc15]
                border-2 border-black rounded-md
                shadow-[2px_2px_0_0_#000]
                active:[transform:translate(2px,2px)] active:shadow-[0_0_0_0_#000]
                transition-colors duration-75
                cursor-pointer
                font-bold text-sm
              "
            >
              ✕
            </button>

            <h3 className="font-display font-bold tracking-wider text-lg mb-1 pr-8">
              Share this play
            </h3>
            <p className="text-[var(--text-muted)] font-mono text-sm mb-3">
              Send a friend the link to today&apos;s numberhunt.
            </p>

            <div
              className="
                bg-[var(--surface-2)] text-[var(--text)]
                font-mono text-xs
                rounded-md px-3 py-2 mb-4
                break-all
              "
            >
              {origin}
            </div>

            <p className="text-[var(--text-muted)] font-mono text-xs mb-2 uppercase tracking-wider">
              Share to
            </p>
            <ShareButtons text={shareText} />
          </div>
        </div>
      )}
    </>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
