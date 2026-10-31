import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductoRequestDTO, ProductoResponseDTO } from '../models/model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly url = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ProductoResponseDTO[]> {
    return this.http.get<ProductoResponseDTO[]>(this.url);
  }

  crear(req: ProductoRequestDTO): Observable<ProductoResponseDTO> {
    return this.http.post<ProductoResponseDTO>(this.url, req);
  }

  actualizar(id: number, req: ProductoRequestDTO): Observable<ProductoResponseDTO> {
    return this.http.put<ProductoResponseDTO>(`${this.url}/${id}`, req);
  }

  eliminar(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
