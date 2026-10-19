import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { MesaResponseDTO } from '../../../models/model';

@Component({
  selector: 'app-mesa-card',
  imports: [Badge, Button],
  templateUrl: './mesa-card.html',
  styleUrl: './mesa-card.css',
})
export class MesaCard {
  @Input() mesa!: MesaResponseDTO;
  @Output() editar = new EventEmitter<MesaResponseDTO>();
  @Output() eliminar = new EventEmitter<number>();

  get badgeVariant() {
    return this.mesa.estado === 'DISPONIBLE' ? 'success' : 'danger';
  }
}
