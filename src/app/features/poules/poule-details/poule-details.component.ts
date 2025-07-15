import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

import { PouleService } from '../../../core/services/poule.service';
import { AuthService } from '../../../core/services/auth.service';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';
import { Poule } from '../../../core/models/poule.model';
import { AppUser } from '../../../core/models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-poule-details',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, HideOnErrorDirective],
  templateUrl: './poule-details.component.html',
  styleUrl: './poule-details.component.scss'
})
export class PouleDetailsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pouleService = inject(PouleService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
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

  isPouleOwner(poule: Poule): boolean {
    const user = this.currentUser();
    return user?.uid === poule.createdBy;
  }

  removePouleMember(uid: string) {
    const poule = this.poule();
    if (!poule?.id) return;
    if (uid === poule.createdBy) return;

    const currentMembers = this.members();
    console.log('[PouleDetailsComponent] Huidige leden members signal:', currentMembers);


    const updatedMembers = currentMembers
      .map(m => m.uid)
      .filter(memberUid => memberUid !== uid);
    console.log('[PouleDetailsComponent] UIDs na verwijdering:', updatedMembers);

    this.pouleService.updatePouleMembers(poule.id, updatedMembers)
    .then(() => {
      this.members.update(members => members.filter(member => member.uid !== uid));
      this.poule.update(p => ({ ...p!, members: updatedMembers }));
      console.log('[PouleDetailsComponent] Lid succesvol verwijderd.');
    })
    .catch(err => {
      console.error('[PouleDetailsComponent] Fout bij verwijderen lid:', err);
      this.members.set(currentMembers);
    });
  }
}
