import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  theme = this.themeService.getTheme;
  isLoggedIn$ = this.authService.isAuthenticated$;

  toggleTheme(event: any) {
    const theme = event.checked ? 'dark-theme' : 'light-theme';
    this.themeService.setTheme(theme);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
