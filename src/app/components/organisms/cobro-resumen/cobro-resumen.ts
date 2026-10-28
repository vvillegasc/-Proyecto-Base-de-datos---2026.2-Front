import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PedidoResponseDTO } from '../../../models/model';
import { PrecioPipe } from '../../../pipes/precio.pipe';

@Component({
  selector: 'app-cobro-resumen',
  imports: [PrecioPipe, DatePipe],
  templateUrl: './cobro-resumen.html',
  styleUrl: './cobro-resumen.css',
})
export class CobroResumen {
  @Input() pedido!: PedidoResponseDTO;
}
