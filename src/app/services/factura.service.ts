import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FacturaResponseDTO } from '../models/model';
import { errorManejado } from '../interceptors/http-context';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private readonly url = `${environment.apiUrl}/facturas`;

  constructor(private http: HttpClient) {}

  // desde / hasta en formato YYYY-MM-DD (se envían como inicio y fin del día).
  // silencioso: si falla, no muestra el aviso de error (para consultas de fondo).
  listar(desde = '', hasta = '', silencioso = false): Observable<FacturaResponseDTO[]> {
    const params: Record<string, string> = {};
    if (desde) params['fechaInicio'] = `${desde}T00:00:00`;
    if (hasta) params['fechaFin'] = `${hasta}T23:59:59`;
    return this.http.get<FacturaResponseDTO[]>(this.url, { params, context: silencioso ? errorManejado() : undefined });
  }

  porPedido(idPedido: number): Observable<FacturaResponseDTO> {
    return this.http.get<FacturaResponseDTO>(`${this.url}/pedido/${idPedido}`);
  }
}
