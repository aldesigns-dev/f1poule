import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, of, switchMap } from 'rxjs';

import { PouleService } from '../../core/services/poule.service';
import { AuthService } from '../../core/services/auth.service';
import { Poule } from '../../core/models/poule.model';
import { AppUser } from '../../core/models/user.model';
import { DialogNewPouleComponent } from '../../shared/dialogs/dialog-new-poule/dialog-new-poule.component';
import { DialogEditPouleComponent } from '../../shared/dialogs/dialog-edit-poule/dialog-edit-poule.component';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-poules',
  standalone: true,
  imports: [MatCardModule, MatDivider, MatButtonModule, MatListModule, MatTableModule, MatIconModule, MatSlideToggleModule, MatTooltipModule, MatInputModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './poules.component.html',
  styleUrl: './poules.component.scss'
})
export class PoulesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pouleService = inject(PouleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  readonly currentUser = signal<AppUser | null>(null);
  copiedCode = '';

  // I.c.m. async pipe beheert Angular de subscription automatisch.
  readonly userPoules$ = this.authService.currentUser$.pipe(
    switchMap(user => user ? this.pouleService.getPoulesByUser$(user.uid) : of([])),
    catchError(() => of([]))
  );

  readonly allPoules$ = this.pouleService.getAllPublicPoules$().pipe(
    catchError(() => of([]))
  );
  
  ngOnInit(): void {
    this.authService.currentUser$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(user => {
      this.currentUser.set(user);
    });
  }

  async openNewPouleDialog() {
    const dialogRef = this.dialog.open(DialogNewPouleComponent);
    const pouleName = await firstValueFrom(dialogRef.afterClosed());
    let user = this.currentUser();

    if (!user) user = await firstValueFrom(this.authService.currentUser$);

    if (pouleName && user) {
      const { name, description, isPublic } = pouleName;
      const newPoule = {
        name,
        description,
        isPublic,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        members: [user.uid]
      };

      try {
        await this.pouleService.createPoule(newPoule);
        this.snackbar.open('Poule aangemaakt!', 'Sluiten', { duration: 3000 });
      } catch (error) {
        console.error('Fout bij aanmaken poule:', error);
        this.snackbar.open('Aanmaken mislukt.', 'Sluiten', { duration: 3000 });
      }
    }
  }

  async openEditPouleDialog(poule: Poule) {
    const pouleCopy = structuredClone(poule);

    const dialogRef = this.dialog.open(DialogEditPouleComponent, {
      data: { poule: pouleCopy }
    });

    const result = await firstValueFrom(dialogRef.afterClosed());

    if (result) {
      const updatedData = {
        name: result.name,
        description: result.description,
        isPublic: result.isPublic,
      };
      try {
        await this.pouleService.updatePoule(poule.id!, updatedData);
        this.snackbar.open('Poule gewijzigd!', 'Sluiten', { duration: 3000 });
      } catch (error) {
        console.error('[PoulesComponent] Poule bijwerken mislukt:', error);
      }
    }
  }

  async onDeletePoule(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Poule verwijderen',
        message: 'Weet je zeker dat je deze poule wilt verwijderen? Dit kan niet ongedaan worden gemaakt.'
      }
    });

    // firstValueFrom is een RxJS helperfunctie die een Observable één waarde laat “uitzenden” en dan de Observable automatisch afsluit. Je krijgt die waarde als Promise terug. Daardoor kun je er await op gebruiken.
    const confirmed = await firstValueFrom(dialogRef.afterClosed());

    if (!confirmed) return;

    try {
      await this.pouleService.deletePoule(id);
      this.snackbar.open('Poule verwijderd!', 'Sluiten', { duration: 3000 });
      console.log('Poule verwijderd:', id);
    } catch (error) {
      console.error('Fout bij verwijderen poule:', error);
      this.snackbar.open('Verwijderen mislukt.', 'Sluiten', { duration: 3000 });
    }
  }

  isPouleOwner(poule: Poule): boolean {
    const user = this.currentUser();
    return user?.uid === poule.createdBy;
  }

  topPublicPoules(allPoules: Poule[]): Poule[] {
    return allPoules
      .filter(p => p.isPublic)
      .sort((a, b) => b.members.length - a.members.length)
      .slice(0, 10);
  }

  copyInviteLink(inviteCode: string) {
    const url = `${window.location.origin}/poules/join/${inviteCode}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedCode = inviteCode;
      setTimeout(() => this.copiedCode = '', 2000);
    });
  }

  isMember(poule: Poule): boolean {
    const user = this.currentUser();
    return !!user && poule.members?.includes(user.uid);
  }

  joinPoule(pouleId: string) {
    const user = this.currentUser();
    if (!user) {
      this.snackbar.open('Je moet ingelogd zijn om lid te worden van een poule.', 'Sluiten', { duration: 3000 });
      return;
    }

    this.pouleService.joinPoule(pouleId, user.uid)
      .then(() => {
        this.snackbar.open('Je bent lid geworden van de poule!', 'Sluiten', { duration: 3000 });
      })
      .catch(err => {
        this.snackbar.open('Fout bij lid worden van de poule.', 'Sluiten', { duration: 3000 });
        console.error(err);
      });
  }

  leavePoule(pouleId: string) {
    const user = this.currentUser();
    if (!user) {
      this.snackbar.open('Je moet ingelogd zijn om een poule te verlaten.', 'Sluiten', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Bevestiging',
        message: 'Weet je zeker dat je deze poule wilt verlaten?'
      }
    });

    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(confirmed => {
      if (!confirmed) return;
      
      this.pouleService.leavePoule(pouleId, user.uid)
      .then(() => {
        this.snackbar.open('Je hebt de poule verlaten.', 'Sluiten', { duration: 3000 });
      })
      .catch(err => {
        this.snackbar.open('Fout bij het verlaten van de poule.', 'Sluiten', { duration: 3000 });
        console.error(err);
      });
    });
  }

  goToPoule(pouleId: string) {
    this.router.navigate(['/poules', pouleId]);
  }
}
