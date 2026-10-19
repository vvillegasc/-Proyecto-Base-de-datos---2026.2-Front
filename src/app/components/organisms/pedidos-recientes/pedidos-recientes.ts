import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoResponseDTO } from '../../../models/model';
import { Badge } from '../../atoms/badge/badge';

@Component({
  selector: 'app-pedidos-recientes',
  imports: [CommonModule, Badge],
  templateUrl: './pedidos-recientes.html',
  styleUrl: './pedidos-recientes.css',
})
export class PedidosRecientes {
  @Input() pedidos: PedidoResponseDTO[] = [];

  badgeVariant(estado: string): 'warning' | 'info' | 'success' | 'neutral' {
    if (estado === 'CREADA') return 'neutral';
    if (estado === 'EN_PREPARACION') return 'warning';
    if (estado === 'ENTREGADA') return 'success';
    return 'neutral';
  }

  estadoLabel(estado: string): string {
    if (estado === 'CREADA') return 'CREADA';
    if (estado === 'EN_PREPARACION') return 'EN PREP.';
    if (estado === 'ENTREGADA') return 'ENTREGADA';
    return estado;
  }
}
