import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputField } from '../../atoms/input-field/input-field';

@Component({
  selector: 'app-form-field',
  imports: [InputField],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {
  @Input() id = '';
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() value: string | number = '';
  @Input() error = '';
  @Output() valueChange = new EventEmitter<string>();
}
