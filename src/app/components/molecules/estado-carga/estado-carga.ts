import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmptyState } from '../empty-state/empty-state';

/** Lo que se muestra mientras una lista carga del back, o si falló. */
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
