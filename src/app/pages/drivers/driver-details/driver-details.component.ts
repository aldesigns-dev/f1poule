import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { getDriverSlug, getDriverImage, getFlagImage } from '../../../shared/utils/driver-utils';
import { getConstructorLogo } from '../../../shared/utils/constructor-utils';
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
  displayedColumns: string[] = ['label', 'value'];
  driverInfo: { label: string; value: string | number | null }[] = [];
  driverCurrentSeason: { label: string; value: string | number | null }[] = [];
  driverCareer: { label: string; value: string | number | null }[] = [];

  getDriverImage = getDriverImage;
  getFlagImage = getFlagImage;
  getConstructorLogo = getConstructorLogo;

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
    this.jolpicaF1Service.getDriverStandingsSeason()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings;
          const foundDriver = standings?.find((d: DriverStanding) => getDriverSlug(d.Driver.driverId) === slug);
          if (foundDriver) {
            this.driver = foundDriver;
            this.buildDriverInfo(foundDriver);
            this.loadDriverResults(foundDriver.Driver.driverId);
          }
        },
        error: (err) => {
          console.error('Fout bij ophalen van driver standings:', err);
        }
      });
  }

  private loadDriverResults(driverId: string) {
    this.jolpicaF1Service.getDriverResultsSeason(driverId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultData) => {
          const races = resultData.MRData.RaceTable.Races;
          if (races.length > 0) {
            const lastRace = races[races.length - 1];
            const lastRaceDate = new Date(lastRace.date);
            const formattedDate = lastRaceDate.toISOString().split('T')[0];
            this.driverCurrentSeason.push({ label: 'Laatste race', value: formattedDate });
          }
        },
        error: (err) => {
          console.error('Fout bij ophalen driver resultaten:', err);
        }
      });
  }

  private buildDriverInfo(driver: DriverStanding) {
    this.driverInfo = [
      { label: 'Team', value: driver.Constructors[0]?.name ?? 'Onbekend' },
      { label: 'Land', value: driver.Driver.nationality },
      { label: 'Geboortedatum', value: driver.Driver.dateOfBirth },
    ];

    this.driverCurrentSeason = [
      { label: 'Positie', value: ''},
      { label: 'Races', value: '' },
      { label: 'Punten', value: driver.points },
      { label: 'Podiumplaatsen', value: '' },
    ];

    this.driverCareer = [
      { label: 'Wereldtitels', value: '' },
      { label: 'Races', value: '' },
      { label: 'Punten', value: '' },
      { label: 'Podiumplaatsen', value: '' },
    ];
  }
}