import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmptyState } from '../empty-state/empty-state';

@Component({
  selector: 'app-estado-carga',
  imports: [EmptyState],
  templateUrl: './estado-carga.html',
  styleUrl: './estado-carga.css',
})
export class EstadoCarga {
  @Input() cargando = false;
  @Input() error = false;
  @Output() reintentar = new EventEmitter<void>();
}
