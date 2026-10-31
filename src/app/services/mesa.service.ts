import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoMesa, MesaRequestDTO, MesaResponseDTO } from '../models/model';

@Injectable({ providedIn: 'root' })
export class MesaService {
  private readonly url = `${environment.apiUrl}/mesas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<MesaResponseDTO[]> {
    return this.http.get<MesaResponseDTO[]>(this.url);
  }

  crear(req: MesaRequestDTO): Observable<MesaResponseDTO> {
    return this.http.post<MesaResponseDTO>(this.url, req);
  }

  actualizar(numeroMesa: number, req: MesaRequestDTO): Observable<MesaResponseDTO> {
    return this.http.put<MesaResponseDTO>(`${this.url}/${numeroMesa}`, req);
  }

  cambiarEstado(numeroMesa: number, estado: EstadoMesa): Observable<MesaResponseDTO> {
    return this.http.patch<MesaResponseDTO>(`${this.url}/${numeroMesa}/estado`, null, { params: { estado } });
  }

  eliminar(numeroMesa: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${numeroMesa}`);
  }
}
