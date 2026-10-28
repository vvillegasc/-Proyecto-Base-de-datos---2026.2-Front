import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { AuthResponseDTO, LoginRequestDTO, Verificar2FARequestDTO } from '../models/model';
import { USUARIOS_MOCK } from '../mocks/usuarios.mock';

// SIMULADO: responde como POST /api/auth/login y /api/auth/verificar-2fa del back.
// En la fase 9 estos métodos pasan a usar HttpClient con la misma firma.
const CONTRASENA_DEMO = 'Password123';
const CODIGO_DEMO = '123456';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(req: LoginRequestDTO): Observable<AuthResponseDTO> {
    const usuario = USUARIOS_MOCK.find(u => u.correo.toLowerCase() === req.correo.trim().toLowerCase());
    if (!usuario || req.contrasena !== CONTRASENA_DEMO) {
      return this.error('Correo o contraseña incorrectos.');
    }
    if (usuario.estado === 'INACTIVO') {
      return this.error('Tu cuenta fue desactivada por el administrador.');
    }
    if (usuario.dosFacHab) {
      return of<AuthResponseDTO>({
        token: undefined,
        requiere2FA: true,
        mensaje: `Enviamos un código de verificación a ${usuario.correo}. Válido por 5 minutos.`,
        usuario,
      }).pipe(delay(400));
    }
    return of<AuthResponseDTO>({ token: 'token-simulado', tipoToken: 'Bearer', requiere2FA: false, usuario }).pipe(
      delay(400),
    );
  }

  verificar2FA(req: Verificar2FARequestDTO): Observable<AuthResponseDTO> {
    const usuario = USUARIOS_MOCK.find(u => u.correo === req.correo);
    if (!usuario || req.codigoOtp !== CODIGO_DEMO) {
      return this.error('El código no es válido. Revísalo e intenta de nuevo.');
    }
    return of<AuthResponseDTO>({ token: 'token-simulado', tipoToken: 'Bearer', requiere2FA: false, usuario }).pipe(
      delay(400),
    );
  }

  private error(message: string): Observable<never> {
    return throwError(() => ({ message })).pipe(delay(400));
  }
}
