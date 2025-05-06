import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JolpicaF1Service } from '../../core/services/jolpica-f1.service';
import { RaceCardComponent } from './race-card/race-card.component';

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

  races: any[] = [];
  displayedColumns: string[] = ['raceName', 'circuitName', 'date'];

  ngOnInit(): void {
    this.loadRaces();
  }

  loadRaces() {
    this.jolpicaF1Service.getRacesSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.races = data;
        console.log('Races:', this.races);
      },
      error: (err) => {
        console.error('Fout bij ophalen van races:', err);
        this.snackbar.open('Fout bij ophalen van races. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
      }
    });
  }
}
