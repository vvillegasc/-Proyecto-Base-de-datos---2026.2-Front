import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PedidoResponseDTO } from '../../models/model';
import { PEDIDO } from '../../testing/datos-prueba';
import { Pedidos } from './pedidos';

const API = environment.apiUrl;

describe('Pedidos', () => {
  it('no pierde un pedido creado mientras la lista completa todavía estaba cargando', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    const fixture = TestBed.createComponent(Pedidos);
    const pagina = fixture.componentInstance;
    const backend = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const nuevo: PedidoResponseDTO = { ...PEDIDO, idPedido: 99, fecha: '2026-11-01T10:00:00' };
    (pagina as unknown as { actualizarEnLista(p: PedidoResponseDTO): void }).actualizarEnLista(nuevo);

    backend.expectOne(`${API}/pedidos`).flush([PEDIDO]);
    expect(pagina.pedidos().map(p => p.idPedido)).toEqual([99, 1]);
    expect(pagina.cargando()).toBe(false);
  });
});
