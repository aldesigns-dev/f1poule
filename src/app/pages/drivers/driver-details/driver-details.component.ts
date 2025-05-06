import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { getDriverSlug, getDriverImage, getFlagImage, getDriverNationality } from '../../../shared/utils/driver-utils';
import { getConstructorColor, getConstructorName } from '../../../shared/utils/constructor-utils';
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
  driverCurrentSeason: { label: string; value: string | number | null }[] = [];
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
    this.jolpicaF1Service.getDriverStandingsSeason()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const standings = data.standings;
          const driver = standings.find((d: DriverStanding) => getDriverSlug(d.Driver.driverId) === slug);
          
          if (driver) {
            this.driver = driver;
            this.round = data.round;

            const mostRecentConstructor = driver.Constructors[driver.Constructors.length - 1];
            this.constructorColor = getConstructorColor(mostRecentConstructor?.constructorId ?? '');
            this.constructorName = getConstructorName(mostRecentConstructor?.constructorId ?? '');

            this.driverInfo = [
              { label: 'Team', value: this.constructorName },
              { label: 'Land', value: getDriverNationality(driver.Driver.nationality) },
              { label: 'Geboortedatum', value: driver.Driver.dateOfBirth },
            ];

            this.driverCurrentSeason = [
              { label: 'Positie', value: driver.position },
              { label: 'Races', value: this.round },
              { label: 'Punten', value: driver.points },
              { label: 'Podiumplaatsen', value: driver.wins }
            ];

            this.jolpicaF1Service.getDriverCareerResults(driver.Driver.driverId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (career) => {
                const raceCount = career.length;
                const totalWins = career.filter((race: any) => race.position === '1').length;
                const totalPoints = career.reduce((sum: number, race: any) => sum + (Number(race.Results[0].points) || 0), 0);
                const worldTitles = career.filter((race: any) => race.position === '1').length;

                this.driverCareerResults = [
                  { label: 'Wereldtitels', value: worldTitles.toString() },
                  { label: 'Races', value: raceCount.toString() },
                  { label: 'Punten', value: totalWins },
                  { label: 'Podiumplaatsen', value: totalPoints }
                ];
              },
              error: (err) => {
                console.error('Fout bij ophalen van driver resultaten:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Fout bij ophalen van driver standings:', err);
        }
      });
  }

  private loadDriverSeasonResults(driverId: string) {
    this.jolpicaF1Service.getDriverSeasonResults(driverId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((races) => {
        const results = races.flatMap(r => r.Results);
        const podiums = results.filter(r => +r.position <= 3).length;
        const points = results.reduce((acc, r) => acc + parseFloat(r.points), 0);
        const position = results[0]?.position ?? 'n/a';

        this.driverCurrentSeason = [
          { label: 'Positie', value: position },
          { label: 'Races', value: results.length },
          { label: 'Punten', value: points },
          { label: 'Podiumplaatsen', value: podiums },
        ];
      });
  }

  // private loadDriverCareerResults(driverId: string) {
  //   this.jolpicaF1Service.getDriverCareerResults(driverId)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((races) => {
  //       const results = races.flatMap(r => r.Results);
  //       const podiums = results.filter(r => +r.position <= 3).length;
  //       const points = results.reduce((acc, r) => acc + parseFloat(r.points), 0);

  //       // Wereldtitels: tel aantal seizoenen waarin deze driver kampioen werd
  //       this.jolpicaF1Service.getDriverStandings()
  //         .pipe(takeUntilDestroyed(this.destroyRef))
  //         .subscribe((allStandings) => {
  //           const worldTitles = allStandings.filter(s => s.Driver.driverId === driverId && s.position === '1').length;

  //           this.driverCareer = [
  //             { label: 'Wereldtitels', value: worldTitles },
  //             { label: 'Races', value: results.length },
  //             { label: 'Punten', value: points },
  //             { label: 'Podiumplaatsen', value: podiums },
  //           ];
  //         });
  //     });
  // }



  // private loadDriverResults(driverId: string) {
  //   this.jolpicaF1Service.getDriverResultsSeason(driverId)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: (resultData) => {
  //         const races = resultData.MRData.RaceTable.Races;
  
  //         const results = races.flatMap((race: any) => race.Results);
  //         const podiums = results.filter((r: any) => +r.position <= 3).length;
  //         const points = results.reduce((acc: number, r: any) => acc + parseFloat(r.points), 0);
  //         const position = this.driver?.position ?? 'n/a';
  
  //         this.driverCurrentSeason = [
  //           { label: 'Positie', value: position },
  //           { label: 'Races', value: results.length },
  //           { label: 'Punten', value: points },
  //           { label: 'Podiumplaatsen', value: podiums },
  //         ];
  //       },
  //       error: (err) => {
  //         console.error('Fout bij ophalen driver resultaten:', err);
  //       }
  //     });
  // }

  // private loadCareerResults(driverId: string){
  //   this.jolpicaF1Service.getDriverResults(driverId)
  //   .pipe(takeUntilDestroyed(this.destroyRef))
  //   .subscribe({
  //     next: (resultData) => {
  //       const races = resultData.MRData.RaceTable.Races;
  //       const results = races.flatMap((race: any) => race.Results);

  //       const podiums = results.filter((r: any) => +r.position <= 3).length;
  //       const points = results.reduce((acc: number, r: any) => acc + parseFloat(r.points), 0);
  //       const titles = this.countWorldTitles(results);

  //       this.driverCareer = [
  //         { label: 'Wereldtitels', value: titles },
  //         { label: 'Races', value: results.length },
  //         { label: 'Punten', value: points },
  //         { label: 'Podiumplaatsen', value: podiums }
  //       ];
  //     },
  //     error: (err) => {
  //       console.error('Fout bij ophalen carrièregegevens:', err);
  //     }
  //   });
  // }

  // private countWorldTitles(results: any[]): number {
  //   // Je kunt later standings per seizoen ophalen en hier filteren op position === '1'
  //   return 0; // Voor nu even hardcoded tenzij je standings hebt
  // }

  // private buildDriverInfo(driver: DriverStanding) {
  //   this.driverInfo = [
  //     { label: 'Team', value: driver.Constructors[0]?.name ?? 'Onbekend' },
  //     { label: 'Land', value: driver.Driver.nationality },
  //     { label: 'Geboortedatum', value: driver.Driver.dateOfBirth },
  //   ];

  //   this.driverCurrentSeason = [
  //     { label: 'Positie', value: ''},
  //     { label: 'Races', value: '' },
  //     { label: 'Punten', value: driver.points },
  //     { label: 'Podiumplaatsen', value: '' },
  //   ];

  //   this.driverCareer = [
  //     { label: 'Wereldtitels', value: '' },
  //     { label: 'Races', value: '' },
  //     { label: 'Punten', value: '' },
  //     { label: 'Podiumplaatsen', value: '' },
  //   ];
  // }
}