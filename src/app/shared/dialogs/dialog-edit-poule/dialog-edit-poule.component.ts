import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDivider } from '@angular/material/divider';

import { Poule } from '../../../core/models/poule.model';
import { AppUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-dialog-edit-poule',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatDialogActions, MatDialogClose, MatRadioModule, MatIconModule, MatTableModule, MatDivider],
  templateUrl: './dialog-edit-poule.component.html',
  styleUrl: './dialog-edit-poule.component.scss'
})
export class DialogEditPouleComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DialogEditPouleComponent>);

  readonly data = inject(MAT_DIALOG_DATA) as { poule: Poule; members: AppUser[] };
  currentUser: AppUser | null = null;
  membersDataSource = new MatTableDataSource<AppUser>();
  displayedColumns = ['avatar', 'username', 'role', 'remove'];
  
  editPouleForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    isPublic: new FormControl(false, Validators.required)
  });

  ngOnInit(): void {
    // Formulier vullen.
    this.editPouleForm.patchValue({
      name: this.data.poule.name,
      description: this.data.poule.description,
      isPublic: this.data.poule.isPublic
    });
    // Tabel vullen.
    this.membersDataSource.data = this.data.members;
  }

  fieldIsInvalid(field: string) {
    const control = this.editPouleForm.get(field);
    return control?.touched && control.invalid;
  }

  isOwner(): boolean {
    return this.currentUser?.uid === this.data.poule.createdBy;
  }

  removeMember(uid: string): void {
    this.membersDataSource.data = this.membersDataSource.data.filter(member => member.uid !== uid);
  }

  async onSubmit() {
    if (this.editPouleForm.valid) {
      this.dialogRef.close({
        ...this.editPouleForm.value,
        members: this.membersDataSource.data as AppUser[]
      });
    }
    console.log('[DialogEditPoule] Leden bij sluiten:', this.membersDataSource.data);
  }
}