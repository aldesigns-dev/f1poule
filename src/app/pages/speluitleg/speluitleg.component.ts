import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-speluitleg',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './speluitleg.component.html',
  styleUrl: './speluitleg.component.scss'
})
export class SpeluitlegComponent {
  readonly pageTitle = input<string>();
}
