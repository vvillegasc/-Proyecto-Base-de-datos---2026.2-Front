import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { EstadoMesa, MesaResponseDTO } from '../../../models/model';

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

  get badgeVariant(): 'success' | 'danger' | 'warning' | 'neutral' {
    const map: Record<EstadoMesa, 'success' | 'danger' | 'warning' | 'neutral'> = {
      DISPONIBLE: 'success',
      OCUPADA: 'danger',
      RESERVADA: 'warning',
      EN_MANTENIMIENTO: 'neutral',
    };
    return map[this.mesa.estado];
  }
}
