import { Injectable } from '@nestjs/common';
import { Grid } from '@p1223/shared';

@Injectable()
export class GeneratorService {
  private generators = new Map<string, Grid>();

  async setConfig(genId: string, char: string | undefined): Promise<Grid> {
    const generator = {
      rows: 10,
      cols: 10,
      data: (char || 'x').repeat(100),
    };
    this.generators.set(genId, generator);
    return generator;
  }

  async get(genId: string): Promise<Grid | undefined> {
    return this.generators.get(genId);
  }
}
