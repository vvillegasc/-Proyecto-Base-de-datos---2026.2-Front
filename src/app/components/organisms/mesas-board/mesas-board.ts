import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoMesa, MesaResponseDTO } from '../../../models/model';

@Component({
  selector: 'app-mesas-board',
  imports: [CommonModule],
  templateUrl: './mesas-board.html',
  styleUrl: './mesas-board.css',
})
export class MesasBoard {
  @Input() mesas: MesaResponseDTO[] = [];

  // Texto corto para que quepa en la casilla.
  readonly abreviatura: Record<EstadoMesa, string> = {
    DISPONIBLE: 'LIBRE',
    OCUPADA: 'OCUP',
    RESERVADA: 'RESERV',
    EN_MANTENIMIENTO: 'MANT',
  };
}
