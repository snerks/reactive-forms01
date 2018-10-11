import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NameEditorComponent } from "./name-editor/name-editor.component";

@NgModule({
  declarations: [AppComponent, NameEditorComponent],
  imports: [NgbModule, BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
