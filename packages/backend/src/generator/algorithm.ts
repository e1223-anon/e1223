const biasWeight = 20;
const alphabetString = 'abcdefghijklmnopqrstuvwxyz';

export function generateGrid(bias: string | undefined): string {
  let candidates = alphabetString;
  const cells = [];
  if (bias) {
    cells.push(...bias.repeat(biasWeight).split(''));
    candidates = candidates.replace(bias, '');
  }

  while (cells.length < 100) {
    cells.push(getRandomChar(candidates));
  }

  return shuffle(cells).join('');
}

export function generateCode(grid: string, seconds: number): string {
  const posA = Math.floor(seconds / 10);
  const posB = seconds % 10;

  const charA = grid[posA * 10 + posB];
  const charB = grid[posA + posB * 10];

  const charACount = charCount(grid, charA);
  const charBCount = charCount(grid, charB);

  return `${divideUntilSingleDigit(charACount)}${divideUntilSingleDigit(charBCount)}`;
}

function getRandomChar(candidates: string): string {
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}

// Ref: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(cells: string[]): string[] {
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  return cells;
}

function charCount(grid: string, char: string): number {
  let count = 0;
  for (const c of grid) {
    if (c === char) {
      count++;
    }
  }
  return count;
}

function divideUntilSingleDigit(charACount: number): number {
  let divisor = 2;
  let result = charACount;
  while (result >= 10) {
    result = Math.floor(charACount / divisor);
    ++divisor;
  }
  return result;
}
