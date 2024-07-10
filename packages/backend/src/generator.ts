export interface Grid {
  rows: number;
  cols: number;
  value: string;
}

export class Generator {
  async setBias(char: string) {}

  async getValue(): Promise<Grid> {
    return {
      rows: 10,
      cols: 10,
      value: "a".repeat(100),
    };
  }
}

export const generator: Generator = new Generator();
