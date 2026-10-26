import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { EstadoPedido, PedidoResponseDTO } from '../../../models/model';
import { ESTADO_PEDIDO, EstadoVisual } from '../../../utils/estados';
import { PrecioPipe } from '../../../pipes/precio.pipe';

@Component({
  selector: 'app-pedido-card',
  imports: [Badge, Button, PrecioPipe],
  templateUrl: './pedido-card.html',
  styleUrl: './pedido-card.css',
})
export class PedidoCard {
  @Input() pedido!: PedidoResponseDTO;
  @Output() avanzar = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() verDetalle = new EventEmitter<PedidoResponseDTO>();

  get estado(): EstadoVisual {
    return ESTADO_PEDIDO[this.pedido.estado];
  }

  get botonAvanzar(): string {
    const map: Partial<Record<EstadoPedido, string>> = {
      PENDIENTE: 'PASAR A EN PREPARACIÓN',
      EN_PREPARACION: 'PASAR A ENTREGADO',
    };
    return map[this.pedido.estado] ?? '';
  }
}
