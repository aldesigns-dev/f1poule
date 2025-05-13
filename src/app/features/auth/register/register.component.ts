import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  readonly pageTitle = input<string>();

  isRegistered = false;
  username = '';
  hidePassword = true;
  hideConfirmPassword = true;

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  fieldIsInvalid(field: string) {
    const control = this.registerForm.get(field);
    return control?.touched && control.invalid;
  }

  passwordsMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    const { email, password, firstName, lastName, username, confirmPassword } = this.registerForm.value;

    if (password!.length < 6) {
      this.snackbar.open('Wachtwoord moet minstens 6 tekens bevatten.', 'Sluiten',);
      return;
    }

    if (password !== confirmPassword) {
      this.snackbar.open('Wachtwoorden komen niet overeen.', 'Sluiten',);
      return;
    }

    try {
      await this.authService.createUser({
        email: email!,
        password: password!,
        firstName: firstName!,
        lastName: lastName!,
        username: username!,
      });
      this.username = username!;
      this.isRegistered = true;
      this.router.navigate(['/dashboard'], {
        state: { fromPage: 'register', username: username }
      });
    } catch (err: any) {
      if (err.message.includes('Gebruikersnaam is al in gebruik')) {
        this.snackbar.open('Gebruikersnaam is al in gebruik. Kies een andere.', 'Sluiten');
      } else if (err.code === 'auth/email-already-in-use') {
        this.snackbar.open('Dit e-mailadres is al in gebruik.', 'Sluiten');
      } else {
        this.snackbar.open('Registratie mislukt.', 'Sluiten');
      }
    }
  }
}
