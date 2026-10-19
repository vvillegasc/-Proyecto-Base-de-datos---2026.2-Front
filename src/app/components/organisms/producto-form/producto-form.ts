import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField } from '../../molecules/form-field/form-field';
import { Button } from '../../atoms/button/button';
import { ProductoRequestDTO } from '../../../models/model';

@Component({
  selector: 'app-producto-form',
  imports: [FormsModule, FormField, Button],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm {
  @Input() form!: ProductoRequestDTO;
  @Input() editando = false;
  @Output() guardar = new EventEmitter<void>();

  readonly categorias = ['Entrada', 'Plato Fuerte', 'Postre', 'Bebida'];
}
