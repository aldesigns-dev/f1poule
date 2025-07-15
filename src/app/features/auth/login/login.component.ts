import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormField, MatLabel, MatInputModule, MatError, MatButtonModule, ReactiveFormsModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly pageTitle = input<string>();

  hidePassword = true;
  redirectTo = '/dashboard'; 

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    // Als iemand van bijv. /poules/join/"inviteCode" komt, overschrijf default redirectTo.
    this.route.queryParamMap
      .pipe(take(1))
      .subscribe(params => {
        const redirect = params.get('redirectTo');
        if (redirect?.startsWith('/')) {
          this.redirectTo = redirect;
        }
      });
  }

  fieldIsInvalid(field: string) {
    const control = this.loginForm.get(field);
    return control?.touched && control.invalid;
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    try {
      const user = await this.authService.loginWithUsername(username!, password!);
      
      this.router.navigate([this.redirectTo], {
        state: { 
          fromPage: 'login', 
          username: user.username, 
          avatarUrl: user.avatarUrl, 
          createdAt: user.createdAt, 
        }
      });
    } catch (err: any) {
      console.error('Login mislukt:', err);
      this.snackbar.open('Ongeldige gebruikersnaam of wachtwoord.', 'Sluiten', { duration: 3000} );
    }
  }
}
