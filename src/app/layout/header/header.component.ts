import { Component, DestroyRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatIcon, MatButton, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  theme = this.themeService.getTheme;
  isLoggedIn$ = this.authService.isAuthenticated$;
  isMenuOpen = signal(false);

  ngOnInit(): void {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => {
      this.isMenuOpen.set(false);
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth > 768 && this.isMenuOpen()) {
      this.isMenuOpen.set(false);
    }
  }

  toggleTheme() {
    const theme = this.theme() === 'dark-theme' ? 'light-theme' : 'dark-theme';
    this.themeService.setTheme(theme);
    this.isMenuOpen.set(false);
  }

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
