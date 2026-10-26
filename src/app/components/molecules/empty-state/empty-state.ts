import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'app-empty-state',
  imports: [Button],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  @Input() title = 'Sin resultados';
  @Input() message = '';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
