import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { MesaCard } from '../../components/organisms/mesa-card/mesa-card';
import { Modal } from '../../components/organisms/modal/modal';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { Button } from '../../components/atoms/button/button';
import { EstadoMesa, MesaRequestDTO, MesaResponseDTO } from '../../models/model';
import { MESAS_MOCK } from '../../mocks/mesas.mock';
import { PEDIDOS_MOCK } from '../../mocks/pedidos.mock';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { ToastService } from '../../services/toast.service';
import { SessionService } from '../../services/session.service';
import { ESTADO_MESA } from '../../utils/estados';

@Component({
  selector: 'app-mesas',
  imports: [DashboardLayout, MesaCard, Modal, FormField, TabFilter, Button, EmptyState, ConfirmDialog],
  templateUrl: './mesas.html',
  styleUrl: './mesas.css',
})
export class Mesas {
  readonly mesas = MESAS_MOCK;
  tabActivo = signal('');
  modalVisible = signal(false);
  editando = signal<MesaResponseDTO | null>(null);
  porEliminar = signal<MesaResponseDTO | null>(null);

  constructor(
    private router: Router,
    private toast: ToastService,
    public sesion: SessionService,
  ) {}

  form: MesaRequestDTO = { numeroMesa: 1, capacidad: 2, estado: 'DISPONIBLE' };

  readonly estados: EstadoMesa[] = ['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'EN_MANTENIMIENTO'];
  readonly estadoLabel = ESTADO_MESA;

  readonly tabs: Tab[] = [
    { label: 'Todas', value: '' },
    { label: 'Disponibles', value: 'DISPONIBLE' },
    { label: 'Ocupadas', value: 'OCUPADA' },
    { label: 'Reservadas', value: 'RESERVADA' },
    { label: 'Mantenimiento', value: 'EN_MANTENIMIENTO' },
  ];

  get mesasFiltradas(): MesaResponseDTO[] {
    const estado = this.tabActivo();
    return estado ? this.mesas.filter(m => m.estado === estado) : this.mesas;
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = { numeroMesa: 1, capacidad: 2, estado: 'DISPONIBLE' };
    this.modalVisible.set(true);
  }

  abrirEditar(m: MesaResponseDTO): void {
    this.editando.set(m);
    this.form = { numeroMesa: m.numeroMesa, capacidad: m.capacidad, estado: m.estado };
    this.modalVisible.set(true);
  }

  guardar(): void {
    this.modalVisible.set(false);
    this.toast.show(this.editando() ? 'Mesa actualizada' : 'Mesa creada', 'success');
  }

  confirmarEliminar(): void {
    this.toast.show(`Mesa ${this.porEliminar()?.numeroMesa} eliminada`, 'success');
    this.porEliminar.set(null);
  }

  cambiarEstado(e: { mesa: MesaResponseDTO; estado: EstadoMesa }): void {
    this.toast.show(`Mesa ${e.mesa.numeroMesa} → ${ESTADO_MESA[e.estado].label}`, 'success');
  }

  tomarPedido(m: MesaResponseDTO): void {
    this.router.navigate(['/pedidos'], { queryParams: { mesa: m.numeroMesa, nuevo: 1 } });
  }

  verPedido(m: MesaResponseDTO): void {
    this.router.navigate(['/pedidos'], { queryParams: { mesa: m.numeroMesa } });
  }

  // Solo se cobra un pedido ENTREGADO; si el de la mesa aún no lo está, se avisa.
  cobrar(m: MesaResponseDTO): void {
    const pedido = PEDIDOS_MOCK.find(p => p.numeroMesa === m.numeroMesa && p.estado === 'ENTREGADO');
    if (pedido) {
      this.router.navigate(['/pedidos'], { queryParams: { cobrar: pedido.idPedido } });
    } else {
      this.toast.show(`El pedido de la mesa ${m.numeroMesa} aún no está entregado`, 'info');
    }
  }
}
