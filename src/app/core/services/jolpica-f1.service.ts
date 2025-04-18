import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JolpicaF1Service {
  private httpClient = inject(HttpClient);
  private baseUrl = 'https://api.jolpi.ca/ergast/f1';

  getDrivers(season: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${season}/drivers.json`);
  }

  getDriverStandings(season: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${season}/driverstandings.json`);
  }

  getConstructors(season: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${season}/constructors.json`);
  }

  getConstructorStandings(season: string) : Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${season}/constructorstandings.json`);
  }

  getRaces(season: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${season}/races.json`);
  }

  getCircuits(season: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${season}/circuits.json`);
  }

  getResults(season: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${season}/results.json`);
  }
}