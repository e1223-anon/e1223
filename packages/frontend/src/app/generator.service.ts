import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { GeneratorPutReturn, GeneratorStateDao } from "@p1223/shared";
import { catchError, of, startWith, Subject, switchMap } from "rxjs";

const generatorId = "default";
const endpointUrl = "/api/generator/" + generatorId;

interface State {
  runState: "not-started" | "running";
  dao: GeneratorStateDao;
}

const defaultState: State = {
  runState: "not-started",
  dao: {
    grid: " ".repeat(100),
    code: "--",
  },
};

@Injectable({
  providedIn: "root",
})
export class GeneratorService {
  private state = signal<State>(defaultState);
  private http = inject(HttpClient);

  grid = computed(() => this.state().dao.grid);

  runState = computed(() => this.state().runState);
  code = computed(() => this.state().dao.code);

  private triggerReload = new Subject<void>();
  constructor() {
    this.triggerReload
      .pipe(
        startWith(undefined),
        switchMap(() => this.http.get<GeneratorStateDao>(endpointUrl)),
        catchError(() => of(defaultState.dao)),
        takeUntilDestroyed(),
      )
      .subscribe((dao) => {
        this.state.set({ dao, runState: "running" });
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
        this.state.set({ dao, runState: "running" });
      });
  }
}
