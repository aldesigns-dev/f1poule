import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JolpicaF1Service {
  private httpClient = inject(HttpClient);
  private baseUrl = 'https://api.jolpi.ca/ergast/f1';
  private season = '2025';

  getDrivers(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/drivers.json`);
  }

  getDriversSeason(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/drivers.json`);
  }

  getDriverStandings(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/driverstandings.json`);
  }

  getDriverStandingsSeason(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${this.season}/driverstandings.json`);
  }

  getDriverResults(driverId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/drivers/${driverId}/results.json`);
  }

  getDriverResultsSeason(driverId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/drivers/${driverId}/results.json`);
  }

  getConstructors(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/constructors.json`);
  }

  getConstructorsSeason(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/constructors.json`);
  }

  getConstructorStandings() : Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/constructorstandings.json`);
  }

  getConstructorStandingsSeason() : Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${this.season}/constructorstandings.json`);
  }

  getRaces(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/races.json`);
  }

  getRacesSeason(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/races.json`);
  }

  getCircuits(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/circuits.json`);
  }
}