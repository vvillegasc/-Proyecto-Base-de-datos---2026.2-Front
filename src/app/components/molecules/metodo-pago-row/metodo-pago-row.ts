import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagoRequestDTO, TipoMetodoPago } from '../../../models/model';
import { PrecioPipe } from '../../../pipes/precio.pipe';

// "recibido" es solo de pantalla (para calcular el cambio en efectivo); no se envía al back.
export interface PagoForm extends PagoRequestDTO {
  recibido?: number;
}

@Component({
  selector: 'app-metodo-pago-row',
  imports: [PrecioPipe],
  templateUrl: './metodo-pago-row.html',
  styleUrl: './metodo-pago-row.css',
})
export class MetodoPagoRow {
  @Input() pago!: PagoForm;
  @Input() metodos: TipoMetodoPago[] = [];
  @Input() restante = 0;
  @Input() removible = true;
  @Output() remove = new EventEmitter<void>();
  @Output() changed = new EventEmitter<void>();

  readonly labels: Record<TipoMetodoPago, string> = {
    EFECTIVO: 'Efectivo',
    TARJETA: 'Tarjeta',
    TRANSFERENCIA: 'Transferencia',
  };

  get cambio(): number {
    return Math.max((this.pago.recibido ?? 0) - this.pago.monto, 0);
  }

  setMetodo(event: Event): void {
    this.pago.tipoMetodoPago = (event.target as HTMLSelectElement).value as TipoMetodoPago;
    this.changed.emit();
  }

  setMonto(event: Event): void {
    this.pago.monto = +(event.target as HTMLInputElement).value || 0;
    this.changed.emit();
  }

  setRecibido(event: Event): void {
    this.pago.recibido = +(event.target as HTMLInputElement).value || 0;
  }

  usarRestante(): void {
    this.pago.monto = Math.round((this.pago.monto + this.restante) * 100) / 100;
    this.changed.emit();
  }
}
