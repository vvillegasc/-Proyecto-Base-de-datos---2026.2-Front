import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { CategoriaService } from './categoria.service';
import { FacturaService } from './factura.service';
import { MesaService } from './mesa.service';
import { PedidoService } from './pedido.service';
import { ReservaService } from './reserva.service';
import { UsuarioService } from './usuario.service';

const API = environment.apiUrl;

// Verifica que cada servicio llame a la ruta y con el formato que espera el back.
describe('servicios HTTP', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('categorías: el nombre (llave) va codificado en la URL', () => {
    TestBed.inject(CategoriaService).eliminar('Bebidas Frías').subscribe();
    const req = backend.expectOne(`${API}/categorias/Bebidas%20Fr%C3%ADas`);
    expect(req.request.method).toBe('DELETE');
  });

  it('mesas y usuarios: el estado va como parámetro', () => {
    TestBed.inject(MesaService).cambiarEstado(5, 'EN_MANTENIMIENTO').subscribe();
    TestBed.inject(UsuarioService).cambiarEstado(3, 'INACTIVO').subscribe();
    expect(backend.expectOne(`${API}/mesas/5/estado?estado=EN_MANTENIMIENTO`).request.method).toBe('PATCH');
    expect(backend.expectOne(`${API}/usuarios/3/estado?estado=INACTIVO`).request.method).toBe('PATCH');
  });

  it('pedidos y reservas: el nuevo estado va en el cuerpo como nuevoEstado', () => {
    TestBed.inject(PedidoService).cambiarEstado(1, 'CANCELADO').subscribe();
    TestBed.inject(ReservaService).cambiarEstado(7, 'CONFIRMADA').subscribe();
    expect(backend.expectOne(`${API}/pedidos/1/estado`).request.body).toEqual({ nuevoEstado: 'CANCELADO' });
    expect(backend.expectOne(`${API}/reservas/7/estado`).request.body).toEqual({ nuevoEstado: 'CONFIRMADA' });
  });

  it('pedidos: filtra por estado solo si se pide', () => {
    const pedidos = TestBed.inject(PedidoService);
    pedidos.listar().subscribe();
    pedidos.listar('ENTREGADO').subscribe();
    backend.expectOne(`${API}/pedidos`);
    backend.expectOne(`${API}/pedidos?estado=ENTREGADO`);
  });

  it('facturas: el rango de fechas se envía como inicio y fin del día', () => {
    TestBed.inject(FacturaService).listar('2026-10-01', '2026-10-31').subscribe();
    const req = backend.expectOne(r => r.url === `${API}/facturas`);
    expect(req.request.params.get('fechaInicio')).toBe('2026-10-01T00:00:00');
    expect(req.request.params.get('fechaFin')).toBe('2026-10-31T23:59:59');
  });

  it('reservas: disponibilidad con fechaHora y número de personas', () => {
    TestBed.inject(ReservaService).disponibles('2026-11-20T19:30:00', 3).subscribe();
    backend.expectOne(`${API}/reservas/disponibles?fechaHora=2026-11-20T19:30:00&numeroPersonas=3`);
  });
});
