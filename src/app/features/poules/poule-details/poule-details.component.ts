import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

import { PouleService } from '../../../core/services/poule.service';
import { AuthService } from '../../../core/services/auth.service';
import { HideOnErrorDirective } from '../../../shared/directives/hide-on-error.directive';
import { Poule } from '../../../core/models/poule.model';
import { AppUser } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/dialog-confirm/dialog-confirm.component';
import { Race } from '../../../core/models/race.model';
import { JolpicaF1Service } from '../../../core/services/jolpica-f1.service';
import { getTrackSvg } from '../../../shared/utils/track-utils';
import { getCountryFlagImage } from '../../../shared/utils/flag-utils';
import { DialogPredictionComponent } from '../../../shared/dialogs/dialog-prediction/dialog-prediction.component';

@Component({
  selector: 'app-poule-details',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDivider, HideOnErrorDirective],
  providers: [DatePipe],
  templateUrl: './poule-details.component.html',
  styleUrl: './poule-details.component.scss'
})
export class PouleDetailsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pouleService = inject(PouleService);
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);
  private readonly datePipe = inject(DatePipe);
  private readonly sanitizer = inject(DomSanitizer);
  readonly currentUser = signal<AppUser | null>(null);
  readonly poule = signal<Poule | null>(null);

  members = signal<{
    uid: string;
    position: number;
    avatarUrl?: string;
    username: string;
    points: number;
  }[]>([]);

  memberColumns: string[] = ['position', 'user', 'points'];
  nextRace: Race | null = null;
  raceColumns: string[] = ['label', 'date', 'time'];
  raceInfo: { label: string; date: string; startTime: string; endTime: string }[] = [];
  dateRange: string = '';
  safeSvg: SafeHtml | null = null;

  getCountryFlagImage = getCountryFlagImage;

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
    this.loadNextRace();
  }

  private loadMembers(pouleId: string) {
    this.pouleService.getPouleById$(pouleId)
    .pipe(
      switchMap(poule => {
        this.poule.set(poule);
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
        message: `Weet je zeker dat je "${member?.username ?? 'dit lid'}" wilt verwijderen uit de poule?`
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

  private loadNextRace() {
    this.jolpicaF1Service.getRacesSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (races) => {
        const now = new Date();

        // Zoek eerstvolgende race. 
        const upcomingRace = races.find(r => {
          const start = new Date(`${r.date}T${r.time}`);
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 uur extra.
          return end > now;
        });

        this.nextRace = upcomingRace ?? null;

        if (!this.nextRace) return;

        // Datum raceweekend.
        this.dateRange = this.formatDateRange(this.nextRace.FirstPractice.date, this.nextRace.date);

        // Ophalen bijbehorende svg.
        const circuitId = this.nextRace.Circuit?.circuitId;
        const svg = getTrackSvg(circuitId);
        this.safeSvg = svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;

        // Weergave data in table.
        this.raceInfo = [];

        if (this.nextRace.FirstPractice) {
          this.raceInfo.push({
            label: '1e vrije training',
            date: this.formatDate(this.nextRace.FirstPractice.date),
            startTime: this.formatTime(this.nextRace.FirstPractice.date, this.nextRace.FirstPractice.time),
            endTime: this.formatTimeWithOffset(this.nextRace.FirstPractice.date, this.nextRace.FirstPractice.time, 60)
          });
        }
        if (this.nextRace.SecondPractice) {
          this.raceInfo.push({
            label: '2e vrije training',
            date: this.formatDate(this.nextRace.SecondPractice.date),
            startTime: this.formatTime(this.nextRace.SecondPractice.date, this.nextRace.SecondPractice.time),
            endTime: this.formatTimeWithOffset(this.nextRace.SecondPractice.date, this.nextRace.SecondPractice.time, 60)
          });
        }
        if (this.nextRace.ThirdPractice) {
          this.raceInfo.push({
            label: '3e vrije training',
            date: this.formatDate(this.nextRace.ThirdPractice.date),
            startTime: this.formatTime(this.nextRace.ThirdPractice.date, this.nextRace.ThirdPractice.time),
            endTime: this.formatTimeWithOffset(this.nextRace.ThirdPractice.date, this.nextRace.ThirdPractice.time, 60)
          });
        }
        if (this.nextRace.SprintQualifying) {
          this.raceInfo.push({
            label: 'Sprint kwalificatie',
            date: this.formatDate(this.nextRace.SprintQualifying.date),
            startTime: this.formatTime(this.nextRace.SprintQualifying.date, this.nextRace.SprintQualifying.time),
            endTime: this.formatTimeWithOffset(this.nextRace.SprintQualifying.date, this.nextRace.SprintQualifying.time, 60)
          });
        }
        if (this.nextRace.Sprint) {
          this.raceInfo.push({
            label: 'Sprint',
            date: this.formatDate(this.nextRace.Sprint.date),
            startTime: this.formatTime(this.nextRace.Sprint.date, this.nextRace.Sprint.time),
            endTime: this.formatTimeWithOffset(this.nextRace.Sprint.date, this.nextRace.Sprint.time, 60)
          });
        }
        if (this.nextRace.Qualifying) {
          this.raceInfo.push({
            label: 'Kwalificatie',
            date: this.formatDate(this.nextRace.Qualifying.date),
            startTime: this.formatTime(this.nextRace.Qualifying.date, this.nextRace.Qualifying.time),
            endTime: this.formatTimeWithOffset(this.nextRace.Qualifying.date, this.nextRace.Qualifying.time, 60)
          });
        }
        this.raceInfo.push({
          label: 'Race',
          date: this.formatDate(this.nextRace.date),
          startTime: this.formatTime(this.nextRace.date, this.nextRace.time),
          endTime: this.formatTimeWithOffset(this.nextRace.date, this.nextRace.time, 120),
        });
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open('Fout bij ophalen van data. Probeer het later opnieuw.', 'Sluiten', { duration: 3000 });
      }
    })
  }

  private formatDate(date: string): string {
    return this.datePipe.transform(new Date(date), 'dd-MM-yyyy', 'nl') ?? '';
  }

  private formatTime(date: string, time: string): string {
    const fullDate = new Date(`${date}T${time}`);
    return this.datePipe.transform(fullDate, 'HH:mm') ?? '';
  }

  private formatTimeWithOffset(date: string, time: string, offsetMinutes: number): string {
    const fullDate = new Date(`${date}T${time}`);
    fullDate.setMinutes(fullDate.getMinutes() + offsetMinutes);
    return this.datePipe.transform(fullDate, 'HH:mm') ?? '';
  }

  private formatDateRange(startDateStr: string, endDateStr: string): string {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    const month = this.datePipe.transform(endDate, 'MMM') ?? '';
    // const year = endDate.getFullYear();

    return `${startDay} ${month} - ${endDay} ${month}`;
  }

  openPredictionDialog() {
    if (!this.nextRace || !this.poule()) return;

    this.dialog.open(DialogPredictionComponent, {
      data: {
        race: this.nextRace,
        pouleId: this.pouleId,
        user: this.currentUser()
      }
    });
  }
}
