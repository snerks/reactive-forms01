import { Component, OnInit } from "@angular/core";
// import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";
import { v1, v4 } from "uuid";

import { NgbIsoDateAdapter } from "../ngb-iso-date-adapter";
import { ShowService } from "../show.service";
import { ShowsInfo, Show } from "../models";

import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { VenueKeyMap } from "../venues-bts";

@Component({
  selector: "app-profile-editor",
  templateUrl: "./profile-editor.component.html",
  styleUrls: ["./profile-editor.component.css"],
  providers: [{ provide: NgbDateAdapter, useClass: NgbIsoDateAdapter }]
})
export class ProfileEditorComponent implements OnInit {
  profileForm = this.fb.group({
    id: [this.getNewGuidV4()],
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
  });

  isUpdating: boolean;
  errorMessage: string;

  knownArtists: string[] = ["Led Zeppelin", "Frank Sinatra"];

  knownArtistsSearchTerm: string;

  searchKnownArtists = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => {
        this.knownArtistsSearchTerm = term;

        const results =
          term.length < 2
            ? []
            : this.knownArtists
                .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
                .slice(0, 10);

        return results;
      })
      // tslint:disable-next-line:semicolon
    );

  searchVenue = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        term =>
          term.length < 2
            ? []
            : VenueKeyMap.filter(
                kvp =>
                  kvp.venueBts.name.toLowerCase().indexOf(term.toLowerCase()) >
                  -1
              )
                .map(kvp => kvp.venueBts.name)
                .slice(0, 10)
      )
      // tslint:disable-next-line:semicolon
    );

  constructor(private fb: FormBuilder, private showService: ShowService) {}

  flattenNestedArray<T>(array: T[][]): T[] {
    const flat = [].concat(...array);
    return flat.some(Array.isArray) ? this.flattenNestedArray(flat) : flat;
  }

  ngOnInit() {
    const getSuccessFn = (showsInfo: ShowsInfo) => {
      console.log("getShowsInfo:getSuccessFn");
      console.log(showsInfo);

      const showsArtistNamesNested = showsInfo.shows.map(show =>
        show.artists.map(artist => artist.name)
      );

      const showsArtistNames = this.flattenNestedArray(showsArtistNamesNested);

      // const uniqueShowsArtistNames = [...new Set(showsArtistNames)];
      const uniqueShowsArtistNames = showsArtistNames.reduce((a, b) => {
        if (a.indexOf(b) < 0) {
          a.push(b);
        }
        return a;
      }, []);

      uniqueShowsArtistNames.sort();

      this.knownArtists = uniqueShowsArtistNames;
    };

    const getErrorFn = (error: any) => {
      console.log("getShowsInfo:errorFn");
      console.log(error);

      this.errorMessage = error.message;
    };

    const getCompleteFn = () => {
      console.log("getShowsInfo:completeFn");
    };

    this.showService
      .getShowsInfo()
      .subscribe(getSuccessFn, getErrorFn, getCompleteFn);
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    // console.warn(this.profileForm.value);
  }

  get profileFormJson() {
    return JSON.stringify(this.profileForm.value, null, 2);
  }

  get artists() {
    return this.profileForm.get("artists") as FormArray;
  }

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

    if (!show.id) {
      show.id = this.getNewGuidV4();
    }

    const getSuccessFn = (showsInfo: ShowsInfo) => {
      console.log("getShowsInfo:getSuccessFn");
      console.log(showsInfo);

      showsInfo.shows.forEach(showForUuid => {
        if (!showForUuid.id) {
          showForUuid.id = this.getNewGuidV4();
        }
      });

      showsInfo.lastUpdated = new Date();
      showsInfo.shows.push(show);

      this.sortShows(showsInfo);

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

    this.showService
      .getShowsInfo()
      .subscribe(getSuccessFn, getErrorFn, getCompleteFn);
  }

  getNewGuidV1(): string {
    const result = v1();
    return result;
  }

  getNewGuidV4() {
    const result = v4();
    return result;
  }

  sortShows(showsInfo: ShowsInfo): void {
    showsInfo.shows.sort((lhs: Show, rhs: Show) => {
      const lhsDate = new Date(lhs.date);
      const rhsDate = new Date(rhs.date);

      const result = lhsDate.getTime() - rhsDate.getTime();

      return result;
    });
  }
}
