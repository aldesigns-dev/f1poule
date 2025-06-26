import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, of, switchMap, tap } from 'rxjs';

import { PouleService } from '../../core/services/poule.service';
import { AuthService } from '../../core/services/auth.service';
import { DialogNewPouleComponent } from '../../shared/dialogs/dialog-new-poule/dialog-new-poule.component';
import { Poule } from '../../core/models/poule.model';
import { AppUser } from '../../core/models/user.model';
import { DialogEditPouleComponent } from '../../shared/dialogs/dialog-edit-poule/dialog-edit-poule.component';

@Component({
  selector: 'app-poules',
  standalone: true,
  imports: [MatCardModule, MatDivider, MatButtonModule, MatListModule, MatTableModule, MatIconModule, MatSlideToggleModule, MatInputModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './poules.component.html',
  styleUrl: './poules.component.scss'
})
export class PoulesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pouleService = inject(PouleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  readonly pageTitle = input<string>();
  readonly currentUser = signal<AppUser | null>(null);
  copiedCode = '';

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

    if (!user) {
      user = await firstValueFrom(this.authService.currentUser$);
    }

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
        // this.snackbar.open('Poule aangemaakt!', 'Sluiten', { duration: 2500 });
      } catch (error) {
        // this.snackbar.open('Aanmaken mislukt.', 'Sluiten', { duration: 2500 });
      }
    }
  }

  async openEditPouleDialog(poule: Poule) {
    const users = await firstValueFrom(this.authService.getUsersByUids$(poule.members));

    const dialogRef = this.dialog.open(DialogEditPouleComponent, {
      data: {
        poule,
        members: users
      }
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    console.log('[PoulesComponent] Dialog gesloten, result:', result);
    if (result) {
      const updatedData = {
        name: result.name,
        description: result.description,
        isPublic: result.isPublic,
        members: (result.members as AppUser[]).map(user => user.uid)
      };
      console.log('[PoulesComponent] Result members:', result.members);

      try {
        await this.pouleService.updatePoule(poule.id!, updatedData);
      } catch (error) {
        console.error('[PoulesComponent] Poule bijwerken mislukt:', error);
      }
    }
  }

  async onDeletePoule(id: string) {
    const confirmed = confirm('Weet je zeker dat je deze poule wilt verwijderen? Dit kan niet ongedaan worden gemaakt.');

    if (!confirmed) {
      return;
    }
    try {
      await this.pouleService.deletePoule(id);
      console.log('Poule verwijderd:', id);
    } catch (error) {
      console.error('Fout bij verwijderen poule:', error);
      alert('Verwijderen mislukt. Probeer het later opnieuw.');
    }
  }

  isPouleOwner(poule: Poule): boolean {
    return this.currentUser()?.uid === poule.createdBy;
  }

  topPublicPoules(allPoules: Poule[]): Poule[] {
    return allPoules
      .filter(p => p.isPublic)
      .sort((a, b) => b.members.length - a.members.length)
      .slice(0, 10);
  }

  copyInviteLink(inviteCode: string) {
    const url = `${window.location.origin}/poules/${inviteCode}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedCode = inviteCode;
      setTimeout(() => this.copiedCode = '', 2000);
    });
  }
}
