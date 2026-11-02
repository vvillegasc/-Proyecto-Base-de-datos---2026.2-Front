import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FacturaResponseDTO } from '../models/model';
import { MESERO } from '../testing/datos-prueba';
import { PropinasService } from './propinas.service';
import { SessionService } from './session.service';

const factura = (nombreUsuario: string, propina: number) => ({ nombreUsuario, propina }) as FacturaResponseDTO;

describe('PropinasService', () => {
  let propinas: PropinasService;
  let backend: HttpTestingController;
  let sesion: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    propinas = TestBed.inject(PropinasService);
    backend = TestBed.inject(HttpTestingController);
    sesion = TestBed.inject(SessionService);
  });

  afterEach(() => backend.verify());

  it('suma solo las propinas de hoy del mesero que inició sesión', () => {
    sesion.iniciar('jwt', MESERO); // Carlos Mesero
    propinas.cargarSiHaceFalta();
    const req = backend.expectOne(r => r.url.endsWith('/facturas'));
    const hoy = new Date().toLocaleDateString('en-CA');
    expect(req.request.params.get('fechaInicio')).toBe(`${hoy}T00:00:00`);
    req.flush([factura('Carlos Mesero', 2000), factura('Luisa Operativa', 5000), factura('Carlos Mesero', 1500)]);
    expect(propinas.hoy()).toBe(3500);

    propinas.cargarSiHaceFalta(); // mismo usuario: no vuelve a consultar
    backend.expectNone(r => r.url.endsWith('/facturas'));
  });

  it('al administrador no le muestra propinas', () => {
    sesion.iniciar('jwt', { ...MESERO, rol: 'ADMINISTRADOR' });
    propinas.cargarSiHaceFalta();
    backend.expectNone(r => r.url.endsWith('/facturas'));
    expect(propinas.hoy()).toBeNull();
  });
});
