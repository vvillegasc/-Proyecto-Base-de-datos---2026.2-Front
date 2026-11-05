import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-input-field',
  imports: [],
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
  host: { '[attr.id]': 'null' },
})
export class InputField {
  @Input() id = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() value: string | number = '';
  @Input() disabled = false;
  @Input() invalido = false;
  @Output() valueChange = new EventEmitter<string>();

  contrasenaVisible = signal(false);

  get tipoReal(): string {
    return this.type === 'password' && this.contrasenaVisible() ? 'text' : this.type;
  }

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
