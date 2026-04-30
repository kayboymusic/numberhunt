'use client';
import GameTile from './GameTile';
import { TileStatus } from '@/lib/engine/feedback';

interface GameRowProps {
  guess: string;
  statuses?: TileStatus[];
  isActive?: boolean;
}

export default function GameRow({ guess, statuses, isActive }: GameRowProps) {
  const tiles = Array.from({ length: 8 }, (_, i) => ({
    char: guess[i] ?? '',
    status: statuses?.[i],
  }));

  return (
    <div className="flex gap-1.5">
      {tiles.map((tile, i) => (
        <GameTile
          key={i}
          char={tile.char}
          status={tile.status}
          isActive={isActive && i === guess.length - 1}
          animationDelay={i * 80}
        />
      ))}
    </div>
  );
}
