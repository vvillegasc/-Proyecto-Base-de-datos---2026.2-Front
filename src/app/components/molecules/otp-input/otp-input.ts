import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

/** Código de N dígitos en casillas separadas: avanza solo, retrocede con borrar y acepta pegar el código. */
@Component({
  selector: 'app-otp-input',
  imports: [],
  templateUrl: './otp-input.html',
  styleUrl: './otp-input.css',
})
export class OtpInput {
  @Input() longitud = 6;
  @Input() error = false;
  @Input() disabled = false;
  @Output() codigoChange = new EventEmitter<string>();

  @ViewChildren('casilla') casillas!: QueryList<ElementRef<HTMLInputElement>>;

  digitos: string[] = [];

  get indices(): number[] {
    return Array.from({ length: this.longitud }, (_, i) => i);
  }

  onInput(i: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.replace(/\D/g, '').slice(-1);
    input.value = valor;
    this.digitos[i] = valor;
    this.emitir();
    if (valor && i < this.longitud - 1) this.enfocar(i + 1);
  }

  onKeydown(i: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digitos[i] && i > 0) this.enfocar(i - 1);
  }

  onPaste(event: ClipboardEvent): void {
    const texto = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, this.longitud);
    if (!texto) return;
    event.preventDefault();
    this.digitos = texto.split('');
    this.casillas.forEach((c, i) => (c.nativeElement.value = this.digitos[i] ?? ''));
    this.emitir();
    this.enfocar(Math.min(texto.length, this.longitud - 1));
  }

  limpiar(): void {
    this.digitos = [];
    this.casillas.forEach(c => (c.nativeElement.value = ''));
    this.emitir();
    this.enfocar(0);
  }

  private emitir(): void {
    this.codigoChange.emit(this.indices.map(i => this.digitos[i] ?? '').join(''));
  }

  private enfocar(i: number): void {
    this.casillas.get(i)?.nativeElement.focus();
  }
}
