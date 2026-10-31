import { TestBed } from '@angular/core/testing';
import { EstadoPedido } from '../../../models/model';
import { PEDIDO } from '../../../testing/datos-prueba';
import { PedidoCard } from './pedido-card';

function botones(estado: EstadoPedido, soloLectura = false): string[] {
  const fixture = TestBed.createComponent(PedidoCard);
  fixture.componentRef.setInput('pedido', { ...PEDIDO, estado });
  fixture.componentRef.setInput('soloLectura', soloLectura);
  fixture.detectChanges();
  return [...fixture.nativeElement.querySelectorAll('button')].map((b: HTMLButtonElement) => b.textContent!.trim());
}

describe('PedidoCard', () => {
  it('muestra solo las acciones que corresponden a cada estado', () => {
    expect(botones('PENDIENTE')).toEqual(['PASAR A PREPARACIÓN', 'VER DETALLE', 'CANCELAR']);
    expect(botones('EN_PREPARACION')).toEqual(['MARCAR ENTREGADO', 'VER DETALLE']);
    expect(botones('ENTREGADO')).toEqual(['COBRAR', 'VER DETALLE']);
    expect(botones('PAGADO')).toEqual(['VER FACTURA', 'VER DETALLE']);
    expect(botones('CANCELADO')).toEqual(['VER DETALLE']);
  });

  it('en solo lectura (admin) no deja avanzar, cobrar ni cancelar', () => {
    expect(botones('PENDIENTE', true)).toEqual(['VER DETALLE']);
    expect(botones('ENTREGADO', true)).toEqual(['VER DETALLE']);
    expect(botones('PAGADO', true)).toEqual(['VER FACTURA', 'VER DETALLE']);
  });
});
