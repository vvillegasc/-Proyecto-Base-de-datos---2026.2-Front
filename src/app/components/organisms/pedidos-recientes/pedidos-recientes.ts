import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoPedido, PedidoResponseDTO } from '../../../models/model';
import { Badge } from '../../atoms/badge/badge';

@Component({
  selector: 'app-pedidos-recientes',
  imports: [CommonModule, Badge],
  templateUrl: './pedidos-recientes.html',
  styleUrl: './pedidos-recientes.css',
})
export class PedidosRecientes {
  @Input() pedidos: PedidoResponseDTO[] = [];

  badgeVariant(estado: EstadoPedido): 'warning' | 'info' | 'success' | 'danger' | 'neutral' {
    if (estado === 'PENDIENTE') return 'neutral';
    if (estado === 'EN_PREPARACION') return 'warning';
    if (estado === 'ENTREGADO') return 'success';
    if (estado === 'CANCELADO') return 'danger';
    return 'neutral';
  }

  estadoLabel(estado: EstadoPedido): string {
    if (estado === 'EN_PREPARACION') return 'EN PREP.';
    return estado;
  }
}
