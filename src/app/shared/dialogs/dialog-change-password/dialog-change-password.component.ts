import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-dialog-change-password',
  standalone: true,
  imports: [MatDivider, MatButtonModule, MatFormField, MatLabel, MatError, MatDialogClose, MatDialogActions, ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './dialog-change-password.component.html',
  styleUrl: './dialog-change-password.component.scss'
})
export class DialogChangePasswordComponent {
  private dialogRef = inject(MatDialogRef<DialogChangePasswordComponent>);

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required),
  })

  fieldIsInvalid(field: string) {
    const control = this.changePasswordForm.get(field);
    return control?.touched && control.invalid;
  }

  passwordsDontMatch(): boolean {
    const { newPassword, confirmPassword } = this.changePasswordForm.value;
    return newPassword !== confirmPassword;
  }

  async onSubmit() {
    if (this.changePasswordForm.invalid || this.passwordsDontMatch()) return;
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    this.dialogRef.close({ currentPassword, newPassword });
  }
}
