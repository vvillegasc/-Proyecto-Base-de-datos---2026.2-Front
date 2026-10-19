import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { PedidoResponseDTO } from '../../../models/model';

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

  get estadoBadgeVariant() {
    const map: Record<string, 'warning' | 'info' | 'success'> = {
      CREADA: 'warning',
      EN_PREPARACION: 'info',
      ENTREGADA: 'success',
    };
    return map[this.pedido.estado] ?? 'neutral';
  }

  get estadoLabel() {
    const map: Record<string, string> = {
      CREADA: 'CREADA',
      EN_PREPARACION: 'EN PREP.',
      ENTREGADA: 'ENTREGADA',
    };
    return map[this.pedido.estado] ?? this.pedido.estado;
  }

  get botonAvanzar() {
    const map: Record<string, string> = {
      CREADA: 'PASAR A EN PREPARACIÓN',
      EN_PREPARACION: 'PASAR A ENTREGADA',
    };
    return map[this.pedido.estado] ?? '';
  }

  formatPrice(value: number): string {
    return `$ ${value.toLocaleString('es-CO')}`;
  }
}
