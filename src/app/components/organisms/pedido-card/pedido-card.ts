import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { EstadoPedido, PedidoResponseDTO } from '../../../models/model';

@Component({
  selector: 'app-pedido-card',
  imports: [Badge, Button],
  templateUrl: './pedido-card.html',
  styleUrl: './pedido-card.css',
})
export class PedidoCard {
  @Input() pedido!: PedidoResponseDTO;
  @Output() avanzar = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() verDetalle = new EventEmitter<PedidoResponseDTO>();

  get estadoBadgeVariant(): 'warning' | 'info' | 'success' | 'danger' | 'neutral' {
    const map: Record<EstadoPedido, 'warning' | 'info' | 'success' | 'danger' | 'neutral'> = {
      PENDIENTE: 'warning',
      EN_PREPARACION: 'info',
      ENTREGADO: 'success',
      PAGADO: 'neutral',
      CANCELADO: 'danger',
    };
    return map[this.pedido.estado];
  }

  get estadoLabel(): string {
    const map: Record<EstadoPedido, string> = {
      PENDIENTE: 'PENDIENTE',
      EN_PREPARACION: 'EN PREP.',
      ENTREGADO: 'ENTREGADO',
      PAGADO: 'PAGADO',
      CANCELADO: 'CANCELADO',
    };
    return map[this.pedido.estado];
  }

  get botonAvanzar(): string {
    const map: Partial<Record<EstadoPedido, string>> = {
      PENDIENTE: 'PASAR A EN PREPARACIÓN',
      EN_PREPARACION: 'PASAR A ENTREGADO',
    };
    return map[this.pedido.estado] ?? '';
  }

  formatPrice(value: number): string {
    return `$ ${value.toLocaleString('es-CO')}`;
  }
}
