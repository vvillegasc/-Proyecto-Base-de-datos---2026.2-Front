import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { SessionService } from '../services/session.service';
import { MESERO } from '../testing/datos-prueba';
import { authGuard, invitadoGuard, rolGuard } from './auth.guards';

const ruta = (roles?: string[]) => ({ data: roles ? { roles } : {} }) as unknown as ActivatedRouteSnapshot;
const estado = {} as RouterStateSnapshot;
const ejecutar = (guard: typeof authGuard, r = ruta()) => TestBed.runInInjectionContext(() => guard(r, estado));
const destino = (res: unknown) => TestBed.inject(Router).serializeUrl(res as UrlTree);

describe('guards de autenticación', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('authGuard manda al login si no hay sesión', () => {
    expect(destino(ejecutar(authGuard))).toBe('/login');
    TestBed.inject(SessionService).iniciar('jwt', MESERO);
    expect(ejecutar(authGuard)).toBe(true);
  });

  it('rolGuard deja pasar solo a los roles permitidos', () => {
    TestBed.inject(SessionService).iniciar('jwt', MESERO);
    expect(destino(ejecutar(rolGuard, ruta(['ADMINISTRADOR'])))).toBe('/mesas');
    expect(ejecutar(rolGuard, ruta(['ADMINISTRADOR', 'MESERO']))).toBe(true);
  });

  it('invitadoGuard saca del login a quien ya inició sesión', () => {
    expect(ejecutar(invitadoGuard)).toBe(true);
    TestBed.inject(SessionService).iniciar('jwt', MESERO);
    expect(destino(ejecutar(invitadoGuard))).toBe('/mesas');
  });
});
