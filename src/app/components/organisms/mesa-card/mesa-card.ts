import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Button } from '../../atoms/button/button';
import { EstadoMesa, MesaResponseDTO } from '../../../models/model';
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
  @Output() eliminar = new EventEmitter<MesaResponseDTO>();
  @Output() cambiarEstado = new EventEmitter<{ mesa: MesaResponseDTO; estado: EstadoMesa }>();
  @Output() tomarPedido = new EventEmitter<MesaResponseDTO>();
  @Output() verPedido = new EventEmitter<MesaResponseDTO>();
  @Output() cobrar = new EventEmitter<MesaResponseDTO>();

  readonly estados = Object.entries(ESTADO_MESA) as [EstadoMesa, EstadoVisual][];

  get estado(): EstadoVisual {
    return ESTADO_MESA[this.mesa.estado];
  }

  onEstadoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const estado = select.value as EstadoMesa;
    // El select vuelve al estado actual: el cambio real lo decide la página.
    select.value = this.mesa.estado;
    if (estado !== this.mesa.estado) this.cambiarEstado.emit({ mesa: this.mesa, estado });
  }
}
