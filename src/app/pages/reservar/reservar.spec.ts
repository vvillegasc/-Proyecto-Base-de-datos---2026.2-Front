import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { errorInterceptor } from '../../interceptors/error.interceptor';
import { Reservar } from './reservar';

const API = environment.apiUrl;
const mesa = (numeroMesa: number, capacidad: number) => ({ numeroMesa, capacidad, estado: 'DISPONIBLE' });

describe('Reservar', () => {
  let pagina: Reservar;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    pagina = TestBed.createComponent(Reservar).componentInstance;
    backend = TestBed.inject(HttpTestingController);
    Object.assign(pagina.form, { fecha: '2030-11-20', hora: '19:30', numeroPersonas: 3 });
    Object.assign(pagina.form, { nombre: 'Sara', apellido: 'Cliente', correo: 'sara@example.com', telefono: '3011234567' });
  });

  afterEach(() => backend.verify());

  const disponibles = (mesas: unknown[]) =>
    backend.expectOne(r => r.url === `${API}/reservas/disponibles`).flush(mesas);

  it('sin mesas disponibles se queda en el primer paso con el aviso', () => {
    pagina.verificarDisponibilidad();
    disponibles([]);
    expect(pagina.paso()).toBe(0);
    expect(pagina.sinDisponibilidad()).toBe(true);
  });

  it('reserva con la primera mesa y, si otro cliente la tomó (409), prueba con la siguiente', () => {
    pagina.verificarDisponibilidad();
    disponibles([mesa(2, 4), mesa(4, 6)]);
    expect(pagina.paso()).toBe(1);

    pagina.confirmar();
    const primera = backend.expectOne(`${API}/reservas`);
    expect(primera.request.body.numeroMesa).toBe(2);
    expect(primera.request.body.hora).toBe('19:30:00');
    primera.flush({ message: 'Mesa ocupada' }, { status: 409, statusText: 'Conflict' });

    const segunda = backend.expectOne(`${API}/reservas`);
    expect(segunda.request.body.numeroMesa).toBe(4);
    segunda.flush({ idReservaCompuesta: '9_6', numeroMesa: 4, estado: 'PENDIENTE' });

    expect(pagina.paso()).toBe(2);
    expect(pagina.reserva()?.numeroMesa).toBe(4);
  });

  // Fecha y hora locales (como las escribe el cliente) a partir de un Date.
  const local = (d: Date) => ({ fecha: d.toLocaleDateString('en-CA'), hora: d.toTimeString().slice(0, 5) });
  const mesaEn = (numeroMesa: number, capacidad: number, estado: string) => ({ numeroMesa, capacidad, estado });

  it('para una reserva cercana no asigna una mesa que ahora está ocupada', () => {
    Object.assign(pagina.form, local(new Date(Date.now() + 60 * 60 * 1000))); // dentro de 1 h
    pagina.verificarDisponibilidad();
    disponibles([mesaEn(1, 2, 'OCUPADA'), mesaEn(5, 2, 'DISPONIBLE')]);

    pagina.confirmar();
    expect(backend.expectOne(`${API}/reservas`).request.body.numeroMesa).toBe(5);
  });

  it('si todas las mesas cercanas están ocupadas ahora, avisa que no hay disponibilidad', () => {
    Object.assign(pagina.form, local(new Date(Date.now() + 60 * 60 * 1000)));
    pagina.verificarDisponibilidad();
    disponibles([mesaEn(1, 2, 'OCUPADA'), mesaEn(2, 4, 'RESERVADA')]);
    expect(pagina.sinDisponibilidad()).toBe(true);
    expect(pagina.paso()).toBe(0);
  });

  it('para una reserva lejana el estado actual de la mesa no importa', () => {
    Object.assign(pagina.form, local(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))); // en una semana
    pagina.verificarDisponibilidad();
    disponibles([mesaEn(1, 2, 'OCUPADA'), mesaEn(5, 2, 'DISPONIBLE')]);

    pagina.confirmar();
    expect(backend.expectOne(`${API}/reservas`).request.body.numeroMesa).toBe(1);
  });

  it('muestra los errores de validación del back debajo de cada campo', () => {
    pagina.verificarDisponibilidad();
    disponibles([mesa(2, 4)]);
    pagina.confirmar();
    backend
      .expectOne(`${API}/reservas`)
      .flush({ validationErrors: { correo: 'Correo inválido' } }, { status: 400, statusText: 'Bad Request' });
    expect(pagina.errores()).toEqual({ correo: 'Correo inválido' });
    expect(pagina.error()).toBe('Revisa los campos marcados en rojo.');
  });
});
