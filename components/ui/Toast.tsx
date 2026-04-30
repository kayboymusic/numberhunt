'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/gameStore';

export default function Toast() {
  const { toast, clearToast } = useGameStore();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 1800);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
      <div className="bg-white text-[#111113] text-sm font-mono font-semibold px-4 py-2 rounded shadow-lg">
        {toast}
      </div>
    </div>
  );
}
