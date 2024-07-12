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
  it('should generate a 2 digit code', () => {
    expect(generateCode('a'.repeat(100), 0)).toEqual('99');
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
