import { Routes } from "@angular/router";
import { GeneratorPageComponent } from "./generator/generator-page.component";

export const routes: Routes = [
  { path: "generator", component: GeneratorPageComponent },
  { path: "", redirectTo: "/generator", pathMatch: "full" },
];
