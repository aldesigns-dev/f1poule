import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatRipple } from '@angular/material/core';

import { ConstructorStanding } from '../../../core/models/constructor-standing.model';
import { DriverStanding } from '../../../core/models/driver-standing.model';
import { getDriverSlug, getDriverImage, getFlagImage } from '../../../shared/utils/driver-utils';
import { getConstructorColor, getConstructorLogo, getConstructorName } from '../../../shared/utils/constructor-utils';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [HideOnErrorDirective, CommonModule, RouterLink, MatCard, MatDivider, MatRipple],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss'
})
export class TeamCardComponent {
  readonly constructorStanding = input.required<ConstructorStanding>();
  readonly driverStanding = input.required<DriverStanding[]>();
  
  getConstructorLogo = getConstructorLogo;
  getConstructorColor = getConstructorColor;
  getConstructorName = getConstructorName;
  getDriverImage = getDriverImage;
  getFlagImage = getFlagImage;
  getDriverLink(driverId: string): string[] {
    return ['/drivers', getDriverSlug(driverId)];
  }
}