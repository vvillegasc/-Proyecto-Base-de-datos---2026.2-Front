import { Component, EventEmitter, Output } from '@angular/core';
import { FormField } from '../../molecules/form-field/form-field';
import { Button } from '../../atoms/button/button';
import { UsuarioRequestDTO } from '../../../models/model';

@Component({
  selector: 'app-register-form',
  imports: [FormField, Button],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  @Output() submitForm = new EventEmitter<UsuarioRequestDTO>();
  @Output() goToLogin = new EventEmitter<void>();

  nombres = '';
  apellidos = '';
  correo = '';
  contrasena = '';
  confirmar = '';
  error = '';

  onSubmit(): void {
    if (!this.nombres || !this.correo || !this.contrasena || !this.confirmar) {
      this.error = 'Completa todos los campos.';
      return;
    }
    if (this.contrasena !== this.confirmar) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.contrasena.length < 6) {
      this.error = 'La contraseña debe tener mínimo 6 caracteres.';
      return;
    }
    this.error = '';
    this.submitForm.emit({
      nombres: this.nombres,
      apellidos: this.apellidos,
      correo: this.correo,
      contrasena: this.contrasena,
      rol: 'EMPLEADO',
    });
  }
}
