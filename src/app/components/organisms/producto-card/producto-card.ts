import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { ProductoResponseDTO } from '../../../models/model';
import { DISPONIBILIDAD_PRODUCTO, EstadoVisual } from '../../../utils/estados';
import { PrecioPipe } from '../../../pipes/precio.pipe';

@Component({
  selector: 'app-producto-card',
  imports: [Badge, Button, PrecioPipe],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  @Input() producto!: ProductoResponseDTO;
  @Output() editar = new EventEmitter<ProductoResponseDTO>();
  @Output() eliminar = new EventEmitter<number>();

  get estado(): EstadoVisual {
    return this.producto.disponibilidad ? DISPONIBILIDAD_PRODUCTO.disponible : DISPONIBILIDAD_PRODUCTO.agotado;
  }
}
