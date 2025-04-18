import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TeamCardComponent } from "../../features/teams/team-card/team-card.component";
import { JolpicaF1Service } from '../../core/services/jolpica-f1.service';
import { ConstructorStanding } from '../../core/models/constructor-standing.model';
import { DriverStanding } from '../../core/models/driver-standing.model';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [TeamCardComponent, CommonModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);
  readonly pageTitle = input<string>();

  constructorStandings: ConstructorStanding[] = [];
  driverStandings: DriverStanding[] = [];
  driversByTeam: { [constructorId: string]: DriverStanding[] } = {};
  season = '2025';

  ngOnInit(): void {
    this.loadConstructorStandings();
    this.loadDriverStandings();
  }

  loadConstructorStandings() {
    this.jolpicaF1Service.getConstructorStandings(this.season)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.constructorStandings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        console.log('ConstructorStandings:', this.constructorStandings);
      },
      error: (err) => {
        console.error('Fout bij ophalen van constructor standings:', err);
        this.snackbar.open('Fout bij ophalen van constructor-stand. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
      }
    });
  }

  loadDriverStandings() {
    this.jolpicaF1Service.getDriverStandings(this.season)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.driverStandings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        this.linkDriversToTeams();
        console.log('DriverStandings:', this.driverStandings);
      },
      error: (err) => {
        console.error('Fout bij ophalen van driver standings:', err);
        this.snackbar.open('Fout bij ophalen van coureurs-stand. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
      }
    });
  }

  linkDriversToTeams() {
    this.driversByTeam = {}; // Reset de mapping.
    // Loop door alle drivers in de driverStandings.
    for (const driver of this.driverStandings) {
      // Ophalen meest recente constructor.
      const mostRecentConstructor = driver.Constructors[driver.Constructors.length - 1]; 
      const constructorId = mostRecentConstructor.constructorId;
      // Als het team nog niet in het object zit, voeg het toe als lege array.
      if (!this.driversByTeam[constructorId]) {
        this.driversByTeam[constructorId] = [];
      }
      // Toevoegen driver aan juiste team.
      this.driversByTeam[constructorId].push(driver);
    }
    console.log('Drivers by Team:', this.driversByTeam);
  }

  getDriversForTeam(constructorId: string): any[] {
    // Haal de drivers voor een specifiek team op
    return this.driversByTeam[constructorId] || [];
  }
}
