import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() submitForm = new EventEmitter<LoginRequestDTO>();
  @Output() goToRegister = new EventEmitter<void>();

  correo = '';
  contrasena = '';
  error = '';

  onSubmit(): void {
    if (!this.correo || !this.contrasena) {
      this.error = 'Completa todos los campos.';
      return;
    }
    this.error = '';
    this.submitForm.emit({ correo: this.correo, contrasena: this.contrasena });
  }
}
