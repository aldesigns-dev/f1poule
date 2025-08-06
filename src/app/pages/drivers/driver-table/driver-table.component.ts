import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

import { DriverStanding } from '../../../core/models/driver-standing.model';
import { getConstructorColor, getConstructorLogo, getConstructorName } from '../../../shared/utils/constructor-utils';
import { getDriverImage, getDriverSlug, getFlagImage } from '../../../shared/utils/driver-utils';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';

@Component({
  selector: 'app-driver-table',
  standalone: true,
  imports: [HideOnErrorDirective, MatTableModule, CommonModule, RouterLink],
  templateUrl: './driver-table.component.html',
  styleUrl: './driver-table.component.scss'
})
export class DriverTableComponent {
  readonly driverStanding = input.required<DriverStanding[]>();
  displayedColumns: string[] = ['position', 'name', 'nationality', 'team', 'points'];

  getConstructorColor = getConstructorColor;
  getConstructorName = getConstructorName;
  getDriverImage = getDriverImage;
  getFlagImage = getFlagImage;
  getConstructorLogo = getConstructorLogo;
  
  getDriverLink(driverId: string): string[] {
    return ['/drivers', getDriverSlug(driverId)];
  }
}
