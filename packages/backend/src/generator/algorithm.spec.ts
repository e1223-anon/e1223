import { generateCode, generateGrid } from './algorithm';

const expectedChars = 'abcdefghijklmnopqrstuvwxyz';

describe('grid algorithm', () => {
  it('should be 100 characters long', () => {
    expect(generateGrid(undefined)).toHaveLength(100);
  });

  it('should include the bias exactly 20 times in the grid', () => {
    expect(generateGrid('j').match(/j/g)?.length).toBe(20);
  });

  describe('randomness [undeterministic]', () => {
    // todo: use a seedable RNG and make this test deterministic
    // todo: refactor so there are fewer tests or change reporter
    let characterCountMap: Record<string, number>;
    beforeAll(() => {
      characterCountMap = generateToCharCountMap(1000);
    });

    const normalDistExpected = (1000 * 100) / 26;

    it.each(expectedChars.split(''))(`'%s' min count `, (char) => {
      expect(characterCountMap[char]).toBeGreaterThan(normalDistExpected * 0.7);
    });

    it.each(expectedChars.split(''))(`'%s' max count`, (char) => {
      expect(characterCountMap[char]).toBeLessThan(normalDistExpected * 1.3);
    });
  });
});

describe('code algorithm', () => {
  it('should generate the code in the example', () => {
    const grid = gridWithProperties({
      fixed: [
        { x: 3, y: 6, c: 'v' },
        { x: 6, y: 3, c: 'c' },
      ],
      bias: [
        { c: 'v', count: 7 },
        { c: 'c', count: 9 },
      ],
      default: 'x',
    });
    dumpGridOnFailure(grid, () => {
      expect(generateCode(grid, 36)).toEqual('79');
    });
  });

  it('should divide the count to always be a 2 digit code', () => {
    const grid = gridWithProperties({ default: 'a' });
    dumpGridOnFailure(grid, () => {
      expect(generateCode(grid, 0)).toEqual('99');
    });
  });

  it('code should be 6 for biased grid', () => {
    const grid = gridWithProperties({
      bias: [{ count: 20, c: 'a' }],
      default: 'x',
    });

    dumpGridOnFailure(grid, () => {
      expect(generateCode(grid, 0)).toEqual('x6');
    });
  });
});

function generateToCharCountMap(iterations: number) {
  const characterCountMap: Record<string, number> = {};

  for (let i = 0; i < iterations; i++) {
    const grid = generateGrid(undefined);
    for (const char of grid) {
      if (characterCountMap[char]) {
        characterCountMap[char] = characterCountMap[char] + 1;
      } else {
        characterCountMap[char] = 1;
      }
    }
  }
  return characterCountMap;
}

function gridWithProperties(props: {
  fixed?: { x: number; y: number; c: string }[];
  bias?: { count: number; c: string }[];
  default: string;
}) {
  const grid: string[][] = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }),
  );
  for (const pos of props.fixed ?? []) {
    grid[pos.x][pos.y] = pos.c;
  }
  for (const bias of props.bias ?? []) {
    const initialCount = grid.flat().filter((v) => v === bias.c).length;
    fillEmpty(grid, bias.c, bias.count - initialCount);
  }

  fillEmpty(grid, props.default, 100);
  return grid.flat().join('');
}

function fillEmpty(grid: string[][], value: string, count: number) {
  const gridCells = grid.flat().length;
  for (let i = 0; i < Math.min(gridCells, count); i++) {
    const emptyPos = grid.flat().findIndex((v) => v === undefined);
    if (emptyPos === -1) {
      return;
    }
    const row = Math.floor(emptyPos / 10);
    const col = emptyPos % 10;
    grid[row][col] = value;
  }
}

function dumpGridOnFailure(grid: string, test: () => void) {
  try {
    test();
  } catch (error) {
    dumpGrid(grid);
    throw error;
  }
}

function dumpGrid(grid: string) {
  const str = [`   01234 56789`];
  for (let i = 0; i < 10; ++i) {
    str.push(
      `${i}  ${grid.slice(i * 10, i * 10 + 5)} ${grid.slice(i * 10 + 5, i * 10 + 10)}`,
    );
  }
  console.log(str.join('\n'));
}
