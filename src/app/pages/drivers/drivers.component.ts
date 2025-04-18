import { Component, input } from '@angular/core';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent {
  readonly pageTitle = input<string>();
}
