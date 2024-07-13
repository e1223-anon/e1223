import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { GeneratorPutReturn, GeneratorStateDao } from "@p1223/shared";
import { catchError, EMPTY, startWith, Subject, switchMap, timer } from "rxjs";
import { EventsService } from "./events.service";

const generatorId = "default";
const endpointUrl = "/api/generator/" + generatorId;

interface State {
  runState: "not-started" | "running";
  dao: GeneratorStateDao;
}

const defaultState: State = {
  runState: "not-started",
  dao: {
    configAllowedInMs: 0,
    expiresInMs: 0,
    grid: " ".repeat(100),
    code: "--",
  },
};

@Injectable({
  providedIn: "root",
})
export class GeneratorService {
  private http = inject(HttpClient);
  private events = inject(EventsService);

  private state = signal<State>(defaultState);
  private reloadAgainAfter = new Subject<number>();

  grid = computed(() => this.state().dao.grid);
  runState = computed(() => this.state().runState);
  code = computed(() => this.state().dao.code);
  configThrottled = computed(() => this.state().dao.configAllowedInMs > 0);

  constructor() {
    this.reloadAgainAfter
      .pipe(
        startWith(0),
        switchMap((delay) => timer(delay)),
        switchMap(() =>
          this.http
            .get<GeneratorStateDao>(endpointUrl)
            .pipe(catchError(() => EMPTY)),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((dao) => {
        this.applyState(dao);
      });
  }

  async generate(bias: string | undefined) {
    if (bias && bias.length !== 1) {
      throw new Error("Bias must be a single character");
    }

    this.http
      .put<GeneratorPutReturn>(endpointUrl, { bias })
      .pipe()
      .subscribe((dao) => {
        this.applyState(dao);
      });
  }

  private applyState(dao: GeneratorStateDao) {
    this.reloadAgainAfter.next(dao.expiresInMs);
    this.state.set({ dao, runState: "running" });
  }
}
