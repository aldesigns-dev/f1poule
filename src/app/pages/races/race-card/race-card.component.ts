import { DatePipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

import { Race } from '../../../core/models/race.model';
import { DriverResult } from '../../../core/models/driver-result.model';
import { getCountryFlagImage } from '../../../shared/utils/flag-utils';
import { getTrackSvg } from '../../../shared/utils/track-utils';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';
import { getDriverImage } from '../../../shared/utils/driver-utils';

@Component({
  selector: 'app-race-card',
  standalone: true,
  imports: [HideOnErrorDirective, MatCard, MatDivider, DatePipe],
  templateUrl: './race-card.component.html',
  styleUrl: './race-card.component.scss'
})
export class RaceCardComponent implements OnInit {
   private readonly sanitizer = inject(DomSanitizer);
  readonly race = input.required<Race>();
  readonly results = input.required<DriverResult[]>();
  safeSvg: SafeHtml | null = null;

  getCountryFlagImage = getCountryFlagImage;
  getDriverImage = getDriverImage;

  ngOnInit(): void {
    const circuitId = this.race().Circuit?.circuitId;
    const svg = getTrackSvg(circuitId);
    this.safeSvg = svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
    // console.log('✅ Ontvangen race:', this.race());
    // console.log('✅ Ontvangen results:', this.results());
  }
}
