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

  tableData = computed(() => {
    const grid = this.generatorService.grid();
    const data = new Array<string[]>(grid.rows);
    for (let i = 0; i < grid.rows; i++) {
      data[i] = grid.data.slice(i * grid.cols, (i + 1) * grid.cols);
    }
    return data;
  });

  generate() {
    this.generatorService.generate(this.bias());
  }
}
