import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";

import { ConstructorStanding } from "../models/constructor-standing.model";
import { DriverStanding } from "../models/driver-standing.model";
import { DriverDetail } from "../models/driver-detail.model";
import { Race } from "../models/race.model";
import { DriverCareerStats } from "../models/driver-career-stats.model";
import { getDriverSlug } from "../../shared/utils/driver-utils";
import { getConstructorColor, getConstructorName } from "../../shared/utils/constructor-utils";

@Injectable({
  providedIn: 'root'
})
export class JolpicaF1Service {
  private httpClient = inject(HttpClient);
  private baseUrl = 'https://api.jolpi.ca/ergast/f1';
  private season = '2025';

  // TeamsComponent
  getConstructorStandingsSeason(): Observable<ConstructorStanding[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/constructorstandings.json`).pipe(
      map(res => res.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [])
    );
  }

  // TeamsComponent
  getDriverStandingsSeason(): Observable<{ round: number; standings: DriverStanding[] }> {
    const url = `${this.baseUrl}/${this.season}/driverstandings.json`;
    return this.httpClient.get<any>(url)
    .pipe(
      map(res => {
        const list = res.MRData.StandingsTable.StandingsLists[0];
        return {
          round: parseInt(list?.round ?? '0', 10),
          standings: list?.DriverStandings ?? []
        };
      })
    );
  }

  getDriverCareerStats(driverId: string, offset = 0, stats: DriverCareerStats = {
    raceCount: 0,
    totalWins: 0,
    podiums: 0,
    totalPoints: 0,
  }): Observable<DriverCareerStats> {
    const limit = 100;
    const url = `${this.baseUrl}/drivers/${driverId}/results.json?limit=${limit}&offset=${offset}`;

    return this.httpClient.get<any>(url)
    .pipe(
      switchMap(res => {
        const races: any[] = res.MRData.RaceTable.Races ?? [];
        const total = parseInt(res.MRData.total, 10);

        // Log alle races met status en positie.
        races.forEach(race => {
          const result = race.Results?.[0];
          if (result) {
            console.log(`${race.season} ${race.raceName} - status: ${result.status}, position: ${result.position}`);
          }
        });

        const excludedStatus = [
          'Did not start',
          'Withdrawn',
          'Excluded',
          // 'Not classified',
          'Disqualified',
          // '+1 Lap',
          // '+2 Laps',
          // 'Lapped',
          // 'Finished',
          // 'Collision',
          // 'Collision damage',
          // 'Undertray',
          // 'Retired',
          // 'Turbo',
          // 'Power Unit',
          // 'Electronics',
          // 'Driveshaft',
          // 'Mechanical',
          // 'Suspension',
          // 'Tyre',
          // 'Accident',
        ];

        const updatedStats = races.reduce((acc, race) => {
          const result = race.Results?.[0];
          if (!result) return acc;

          // Tel race alleen mee als status niet in excludedStatuses zit.
          if (!excludedStatus.includes(result.status)) {
            acc.raceCount++;
          }

          // Tel wins, podiums en punten als positie geldig is.
          const pos = Number(result.position);
          if (pos > 0 && pos <= 20) {
            if (result.position === '1') acc.totalWins++;
            if (['1', '2', '3'].includes(result.position)) acc.podiums++;
            acc.totalPoints += parseFloat(result.points ?? '0');
          }

          return acc;
        }, stats);

        if (offset + limit < total) {
          return this.getDriverCareerStats(driverId, offset + limit, updatedStats);
        } else {
          return of(updatedStats);
        }
      })
    );
  }

  getDriverSprintResults(driverId: string): Observable<Race[]> {
    const url = `${this.baseUrl}/drivers/${driverId}/sprint.json`;
    return this.httpClient.get<any>(url)
    .pipe(
      map(res => res.MRData.RaceTable.Races ?? [])
    );
  }

  // DriverDetailComponent
  getDriverDetail(slug: string): Observable<DriverDetail> {
    return this.getDriverStandingsSeason()
    .pipe(
      // Ophalen DriverStandings van het huidige seizoen.
      switchMap(data => {
        const standings = data.standings;
        // Driver zoeken die overeenkomt met de slug.
        const driver = standings.find((d: DriverStanding) => getDriverSlug(d.Driver.driverId) === slug);

        if (!driver) {
          throw new Error('Driver niet gevonden');
        }

        const round = data.round;
        const mostRecentConstructor = driver.Constructors[driver.Constructors.length - 1];
        const constructorColor = getConstructorColor(mostRecentConstructor?.constructorId ?? '');
        const constructorName = getConstructorName(mostRecentConstructor?.constructorId ?? '');

        // Parallel ophalen carrièrestatistieken en sprintrace-resultaten.
        return forkJoin({
          careerStats: this.getDriverCareerStats(driver.Driver.driverId),
          sprintRaces: this.getDriverSprintResults(driver.Driver.driverId)
        }).pipe(
          // Zodra beide observables klaar zijn, verwerk de resultaten.
          map(({ careerStats, sprintRaces }) => {
            // Bereken totaal aantal punten uit sprints.
            const sprintPoints = sprintRaces.reduce((acc, race) => {
              const sprintResult = race.SprintResults?.[0];
              if (!sprintResult) return acc;
              return acc + parseFloat(sprintResult.points ?? '0');
            }, 0);

            // Totaal punten = sprintpunten + carrièrepunten.
            careerStats.totalPoints += sprintPoints;

            // Return een object met alle verzamelde gegevens.
            return {
              driver,
              careerStats,
              round,
              constructorName,
              constructorColor
            };
          })
        );
      })
    );
  }

  // RacesComponent
  getRacesSeason(): Observable<Race[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/races.json`)
    .pipe(
      map(res => res.MRData.RaceTable.Races ?? [])
    );
  }


  // getCircuitsSeason(): Observable<Circuit[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/circuits.json`).pipe(
  //     map(res => res.MRData.CircuitTable.Circuits ?? [])
  //   );
  // }

  // getRaces(): Observable<Race[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/races.json`).pipe(
  //     map(res => res.MRData.RaceTable.Races ?? [])
  //   );
  // }

  // getDrivers(): Observable<Driver[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/drivers.json`).pipe(
  //     map(res => res.MRData.DriverTable.Drivers ?? [])
  //   );
  // }
  
  // getDriversSeason(): Observable<Driver[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/drivers.json`).pipe(
  //     map(res => res.MRData.DriverTable.Drivers ?? [])
  //   );
  // }

  // getDriverSeasonResults(driverId: string): Observable<any[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/drivers/${driverId}/results.json`).pipe(
  //     map(res => res.MRData.RaceTable.Races ?? [])
  //   );
  // }

  // getConstructors(): Observable<Constructor[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/constructors.json`).pipe(
  //     map(res => res.MRData.ConstructorTable.Constructors ?? [])
  //   );
  // }
  
  // getConstructorsSeason(): Observable<Constructor[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/${this.season}/constructors.json`).pipe(
  //     map(res => res.MRData.ConstructorTable.Constructors ?? [])
  //   );
  // }

  // getConstructorStandings() : Observable<ConstructorStanding[]> {
  //   return this.httpClient.get<any>(`${this.baseUrl}/constructorstandings.json`).pipe(
  //     map(res => res.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [])
  //   );
  // }
}