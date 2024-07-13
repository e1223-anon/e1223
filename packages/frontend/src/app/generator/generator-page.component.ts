import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GeneratorService } from "../generator.service";
import { CodeComponent } from "../shared/code.component";

@Component({
  selector: "app-generator-page",
  standalone: true,
  imports: [CommonModule, CodeComponent, FormsModule],
  templateUrl: "./generator-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorPageComponent {
  generatorService = inject(GeneratorService);

  bias = model<string | undefined>(undefined);

  configThrottled = this.generatorService.configThrottled;

  tableData = computed(() => {
    const grid = this.generatorService.grid();
    const rows = 10;
    const cols = 10;
    const data = new Array<string[]>(rows);
    for (let i = 0; i < rows; i++) {
      data[i] = grid.slice(i * cols, (i + 1) * cols).split("");
    }
    return data;
  });

  generate() {
    this.generatorService.generate(this.bias());
  }
}
