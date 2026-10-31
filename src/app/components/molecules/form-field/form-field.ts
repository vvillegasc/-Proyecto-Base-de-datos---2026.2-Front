import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputField } from '../../atoms/input-field/input-field';

@Component({
  selector: 'app-form-field',
  imports: [InputField],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
  // El id va solo en el <input>; si quedara también en la etiqueta del componente habría dos elementos
  // con el mismo id y el <label for> apuntaría al equivocado.
  host: { '[attr.id]': 'null' },
})
export class FormField {
  @Input() id = '';
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() value: string | number = '';
  @Input() error = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();
}
