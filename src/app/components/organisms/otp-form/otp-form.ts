import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, signal } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { OtpInput } from '../../molecules/otp-input/otp-input';

// El back guarda el código 5 minutos.
const VIGENCIA_SEGUNDOS = 5 * 60;

@Component({
  selector: 'app-otp-form',
  imports: [Button, OtpInput],
  templateUrl: './otp-form.html',
  styleUrl: './otp-form.css',
})
export class OtpForm implements OnInit, OnDestroy {
  @Input() correo = '';
  @Input() error = '';
  @Input() cargando = false;
  @Output() verificar = new EventEmitter<string>();
  @Output() reenviar = new EventEmitter<void>();
  @Output() otraCuenta = new EventEmitter<void>();

  @ViewChild(OtpInput) otp!: OtpInput;

  codigo = '';
  restante = signal(VIGENCIA_SEGUNDOS);
  private timer?: ReturnType<typeof setInterval>;

  get expirado(): boolean {
    return this.restante() <= 0;
  }

  get tiempo(): string {
    const s = Math.max(this.restante(), 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  ngOnInit(): void {
    this.iniciarTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  onVerificar(): void {
    if (this.codigo.length === 6 && !this.expirado) this.verificar.emit(this.codigo);
  }

  onReenviar(): void {
    this.otp.limpiar();
    this.iniciarTimer();
    this.reenviar.emit();
  }

  private iniciarTimer(): void {
    clearInterval(this.timer);
    this.restante.set(VIGENCIA_SEGUNDOS);
    this.timer = setInterval(() => {
      this.restante.update(s => s - 1);
      if (this.restante() <= 0) clearInterval(this.timer);
    }, 1000);
  }
}
