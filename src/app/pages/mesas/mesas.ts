import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { MesaCard } from '../../components/organisms/mesa-card/mesa-card';
import { Modal } from '../../components/organisms/modal/modal';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { Button } from '../../components/atoms/button/button';
import { EstadoMesa, MesaRequestDTO, MesaResponseDTO } from '../../models/model';
import { MesaService } from '../../services/mesa.service';
import { PedidoService } from '../../services/pedido.service';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { ToastService } from '../../services/toast.service';
import { SessionService } from '../../services/session.service';
import { ESTADO_MESA } from '../../utils/estados';

@Component({
  selector: 'app-mesas',
  imports: [DashboardLayout, MesaCard, Modal, FormField, TabFilter, Button, EmptyState, EstadoCarga, ConfirmDialog],
  templateUrl: './mesas.html',
  styleUrl: './mesas.css',
})
export class Mesas implements OnInit {
  mesas = signal<MesaResponseDTO[]>([]);
  cargando = signal(true);
  error = signal(false);
  guardando = signal(false);
  tabActivo = signal('');
  modalVisible = signal(false);
  editando = signal<MesaResponseDTO | null>(null);
  porEliminar = signal<MesaResponseDTO | null>(null);

  constructor(
    private mesaService: MesaService,
    private pedidoService: PedidoService,
    private router: Router,
    private toast: ToastService,
    public sesion: SessionService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.mesaService.listar().subscribe({
      next: mesas => {
        this.mesas.set(mesas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

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
    return estado ? this.mesas().filter(m => m.estado === estado) : this.mesas();
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
    const editando = this.editando();
    const peticion = editando
      ? this.mesaService.actualizar(editando.numeroMesa, this.form)
      : this.mesaService.crear(this.form);
    this.guardando.set(true);
    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalVisible.set(false);
        this.toast.show(editando ? 'Mesa actualizada' : 'Mesa creada', 'success');
        this.cargar();
      },
      error: () => this.guardando.set(false),
    });
  }

  confirmarEliminar(): void {
    const m = this.porEliminar();
    if (!m) return;
    this.mesaService.eliminar(m.numeroMesa).subscribe({
      next: () => {
        this.porEliminar.set(null);
        this.toast.show(`Mesa ${m.numeroMesa} eliminada`, 'success');
        this.cargar();
      },
      error: () => this.porEliminar.set(null),
    });
  }

  cambiarEstado(e: { mesa: MesaResponseDTO; estado: EstadoMesa }): void {
    this.mesaService.cambiarEstado(e.mesa.numeroMesa, e.estado).subscribe(actualizada => {
      this.mesas.update(lista => lista.map(m => (m.numeroMesa === actualizada.numeroMesa ? actualizada : m)));
      this.toast.show(`Mesa ${actualizada.numeroMesa} → ${ESTADO_MESA[actualizada.estado].label}`, 'success');
    });
  }

  tomarPedido(m: MesaResponseDTO): void {
    this.router.navigate(['/pedidos'], { queryParams: { mesa: m.numeroMesa, nuevo: 1 } });
  }

  verPedido(m: MesaResponseDTO): void {
    this.router.navigate(['/pedidos'], { queryParams: { mesa: m.numeroMesa } });
  }

  // Solo se cobra un pedido ENTREGADO. El back no filtra por mesa: se busca en la lista de entregados.
  cobrar(m: MesaResponseDTO): void {
    this.pedidoService.listar('ENTREGADO').subscribe(pedidos => {
      const pedido = pedidos.find(p => p.numeroMesa === m.numeroMesa);
      if (pedido) {
        this.router.navigate(['/pedidos'], { queryParams: { cobrar: pedido.idPedido } });
      } else {
        this.toast.show(`El pedido de la mesa ${m.numeroMesa} aún no está entregado`, 'info');
      }
    });
  }
}
