import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * 1) Adjunta `Authorization: Bearer <token>` a las peticiones dirigidas a nuestra API
 *    (nunca a dominios de terceros, para no filtrar el token).
 * 2) Si la API responde 401 a una petición autenticada (token vencido o inválido),
 *    cierra la sesión y envía al usuario a /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.token();
  const esNuestraApi = req.url.startsWith(environment.apiUrl);
  const conToken = !!token && esNuestraApi;

  const peticion = conToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(peticion).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && conToken) {
        auth.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url, expired: 1 },
        });
      }
      return throwError(() => err);
    }),
  );
};
