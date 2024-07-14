import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { GeneratorPutReturn, GeneratorStateDao } from "@p1223/shared";
import { environment } from "../environments/environment";
import { createEventsSocket } from "./events-socket";

const endpointUrl = `${environment.backendUrl}/api/generator/default`;

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
  private events = createEventsSocket<GeneratorStateDao>("generator-events");

  private state = signal<State>(defaultState);

  grid = computed(() => this.state().dao.grid);
  runState = computed(() => this.state().runState);
  code = computed(() => this.state().dao.code);
  live = computed(() => this.events.connected());
  configThrottled = computed(() => this.state().dao.configAllowedInMs > 0);

  constructor() {
    this.http.get<GeneratorStateDao>(endpointUrl).subscribe((dao) => {
      this.applyState(dao);
    });

    this.events.eventStream.subscribe(({ data }) => {
      this.applyState(data);
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
    this.state.set({ dao, runState: "running" });
  }
}
