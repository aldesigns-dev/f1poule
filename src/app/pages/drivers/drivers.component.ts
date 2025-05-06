import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRipple } from '@angular/material/core';

import { DriverCardComponent } from './driver-card/driver-card.component';
import { JolpicaF1Service } from '../../core/services/jolpica-f1.service';
import { DriverStanding } from '../../core/models/driver-standing.model';
import { getDriverSlug } from '../../shared/utils/driver-utils';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [DriverCardComponent, RouterLink, MatRipple],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);
  readonly pageTitle = input<string>();

  driverStandings: DriverStanding[] = [];

  getDriverLink(driverId: string): string[] {
    return ['/drivers', getDriverSlug(driverId)];
  }

  ngOnInit(): void {
    this.loadDriverStandingsSeason();
  }

  // Ophalen coureursstanden. 
  loadDriverStandingsSeason() {
    this.jolpicaF1Service.getDriverStandingsSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.driverStandings = data.standings;
        console.log('DriverStandings:', this.driverStandings);
      },
      error: (err) => {
        console.error('Fout bij ophalen van driver standings:', err);
        this.snackbar.open('Fout bij ophalen van coureurs-stand. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
      }
    });
  }
}
