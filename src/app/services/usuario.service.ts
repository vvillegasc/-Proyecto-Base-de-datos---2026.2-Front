import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoUsuario, UsuarioRequestDTO, UsuarioResponseDTO } from '../models/model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioResponseDTO[]> {
    return this.http.get<UsuarioResponseDTO[]>(this.url);
  }

  crear(req: UsuarioRequestDTO): Observable<UsuarioResponseDTO> {
    return this.http.post<UsuarioResponseDTO>(this.url, req);
  }

  actualizar(id: number, req: UsuarioRequestDTO): Observable<UsuarioResponseDTO> {
    return this.http.put<UsuarioResponseDTO>(`${this.url}/${id}`, req);
  }

  cambiarEstado(id: number, estado: EstadoUsuario): Observable<UsuarioResponseDTO> {
    return this.http.patch<UsuarioResponseDTO>(`${this.url}/${id}/estado`, null, { params: { estado } });
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
