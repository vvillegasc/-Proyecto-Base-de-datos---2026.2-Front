import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoResponseDTO } from '../../../models/model';
import { Badge } from '../../atoms/badge/badge';
import { ESTADO_PEDIDO } from '../../../utils/estados';

@Component({
  selector: 'app-pedidos-recientes',
  imports: [CommonModule, Badge],
  templateUrl: './pedidos-recientes.html',
  styleUrl: './pedidos-recientes.css',
})
export class PedidosRecientes {
  @Input() pedidos: PedidoResponseDTO[] = [];
  readonly estados = ESTADO_PEDIDO;
}
