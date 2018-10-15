import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";

import { ShowsInfo } from "./models";
// import { ShowsInfoResult } from "./mock-shows-info";

@Injectable({
  providedIn: "root"
})
export class ShowService {
  // private showsInfoUrl =
  //   "https://snerks.github.io/recommended-shows-ts01/recommended-shows.json";

  private showsInfoGithubUrl =
    "https://snerks.github.io/recommended-shows-ts01/recommended-shows.json";

  private showsInfoUrl = "https://api.myjson.com/bins/6blgs";
  // private showsInfoUrl = "https://api.myjson.com/bins/BOGUS";

  showsInfo: ShowsInfo = null;
  errorMessage: string;

  constructor(private http: HttpClient) {
    const getSuccessFn = (showsInfo: ShowsInfo) => {
      // console.log("getShowsInfo:getSuccessFn");
      // console.log(showsInfo);

      this.showsInfo = showsInfo;

      // this.sortShows(this.showsInfo);

      // const showsArtistNamesNested = showsInfo.shows.map(show =>
      //   show.artists.map(artist => artist.name)
      // );

      // const showsArtistNames = this.flattenNestedArray(showsArtistNamesNested);

      // // const uniqueShowsArtistNames = [...new Set(showsArtistNames)];
      // const uniqueShowsArtistNames = showsArtistNames.reduce((a, b) => {
      //   if (a.indexOf(b) < 0) {
      //     a.push(b);
      //   }
      //   return a;
      // }, []);

      // uniqueShowsArtistNames.sort();

      // this.knownArtists = uniqueShowsArtistNames;
    };

    const getErrorFn = (error: any) => {
      // console.log("getShowsInfo:errorFn");
      // console.log(error);

      this.errorMessage = error.message;
    };

    const getCompleteFn = () => {
      // console.log("getShowsInfo:completeFn");
    };

    this.getShowsInfo().subscribe(getSuccessFn, getErrorFn, getCompleteFn);
    // this.putShowsInfo().subscribe(getSuccessFn, getErrorFn, getCompleteFn);
  }

  // getShowsInfo(): ShowsInfo {
  //   return ShowsInfoResult;
  // }

  set ShowsInfo(showsInfo: ShowsInfo) {
    this.showsInfo = showsInfo;
  }

  getShowsInfo(): Observable<ShowsInfo> {
    // return this.http.get<ShowsInfo>(this.showsInfoUrl).pipe(
    //   tap(heroes => this.log("fetched heroes")),
    //   catchError(this.handleError("getHeroes", []))
    // );

    if (this.showsInfo == null) {
      return this.http.get<ShowsInfo>(this.showsInfoUrl);
      // return this.http.get<ShowsInfo>(this.showsInfoGithubUrl);
    }

    return of(this.showsInfo);
  }

  putShowsInfo(showsInfo: ShowsInfo): Observable<ShowsInfo> {
    return this.http.put<ShowsInfo>(this.showsInfoUrl, showsInfo);
  }
}
