import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaResponseDTO } from '../../../models/model';

@Component({
  selector: 'app-mesas-board',
  imports: [CommonModule],
  templateUrl: './mesas-board.html',
  styleUrl: './mesas-board.css',
})
export class MesasBoard {
  @Input() mesas: MesaResponseDTO[] = [];

  isOcupada(mesa: MesaResponseDTO): boolean {
    return mesa.estado === 'OCUPADA';
  }
}
