import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pageTitle = input<string>();

  username: string | undefined;
  fromPage: string | undefined;

  ngOnInit(): void {
    // Haal de navigatiestaat op van de router.
    const state = history.state as { fromPage?: string; username?: string };

    this.fromPage = state?.fromPage;
    this.username = state?.username;

    this.authService.authState$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(user => {
      this.username = user?.displayName ?? 'F1-fan';
    })
  }
}
