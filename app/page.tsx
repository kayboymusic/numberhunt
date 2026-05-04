'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import Header from '@/components/ui/Header';
import Toast from '@/components/ui/Toast';
import StartScreen from '@/components/ui/StartScreen';
import HowToPlay from '@/components/ui/HowToPlay';
import GameBoard from '@/components/game/GameBoard';
import Keyboard from '@/components/game/Keyboard';
import WinModal from '@/components/modals/WinModal';
import LoseModal from '@/components/modals/LoseModal';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  const loadGame = useGameStore((s) => s.loadGame);
  const hasStarted = useGameStore((s) => s.hasStarted);
  const setGoogleAuth = useGameStore((s) => s.setGoogleAuth);
  const signOut = useGameStore((s) => s.signOut);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const user = data.session?.user;
      if (user) {
        const meta = user.user_metadata as {
          avatar_url?: string;
          picture?: string;
          full_name?: string;
          name?: string;
        };
        setGoogleAuth(
          meta.avatar_url ?? meta.picture ?? null,
          meta.full_name ?? meta.name ?? user.email ?? null,
        );
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const meta = session.user.user_metadata as {
          avatar_url?: string;
          picture?: string;
          full_name?: string;
          name?: string;
        };
        setGoogleAuth(
          meta.avatar_url ?? meta.picture ?? null,
          meta.full_name ?? meta.name ?? session.user.email ?? null,
        );
      } else if (event === 'SIGNED_OUT') {
        // Only react to Supabase sign-outs for google users.
        // (Guest sign-out is handled locally by the store.)
        if (useGameStore.getState().authMode === 'google') {
          signOut();
        }
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [setGoogleAuth, signOut]);

  return (
    <main className="flex flex-col items-center min-h-screen bg-[var(--bg)] pt-4 pb-8 px-2">
      {hasStarted ? (
        <>
          <div className="w-full max-w-lg">
            <Header />
            <div className="flex flex-col items-center gap-6 mt-2">
              <GameBoard />
              <Keyboard />
            </div>
          </div>
          <WinModal />
          <LoseModal />
        </>
      ) : (
        <StartScreen />
      )}
      <HowToPlay />
      <AuthModal />
      <Toast />
    </main>
  );
}
