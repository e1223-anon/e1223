import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { GeneratorGet, GeneratorPutReturn, Grid } from "@p1223/shared";

const generatorId = "default";
const endpointUrl = "/api/generator/" + generatorId;

interface State {
  grid: Grid;
  code: string;
}

@Injectable({
  providedIn: "root",
})
export class GeneratorService {
  private state = signal<State>({
    grid: {
      data: "a".repeat(100),
      cols: 10,
      rows: 10,
    },
    code: "42",
  });
  private http = inject(HttpClient);

  grid = computed(() => {
    const g = this.state().grid;
    return {
      ...g,
      data: g.data.split(""),
    };
  });

  code = computed(() => this.state().code);

  constructor() {
    this.http.get<GeneratorGet>(endpointUrl).subscribe((r) => {
      this.state.set(r);
    });
  }

  async generate(bias: string | undefined) {
    if (bias && bias.length !== 1) {
      throw new Error("Bias must be a single character");
    }

    this.http
      .put<GeneratorPutReturn>(endpointUrl, { bias })
      .pipe()
      .subscribe((r) => {
        this.state.set(r);
      });
  }
}
