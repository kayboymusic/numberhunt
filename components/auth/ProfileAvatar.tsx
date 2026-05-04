'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/lib/store/gameStore';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export default function ProfileAvatar() {
  const authMode = useGameStore((s) => s.authMode);
  const userImage = useGameStore((s) => s.userImage);
  const userName = useGameStore((s) => s.userName);
  const signOut = useGameStore((s) => s.signOut);
  const [open, setOpen] = useState(false);

  if (!authMode) return null;

  async function handleSignOut() {
    if (authMode === 'google') {
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();
    }
    signOut();
    setOpen(false);
  }

  const label = authMode === 'guest' ? 'Guest' : (userName ?? 'You');

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="
          w-9 h-9 flex items-center justify-center
          bg-[var(--surface)] border-2 border-black rounded-full
          shadow-[2px_2px_0_0_#000]
          active:[transform:translate(2px,2px)] active:shadow-[0_0_0_0_#000]
          transition-[transform,box-shadow] duration-75
          cursor-pointer overflow-hidden
        "
      >
        {authMode === 'google' && userImage ? (
          <Image
            src={userImage}
            alt={label}
            width={36}
            height={36}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            unoptimized
          />
        ) : (
          <GuestIcon />
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            className="
              absolute right-0 mt-2 w-48 z-40
              bg-[var(--surface)] border-2 border-black rounded-xl
              shadow-[4px_4px_0_0_#000]
              p-2
            "
          >
            <p className="font-mono text-xs text-[var(--text-muted)] px-2 py-1 truncate">
              {authMode === 'guest' ? 'Playing as Guest' : label}
            </p>
            <button
              onClick={handleSignOut}
              className="
                w-full text-left font-mono text-sm
                text-[var(--text)] hover:bg-[#facc15] hover:text-black
                rounded-md px-2 py-1.5
                cursor-pointer
              "
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function GuestIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-[var(--text)]"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
