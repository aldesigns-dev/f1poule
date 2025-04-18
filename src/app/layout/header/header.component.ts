import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private themeService = inject(ThemeService);

  theme = this.themeService.getTheme;

  toggleTheme(event: any) {
    const theme = event.checked ? 'dark-theme' : 'light-theme';
    this.themeService.setTheme(theme);
  }
}
