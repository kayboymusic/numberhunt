export type TileStatus = 'correct' | 'present' | 'absent';

export function getFeedback(guess: string, solution: string): TileStatus[] {
  const result: TileStatus[] = new Array(8).fill('absent');
  const solutionArr = solution.split('');
  const guessArr = guess.split('');
  const solutionUsed = new Array(8).fill(false);
  const guessUsed = new Array(8).fill(false);

  // Pass 1: exact matches
  for (let i = 0; i < 8; i++) {
    if (guessArr[i] === solutionArr[i]) {
      result[i] = 'correct';
      solutionUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Pass 2: present but wrong position
  for (let i = 0; i < 8; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 8; j++) {
      if (solutionUsed[j]) continue;
      if (guessArr[i] === solutionArr[j]) {
        result[i] = 'present';
        solutionUsed[j] = true;
        break;
      }
    }
  }

  return result;
}
