import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoPedido, PedidoRequestDTO, PedidoResponseDTO } from '../models/model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly url = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  // El back solo filtra por estado y cliente; mesa, mesero y fechas se filtran en la pantalla.
  listar(estado?: EstadoPedido): Observable<PedidoResponseDTO[]> {
    return this.http.get<PedidoResponseDTO[]>(this.url, { params: estado ? { estado } : {} });
  }

  obtener(id: number): Observable<PedidoResponseDTO> {
    return this.http.get<PedidoResponseDTO>(`${this.url}/${id}`);
  }

  crear(req: PedidoRequestDTO): Observable<PedidoResponseDTO> {
    return this.http.post<PedidoResponseDTO>(this.url, req);
  }

  // Solo hacia adelante. Cancelar = CANCELADO (no se borra el pedido).
  cambiarEstado(id: number, nuevoEstado: EstadoPedido): Observable<PedidoResponseDTO> {
    return this.http.patch<PedidoResponseDTO>(`${this.url}/${id}/estado`, { nuevoEstado });
  }
}
