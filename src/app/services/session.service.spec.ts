import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { MESERO } from '../testing/datos-prueba';

describe('SessionService', () => {
  beforeEach(() => localStorage.clear());

  it('inicia y cierra sesión, guardándola en localStorage', () => {
    const sesion = TestBed.inject(SessionService);
    expect(sesion.estaLogueado()).toBe(false);

    sesion.iniciar('jwt', MESERO);
    expect(sesion.token()).toBe('jwt');
    expect(sesion.esMesero()).toBe(true);
    expect(sesion.inicio()).toBe('/mesas');
    expect(localStorage.getItem('savana.sesion')).toContain('jwt');

    sesion.cerrar();
    expect(sesion.estaLogueado()).toBe(false);
    expect(localStorage.getItem('savana.sesion')).toBeNull();
  });

  it('recupera la sesión guardada al recargar', () => {
    localStorage.setItem('savana.sesion', JSON.stringify({ token: 'jwt', usuario: { ...MESERO, rol: 'ADMINISTRADOR' } }));
    const sesion = TestBed.inject(SessionService);
    expect(sesion.esAdmin()).toBe(true);
    expect(sesion.inicio()).toBe('/dashboard');
  });
});
