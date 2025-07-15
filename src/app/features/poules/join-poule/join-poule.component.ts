import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/services/auth.service';
import { PouleService } from '../../../core/services/poule.service';
import { catchError, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-join-poule',
  standalone: true,
  imports: [MatButtonModule, CommonModule, RouterLink],
  templateUrl: './join-poule.component.html',
  styleUrl: './join-poule.component.scss'
})
export class JoinPouleComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pouleService = inject(PouleService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly pageTitle = input<string>();
  readonly currentUser$ = this.authService.currentUser$;
  readonly poule$ = this.route.paramMap.pipe(
    switchMap(params => {
      const code = params.get('inviteCode');
      console.log('[JoinPouleComponent] inviteCode:', code);
      return code ? this.pouleService.getPouleByInviteCode(code) : of(null);
    }),
    catchError(err => {
      console.error('[JoinPouleComponent] Fout bij ophalen poule via code:', err);
      return of(null);
    })
  );

  fromPage: string | undefined;
  username: string | undefined;

  ngOnInit(): void {
    // Ophalen navigatiestaat van de router voor welkomstbericht.
    const state = history.state as { fromPage?: string; username?: string };
    this.fromPage = state?.fromPage;
    this.username = state?.username;
  }

  async joinPoule(pouleId: string, userId: string) {
    try {
      await this.pouleService.joinPoule(pouleId, userId);
      this.router.navigate(['/poules', pouleId]); 
    } catch (error) {
      console.error('[JoinPouleComponent] Fout bij joinPoule:', error);
    }
  }

  goToLogin() {
    this.router.navigate(['/login'], { queryParams: { redirectTo: this.router.url } });
  }

  goToRegister() {
    this.router.navigate(['/register'], { queryParams: { redirectTo: this.router.url } });
  }
}
