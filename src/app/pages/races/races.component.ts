import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest } from 'rxjs';

import { JolpicaF1Service } from '../../core/services/jolpica-f1.service';
import { RaceCardComponent } from './race-card/race-card.component';
import { DriverResult } from '../../core/models/driver-result.model';
import { Race } from '../../core/models/race.model';

@Component({
  selector: 'app-races',
  standalone: true,
  imports: [RaceCardComponent],
  templateUrl: './races.component.html',
  styleUrl: './races.component.scss'
})
export class RacesComponent implements OnInit {
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);
  readonly pageTitle = input<string>();

  races: Race[] = [];
  top3Results: { [round: string]: DriverResult[] } = {};
  displayedColumns: string[] = ['raceName', 'circuitName', 'date'];

  // ngOnInit(): void {
  //   this.loadRaces();
  //   this.loadRaceResults();
  // }

  // loadRaces() {
  //   this.jolpicaF1Service.getRacesSeason()
  //   .pipe(takeUntilDestroyed(this.destroyRef))
  //   .subscribe({
  //     next: (data) => {
  //       this.races = data;
  //       // console.log('✅ Races:', this.races);
  //     },
  //     error: (err) => {
  //       console.error('Fout bij ophalen van races:', err);
  //       this.snackbar.open('Fout bij ophalen van races. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
  //     }
  //   });
  // }

  // loadRaceResults() {
  //   this.jolpicaF1Service.getRaceResultsSeason()
  //   .pipe(takeUntilDestroyed(this.destroyRef))
  //   .subscribe({
  //     next: (resultsByRound) => {
  //       this.top3Results = resultsByRound;
  //       // console.log('✅ Resultaten per ronde:', this.top3Results); 
  //     },
  //     error: (err) => {
  //       console.error('Fout bij ophalen van resultaten:', err);
  //       this.snackbar.open('Fout bij ophalen van resultaten. Probeer het later opnieuw.', 'Sluiten', { duration: 3000 });
  //     }
  //   })
  // }

  ngOnInit(): void {
    combineLatest([
      this.jolpicaF1Service.getRacesSeason(),
      this.jolpicaF1Service.getRaceResultsSeason()
    ])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: ([races, results]) => {
        this.races = races;
        this.top3Results = results;
        // console.log('✅ Races:', this.races);
        // console.log('✅ Resultaten per ronde:', this.top3Results); 
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open('Fout bij ophalen van data. Probeer het later opnieuw.', 'Sluiten', { duration: 3000 });
      }
    });
  }

  getTop3Results(round: string): DriverResult[] {
    return this.top3Results[round.toString()] ?? [];
  }
}
