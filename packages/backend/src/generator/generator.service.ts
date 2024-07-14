import { Injectable } from '@nestjs/common';
import { GeneratorStateDao } from '@p1223/shared';
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  Subject,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';
import { generateCode, generateGrid } from './algorithm';
import { GeneratorEventsGateway } from './generator-events.gateway';

const configThrottleMs = 4 * 1000;
const expiryIntervalMs = 2 * 1000;

interface GeneratorValue {
  grid: string;
  code: string;
  configuredTimestamp: number;
  generatedTimestamp: number;
}
interface State {
  configSubject: Subject<{
    bias: string | undefined;
  }>;
  value: Observable<GeneratorValue>;
  eventsSubscription: Subscription;
}

@Injectable()
export class GeneratorService {
  private generators = new Map<string, State>();
  private generatorSubject = new ReplaySubject<GeneratorStateDao>(1);

  changes = this.generatorSubject.asObservable();

  constructor(private eventGateway: GeneratorEventsGateway) {}

  async get(genId: string): Promise<GeneratorStateDao | undefined> {
    const state = this.generators.get(genId);
    if (!state) {
      return undefined;
    }

    return this.convertToDao(await firstValueFrom(state.value));
  }

  async setConfig(
    genId: string,
    bias: string | undefined,
  ): Promise<
    | { result: 'ok'; dao: GeneratorStateDao }
    | { result: 'error'; reason: 'config-throttle' }
  > {
    let generator = this.generators.get(genId);
    if (generator) {
      const value = await firstValueFrom(generator.value);

      if (value.configuredTimestamp + configThrottleMs > Date.now()) {
        return { result: 'error', reason: 'config-throttle' };
      }

      generator.configSubject.next({ bias });
    } else {
      generator = this.createGenerator(genId, bias);
    }

    return {
      result: 'ok',
      dao: this.convertToDao(await firstValueFrom(generator.value)),
    };
  }

  private createGenerator(genId: string, bias: string | undefined): State {
    const configSubject = new BehaviorSubject({
      bias,
    });

    const value = configSubject.pipe(
      map((config) => ({
        ...config,
        configuredTimestamp: Date.now(),
      })),
      switchMap((c) => timer(0, expiryIntervalMs).pipe(map(() => c))),
      map((config) => {
        const grid = generateGrid(config.bias);
        const code = generateCode(grid, new Date().getSeconds());
        return {
          grid,
          code,
          configuredTimestamp: config.configuredTimestamp,
          generatedTimestamp: Date.now(),
        };
      }),
      shareReplay(1),
    );

    const generator: State = {
      configSubject,
      value,
      eventsSubscription: value.subscribe((v) => {
        this.eventGateway.emit(genId, this.convertToDao(v));
      }),
    };

    this.generators.set(genId, generator);
    return generator;
  }

  private convertToDao(generatorValue: GeneratorValue): GeneratorStateDao {
    const now = Date.now();
    return {
      code: generatorValue.code,
      grid: generatorValue.grid,
      configAllowedInMs: remainingTime(
        now,
        generatorValue.configuredTimestamp + configThrottleMs,
      ),
      expiresInMs: remainingTime(
        now,
        generatorValue.generatedTimestamp + expiryIntervalMs,
      ),
    };
  }
}

function remainingTime(now: number, to: number) {
  const result = Math.max(0, to - now);
  return result;
}
