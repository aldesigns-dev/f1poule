import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { DialogAvatarComponent } from '../../shared/dialogs/dialog-avatar/dialog-avatar.component';
import { HideOnErrorDirective } from '../../shared/directives/hide-on-error.directive';
import { DialogChangePasswordComponent } from '../../shared/dialogs/dialog-change-password/dialog-change-password.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCard, MatDivider, DatePipe, HideOnErrorDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  readonly pageTitle = input<string>();

  fromPage: string | undefined;
  username: string | undefined;
  email: string | undefined ;
  avatarUrl: string | undefined; 
  createdAt: Date | undefined;

  ngOnInit(): void {
    // Ophalen navigatiestaat van de router voor welkomstbericht.
    const state = history.state as { fromPage?: string; username?: string; };
    this.fromPage = state?.fromPage;
    this.username = state?.username;

    this.authService.currentUser$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(user => {
      console.log('[Dashboard] currentUser$ user:', user);
      this.username = user?.username ?? 'F1-fan';
      this.email = user?.email ?? undefined;
      this.avatarUrl = user?.avatarUrl ?? '/assets/avatars/avatar1.png';
      this.createdAt = user?.createdAt ? user.createdAt.toDate() : undefined;
    });
  }

  openAvatarDialog() {
    const dialogRef = this.dialog.open(DialogAvatarComponent);
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(selectedAvatar => {
      if (selectedAvatar) {
        this.authService.updateAvatar(selectedAvatar)
        .then(() => {
          this.avatarUrl = '/assets/avatars/' + selectedAvatar;
        })
        .catch(error => {
          console.error('Avatar bijwerken mislukt:', error);
        });
      }
    })
  }

  openPassWordDialog() {
    const dialogRef = this.dialog.open(DialogChangePasswordComponent);
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe( async (result) => {
      if (!result) return;

      try {
        await this.authService.changePasswordWithReauth(result.currentPassword, result.newPassword);
        this.snackbar.open('Wachtwoord gewijzigd. Je wordt nu verzocht opnieuw in te loggen', 'OK', { duration: 3000 });

        setTimeout(async () => {
          await this.authService.logout(); 
          this.router.navigate(['/login']);
        }, 3000);

      } catch (err: any) {
        if (err.code === 'auth/invalid-credential') {
          this.snackbar.open('Huidig wachtwoord is onjuist', 'OK', { duration: 3000 });
        } else if (err.code === 'auth/requires-recent-login') {
          this.snackbar.open('Log opnieuw in om je wachtwoord te wijzigen', 'OK', { duration: 3000 });
        } else {
          this.snackbar.open('Wachtwoord wijzigen mislukt', 'OK', { duration: 3000 });
        }
        console.error(err);
      }
    });
  }
}
