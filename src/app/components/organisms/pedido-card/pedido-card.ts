import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { EstadoPedido, PedidoResponseDTO } from '../../../models/model';
import { ESTADO_PEDIDO, EstadoVisual } from '../../../utils/estados';
import { PrecioPipe } from '../../../pipes/precio.pipe';

@Component({
  selector: 'app-pedido-card',
  imports: [Badge, Button, PrecioPipe, DatePipe],
  templateUrl: './pedido-card.html',
  styleUrl: './pedido-card.css',
})
export class PedidoCard {
  @Input() pedido!: PedidoResponseDTO;
  @Output() avanzar = new EventEmitter<{ pedido: PedidoResponseDTO; estado: EstadoPedido }>();
  @Output() cancelar = new EventEmitter<PedidoResponseDTO>();
  @Output() cobrar = new EventEmitter<PedidoResponseDTO>();
  @Output() verFactura = new EventEmitter<PedidoResponseDTO>();
  @Output() verDetalle = new EventEmitter<PedidoResponseDTO>();

  get estado(): EstadoVisual {
    return ESTADO_PEDIDO[this.pedido.estado];
  }

  // Solo se avanza hacia adelante: PENDIENTE → EN_PREPARACION → ENTREGADO (PAGADO llega al cobrar).
  get siguiente(): { label: string; estado: EstadoPedido } | null {
    const map: Partial<Record<EstadoPedido, { label: string; estado: EstadoPedido }>> = {
      PENDIENTE: { label: 'PASAR A PREPARACIÓN', estado: 'EN_PREPARACION' },
      EN_PREPARACION: { label: 'MARCAR ENTREGADO', estado: 'ENTREGADO' },
    };
    return map[this.pedido.estado] ?? null;
  }
}
