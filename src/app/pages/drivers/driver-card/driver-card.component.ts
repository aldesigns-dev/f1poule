import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

import { DriverStanding } from '../../../core/models/driver-standing.model';
import { getConstructorColor, getConstructorName } from '../../../shared/utils/constructor-utils';
import { getDriverImage, getFlagImage } from '../../../shared/utils/driver-utils';

@Component({
  selector: 'app-driver-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDivider],
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
