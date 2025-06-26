import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

import { HideOnErrorDirective } from '../../shared/directives/hide-on-error.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [HideOnErrorDirective, MatDivider],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  
}
