'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import Header from '@/components/ui/Header';
import Toast from '@/components/ui/Toast';
import StartScreen from '@/components/ui/StartScreen';
import GameBoard from '@/components/game/GameBoard';
import Keyboard from '@/components/game/Keyboard';
import WinModal from '@/components/modals/WinModal';
import LoseModal from '@/components/modals/LoseModal';

export default function Home() {
  const loadGame = useGameStore((s) => s.loadGame);
  const hasStarted = useGameStore((s) => s.hasStarted);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

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
      <Toast />
    </main>
  );
}
