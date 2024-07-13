import { Injectable } from '@nestjs/common';
import { GeneratorStateDao } from '@p1223/shared';
import { generateCode, generateGrid } from './algorithm';

interface State {
  bias?: string;
  configLockedUntil: number;
  expiresAtMs: number;
  grid: string;
  code: string;
}
@Injectable()
export class GeneratorService {
  private generators = new Map<string, State>();

  async setConfig(
    genId: string,
    bias: string | undefined,
  ): Promise<
    | { result: 'ok'; dao: GeneratorStateDao }
    | { result: 'error'; reason: 'config-throttle' }
  > {
    const existing = this.generators.get(genId);
    const now = Date.now();

    if (existing && existing.configLockedUntil > now) {
      return { result: 'error', reason: 'config-throttle' };
    }
    const grid = generateGrid(bias);
    const code = generateCode(grid, new Date().getSeconds());
    const state = this.generate({ bias });

    this.generators.set(genId, state);
    return {
      result: 'ok',
      dao: {
        grid,
        code,
        expiresInMs: remainingTime(now, state.expiresAtMs),
        configAllowedInMs: remainingTime(now, state.configLockedUntil),
      },
    };
  }

  async get(genId: string): Promise<GeneratorStateDao | undefined> {
    let state = this.generators.get(genId);
    if (!state) {
      return undefined;
    }
    const expires = remainingTime(Date.now(), state.expiresAtMs);
    if (expires === 0) {
      state = this.generate(state);
      this.generators.set(genId, state);
    }

    return this.exportState(state);
  }

  private generate(state?: Partial<State>): State {
    const now = Date.now();
    const grid = generateGrid(state?.bias);
    const code = generateCode(grid, new Date().getSeconds());

    return {
      expiresAtMs: now + 1000 * 2,
      configLockedUntil: state?.configLockedUntil || now + 1000 * 4,
      bias: state?.bias,
      grid,
      code,
    };
  }

  private exportState(state: State): GeneratorStateDao {
    return {
      grid: state.grid,
      code: state.code,
      configAllowedInMs: remainingTime(Date.now(), state.configLockedUntil),
      expiresInMs: remainingTime(Date.now(), state.expiresAtMs),
    };
  }
}

function remainingTime(now: number, to: number) {
  const result = Math.max(0, to - now);
  return result;
}
