import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatRipple } from '@angular/material/core';

import { ConstructorStanding } from '../../../core/models/constructor-standing.model';
import { DriverStanding } from '../../../core/models/driver-standing.model';
import { getDriverSlug } from '../../../shared/utils/driver-utils';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatDivider, MatRipple],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss'
})
export class TeamCardComponent {
  readonly constructorStanding = input.required<ConstructorStanding>();
  readonly drivers = input.required<DriverStanding[]>();

  getDriverImage(driverId: string): string {
    return `assets/drivers/${getDriverSlug(driverId)}.png`;
  }
  
  getDriverLink(driverId: string): string[] {
    return ['/drivers', getDriverSlug(driverId)];
  }
}