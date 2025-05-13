import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { ConstructorStanding } from "../models/constructor-standing.model";
import { DriverStanding } from "../models/driver-standing.model";
import { Driver } from "../models/driver.model";
import { Constructor } from "../models/constructor.model";
import { Race } from "../models/race.model";
import { Circuit } from "../models/circuit.model";

@Injectable({
  providedIn: 'root'
})
export class JolpicaF1Service {
  private httpClient = inject(HttpClient);
  private baseUrl = 'https://api.jolpi.ca/ergast/f1';
  private season = '2025';

  // TeamsComponent + DriverDetailComponent
  getDriverStandingsSeason(): Observable<{ round: number; standings: DriverStanding[] }> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/driverstandings.json`).pipe(
      map(res => {
        const list = res.MRData.StandingsTable.StandingsLists[0];
        return {
          round: parseInt(list?.round ?? '0', 10),
          standings: list?.DriverStandings ?? []
        };
      })
    );
  }

  // TeamsComponent
  getConstructorStandingsSeason(): Observable<ConstructorStanding[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/constructorstandings.json`).pipe(
      map(res => res.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [])
    );
  }

  // RacesComponent
  getRacesSeason(): Observable<Race[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/races.json`).pipe(
      map(res => res.MRData.RaceTable.Races ?? [])
    );
  }



  getCircuitsSeason(): Observable<Circuit[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/circuits.json`).pipe(
      map(res => res.MRData.CircuitTable.Circuits ?? [])
    );
  }

  getRaces(): Observable<Race[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/races.json`).pipe(
      map(res => res.MRData.RaceTable.Races ?? [])
    );
  }

  getDrivers(): Observable<Driver[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/drivers.json`).pipe(
      map(res => res.MRData.DriverTable.Drivers ?? [])
    );
  }
  
  getDriversSeason(): Observable<Driver[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/drivers.json`).pipe(
      map(res => res.MRData.DriverTable.Drivers ?? [])
    );
  }

  getDriverSeasonResults(driverId: string): Observable<any[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/drivers/${driverId}/results.json`).pipe(
      map(res => res.MRData.RaceTable.Races ?? [])
    );
  }

  getDriverCareerResults(driverId: string): Observable<any[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/drivers/${driverId}/results.json`).pipe(
      map(res => res.MRData.RaceTable.Races ?? [])
    );
  }

  getConstructors(): Observable<Constructor[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/constructors.json`).pipe(
      map(res => res.MRData.ConstructorTable.Constructors ?? [])
    );
  }
  
  getConstructorsSeason(): Observable<Constructor[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/constructors.json`).pipe(
      map(res => res.MRData.ConstructorTable.Constructors ?? [])
    );
  }

  getConstructorStandings() : Observable<ConstructorStanding[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/constructorstandings.json`).pipe(
      map(res => res.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [])
    );
  }
}