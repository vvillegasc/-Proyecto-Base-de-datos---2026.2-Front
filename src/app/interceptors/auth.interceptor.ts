import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';

// Rutas públicas del back: no llevan token (un token vencido guardado no debe hacerlas fallar).
function esPublica(req: HttpRequest<unknown>): boolean {
  return (
    req.url.includes('/auth/') ||
    req.url.includes('/reservas/disponibles') ||
    (req.method === 'POST' && req.url.endsWith('/reservas'))
  );
}

// Agrega "Authorization: Bearer <token>" a las peticiones del personal.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(SessionService).token();
  if (!token || esPublica(req)) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
