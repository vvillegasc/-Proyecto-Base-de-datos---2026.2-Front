import { Component, signal } from '@angular/core';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { PedidoCard } from '../../components/organisms/pedido-card/pedido-card';
import { Modal } from '../../components/organisms/modal/modal';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { Button } from '../../components/atoms/button/button';
import { DetallePedidoRequestDTO, PedidoResponseDTO } from '../../models/model';
import { PEDIDOS_MOCK } from '../../mocks/pedidos.mock';
import { MESAS_MOCK } from '../../mocks/mesas.mock';
import { CLIENTES_MOCK } from '../../mocks/clientes.mock';
import { PRODUCTOS_MOCK } from '../../mocks/productos.mock';
import { PrecioPipe } from '../../pipes/precio.pipe';

import { EmptyState } from '../../components/molecules/empty-state/empty-state';

@Component({
  selector: 'app-pedidos',
  imports: [DashboardLayout, PedidoCard, Modal, FormField, TabFilter, Button, PrecioPipe, EmptyState],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos {
  readonly pedidos = PEDIDOS_MOCK;
  readonly mesas = MESAS_MOCK.filter(m => m.estado === 'DISPONIBLE');
  readonly clientes = CLIENTES_MOCK;
  readonly productos = PRODUCTOS_MOCK.filter(p => p.disponibilidad);
  tabActivo = signal('');
  modalVisible = signal(false);
  detalleVisible = signal(false);
  pedidoDetalle = signal<PedidoResponseDTO | null>(null);

  numeroMesa = 0;
  idCliente = 0;
  observaciones = '';
  detalles: DetallePedidoRequestDTO[] = [{ idProducto: 0, cantidad: 1 }];

  readonly tabs: Tab[] = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'En preparación', value: 'EN_PREPARACION' },
    { label: 'Entregado', value: 'ENTREGADO' },
    { label: 'Pagado', value: 'PAGADO' },
  ];

  get pedidosFiltrados(): PedidoResponseDTO[] {
    const estado = this.tabActivo();
    return estado ? this.pedidos.filter(p => p.estado === estado) : this.pedidos;
  }

  abrirCrear(): void {
    this.numeroMesa = 0;
    this.idCliente = 0;
    this.observaciones = '';
    this.detalles = [{ idProducto: 0, cantidad: 1 }];
    this.modalVisible.set(true);
  }

  agregarDetalle(): void {
    this.detalles = [...this.detalles, { idProducto: 0, cantidad: 1 }];
  }

  quitarDetalle(i: number): void {
    this.detalles = this.detalles.filter((_, idx) => idx !== i);
  }

  guardar(): void {
    this.modalVisible.set(false);
  }

  avanzar(_id: number): void {}

  eliminar(_id: number): void {}

  verDetalle(pedido: PedidoResponseDTO): void {
    this.pedidoDetalle.set(pedido);
    this.detalleVisible.set(true);
  }
}
