import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const token = auth.getToken();
  const role = auth.getRole();

  if (!token || !role) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as string[];

  if (allowedRoles.includes(role)) {
    return true;
  }

  if (role === 'operador') {
    return router.createUrlTree(['/main']);
  }

  if (role === 'supervisor') {
    return router.createUrlTree(['/cancellations']);
  }

  return router.createUrlTree(['/login']);
};
