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
  absent: 'bg-[#3a3a3c] border-[#3a3a3c] text-white',
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
          className={`tile-face tile-front flex items-center justify-center text-2xl font-bold font-mono uppercase select-none
            border-2 transition-colors
            ${isEmpty ? 'border-[#3a3a3c] bg-transparent text-white' : ''}
            ${char && !status ? (isActive ? 'border-[#565758] bg-transparent text-white scale-[1.05]' : 'border-[#565758] bg-transparent text-white') : ''}
          `}
        >
          {char}
        </div>
        {/* Back face (revealed) */}
        <div
          className={`tile-face tile-back flex items-center justify-center text-2xl font-bold font-mono uppercase select-none
            border-2 ${status ? statusStyles[status] : 'bg-transparent border-[#3a3a3c]'}
          `}
        >
          {char}
        </div>
      </div>
    </div>
  );
}
