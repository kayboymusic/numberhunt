import type { TileStatus } from '../engine/feedback';
import type { GameMode, GameStatus } from '../store/gameStore';

const EMOJI: Record<TileStatus, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
};

interface BuildShareTextArgs {
  gameStatus: GameStatus;
  mode: GameMode;
  guesses: string[];
  statuses: TileStatus[][];
  origin: string;
}

export function buildShareText({ gameStatus, mode, guesses, statuses, origin }: BuildShareTextArgs): string {
  const date = new Date().toLocaleDateString();
  const grid = statuses.map((row) => row.map((s) => EMOJI[s]).join('')).join('\n');

  if (gameStatus === 'won') {
    return [
      `NumberHunt ${date} (${mode})`,
      `${guesses.length}/6`,
      '',
      grid,
      '',
      origin,
    ].join('\n');
  }

  if (gameStatus === 'lost') {
    return [
      `NumberHunt ${date} (${mode})`,
      `X/6`,
      '',
      grid,
      '',
      origin,
    ].join('\n');
  }

  return [
    `Share this play`,
    `Send a friend the link to today's numberhunt.`,
    '',
    origin,
  ].join('\n');
}
