import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { TotalesBox } from '../../molecules/totales-box/totales-box';
import { MetodoPagoRow, PagoForm } from '../../molecules/metodo-pago-row/metodo-pago-row';
import { CobroResumen } from '../cobro-resumen/cobro-resumen';
import { FacturaRequestDTO, PedidoResponseDTO, TipoMetodoPago } from '../../../models/model';
import { METODOS_PAGO_MOCK } from '../../../mocks/metodos-pago.mock';
import { PrecioPipe } from '../../../pipes/precio.pipe';

const IVA = 0.19;

const redondear = (n: number) => Math.round(n * 100) / 100;

@Component({
  selector: 'app-cobro-form',
  imports: [Button, TotalesBox, MetodoPagoRow, CobroResumen, PrecioPipe],
  templateUrl: './cobro-form.html',
  styleUrl: './cobro-form.css',
})
export class CobroForm implements OnInit {
  @Input() pedido!: PedidoResponseDTO;
  @Output() confirmar = new EventEmitter<FacturaRequestDTO>();
  @Output() cancelar = new EventEmitter<void>();

  readonly metodos: TipoMetodoPago[] = METODOS_PAGO_MOCK.map(m => m.tipo);
  readonly propinasRapidas = [0, 5, 10];

  propina = 0;
  pagos: PagoForm[] = [];

  ngOnInit(): void {
    // Arranca con un solo pago en efectivo por el total.
    this.pagos = [{ tipoMetodoPago: 'EFECTIVO', monto: this.total }];
  }

  get subtotal(): number {
    return this.pedido.subtotal;
  }

  get impuesto(): number {
    return redondear(this.subtotal * IVA);
  }

  get total(): number {
    return redondear(this.subtotal + this.impuesto + this.propina);
  }

  get pagado(): number {
    return redondear(this.pagos.reduce((t, p) => t + (p.monto || 0), 0));
  }

  get diferencia(): number {
    return redondear(this.total - this.pagado);
  }

  get cuadra(): boolean {
    return this.diferencia === 0;
  }

  porcentajePropina(pct: number): number {
    return redondear(this.subtotal * (pct / 100));
  }

  setPropina(valor: number): void {
    this.propina = Math.max(valor || 0, 0);
  }

  agregarPago(): void {
    const usado = this.pagos.map(p => p.tipoMetodoPago);
    const libre = this.metodos.find(m => !usado.includes(m)) ?? 'EFECTIVO';
    this.pagos = [...this.pagos, { tipoMetodoPago: libre, monto: Math.max(this.diferencia, 0) }];
  }

  quitarPago(i: number): void {
    this.pagos = this.pagos.filter((_, idx) => idx !== i);
  }

  onConfirmar(): void {
    this.confirmar.emit({
      idPedido: this.pedido.idPedido,
      propina: this.propina,
      pagos: this.pagos.map(p => ({ tipoMetodoPago: p.tipoMetodoPago, monto: p.monto })),
    });
  }
}
