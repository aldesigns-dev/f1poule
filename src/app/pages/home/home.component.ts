import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDivider } from '@angular/material/divider';
import { MatCard } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { JolpicaF1Service } from '../../core/services/jolpica-f1.service';
import { Race } from '../../core/models/race.model';
import { ConstructorStanding } from '../../core/models/constructor-standing.model';
import { getTrackSvg } from '../../shared/utils/track-utils';
import { getCountryFlagImage } from '../../shared/utils/flag-utils';
import { getConstructorColor, getConstructorLogo, getConstructorName } from '../../shared/utils/constructor-utils';
import { DriverStanding } from '../../core/models/driver-standing.model';
import { getDriverImage } from '../../shared/utils/driver-utils';
import { HideOnErrorDirective } from '../../shared/directives/hide-on-error.directive';
import { DriverResult } from '../../core/models/driver-result.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HideOnErrorDirective, MatButton, MatTableModule, MatDivider, MatCard, MatRipple, RouterLink],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly datePipe = inject(DatePipe);
  readonly pageTitle = input<string>();

  constructorStandings: ConstructorStanding[] = [];
  driverStandings: DriverStanding[] = [];
  lastRace: Race | null = null;
  top3Results: DriverResult[] = [];
  nextRace: Race | null = null;
  displayedColumns: string[] = ['label', 'date', 'time'];
  raceInfo: { label: string; date: string; startTime: string; endTime: string }[] = [];
  dateRange: string = '';
  safeSvg: SafeHtml | null = null;

  getCountryFlagImage = getCountryFlagImage;
  getConstructorColor = getConstructorColor;
  getConstructorLogo = getConstructorLogo;
  getConstructorName = getConstructorName;
  getDriverImage = getDriverImage;

  ngOnInit(): void { 
    this.loadConstructorStandingsSeason();
    this.loadDriverStandingsSeason();
    this.loadResultsLastRace();
    this.loadNextRace();
  }

  private loadConstructorStandingsSeason() {
    this.jolpicaF1Service.getConstructorStandingsSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.constructorStandings = data;
        // console.log('[HomeComponent] ConstructorStandings:', this.constructorStandings);
      },
      error: (err) => {
        console.error('Fout bij ophalen van constructor standings:', err);
        this.snackbar.open('Fout bij ophalen van constructor-stand. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
      }
    });
  }

  get topThreeConstructors(): ConstructorStanding[] {
    return this.constructorStandings.slice(0, 3);
  }

  private loadDriverStandingsSeason() {
    this.jolpicaF1Service.getDriverStandingsSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.driverStandings = data.standings;
        // console.log('[HomeComponent] DriverStandings:', this.driverStandings);
      },
      error: (err) => {
        console.error('Fout bij ophalen van driver standings:', err);
        this.snackbar.open('Fout bij ophalen van coureurs-stand. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
      }
    });
  }

  get topThreeDrivers(): DriverStanding[] {
    return this.driverStandings.slice(0, 3);
  }

  private loadResultsLastRace() {
    this.jolpicaF1Service.getResultsLastRace()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ race, top3 }) => {
          this.lastRace = race;
          this.top3Results = top3;
          // console.log('[HomeComponent] Laatste race:', race);
          // console.log('[HomeComponent] Drivers Top 3:', top3);
        },
        error: (err) => {
          console.error('Fout bij ophalen laatste race:', err);
          this.snackbar.open('Fout bij ophalen van race data. Probeer het later opnieuw.', 'Sluiten', { duration: 3000 });
        }
      });
  }

  private loadNextRace() {
    this.jolpicaF1Service.getRacesSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (races) => {
        const now = new Date();

        // Zoek eerstvolgende race. 
        const upcomingRace = races.find(r => {
          const start = new Date(`${r.date}T${r.time}`);
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 uur extra.
          return end > now;
        });

        this.nextRace = upcomingRace ?? null;

        if (!this.nextRace) return;

        // Datum raceweekend.
        this.dateRange = this.formatDateRange(this.nextRace.FirstPractice.date, this.nextRace.date);

        // Ophalen bijbehorende svg.
        const circuitId = this.nextRace.Circuit?.circuitId;
        const svg = getTrackSvg(circuitId);
        this.safeSvg = svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;

        // Weergave data in table.
        this.raceInfo = [];

        if (this.nextRace.FirstPractice) {
          this.raceInfo.push({
            label: '1e vrije training',
            date: this.formatDate(this.nextRace.FirstPractice.date),
            startTime: this.formatTime(this.nextRace.FirstPractice.date, this.nextRace.FirstPractice.time),
            endTime: this.formatTimeWithOffset(this.nextRace.FirstPractice.date, this.nextRace.FirstPractice.time, 60)
          });
        }
        if (this.nextRace.SecondPractice) {
          this.raceInfo.push({
            label: '2e vrije training',
            date: this.formatDate(this.nextRace.SecondPractice.date),
            startTime: this.formatTime(this.nextRace.SecondPractice.date, this.nextRace.SecondPractice.time),
            endTime: this.formatTimeWithOffset(this.nextRace.SecondPractice.date, this.nextRace.SecondPractice.time, 60)
          });
        }
        if (this.nextRace.ThirdPractice) {
          this.raceInfo.push({
            label: '3e vrije training',
            date: this.formatDate(this.nextRace.ThirdPractice.date),
            startTime: this.formatTime(this.nextRace.ThirdPractice.date, this.nextRace.ThirdPractice.time),
            endTime: this.formatTimeWithOffset(this.nextRace.ThirdPractice.date, this.nextRace.ThirdPractice.time, 60)
          });
        }
        if (this.nextRace.SprintQualifying) {
          this.raceInfo.push({
            label: 'Sprint kwalificatie',
            date: this.formatDate(this.nextRace.SprintQualifying.date),
            startTime: this.formatTime(this.nextRace.SprintQualifying.date, this.nextRace.SprintQualifying.time),
            endTime: this.formatTimeWithOffset(this.nextRace.SprintQualifying.date, this.nextRace.SprintQualifying.time, 60)
          });
        }
        if (this.nextRace.Sprint) {
          this.raceInfo.push({
            label: 'Sprint',
            date: this.formatDate(this.nextRace.Sprint.date),
            startTime: this.formatTime(this.nextRace.Sprint.date, this.nextRace.Sprint.time),
            endTime: this.formatTimeWithOffset(this.nextRace.Sprint.date, this.nextRace.Sprint.time, 60)
          });
        }
        if (this.nextRace.Qualifying) {
          this.raceInfo.push({
            label: 'Kwalificatie',
            date: this.formatDate(this.nextRace.Qualifying.date),
            startTime: this.formatTime(this.nextRace.Qualifying.date, this.nextRace.Qualifying.time),
            endTime: this.formatTimeWithOffset(this.nextRace.Qualifying.date, this.nextRace.Qualifying.time, 60)
          });
        }
        this.raceInfo.push({
          label: 'Race',
          date: this.formatDate(this.nextRace.date),
          startTime: this.formatTime(this.nextRace.date, this.nextRace.time),
          endTime: this.formatTimeWithOffset(this.nextRace.date, this.nextRace.time, 120)
        });
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open('Fout bij ophalen van data. Probeer het later opnieuw.', 'Sluiten', { duration: 3000 });
      }
    })
  }

  private formatDate(date: string): string {
    return this.datePipe.transform(new Date(date), 'dd-MM-yyyy', 'nl') ?? '';
  }

  private formatTime(date: string, time: string): string {
    const fullDate = new Date(`${date}T${time}`);
    return this.datePipe.transform(fullDate, 'HH:mm') ?? '';
  }

  private formatTimeWithOffset(date: string, time: string, offsetMinutes: number): string {
    const fullDate = new Date(`${date}T${time}`);
    fullDate.setMinutes(fullDate.getMinutes() + offsetMinutes);
    return this.datePipe.transform(fullDate, 'HH:mm') ?? '';
  }

  private formatDateRange(startDateStr: string, endDateStr: string): string {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    const month = this.datePipe.transform(endDate, 'MMM') ?? '';
    // const year = endDate.getFullYear();

    return `${startDay} ${month} - ${endDay} ${month}`;
  }
}
