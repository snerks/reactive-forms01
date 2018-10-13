import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ShowService } from "../show.service";
import { ShowsInfo, Show } from "../models";

import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";
import { v1, v4 } from "uuid";

import { NgbIsoDateAdapter } from "../ngb-iso-date-adapter";

import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { VenueKeyMap } from "../venues-bts";

@Component({
  selector: "app-showdetail",
  templateUrl: "./showdetail.component.html",
  styleUrls: ["./showdetail.component.css"],
  providers: [{ provide: NgbDateAdapter, useClass: NgbIsoDateAdapter }]
})
export class ShowdetailComponent implements OnInit {
  // profileForm = this.fb.group({
  //   id: [this.getNewGuidV4()],
  //   addedDate: [new Date().toISOString().substring(0, 10), Validators.required],
  //   venue: ["", Validators.required],
  //   date: ["", Validators.required],
  //   artists: this.fb.array([
  //     this.fb.group({
  //       name: ["", Validators.required]
  //     })
  //   ]),

  //   isSoldOut: [false],
  //   isCancelled: [false]
  // });

  isUpdating: boolean;
  errorMessage: string;

  knownArtists: string[] = [];

  knownArtistsSearchTerm: string;
  knownArtistsMatches: string[] = [];

  showsInfo: ShowsInfo;

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

        this.knownArtistsMatches = results;

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private showService: ShowService
  ) {}

  ngOnInit() {
    // this.getShowsInfo();

    const getSuccessFn = (showsInfo: ShowsInfo) => {
      console.log("getShowsInfo:getSuccessFn");
      console.log(showsInfo);

      this.showsInfo = showsInfo;

      this.sortShows(this.showsInfo);

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

  get show(): Show {
    if (!this.showsInfo) {
      return null;
    }

    const { shows } = this.showsInfo;
    const id = this.route.snapshot.paramMap.get("id");

    const results = shows.filter(show => show.id === id);

    if (results.length) {
      return results[0];
    }

    return null;
  }

  get profileForm(): FormGroup {
    if (!this.show) {
      return this.fb.group({
        id: [this.getNewGuidV4()],
        addedDate: [
          new Date().toISOString().substring(0, 10),
          Validators.required
        ],
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
    }

    // const dateString = new Date(this.show.date); // .toISOString().substring(0, 10);
    const dateString = new Date(this.show.date).toISOString().substring(0, 10);
    // const dateString = "";

    const showFormGroup = this.fb.group({
      id: [this.show.id],
      // addedDate: [
      //   this.show.addedDate
      //     ? this.show.addedDate.toISOString().substring(0, 10)
      //     : new Date().toISOString().substring(0, 10),
      //   Validators.required
      // ],
      venue: [this.show.venue, Validators.required],
      date: [dateString, Validators.required],

      // artists: this.fb.array([
      //   this.fb.group({
      //     name: ["", Validators.required]
      //   })
      // ]),

      artists: this.fb.array(
        this.show.artists.map(artist =>
          this.fb.group({ name: [artist.name, Validators.required] })
        )
      ),

      isSoldOut: [this.show.isSoldOut],
      isCancelled: [this.show.isCancelled]
    });

    return showFormGroup;
  }

  getShowsInfo(): void {
    this.showService
      .getShowsInfo()
      .subscribe(showsInfo => (this.showsInfo = showsInfo));
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    // console.warn(this.profileForm.value);
  }

  flattenNestedArray<T>(array: T[][]): T[] {
    const flat = [].concat(...array);
    return flat.some(Array.isArray) ? this.flattenNestedArray(flat) : flat;
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

  isRecentlyAdded = (show: Show, thresholdInDays = 1) => {
    if (!show.addedDate) {
      return false;
    }

    const addedDate = new Date(show.addedDate);
    const currentDate = new Date();

    const millisecondsSinceAdded = currentDate.getTime() - addedDate.getTime();

    // const thresholdInDays = 3;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const thresholdInMilliseconds = thresholdInDays * millisecondsPerDay;

    const result = millisecondsSinceAdded < thresholdInMilliseconds;

    return result;

    // tslint:disable-next-line:semicolon
  };

  get addedTodayShows(): Show[] {
    if (!this.showsInfo) {
      return [];
    }

    return this.showsInfo.shows.filter(show => {
      return this.isRecentlyAdded(show, 1);
    });
  }

  get addedWithin3DaysShows(): Show[] {
    if (!this.showsInfo) {
      return [];
    }

    return this.showsInfo.shows.filter(show => {
      return this.isRecentlyAdded(show, 3);
    });
  }

  get addedWithin7DaysShows(): Show[] {
    if (!this.showsInfo) {
      return [];
    }

    return this.showsInfo.shows.filter(show => {
      return this.isRecentlyAdded(show, 7);
    });
  }

  submitShow() {
    this.isUpdating = true;
    this.errorMessage = null;

    const showJson = this.profileFormJson;
    const show = JSON.parse(showJson);

    const isCleanupRequired = false;

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

        if (!showForUuid.addedDate) {
          // Month is zero-based : 8 = Sept
          showForUuid.addedDate = new Date(2018, 8, 17, 12, 0, 0);
        }
      });

      showsInfo.lastUpdated = new Date();

      if (!isCleanupRequired) {
        showsInfo.shows.push(show);
      }

      this.sortShows(showsInfo);

      const putSuccessFn = (nextShowsInfo: ShowsInfo) => {
        console.log("putShowsInfo:successFn");
        console.log(nextShowsInfo);

        this.showsInfo = nextShowsInfo;
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

      if (isCleanupRequired) {
        const cleanedShows = showsInfo.shows.filter(
          showToFilter =>
            !showToFilter.artists.some(
              artist =>
                artist.name === "Frank Sinatra" ||
                artist.name === "Led Zeppelin"
            )
        );

        showsInfo.shows = cleanedShows;
      }

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

      // const result = lhsDate.getTime() - rhsDate.getTime();
      const lhsTime = lhsDate.getTime();
      const rhsTime = rhsDate.getTime();

      if (lhsTime === rhsTime) {
        return lhs.id < rhs.id ? -1 : lhs.id > rhs.id ? 1 : 0;
      } else {
        return lhsTime - rhsTime;
      }
    });
  }
}
