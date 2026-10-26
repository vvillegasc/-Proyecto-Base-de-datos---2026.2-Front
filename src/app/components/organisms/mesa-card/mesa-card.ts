import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { MesaResponseDTO } from '../../../models/model';
import { ESTADO_MESA, EstadoVisual } from '../../../utils/estados';

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

  get estado(): EstadoVisual {
    return ESTADO_MESA[this.mesa.estado];
  }
}
