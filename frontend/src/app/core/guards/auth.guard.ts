import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protege rutas privadas: sin sesión válida → /login?returnUrl=<ruta pedida>. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.hasValidSession()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
