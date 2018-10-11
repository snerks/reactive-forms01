import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";
import { NgbIsoDateAdapter } from "../ngb-iso-date-adapter";
import { ShowService } from "../show.service";
import { ShowsInfo } from "../models";

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
    addedDate: [new Date().toISOString().substring(0, 10), Validators.required],
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

  isUpdating: boolean;
  errorMessage: string;

  constructor(private fb: FormBuilder, private showService: ShowService) {}

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

  submitShow() {
    this.isUpdating = true;
    this.errorMessage = null;

    const showJson = this.profileFormJson;
    const show = JSON.parse(showJson);

    const getSuccessFn = (showsInfo: ShowsInfo) => {
      console.log("getShowsInfo:getSuccessFn");
      console.log(showsInfo);

      showsInfo.lastUpdated = new Date();
      showsInfo.shows.push(show);

      const putSuccessFn = (nextShowsInfo: ShowsInfo) => {
        console.log("putShowsInfo:successFn");
        console.log(nextShowsInfo);
      };

      const putErrorFn = (error: any) => {
        console.log("putShowsInfo:errorFn");
        console.log(error);

        this.errorMessage = error.message;
      };

      const putCompleteFn = () => {
        console.log("putShowsInfo:completeFn");
        this.isUpdating = false;
      };

      this.showService
        .putShowsInfo(showsInfo)
        .subscribe(putSuccessFn, putErrorFn, putCompleteFn);
    };

    const getErrorFn = (error: any) => {
      console.log("getShowsInfo:errorFn");
      console.log(error);
      this.isUpdating = false;
      this.errorMessage = error.message;
    };

    const getCompleteFn = () => {
      console.log("getShowsInfo:completeFn");
      this.isUpdating = false;
    };

    // this.showService.getShowsInfo().subscribe(showsInfo => {
    //   console.log("getShowsInfo:subscribe");
    //   console.log(showsInfo);

    //   showsInfo.shows.push(show);

    //   const putSuccessFn = (nextShowsInfo: ShowsInfo) => {
    //     console.log("putShowsInfo:successFn");
    //     console.log(nextShowsInfo);

    //     // this.isUpdating = false;
    //   };

    //   const putErrorFn = (error: any) => {
    //     console.log("putShowsInfo:errorFn");
    //     console.log(error);

    //     // this.isUpdating = false;
    //   };

    //   const putCompleteFn = () => {
    //     console.log("putShowsInfo:completeFn");
    //     this.isUpdating = false;
    //   };

    //   this.showService
    //     .putShowsInfo(showsInfo)
    //     .subscribe(putSuccessFn, putErrorFn, putCompleteFn);
    // });

    this.showService
      .getShowsInfo()
      .subscribe(getSuccessFn, getErrorFn, getCompleteFn);
  }
}
