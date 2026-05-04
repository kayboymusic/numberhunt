'use client';
import { useState } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export default function AuthModal() {
  const showAuthModal = useGameStore((s) => s.showAuthModal);
  const closeAuthModal = useGameStore((s) => s.closeAuthModal);
  const signInAsGuest = useGameStore((s) => s.signInAsGuest);
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  async function continueWithGoogle() {
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });
    if (error) {
      console.error('Google sign-in error:', error);
      setLoading(false);
    }
    // On success, browser is redirected away — no need to close modal here.
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={closeAuthModal}
    >
      <div
        className="bg-[var(--surface)] border-[3px] border-black rounded-2xl p-6 max-w-sm w-full text-center shadow-[8px_8px_0_0_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-bold text-[var(--text)] tracking-wide mb-1">
          Sign in to play
        </h2>
        <p className="font-mono text-xs text-[var(--text-muted)] mb-5">
          Pick how you&apos;d like to continue.
        </p>

        <button
          onClick={continueWithGoogle}
          disabled={loading}
          className="
            w-full mb-3 flex items-center justify-center gap-3
            font-mono font-semibold text-sm
            bg-white hover:bg-[#facc15] text-black
            border-2 border-black rounded-full
            shadow-[3px_3px_0_0_#000]
            px-4 py-2.5
            active:[transform:translate(3px,3px)] active:shadow-[0_0_0_0_#000]
            transition-colors duration-75
            cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <GoogleLogo />
          Continue with Google
        </button>

        <button
          onClick={signInAsGuest}
          disabled={loading}
          className="
            w-full flex items-center justify-center gap-3
            font-mono font-semibold text-sm
            bg-[var(--surface-2)] hover:bg-[#facc15]
            text-[var(--text)] hover:text-black
            border-2 border-black rounded-full
            shadow-[3px_3px_0_0_#000]
            px-4 py-2.5
            active:[transform:translate(3px,3px)] active:shadow-[0_0_0_0_#000]
            transition-colors duration-75
            cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <GuestIcon />
          Continue as Guest
        </button>

        <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-4 leading-snug">
          Guests stay signed in only after their first guess.
        </p>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function GuestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
