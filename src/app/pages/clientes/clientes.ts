import { Component, signal } from '@angular/core';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { ClienteCard } from '../../components/organisms/cliente-card/cliente-card';
import { Modal } from '../../components/organisms/modal/modal';
import { FormField } from '../../components/molecules/form-field/form-field';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { Button } from '../../components/atoms/button/button';
import { ClienteRequestDTO, ClienteResponseDTO } from '../../models/model';
import { CLIENTES_MOCK } from '../../mocks/clientes.mock';
import { PEDIDOS_MOCK } from '../../mocks/pedidos.mock';
import { RESERVAS_MOCK } from '../../mocks/reservas.mock';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-clientes',
  imports: [DashboardLayout, ClienteCard, Modal, FormField, SearchBar, Button, EmptyState, ConfirmDialog],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  readonly clientes = CLIENTES_MOCK;
  busqueda = signal('');
  modalVisible = signal(false);
  editando = signal<ClienteResponseDTO | null>(null);
  porEliminar = signal<ClienteResponseDTO | null>(null);

  constructor(private toast: ToastService) {}

  form: ClienteRequestDTO = { nombre: '', apellido: '', correo: '', telefono: '' };

  get clientesFiltrados(): ClienteResponseDTO[] {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.clientes;
    return this.clientes.filter(c =>
      `${c.nombre} ${c.apellido} ${c.correo}`.toLowerCase().includes(q),
    );
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = { nombre: '', apellido: '', correo: '', telefono: '' };
    this.modalVisible.set(true);
  }

  abrirEditar(c: ClienteResponseDTO): void {
    this.editando.set(c);
    this.form = { nombre: c.nombre, apellido: c.apellido, correo: c.correo, telefono: c.telefono };
    this.modalVisible.set(true);
  }

  guardar(): void {
    this.modalVisible.set(false);
    this.toast.show(this.editando() ? 'Cliente actualizado' : 'Cliente registrado', 'success');
  }

  confirmarEliminar(): void {
    const c = this.porEliminar();
    this.porEliminar.set(null);
    if (!c) return;
    // Simula la respuesta 409 del back: no se elimina un cliente con pedidos/facturas o reservas activas.
    const tieneHistorial = PEDIDOS_MOCK.some(p => p.idCliente === c.idCliente);
    const tieneReservaActiva = RESERVAS_MOCK.some(
      r => r.idCliente === c.idCliente && (r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA'),
    );
    if (tieneHistorial || tieneReservaActiva) {
      this.toast.show(
        `No se puede eliminar a ${c.nombre} ${c.apellido}: tiene ${tieneHistorial ? 'pedidos o facturas' : 'reservas activas'} asociados.`,
        'error',
      );
      return;
    }
    this.toast.show(`Cliente ${c.nombre} ${c.apellido} eliminado`, 'success');
  }
}
