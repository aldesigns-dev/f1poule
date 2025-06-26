import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-dialog-new-poule',
  standalone: true,
  imports: [MatDivider, MatInputModule, MatDialogActions, MatButtonModule, ReactiveFormsModule, MatRadioModule, MatDialogClose],
  templateUrl: './dialog-new-poule.component.html',
  styleUrl: './dialog-new-poule.component.scss'
})
export class DialogNewPouleComponent {
  private dialogRef = inject(MatDialogRef<DialogNewPouleComponent>);

  newPouleForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    isPublic: new FormControl(false, Validators.required)
  })

  fieldIsInvalid(field: string) {
    const control = this.newPouleForm.get(field);
    return control?.touched && control.invalid;
  }

  async onSubmit() {
    if (this.newPouleForm.invalid) return;
    this.dialogRef.close(this.newPouleForm.value);
  }
}
