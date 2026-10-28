import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { ProductoResponseDTO } from '../../../models/model';
import { DISPONIBILIDAD_PRODUCTO, EstadoVisual } from '../../../utils/estados';
import { PrecioPipe } from '../../../pipes/precio.pipe';

const STOCK_BAJO = 10;

@Component({
  selector: 'app-producto-card',
  imports: [Badge, Button, PrecioPipe],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  @Input() producto!: ProductoResponseDTO;
  // false = solo lectura (vista del mesero).
  @Input() editable = true;
  @Output() editar = new EventEmitter<ProductoResponseDTO>();
  @Output() eliminar = new EventEmitter<ProductoResponseDTO>();

  get estado(): EstadoVisual {
    return this.producto.disponibilidad ? DISPONIBILIDAD_PRODUCTO.disponible : DISPONIBILIDAD_PRODUCTO.agotado;
  }

  get nivelStock(): 'ok' | 'bajo' | 'agotado' {
    if (this.producto.stock <= 0) return 'agotado';
    return this.producto.stock <= STOCK_BAJO ? 'bajo' : 'ok';
  }
}
