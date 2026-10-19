import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { ProductoResponseDTO } from '../../../models/model';

@Component({
  selector: 'app-producto-card',
  imports: [Badge, Button],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  @Input() producto!: ProductoResponseDTO;
  @Output() editar = new EventEmitter<ProductoResponseDTO>();
  @Output() eliminar = new EventEmitter<number>();

  get badgeVariant() {
    return this.producto.disponible ? 'success' : 'danger';
  }

  get badgeLabel() {
    return this.producto.disponible ? 'ACTIVO' : 'INACTIVO';
  }

  formatPrice(value: number): string {
    return `$ ${value.toLocaleString('es-CO')}`;
  }
}
