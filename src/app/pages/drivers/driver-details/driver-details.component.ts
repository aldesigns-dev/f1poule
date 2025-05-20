import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { getDriverSlug, getDriverImage, getFlagImage, getDriverNationality } from '../../../shared/utils/driver-utils';
import { JolpicaF1Service } from '../../../core/services/jolpica-f1.service';
import { DriverStanding } from '../../../core/models/driver-standing.model';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';

@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [HideOnErrorDirective, MatTableModule, DatePipe, CommonModule],
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.scss'
})
export class DriverDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);
    private readonly snackbar = inject(MatSnackBar);

  driver: DriverStanding | null = null;
  round: number = 0;
  constructorColor: string = 'transparent';
  constructorName: string = '';
  displayedColumns: string[] = ['label', 'value'];
  driverInfo: { label: string; value: string | number | null }[] = [];
  driverSeasonResults: { label: string; value: string | number | null }[] = [];
  driverCareerResults: { label: string; value: string | number | null }[] = [];
  worldTitles = 0;

  getDriverImage = getDriverImage;
  getFlagImage = getFlagImage;
  getDriverLink(driverId: string): string[] {
    return ['/drivers', getDriverSlug(driverId)];
  }

  ngOnInit(): void {
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadDriverData(slug);
    }
  }

  private loadDriverData(slug: string) {
    this.jolpicaF1Service.getDriverDetail(slug)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: ({ driver, round, constructorName, constructorColor, careerStats, seasonStats }) => {
        this.driver = driver;
        this.round = round;
        this.constructorName = constructorName;
        this.constructorColor = constructorColor;
        this.worldTitles = this.jolpicaF1Service.driverWorldTitles[slug] ?? 0;
        this.driverInfo = [
          { label: 'Team', value: constructorName },
          { label: 'Land', value: getDriverNationality(driver.Driver.nationality) },
          { label: 'Geboortedatum', value: driver.Driver.dateOfBirth },
        ];
        this.driverSeasonResults = [
          { label: 'Races', value: round },
          { label: 'Punten', value: driver.points },
          { label: 'Positie', value: driver.position},
          { label: 'Overwinningen', value: seasonStats.totalWins },
          { label: 'Podiumplaatsen', value: seasonStats.podiums },
        ];
        this.driverCareerResults = [
          { label: 'Races', value: careerStats.raceCount },
          { label: 'Punten', value: this.formatPoints(careerStats.totalPoints) },
          { label: 'Wereldtitels', value: this.worldTitles},
          { label: 'Overwinningen', value: careerStats.totalWins },
          { label: 'Podiumplaatsen', value: careerStats.podiums },
        ];
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open('Fout bij ophalen van data. Probeer het later opnieuw.', 'Sluiten', { duration: 3000 });
      }
    });
  }

  formatPoints(points: number): string {
    return Number.isInteger(points) ? points.toString() : points.toFixed(1);
  }
}