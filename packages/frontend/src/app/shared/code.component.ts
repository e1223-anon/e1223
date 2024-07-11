import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GeneratorService } from "../generator.service";

@Component({
  selector: "app-code",
  standalone: true,
  imports: [],
  templateUrl: "./code.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeComponent {
  generatorService = inject(GeneratorService);
  code = this.generatorService.code;
}
