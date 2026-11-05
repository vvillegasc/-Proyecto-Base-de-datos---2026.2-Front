import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RolUsuario } from '../models/model';
import { SessionService } from '../services/session.service';

export const authGuard: CanActivateFn = () => {
  const sesion = inject(SessionService);
  return sesion.estaLogueado() || inject(Router).createUrlTree(['/login']);
};

export const rolGuard: CanActivateFn = (route) => {
  const sesion = inject(SessionService);
  const roles = (route.data['roles'] ?? []) as RolUsuario[];
  const rol = sesion.rol();
  if (rol && (roles.length === 0 || roles.includes(rol))) return true;
  return inject(Router).createUrlTree([sesion.inicio()]);
};

export const invitadoGuard: CanActivateFn = () => {
  const sesion = inject(SessionService);
  return !sesion.estaLogueado() || inject(Router).createUrlTree([sesion.inicio()]);
};
