import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SessionService } from '../services/session.service';
import { MESERO } from '../testing/datos-prueba';
import { ToastService } from '../services/toast.service';
import { authInterceptor } from './auth.interceptor';
import { errorInterceptor, mensajeDeError } from './error.interceptor';
import { errorManejado } from './http-context';

describe('interceptores HTTP', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let sesion: SessionService;
  let toast: ToastService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    sesion = TestBed.inject(SessionService);
    toast = TestBed.inject(ToastService);
    sesion.iniciar('jwt-123', MESERO);
  });

  afterEach(() => backend.verify());

  it('agrega el token a las rutas del personal', () => {
    http.get('/api/pedidos').subscribe();
    expect(backend.expectOne('/api/pedidos').request.headers.get('Authorization')).toBe('Bearer jwt-123');
  });

  it('no manda el token a las rutas públicas', () => {
    http.post('/api/auth/login', {}).subscribe();
    http.get('/api/reservas/disponibles').subscribe();
    http.post('/api/reservas', {}).subscribe();
    for (const url of ['/api/auth/login', '/api/reservas/disponibles', '/api/reservas']) {
      expect(backend.expectOne(url).request.headers.has('Authorization')).toBe(false);
    }
  });

  it('un 401 fuera del login cierra la sesión y lleva al login', () => {
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    http.get('/api/pedidos').subscribe({ error: () => {} });
    backend.expectOne('/api/pedidos').flush({ message: 'Token inválido' }, { status: 401, statusText: 'Unauthorized' });
    expect(sesion.estaLogueado()).toBe(false);
    expect(navegar).toHaveBeenCalledWith(['/login']);
  });

  it('un 401 del login no cierra la sesión (lo muestra el formulario)', () => {
    http.post('/api/auth/login', {}, { context: errorManejado() }).subscribe({ error: () => {} });
    backend.expectOne('/api/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(sesion.estaLogueado()).toBe(true);
    expect(toast.toasts()).toEqual([]);
  });

  it('muestra el mensaje del back en un toast, y uno corto si hay errores por campo', () => {
    http.delete('/api/clientes/3').subscribe({ error: () => {} });
    backend.expectOne('/api/clientes/3').flush({ message: 'El cliente tiene historial' }, { status: 409, statusText: 'Conflict' });
    http.post('/api/clientes', {}).subscribe({ error: () => {} });
    backend.expectOne('/api/clientes').flush({ validationErrors: { correo: 'inválido' } }, { status: 400, statusText: 'Bad Request' });
    expect(toast.toasts().map(t => t.message)).toEqual(['El cliente tiene historial', 'Revisa los campos marcados en rojo.']);
  });

  it('mensajeDeError explica la falta de conexión y une los errores por campo', () => {
    http.get('/api/mesas').subscribe({ error: err => expect(mensajeDeError(err)).toContain('No se pudo conectar') });
    backend.expectOne('/api/mesas').error(new ProgressEvent('error'), { status: 0 });
  });
});
