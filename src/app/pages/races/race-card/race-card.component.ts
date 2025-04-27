import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-race-card',
  standalone: true,
  imports: [MatCardModule, MatDivider, DatePipe],
  templateUrl: './race-card.component.html',
  styleUrl: './race-card.component.scss'
})
export class RaceCardComponent {
  readonly race = input.required<any>()
}
