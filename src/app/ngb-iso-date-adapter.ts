import { NgbDateStruct, NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";
// import { isNumber } from "@ng-bootstrap/ng-bootstrap/util";
import { Injectable } from "@angular/core";
import { isNumber } from "util";

function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return "";
  }
}

@Injectable()
export class NgbIsoDateAdapter extends NgbDateAdapter<string> {
  fromModel(date: string): NgbDateStruct {
    const parsedDate = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(date);
    if (parsedDate) {
      return <NgbDateStruct>{
        year: Number(parsedDate[1]),
        month: Number(parsedDate[2]),
        day: Number(parsedDate[3])
      };
    } else {
      return null;
    }
  }
  toModel(date: NgbDateStruct): string {
    if (date) {
      return (
        date.year + "-" + padNumber(date.month) + "-" + padNumber(date.day)
      );
    } else {
      return null;
    }
  }
}
