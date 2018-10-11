import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NameEditorComponent } from "./name-editor/name-editor.component";
import { ProfileEditorComponent } from "./profile-editor/profile-editor.component";

@NgModule({
  declarations: [AppComponent, NameEditorComponent, ProfileEditorComponent],
  imports: [NgbModule, BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
