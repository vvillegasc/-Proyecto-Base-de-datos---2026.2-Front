import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FacturaRequestDTO, FacturaResponseDTO } from '../models/model';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly url = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  // Registra el pago y devuelve la factura generada (no existe POST /facturas).
  pagar(req: FacturaRequestDTO): Observable<FacturaResponseDTO> {
    return this.http.post<FacturaResponseDTO>(this.url, req);
  }
}
