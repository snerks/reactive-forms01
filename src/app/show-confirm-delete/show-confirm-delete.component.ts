import { Component, OnInit } from "@angular/core";
import { ShowsInfo, Show } from "../models";
import { ActivatedRoute, Router } from "@angular/router";
import { ShowService } from "../show.service";

@Component({
  selector: "app-show-confirm-delete",
  templateUrl: "./show-confirm-delete.component.html",
  styleUrls: ["./show-confirm-delete.component.css"]
})
export class ShowConfirmDeleteComponent implements OnInit {
  showsInfo: ShowsInfo;
  isUpdating: boolean;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService
  ) {}

  ngOnInit() {
    // this.getShowsInfo();

    const getSuccessFn = (showsInfo: ShowsInfo) => {
      // console.log("getShowsInfo:getSuccessFn");
      // console.log(showsInfo);

      this.showsInfo = showsInfo;
    };

    const getErrorFn = (error: any) => {
      // console.log("getShowsInfo:errorFn");
      // console.log(error);

      this.errorMessage = error.message;
    };

    const getCompleteFn = () => {
      // console.log("getShowsInfo:completeFn");
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

  cancelDeleteShow() {
    this.router.navigate(["/list"]);
  }

  deleteShow() {
    this.isUpdating = true;
    this.errorMessage = null;

    // const showJson = this.profileFormJson;
    // const show = JSON.parse(showJson);

    // const isCleanupRequired = false;

    // if (!show.id) {
    //   show.id = this.getNewGuidV4();
    // }

    const getSuccessFn = (showsInfo: ShowsInfo) => {
      // console.log("getShowsInfo:getSuccessFn");
      // console.log(showsInfo);

      // showsInfo.shows.forEach(showForUuid => {
      //   if (!showForUuid.id) {
      //     showForUuid.id = this.getNewGuidV4();
      //   }

      //   if (!showForUuid.addedDate) {
      //     // Month is zero-based : 8 = Sept
      //     showForUuid.addedDate = new Date(2018, 8, 17, 12, 0, 0);
      //   }
      // });

      showsInfo.lastUpdated = new Date();

      // if (!isCleanupRequired) {
      //   showsInfo.shows.push(show);
      // }

      // if (!isCleanupRequired) {
      //   const showToUpdate = showsInfo.shows.find(
      //     showToFind => showToFind.id === show.id
      //   );

      //   if (showToUpdate) {
      //     showToUpdate.date = show.date;
      //     showToUpdate.venue = show.venue;

      //     showToUpdate.artists = show.artists;

      //     showToUpdate.isSoldOut = show.isSoldOut;
      //     showToUpdate.isCancelled = show.isCancelled;
      //   }
      // }

      // this.sortShows(showsInfo);

      const nextShows = showsInfo.shows.filter(
        showToDelete => showToDelete.id !== this.show.id
      );

      showsInfo.shows = nextShows;

      const putSuccessFn = (nextShowsInfo: ShowsInfo) => {
        // console.log("putShowsInfo:successFn");
        // console.log(nextShowsInfo);

        this.showsInfo = nextShowsInfo;

        this.router.navigate(["/list"]);
      };

      const putErrorFn = (error: any) => {
        // console.log("putShowsInfo:errorFn");
        // console.log(error);

        this.errorMessage = error.message;
      };

      const putCompleteFn = () => {
        // console.log("putShowsInfo:completeFn");

        this.isUpdating = false;
      };

      // if (isCleanupRequired) {
      //   const cleanedShows = showsInfo.shows.filter(
      //     showToFilter =>
      //       !showToFilter.artists.some(
      //         artist =>
      //           artist.name === "Frank Sinatra" ||
      //           artist.name === "Led Zeppelin"
      //       )
      //   );

      //   showsInfo.shows = cleanedShows;
      // }

      this.showService
        .putShowsInfo(showsInfo)
        .subscribe(putSuccessFn, putErrorFn, putCompleteFn);
    };

    const getErrorFn = (error: any) => {
      // console.log("getShowsInfo:errorFn");
      // console.log(error);

      this.isUpdating = false;
      this.errorMessage = error.message;
    };

    const getCompleteFn = () => {
      // console.log("getShowsInfo:completeFn");
      this.isUpdating = false;
    };

    this.showService
      .getShowsInfo()
      .subscribe(getSuccessFn, getErrorFn, getCompleteFn);
  }
}
