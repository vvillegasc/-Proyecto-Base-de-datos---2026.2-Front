import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField } from '../../molecules/form-field/form-field';
import { TextareaField } from '../../molecules/textarea-field/textarea-field';
import { Button } from '../../atoms/button/button';
import { ProductoRequestDTO } from '../../../models/model';
import { CATEGORIAS_MOCK } from '../../../mocks/categorias.mock';

@Component({
  selector: 'app-producto-form',
  imports: [FormsModule, FormField, TextareaField, Button],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm {
  @Input() form!: ProductoRequestDTO;
  @Input() editando = false;
  @Output() guardar = new EventEmitter<void>();

  readonly categorias = CATEGORIAS_MOCK;
  imagenConError = false;

  onImagenChange(url: string): void {
    this.form.imagenUrl = url;
    this.imagenConError = false;
  }
}
