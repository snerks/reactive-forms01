import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ProfileEditorComponent } from "./profile-editor/profile-editor.component";
import { HomeComponent } from "./home/home.component";
import { ShowlistComponent } from "./showlist/showlist.component";
import { ShowdetailComponent } from "./showdetail/showdetail.component";
import { ShowConfirmDeleteComponent } from "./show-confirm-delete/show-confirm-delete.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "create", component: ProfileEditorComponent },
  { path: "list/:days", component: ShowlistComponent },
  { path: "detail/:id", component: ShowdetailComponent },
  // { path: "detail", component: ShowdetailComponent }
  { path: "showconfirmdelete/:id", component: ShowConfirmDeleteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
