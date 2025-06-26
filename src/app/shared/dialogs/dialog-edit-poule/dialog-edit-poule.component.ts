import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

import { Poule } from '../../../core/models/poule.model';

@Component({
  selector: 'app-dialog-edit-poule',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatDialogActions, MatDialogClose, MatRadioModule, MatIconModule, MatDivider],
  templateUrl: './dialog-edit-poule.component.html',
  styleUrl: './dialog-edit-poule.component.scss'
})
export class DialogEditPouleComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DialogEditPouleComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as { poule: Poule};
  
  editPouleForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    isPublic: new FormControl(false)
  });

  ngOnInit(): void {
    this.editPouleForm.patchValue({
      name: this.data.poule.name,
      description: this.data.poule.description,
      isPublic: this.data.poule.isPublic
    });
  }

  fieldIsInvalid(field: string) {
    const control = this.editPouleForm.get(field);
    return control?.touched && control.invalid;
  }

  async onSubmit() {
    if (this.editPouleForm.valid) {
      this.dialogRef.close({
        ...this.editPouleForm.value,
      });
    }
  }
}