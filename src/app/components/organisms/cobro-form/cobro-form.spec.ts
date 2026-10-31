import { TestBed } from '@angular/core/testing';
import { PEDIDO } from '../../../testing/datos-prueba';
import { CobroForm } from './cobro-form';

describe('CobroForm', () => {
  let cobro: CobroForm;

  beforeEach(() => {
    const fixture = TestBed.createComponent(CobroForm);
    cobro = fixture.componentInstance;
    cobro.pedido = { ...PEDIDO, estado: 'ENTREGADO' }; // subtotal 21.500
    fixture.detectChanges();
  });

  it('calcula IVA del 19 % y arranca con un pago en efectivo por el total', () => {
    expect(cobro.impuesto).toBe(4085);
    expect(cobro.total).toBe(25585);
    expect(cobro.pagos).toEqual([{ tipoMetodoPago: 'EFECTIVO', monto: 25585 }]);
    expect(cobro.cuadra).toBe(true);
  });

  it('la propina sube el total y deja de cuadrar hasta completar el pago', () => {
    cobro.setPropina(cobro.porcentajePropina(10)); // 2.150
    expect(cobro.total).toBe(27735);
    expect(cobro.cuadra).toBe(false);
    expect(cobro.diferencia).toBe(2150);

    cobro.agregarPago(); // segundo método con lo que falta
    expect(cobro.pagos[1]).toEqual({ tipoMetodoPago: 'TARJETA', monto: 2150 });
    expect(cobro.cuadra).toBe(true);
  });

  it('envía al back solo método y monto de cada pago', () => {
    const enviado = vi.fn();
    cobro.confirmar.subscribe(enviado);
    cobro.pagos[0].recibido = 30000; // solo de pantalla
    cobro.onConfirmar();
    expect(enviado).toHaveBeenCalledWith({
      idPedido: 1,
      propina: 0,
      pagos: [{ tipoMetodoPago: 'EFECTIVO', monto: 25585 }],
    });
  });
});
