import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoReserva, MesaResponseDTO, ReservaRequestDTO, ReservaResponseDTO } from '../models/model';
import { errorManejado } from '../interceptors/http-context';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly url = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ReservaResponseDTO[]> {
    return this.http.get<ReservaResponseDTO[]>(this.url);
  }

  disponibles(fechaHora: string, numeroPersonas: number): Observable<MesaResponseDTO[]> {
    return this.http.get<MesaResponseDTO[]>(`${this.url}/disponibles`, {
      params: { fechaHora, numeroPersonas },
      context: errorManejado(),
    });
  }

  crear(req: ReservaRequestDTO): Observable<ReservaResponseDTO> {
    return this.http.post<ReservaResponseDTO>(this.url, req, { context: errorManejado() });
  }

  cambiarEstado(idReserva: number, nuevoEstado: EstadoReserva): Observable<ReservaResponseDTO> {
    return this.http.patch<ReservaResponseDTO>(`${this.url}/${idReserva}/estado`, { nuevoEstado });
  }
}
