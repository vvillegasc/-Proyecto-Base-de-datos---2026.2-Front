import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardResumenDTO } from '../models/model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly url = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  resumen(): Observable<DashboardResumenDTO> {
    return this.http.get<DashboardResumenDTO>(`${this.url}/resumen`);
  }
}
