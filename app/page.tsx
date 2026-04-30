'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import Header from '@/components/ui/Header';
import Toast from '@/components/ui/Toast';
import GameBoard from '@/components/game/GameBoard';
import Keyboard from '@/components/game/Keyboard';
import WinModal from '@/components/modals/WinModal';
import LoseModal from '@/components/modals/LoseModal';

export default function Home() {
  const loadGame = useGameStore((s) => s.loadGame);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#111113] pt-4 pb-8 px-2">
      <div className="w-full max-w-lg">
        <Header />
        <div className="flex flex-col items-center gap-6 mt-2">
          <GameBoard />
          <Keyboard />
        </div>
      </div>
      <Toast />
      <WinModal />
      <LoseModal />
    </main>
  );
}
