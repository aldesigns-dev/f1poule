import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';

import { HideOnErrorDirective } from '../../shared/directives/hide-on-error.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [HideOnErrorDirective, MatDivider, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  
}
