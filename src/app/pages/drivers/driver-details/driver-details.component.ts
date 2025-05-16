import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { getDriverSlug, getDriverImage, getFlagImage, getDriverNationality } from '../../../shared/utils/driver-utils';
import { JolpicaF1Service } from '../../../core/services/jolpica-f1.service';
import { DriverStanding } from '../../../core/models/driver-standing.model';

@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [MatTableModule, DatePipe, CommonModule],
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.scss'
})
export class DriverDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);

  driver: DriverStanding | null = null;
  round: number = 0;
  constructorColor: string = 'transparent';
  constructorName: string = '';
  displayedColumns: string[] = ['label', 'value'];
  driverInfo: { label: string; value: string | number | null }[] = [];
  driverSeasonResults: { label: string; value: string | number | null }[] = [];
  driverCareerResults: { label: string; value: string | number | null }[] = [];

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
      next: ({ driver, careerStats, round, constructorName, constructorColor }) => {
        this.driver = driver;
        this.round = round;
        this.constructorName = constructorName;
        this.constructorColor = constructorColor;
        this.driverInfo = [
          { label: 'Team', value: constructorName },
          { label: 'Land', value: getDriverNationality(driver.Driver.nationality) },
          { label: 'Geboortedatum', value: driver.Driver.dateOfBirth },
        ];
        this.driverSeasonResults = [
          { label: 'Races', value: round },
          { label: 'Positie', value: driver.position },
          { label: 'Podiumplaatsen', value: driver.wins },
          { label: 'Punten', value: driver.points },
        ];
        this.driverCareerResults = [
          { label: 'Races', value: careerStats.raceCount },
          { label: 'Overwinningen', value: careerStats.totalWins },
          { label: 'Podiumplaatsen', value: careerStats.podiums },
          { label: 'Punten totaal', value: this.formatPoints(careerStats.totalPoints) },
        ];
      },
      error: err => {
        console.error('Fout bij laden driver data', err);
        // Toon eventueel snackbar
      }
    });
  }

  formatPoints(points: number): string {
    return Number.isInteger(points) ? points.toString() : points.toFixed(1);
  }
}