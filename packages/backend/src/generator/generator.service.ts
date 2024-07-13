import { Injectable } from '@nestjs/common';
import { GeneratorStateDao } from '@p1223/shared';
import { generateCode, generateGrid } from './algorithm';

interface State {
  dao: GeneratorStateDao;
}
@Injectable()
export class GeneratorService {
  private generators = new Map<string, State>();

  async setConfig(
    genId: string,
    bias: string | undefined,
  ): Promise<GeneratorStateDao> {
    const grid = generateGrid(bias);
    const code = generateCode(grid, new Date().getSeconds());
    const generator = {
      dao: {
        grid: grid,
        code,
      },
    };
    this.generators.set(genId, generator);
    return { grid, code };
  }

  async get(genId: string): Promise<GeneratorStateDao | undefined> {
    return this.generators.get(genId)?.dao;
  }
}
