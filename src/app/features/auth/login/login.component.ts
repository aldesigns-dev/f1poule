import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  readonly pageTitle = input<string>();

  isLoggedIn = false;
  username = '';
  hidePassword = true;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  fieldIsInvalid(field: string) {
    const control = this.loginForm.get(field);
    return control?.touched && control.invalid;
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    try {
      const user = await this.authService.loginWithUsername(username!, password!);
      this.isLoggedIn = true;
      this.username = user.displayName || username!;
      this.router.navigate(['/dashboard'], {
        state: { fromPage: 'login', username: this.username }
      });
    } catch (err: any) {
      console.error('Login mislukt:', err);
      this.snackbar.open('Ongeldige gebruikersnaam of wachtwoord.', 'Sluiten');
    }
  }
}
