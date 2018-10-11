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

  constructor(private http: HttpClient) {}

  // getShowsInfo(): ShowsInfo {
  //   return ShowsInfoResult;
  // }

  getShowsInfo(): Observable<ShowsInfo> {
    // return this.http.get<ShowsInfo>(this.showsInfoUrl).pipe(
    //   tap(heroes => this.log("fetched heroes")),
    //   catchError(this.handleError("getHeroes", []))
    // );

    return this.http.get<ShowsInfo>(this.showsInfoUrl);
    // return this.http.get<ShowsInfo>(this.showsInfoGithubUrl);
  }

  putShowsInfo(showsInfo: ShowsInfo): Observable<ShowsInfo> {
    return this.http.put<ShowsInfo>(this.showsInfoUrl, showsInfo);
  }
}
