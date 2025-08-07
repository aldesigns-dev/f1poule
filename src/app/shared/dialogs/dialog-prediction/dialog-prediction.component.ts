import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import { DriverStanding } from '../../../core/models/driver-standing.model';
import { Race } from '../../../core/models/race.model';
import { ConstructorStanding } from '../../../core/models/constructor-standing.model';

@Component({
  selector: 'app-dialog-prediction',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDivider, MatSelectModule],
  templateUrl: './dialog-prediction.component.html',
  styleUrl: './dialog-prediction.component.scss'
})
export class DialogPredictionComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DialogPredictionComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as { 
    race: Race; 
    pouleId: string; 
    user: any;
    driverStandings: DriverStanding[];
    constructorStandings: ConstructorStanding[];
  };

  constructorStandings: ConstructorStanding[] = [];
  driverStandings: DriverStanding[] = [];

  racePredictionForm = new FormGroup({
    driver1: new FormControl('', Validators.required),
    driver2: new FormControl('', Validators.required),
    driver3: new FormControl('', Validators.required),
    driver4: new FormControl('', Validators.required),
    driver5: new FormControl('', Validators.required),
    fastestLap: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.driverStandings = this.data.driverStandings;
    this.constructorStandings = this.data.constructorStandings;
  }

  shouldDriverBeDisabled(driverId: string, position: number): boolean {
    // Check if the driver is already selected in another position.
    for (let i = 1; i <= 5; i++) {
      if (i !== position && this.racePredictionForm.get(`driver${i}`)?.value === driverId) {
        return true;
      }
    }
    return false;
  }

  async onSubmit() {
    if (this.racePredictionForm.valid) {
      this.dialogRef.close({
        ...this.racePredictionForm.value,
      });
    }
  }
}
