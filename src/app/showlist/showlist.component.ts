import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { ShowsInfo, Show } from "../models";
import { ShowService } from "../show.service";

@Component({
  selector: "app-showlist",
  templateUrl: "./showlist.component.html",
  styleUrls: ["./showlist.component.css"]
})
export class ShowlistComponent implements OnInit {
  showsInfo: ShowsInfo;

  artistsSearchTerm?: string;

  showPastEvents: boolean;

  constructor(private showService: ShowService) {}

  ngOnInit() {
    this.getShowsInfo();
  }

  getShowsInfo(): void {
    this.showService
      .getShowsInfo()
      .subscribe(showsInfo => (this.showsInfo = showsInfo));
  }

  get inDateRangeShows(): Show[] {
    const { shows } = this.showsInfo;

    if (this.showPastEvents) {
      return shows;
    }

    const results = shows.filter(this.dateRangeShowFilter);

    return results;
  }

  dateRangeShowFilter = (show: Show) => {
    const currentDateTime = new Date();

    let willShowEvent = false;

    if (this.showPastEvents) {
      willShowEvent = true;
    } else {
      const eventDate = new Date(show.date);
      const eventDateEndOfDay = moment(eventDate).endOf("day");

      const isPastEvent = eventDateEndOfDay.isBefore(currentDateTime);

      willShowEvent = !isPastEvent;
    }

    return willShowEvent;
    // tslint:disable-next-line:semicolon
  };

  get artistFilterShows(): Show[] {
    const results = this.inDateRangeShows.filter(show => {
      if (!this.artistsSearchTerm) {
        return true;
      }

      const showArtistsText = show.artists.reduce(
        (previousArtistsResult, currentArtist, currentArtistIndex) => {
          const currentArtistText = currentArtist.name;

          return currentArtistIndex === 0
            ? currentArtistText
            : previousArtistsResult + " " + currentArtistText;
        },
        ""
      );

      return (
        showArtistsText
          .toLowerCase()
          .indexOf(this.artistsSearchTerm.toLowerCase()) > -1
      );
    });

    return results;
  }

  get sortedShows(): Show[] {
    const results = this.artistFilterShows.sort((lhs: Show, rhs: Show) => {
      const lhsDate = new Date(lhs.date);
      const rhsDate = new Date(rhs.date);

      const result = lhsDate.getTime() - rhsDate.getTime();

      return result;
    });

    return results;
  }
}
