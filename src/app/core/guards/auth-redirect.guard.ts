import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';

import { AuthService } from '../services/auth.service';

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