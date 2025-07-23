import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

import { PouleService } from '../../../core/services/poule.service';
import { AuthService } from '../../../core/services/auth.service';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';
import { Poule } from '../../../core/models/poule.model';
import { AppUser } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-poule-details',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, HideOnErrorDirective],
  templateUrl: './poule-details.component.html',
  styleUrl: './poule-details.component.scss'
})
export class PouleDetailsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pouleService = inject(PouleService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);
  readonly currentUser = signal<AppUser | null>(null);
  readonly poule = signal<Poule | null>(null);
  members = signal<{
    uid: string;
    position: number;
    avatarUrl?: string;
    username: string;
    points: number;
  }[]>([]);

  displayedColumns = ['position', 'user', 'points'];

  ngOnInit() {
    this.route.paramMap
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {
      const pouleId = params.get('id');
      if (pouleId) {
        this.loadMembers(pouleId);
      }
    });
    this.authService.currentUser$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(user => {
      this.currentUser.set(user);
    });
  }

  private loadMembers(pouleId: string) {
    this.pouleService.getPouleById$(pouleId)
    .pipe(
      switchMap(poule => {
        this.poule.set(poule); // Opslaan poule in de signal.
        // Ophalen poule leden.
        return this.authService.getUsersByUids$(poule.members ?? []).pipe(
          map(users => {
            const points = users.map(user => ({
              ...user,
              uid: user.uid,
              points: Math.floor(Math.random() * 91) + 10
            }));
            return points.sort((a, b) => b.points - a.points).map((user, index) => ({
              ...user,
              position: index + 1
            }));
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef))
    .subscribe(sortedMembers => {
      this.members.set(sortedMembers);
    });
  }

  get pouleId(): string {
    const id = this.poule()?.id;
    if (!id) {
      throw new Error('Poule ID is unexpectedly undefined');
    }
    return id;
  }

  isPouleOwner(poule: Poule): boolean {
    const user = this.currentUser();
    return user?.uid === poule.createdBy;
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

  removePouleMember(uid: string) {
    const poule = this.poule();
    if (!poule?.id) return;
    if (uid === poule.createdBy) return;

    const currentMembers = this.members();
    console.log('[PouleDetailsComponent] Huidige leden members signal:', currentMembers);
    const member = currentMembers.find(m => m.uid === uid);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Bevestiging',
        message: `Weet je zeker dat je ${member?.username ?? 'dit lid'} wilt verwijderen uit de poule?`
      }
    });

    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(confirmed => {
      if (!confirmed) return;

      const updatedMembers = currentMembers
      .map(m => m.uid)
      .filter(memberUid => memberUid !== uid);
      console.log('[PouleDetailsComponent] UIDs na verwijdering:', updatedMembers);

      this.pouleService.updatePouleMembers(poule.id!, updatedMembers)
      .then(() => {
        this.members.update(members => members.filter(member => member.uid !== uid));
        this.poule.update(p => ({ ...p!, members: updatedMembers }));
        this.snackbar.open('Lid succesvol verwijderd.', 'Sluiten', { duration: 3000 });
        console.log('[PouleDetailsComponent] Lid succesvol verwijderd.');
      })
      .catch(err => {
        console.error('[PouleDetailsComponent] Fout bij verwijderen lid:', err);
        this.members.set(currentMembers);
        this.snackbar.open('Fout bij verwijderen lid.', 'Sluiten', { duration: 3000 });
      });
    })
  }
}
