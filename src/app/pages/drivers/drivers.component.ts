import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRipple } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DriverCardComponent } from './driver-card/driver-card.component';
import { DriverTableComponent } from './driver-table/driver-table.component';
import { JolpicaF1Service } from '../../core/services/jolpica-f1.service';
import { DriverStanding } from '../../core/models/driver-standing.model';
import { getDriverSlug } from '../../shared/utils/driver-utils';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [DriverCardComponent, DriverTableComponent, RouterLink, MatRipple, MatIconModule, MatTooltipModule],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);
  readonly pageTitle = input<string>();

  driverStandings: DriverStanding[] = [];
  showTableView = false;

  ngOnInit(): void {
    this.loadDriverStandingsSeason();
  }

  private loadDriverStandingsSeason() {
    this.jolpicaF1Service.getDriverStandingsSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.driverStandings = data.standings;
        console.log('[DriversComponent] DriverStandings:', this.driverStandings);
      },
      error: (err) => {
        this.snackbar.open('Fout bij ophalen van coureurs-stand. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
        console.error('[DriversComponent] Fout bij ophalen van driver standings:', err);
      }
    });
  }

  getDriverLink(driverId: string): string[] {
    return ['/drivers', getDriverSlug(driverId)];
  }

  toggleView() {
    this.showTableView = !this.showTableView;
  }
}
