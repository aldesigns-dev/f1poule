import { DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

import { Race } from '../../../core/models/race.model';
import { getCountryFlagImage } from '../../../shared/utils/flag-utils';
import { getTrackSvg } from '../../../shared/utils/track-utils';

@Component({
  selector: 'app-race-card',
  standalone: true,
  imports: [MatCardModule, MatDivider, DatePipe],
  templateUrl: './race-card.component.html',
  styleUrl: './race-card.component.scss'
})
export class RaceCardComponent implements OnInit {
  readonly race = input.required<Race>();
  safeSvg: SafeHtml | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const circuitId = this.race().Circuit?.circuitId;
    const svg = getTrackSvg(circuitId);
    this.safeSvg = svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
  }

  getCountryFlagImage = getCountryFlagImage;
}
