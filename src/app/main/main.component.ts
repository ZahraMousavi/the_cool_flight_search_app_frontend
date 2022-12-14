import { Component } from '@angular/core';
import { AmadeusService } from '../amadeus.service'
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {EMPTY} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent{
  from: any = "";
  fromLocation: any = [];
  origin: any;

  to: any = "";
  toLocation: any = [];
  destination: any;

  date: any = "";

  flights: any;
  flightTemplate: boolean = false;

  booked: boolean = false;

  first: string = "";
  last: string= "";

  wait: boolean = false;

  constructor(
    private amadeusService: AmadeusService,
  ) {
  }

  getFromLocation = () => {
    if (this.from.length > 3) {
      this.amadeusService.getCityAndAirport(this.from).pipe(
        // @ts-ignore
        tap(jsonResponse => this.fromLocation = jsonResponse.data),
        tap(() => {
          let location_from_list = document.querySelector(".location_from .mat-grid-tile-content");
          if (location_from_list){
            // @ts-ignore
            location_from_list.style.overflowY = 'scroll';
          }
          let location_row = document.querySelector("#location");
          if (location_row){
            // @ts-ignore
            location_row.style.display = 'block';
          }
        }),
        catchError(error => this.handleError(error)),
      ).subscribe();
    }
  };

  getOrigin = (location: any) => {
    this.origin = location;
    this.from = location.name + ' (' + location.subType + ')';
    this.fromLocation = [];
    let location_from_list = document.querySelector(".location_from .mat-grid-tile-content");
    if (location_from_list){
      // @ts-ignore
      location_from_list.style.overflowY = 'auto';
    }
    let location_list = document.querySelector("#location");
    if (location_list){
      // @ts-ignore
      location_list.style.display = 'none';
    }
  };

  getToLocation = () => {
    if (this.to.length > 3) {
      this.amadeusService.getCityAndAirport(this.to).pipe(
        // @ts-ignore
        tap(jsonResponse => this.toLocation = jsonResponse.data),
        tap(() => {
          let location_to_list = document.querySelector(".location_to .mat-grid-tile-content");
          if (location_to_list){
            // @ts-ignore
            location_to_list.style.overflowY = 'scroll';
          }
          let location_row = document.querySelector("#location");
          if (location_row){
            // @ts-ignore
            location_row.style.display = 'block';
          }
        }),
        catchError(error => this.handleError(error)),
      ).subscribe();
    }
  };

  getDestination = (location: any) => {
    this.destination = location;
    this.to = location.name + ' (' + location.subType + ')';
    this.toLocation = [];
    let location_to_list = document.querySelector(".location_to .mat-grid-tile-content");
    if (location_to_list){
      // @ts-ignore
      location_to_list.style.overflowY = 'auto';
    }
    let location_row = document.querySelector("#location");
    if (location_row){
      // @ts-ignore
      location_row.style.display = 'none';
    }
  };


  onFindFlight = () =>  {
    if (this.origin?.iataCode === undefined) {
      alert("Please choose a from airport")
    }
    else if (this.destination?.iataCode === undefined) {
      alert("Please choose a to airport")
    }
    else if (this.date === "" || this.date === null) {
      alert("Please choose a date")
    }
    else {
      this.wait = true;
      this.amadeusService.getFlights(this.origin.iataCode, this.destination.iataCode, this.date.format("YYYY-MM-DD")).pipe(
        tap(() => this.wait = false),
        // @ts-ignore
        tap(jsonResponse => this.flights = jsonResponse.data),
        tap(() => this.flightTemplate = true),
        catchError(error => this.handleError(error)),
      ).subscribe();
    }

  };

  onBookFlight = (event: any) => {
    const data = { flight: event.flight };
    const name = {
      first: event.first,
      last: event.last
    };
    const dataForBookingFlight = { flight: event.flight, name: name };
    this.amadeusService.confirmFlight(data).pipe(
      catchError(error => this.handleError(error)),
      switchMap(()=>this.amadeusService.bookFlight(dataForBookingFlight)),
      tap(() => this.booked  = true),
      tap(() => this.flightTemplate = false),
      tap(() => this.flights = []),
      catchError(error => this.handleError(error)),
    ).subscribe();
  };


  // @ts-ignore
  handleError = (error) => {
    console.error(error.message);
    return EMPTY;
  }

}
