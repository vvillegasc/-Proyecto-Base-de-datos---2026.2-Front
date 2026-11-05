import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { FacturaResponseDTO, PedidoResponseDTO, TipoMetodoPago } from '../../../models/model';
import { ESTADO_FACTURA, EstadoVisual } from '../../../utils/estados';
import { PrecioPipe } from '../../../pipes/precio.pipe';

const METODO_LABEL: Record<TipoMetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta débito / crédito',
  TRANSFERENCIA: 'Transferencia',
};

@Component({
  selector: 'app-factura-detalle',
  imports: [Badge, Button, PrecioPipe, DatePipe],
  templateUrl: './factura-detalle.html',
  styleUrl: './factura-detalle.css',
})
export class FacturaDetalle {
  @Input() factura!: FacturaResponseDTO;
  @Input() pedido: PedidoResponseDTO | null = null;
  @Input() aviso = '';
  @Output() imprimir = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  readonly metodoLabel = METODO_LABEL;

  get estado(): EstadoVisual {
    return ESTADO_FACTURA[this.factura.estado];
  }

  get subtotal(): number {
    return this.factura.total - this.factura.impuesto - this.factura.propina;
  }
}
