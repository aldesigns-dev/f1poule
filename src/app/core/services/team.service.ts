import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private httpClient = inject(HttpClient);

  // getTeams(): Observable<Team[]> {
  //   return this.httpClient
  //   .get<{ teams: Team[] }>('http://localhost:3000/api/teams')
  //   .pipe(
  //     tap(response => {
  //       console.log('Response:', response)
  //     }),
  //     map(response => response.teams),
  //   );
  // }

  // // Kleur ophalen van een team via naam.
  // getTeamColor(teamName: string): Observable<string> {
  //   return this.getTeams().pipe(
  //     map(teams => teams.find(t => t.teamName === teamName)?.teamColor ?? 'oklch(0.84 0.0047 258.33)')
  //   );
  // }
}