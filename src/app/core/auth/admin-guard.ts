import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.user()?.isAdmin) {
    return true;
  }

  router.navigateByUrl('/home', { replaceUrl: true });
  return false;
};
