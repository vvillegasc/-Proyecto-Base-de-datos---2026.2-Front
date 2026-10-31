import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MetodoPagoResponseDTO } from '../models/model';

@Injectable({ providedIn: 'root' })
export class MetodoPagoService {
  private readonly url = `${environment.apiUrl}/metodos-pago`;

  constructor(private http: HttpClient) {}

  listar(): Observable<MetodoPagoResponseDTO[]> {
    return this.http.get<MetodoPagoResponseDTO[]>(this.url);
  }
}
