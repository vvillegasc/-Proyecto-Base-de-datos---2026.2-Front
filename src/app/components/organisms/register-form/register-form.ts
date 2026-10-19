import { Component, EventEmitter, Output } from '@angular/core';
import { FormField } from '../../molecules/form-field/form-field';
import { Button } from '../../atoms/button/button';
import { RegistroRequestDTO } from '../../../models/model';

@Component({
  selector: 'app-register-form',
  imports: [FormField, Button],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  @Output() submitForm = new EventEmitter<RegistroRequestDTO>();
  @Output() goToLogin = new EventEmitter<void>();

  nombre = '';
  email = '';
  password = '';
  confirmar = '';
  error = '';

  onSubmit(): void {
    if (!this.nombre || !this.email || !this.password || !this.confirmar) {
      this.error = 'Completa todos los campos.';
      return;
    }
    if (this.password !== this.confirmar) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener mínimo 6 caracteres.';
      return;
    }
    this.error = '';
    this.submitForm.emit({ nombre: this.nombre, email: this.email, password: this.password });
  }
}
