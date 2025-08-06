import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JolpicaF1Service } from '../../../core/services/jolpica-f1.service';
import { DriverStanding } from '../../../core/models/driver-standing.model';
import { Race } from '../../../core/models/race.model';
import { ConstructorStanding } from '../../../core/models/constructor-standing.model';

@Component({
  selector: 'app-dialog-prediction',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogActions, MatDivider, MatSelectModule],
  templateUrl: './dialog-prediction.component.html',
  styleUrl: './dialog-prediction.component.scss'
})
export class DialogPredictionComponent implements OnInit {
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DialogPredictionComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as { race: Race; pouleId: string; user: any };

  constructorStandings: ConstructorStanding[] = [];
  driverStandings: DriverStanding[] = [];

  racePredictionForm = new FormGroup({
    driver1: new FormControl('', Validators.required),
    driver2: new FormControl('', Validators.required),
    driver3: new FormControl('', Validators.required),
    driver4: new FormControl('', Validators.required),
    driver5: new FormControl('', Validators.required),
    fastestLap: new FormControl('', [Validators.required]),
    fastestPitStop: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.loadDriverStandingsSeason();
    this.loadConstructorStandingsSeason();
  }

  private loadDriverStandingsSeason() {
    this.jolpicaF1Service.getDriverStandingsSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.driverStandings = data.standings;
        console.log('[DriversComponent] DriverStandings:', this.driverStandings);
      },
      error: (err) => {
        this.snackbar.open('Fout bij ophalen van coureurs. Probeer het later opnieuw', 'Sluiten', { duration: 3000} );
        console.error('[DriversComponent] Fout bij ophalen van driver standings:', err);
      }
    });
  }

  private loadConstructorStandingsSeason() {
    this.jolpicaF1Service.getConstructorStandingsSeason()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.constructorStandings = data;
        console.log('[DialogPredictionComponent] ConstructorStandings:', this.constructorStandings);
      },
      error: (err) => {
        this.snackbar.open('Fout bij ophalen van teams. Probeer het later opnieuw.', 'Sluiten', { duration: 3000 });
        console.error('[DialogPredictionComponent] Fout bij ophalen constructor standings:', err);
      }
    });
  }

  async onSubmit() {
    if (this.racePredictionForm.valid) {
      this.dialogRef.close({
        ...this.racePredictionForm.value,
      });
    }
  }
}
