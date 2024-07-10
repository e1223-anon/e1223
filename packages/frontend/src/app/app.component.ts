import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HelloWorld } from "@p1223/shared";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = signal("frontend");
  http = inject(HttpClient);

  ngOnInit() {
    this.http
      .get<HelloWorld>("/api")
      .subscribe((r) => this.title.update(() => r.msg));
  }
}
