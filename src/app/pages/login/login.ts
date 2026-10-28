import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLayout } from '../../components/templates/auth-layout/auth-layout';
import { LoginForm } from '../../components/organisms/login-form/login-form';
import { OtpForm } from '../../components/organisms/otp-form/otp-form';
import { AuthResponseDTO, LoginRequestDTO } from '../../models/model';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [AuthLayout, LoginForm, OtpForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  paso = signal<'credenciales' | 'codigo'>('credenciales');
  cargando = signal(false);
  error = signal('');

  // Se guardan para verificar el código y para "Reenviar código" (= repetir el login).
  private credenciales: LoginRequestDTO | null = null;
  correo = '';

  constructor(
    private auth: AuthService,
    private sesion: SessionService,
    private toast: ToastService,
    private router: Router,
  ) {}

  onLogin(req: LoginRequestDTO): void {
    this.credenciales = req;
    this.cargando.set(true);
    this.error.set('');
    this.auth.login(req).subscribe({
      next: res => {
        this.cargando.set(false);
        if (res.requiere2FA) {
          this.correo = res.usuario?.correo ?? req.correo;
          this.paso.set('codigo');
        } else {
          this.entrar(res);
        }
      },
      error: err => this.fallo(err),
    });
  }

  onVerificar(codigoOtp: string): void {
    this.cargando.set(true);
    this.error.set('');
    this.auth.verificar2FA({ correo: this.correo, codigoOtp }).subscribe({
      next: res => this.entrar(res),
      error: err => this.fallo(err),
    });
  }

  onReenviar(): void {
    if (!this.credenciales) return;
    this.error.set('');
    this.auth.login(this.credenciales).subscribe({
      next: () => this.toast.show(`Te enviamos un código nuevo a ${this.correo}`, 'success'),
      error: err => this.fallo(err),
    });
  }

  usarOtraCuenta(): void {
    this.credenciales = null;
    this.error.set('');
    this.paso.set('credenciales');
  }

  private entrar(res: AuthResponseDTO): void {
    this.cargando.set(false);
    if (!res.token || !res.usuario) return;
    this.sesion.iniciar(res.token, res.usuario);
    this.router.navigate([this.sesion.inicio()]);
  }

  private fallo(err: { message?: string }): void {
    this.cargando.set(false);
    this.error.set(err?.message ?? 'No se pudo iniciar sesión.');
  }
}
