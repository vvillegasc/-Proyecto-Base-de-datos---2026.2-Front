import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponseDTO, LoginRequestDTO, Verificar2FARequestDTO } from '../models/model';
import { errorManejado } from '../interceptors/http-context';

// Los errores de login los muestra el formulario, por eso no generan toast.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(req: LoginRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.url}/login`, req, { context: errorManejado() });
  }

  verificar2FA(req: Verificar2FARequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.url}/verificar-2fa`, req, { context: errorManejado() });
  }
}
