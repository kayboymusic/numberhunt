'use client';
import { TileStatus } from '@/lib/engine/feedback';

interface GameTileProps {
  char: string;
  status?: TileStatus;
  isActive?: boolean;
  animationDelay?: number;
}

const statusStyles: Record<TileStatus, string> = {
  correct: 'bg-[#538d4e] border-[#538d4e] text-white',
  present: 'bg-[#b59f3b] border-[#b59f3b] text-white',
  absent: 'bg-[var(--tile-absent)] border-[var(--tile-absent)] text-white',
};

export default function GameTile({ char, status, isActive, animationDelay = 0 }: GameTileProps) {
  const isEmpty = !char && !status;
  const isRevealed = !!status;

  return (
    <div
      className="tile-container"
      style={{ '--delay': `${animationDelay}ms` } as React.CSSProperties}
    >
      <div className={`tile ${isRevealed ? 'flipped' : ''}`}>
        {/* Front face */}
        <div
          className={`tile-face flex items-center justify-center text-2xl font-bold font-mono uppercase select-none
            border-2 transition-colors
            ${isEmpty ? 'border-[var(--tile-empty-border)] bg-transparent text-[var(--text)]' : ''}
            ${char && !status ? (isActive ? 'border-[var(--tile-active-border)] bg-transparent text-[var(--text)] scale-[1.05]' : 'border-[var(--tile-active-border)] bg-transparent text-[var(--text)]') : ''}
          `}
        >
          {char}
        </div>
        {/* Back face (revealed) */}
        <div
          className={`tile-face tile-back flex items-center justify-center text-2xl font-bold font-mono uppercase select-none
            border-2 ${status ? statusStyles[status] : 'bg-transparent border-[var(--tile-empty-border)]'}
          `}
        >
          {char}
        </div>
      </div>
    </div>
  );
}
