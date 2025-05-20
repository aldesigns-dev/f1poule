import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TeamCardComponent } from "./team-card/team-card.component";
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
 
  ngOnInit(): void {
    this.loadConstructorStandingsSeason();
    this.loadDriverStandingsSeason();
  }

  // Ophalen teamstanden.
  loadConstructorStandingsSeason() {
    this.jolpicaF1Service.getConstructorStandingsSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.constructorStandings = data;
        console.log('ConstructorStandings:', this.constructorStandings);
      },
      error: (err) => {
        console.error('Fout bij ophalen van constructor standings:', err);
        this.snackbar.open('Fout bij ophalen van constructor-stand. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
      }
    });
  }

  // Ophalen coureursstanden. 
  loadDriverStandingsSeason() {
    this.jolpicaF1Service.getDriverStandingsSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.driverStandings = data.standings;
        this.linkDriversToTeams();
        console.log('DriverStandings:', this.driverStandings);
      },
      error: (err) => {
        console.error('Fout bij ophalen van driver standings:', err);
        this.snackbar.open('Fout bij ophalen van coureurs-stand. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
      }
    });
  }

  // Coureurs koppelen aan teams.
  linkDriversToTeams() {
    this.driversByTeam = {}; // Reset mapping.
    for (const driver of this.driverStandings) {
      // Coureurs uitsluiten (tijdelijke oplossing).
      if (driver.Driver.driverId === 'doohan') {
        continue;
      }
      const mostRecentConstructor = driver.Constructors[driver.Constructors.length - 1]; 
      const constructorId = mostRecentConstructor.constructorId;
      if (!this.driversByTeam[constructorId]) {
        this.driversByTeam[constructorId] = [];
      }
      this.driversByTeam[constructorId].push(driver);
    }
    console.log('Drivers per team:', this.driversByTeam);
  }

  // Coureurs ophalen voor een bepaald team. 
  getDriversForTeam(constructorId: string): DriverStanding[] {
    return this.driversByTeam[constructorId] || [];
  }
}
