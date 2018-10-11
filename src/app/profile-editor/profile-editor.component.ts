import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";
import { NgbIsoDateAdapter } from "../ngb-iso-date-adapter";

@Component({
  selector: "app-profile-editor",
  templateUrl: "./profile-editor.component.html",
  styleUrls: ["./profile-editor.component.css"],
  providers: [{ provide: NgbDateAdapter, useClass: NgbIsoDateAdapter }]
})
export class ProfileEditorComponent implements OnInit {
  // profileForm = new FormGroup({
  //   firstName: new FormControl(""),
  //   lastName: new FormControl(""),
  //   address: new FormGroup({
  //     street: new FormControl(""),
  //     city: new FormControl(""),
  //     state: new FormControl(""),
  //     zip: new FormControl("")
  //   })
  // });

  // {
  //   "addedDate": "2018-10-11",
  //   "isSoldOut": false,
  //   "isCancelled": false,
  //   "date": "2019-05-10",
  //   "venue": "Bristol Fiddlers",
  //   "artists": [
  //     {
  //       "name": "Wreckless Eric"
  //     }
  //   ]
  // }

  profileForm = this.fb.group({
    venue: ["", Validators.required],
    date: ["", Validators.required],
    artists: this.fb.array([
      this.fb.group({
        name: ["", Validators.required]
      })
    ]),

    isSoldOut: [false],
    isCancelled: [false]

    // address: this.fb.group({
    //   street: [""],
    //   city: [""],
    //   state: [""],
    //   zip: [""]
    // }),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }

  get profileFormJson() {
    return JSON.stringify(this.profileForm.value, null, 2);
  }

  get artists() {
    return this.profileForm.get("artists") as FormArray;
  }

  // addArtist() {
  //   this.artists.push(
  //     this.fb.array([
  //       this.fb.group({
  //         name: ["", Validators.required]
  //       })
  //     ])
  //   );
  // }

  addArtist() {
    this.artists.push(
      this.fb.group({
        name: ["", Validators.required]
      })
    );
  }
}
