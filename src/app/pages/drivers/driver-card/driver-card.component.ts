import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { DriverStanding } from '../../../core/models/driver-standing.model';
import { getConstructorColor, getConstructorName } from '../../../shared/utils/constructor-utils';
import { getDriverImage, getFlagImage } from '../../../shared/utils/driver-utils';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';

@Component({
  selector: 'app-driver-card',
  standalone: true,
  imports: [HideOnErrorDirective, CommonModule, MatCard, MatDivider, NgxSkeletonLoaderModule],
  templateUrl: './driver-card.component.html',
  styleUrl: './driver-card.component.scss'
})
export class DriverCardComponent implements OnInit {
  readonly driverStanding = input.required<DriverStanding>();
  loading = true;

  getConstructorColor = getConstructorColor;
  getConstructorName = getConstructorName;
  getDriverImage = getDriverImage;
  getFlagImage = getFlagImage;

  ngOnInit() {
    setTimeout(() => {
       this.loading = false;
    }, 500)
  }
}
