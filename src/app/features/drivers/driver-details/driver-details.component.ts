import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DriverService } from '../../../core/services/driver.service';
import { Driver } from '../../../core/models/driver.model';
import { TeamService } from '../../../core/services/team.service';

@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [MatTableModule, DatePipe, CommonModule],
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.scss'
})
export class DriverDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly driverService = inject(DriverService);
  private readonly teamService = inject(TeamService);
  private readonly destroyRef = inject(DestroyRef);

  teamColor: string = '';
  driver!: Driver;

  displayedColumns: string[] = ['label', 'value'];
  driverInfo: { label: string; value: string | number | null }[] = [];
  driverCurrentSeason: { label: string; value: string | number | null }[] = [];
  driverCareer: { label: string; value: string | number | null }[] = [];

  ngOnInit(): void {
    // const slug = this.activatedRoute.snapshot.paramMap.get('slug');

    // this.driverService.getDrivers()
    // .pipe(takeUntilDestroyed(this.destroyRef))
    // .subscribe(drivers => {
    //   const driver = drivers.find(d => d.slug === slug);
    //   if (driver) {
    //     this.driver = driver;

    //     this.driverInfo = [
    //       { label: 'Team', value: driver.team },
    //       { label: 'Land', value: driver.country },
    //       { label: 'Geboortedatum', value: driver.dateOfBirth },
    //       { label: 'Geboorteplaats', value: driver.placeOfBirth },
    //     ];

    //     this.driverCurrentSeason = [
    //       { label: 'Races', value: driver.races },
    //       { label: 'Punten', value: driver.points },
    //       { label: 'Podiums', value: driver.podiums },
    //     ];
  
    //     this.driverCareer = [
    //       { label: 'Races', value: driver.racesTotal },
    //       { label: 'Punten', value: driver.pointsTotal },
    //       { label: 'Podiums', value: driver.podiumsTotal },
    //     ];

    //     // Teamkleur ophalen.
    //     this.teamService.getTeamColor(driver.team)
    //     .pipe(takeUntilDestroyed(this.destroyRef))
    //     .subscribe(color => {
    //       this.teamColor = color;
    //     });
    //   }
    // });
  }
}