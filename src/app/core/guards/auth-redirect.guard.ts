import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const redirectIfLoggedIn: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(user => {
      if (user) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    })
  );
};