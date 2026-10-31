import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-textarea-field',
  imports: [],
  templateUrl: './textarea-field.html',
  styleUrl: './textarea-field.css',
  // El id va solo en el <input>; si quedara también en la etiqueta del componente habría dos elementos
  // con el mismo id y el <label for> apuntaría al equivocado.
  host: { '[attr.id]': 'null' },
})
export class TextareaField {
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() rows = 3;
  @Input() maxLength: number | null = null;
  @Input() error = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLTextAreaElement).value);
  }
}
