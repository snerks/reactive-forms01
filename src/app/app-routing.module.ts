import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ProfileEditorComponent } from "./profile-editor/profile-editor.component";
import { HomeComponent } from "./home/home.component";
import { ShowlistComponent } from "./showlist/showlist.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "create", component: ProfileEditorComponent },
  { path: "list", component: ShowlistComponent }
  //   { path: "detail/:id", component: HeroDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}