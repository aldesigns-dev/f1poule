import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { AuthService } from '../../core/services/auth.service';
import { DialogAvatarComponent } from '../../shared/dialogs/dialog-avatar/dialog-avatar.component';
import { HideOnErrorDirective } from '../../shared/directives/hide-on-error.directive';
import { DialogChangePasswordComponent } from '../../shared/dialogs/dialog-change-password/dialog-change-password.component';
import { PouleService } from '../../core/services/poule.service';
import { Poule } from '../../core/models/poule.model';
import { AppUser } from '../../core/models/user.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCard, MatDivider, DatePipe, HideOnErrorDirective, MatTableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pouleService = inject(PouleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  readonly pageTitle = input<string>();
  readonly currentUser = signal<AppUser | null>(null);

  fromPage: string | undefined;
  username: string | undefined;
  userPoules: Poule[] = [];
  displayedColumns: string[] = ['name', 'members', 'status'];

  ngOnInit(): void {
    // Ophalen navigatiestaat van de router voor welkomstbericht.
    const state = history.state as { fromPage?: string; username?: string; };
    this.fromPage = state?.fromPage;
    this.username = state?.username;

    this.authService.currentUser$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(user => {
      console.log('[Dashboard] currentUser$ user:', user);
      this.currentUser.set(user);
      this.loadPouleData(user?.uid ?? '');
    });
  }

  private loadPouleData(userId: string) {
    this.pouleService.getPoulesByUser$(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: poules => {
          this.userPoules = poules;
        },
        error: err => {
          console.error('Fout bij ophalen van poules:', err);
          this.snackbar.open('Kon poules niet laden.', 'Sluiten', { duration: 3000 });
        }
      });
  }

  goToPoule(pouleId: string) {
    this.router.navigate(['/poules', pouleId]);
  }

  openAvatarDialog() {
    const dialogRef = this.dialog.open(DialogAvatarComponent);
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(selectedAvatar => {
      if (selectedAvatar) {
        this.authService.updateAvatar(selectedAvatar)
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
    .subscribe(result => {
      if (!result) return;
      this.handlePasswordChange(result.currentPassword, result.newPassword);
    });
  }

  private async handlePasswordChange(currentPassword: string, newPassword: string) {
    try {
      await this.authService.changePasswordWithReauth(currentPassword, newPassword);
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
  }
}
