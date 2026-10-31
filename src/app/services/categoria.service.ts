import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoriaRequestDTO, CategoriaResponseDTO } from '../models/model';

// La llave de la categoría es su nombre (puede tener espacios y tildes), por eso se codifica en la URL.
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly url = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listar(): Observable<CategoriaResponseDTO[]> {
    return this.http.get<CategoriaResponseDTO[]>(this.url);
  }

  crear(req: CategoriaRequestDTO): Observable<CategoriaResponseDTO> {
    return this.http.post<CategoriaResponseDTO>(this.url, req);
  }

  actualizar(nombre: string, req: CategoriaRequestDTO): Observable<CategoriaResponseDTO> {
    return this.http.put<CategoriaResponseDTO>(`${this.url}/${encodeURIComponent(nombre)}`, req);
  }

  eliminar(nombre: string): Observable<unknown> {
    return this.http.delete(`${this.url}/${encodeURIComponent(nombre)}`);
  }
}
