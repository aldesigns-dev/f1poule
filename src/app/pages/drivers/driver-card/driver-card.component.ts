import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

import { DriverStanding } from '../../../core/models/driver-standing.model';
import { getConstructorColor, getConstructorName } from '../../../shared/utils/constructor-utils';
import { getDriverImage, getFlagImage } from '../../../shared/utils/driver-utils';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';

@Component({
  selector: 'app-driver-card',
  standalone: true,
  imports: [HideOnErrorDirective, CommonModule, MatCard, MatDivider],
  templateUrl: './driver-card.component.html',
  styleUrl: './driver-card.component.scss'
})
export class DriverCardComponent {
  readonly driverStanding = input.required<DriverStanding>();

  getConstructorColor = getConstructorColor;
  getConstructorName = getConstructorName;
  getDriverImage = getDriverImage;
  getFlagImage = getFlagImage;
}
