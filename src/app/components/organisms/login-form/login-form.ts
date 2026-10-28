import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormField } from '../../molecules/form-field/form-field';
import { Button } from '../../atoms/button/button';
import { LoginRequestDTO } from '../../../models/model';

@Component({
  selector: 'app-login-form',
  imports: [FormField, Button],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  // Error que devuelve el back (credenciales, cuenta inactiva...).
  @Input() error = '';
  @Input() cargando = false;
  @Output() submitForm = new EventEmitter<LoginRequestDTO>();

  correo = '';
  contrasena = '';
  errorLocal = '';

  onSubmit(): void {
    if (!this.correo || !this.contrasena) {
      this.errorLocal = 'Completa todos los campos.';
      return;
    }
    this.errorLocal = '';
    this.submitForm.emit({ correo: this.correo, contrasena: this.contrasena });
  }
}
