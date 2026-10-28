import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RolUsuario } from '../models/model';
import { SessionService } from '../services/session.service';

// Rutas del personal: sin sesión → login.
export const authGuard: CanActivateFn = () => {
  const sesion = inject(SessionService);
  return sesion.estaLogueado() || inject(Router).createUrlTree(['/login']);
};

// Rutas con `data: { roles: [...] }`: si el rol no está permitido, va a la pantalla de inicio de su rol.
export const rolGuard: CanActivateFn = route => {
  const sesion = inject(SessionService);
  const roles = (route.data['roles'] ?? []) as RolUsuario[];
  const rol = sesion.rol();
  if (rol && (roles.length === 0 || roles.includes(rol))) return true;
  return inject(Router).createUrlTree([sesion.inicio()]);
};

// /login: si ya hay sesión, no tiene sentido mostrarlo.
export const invitadoGuard: CanActivateFn = () => {
  const sesion = inject(SessionService);
  return !sesion.estaLogueado() || inject(Router).createUrlTree([sesion.inicio()]);
};
