import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { DataTable, TableColumn, TableRow } from '../../components/organisms/data-table/data-table';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { DateRangeFilter, RangoFechas } from '../../components/molecules/date-range-filter/date-range-filter';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { EstadoReserva, MesaResponseDTO, ReservaResponseDTO } from '../../models/model';
import { ReservaService } from '../../services/reserva.service';
import { MesaService } from '../../services/mesa.service';
import { ToastService } from '../../services/toast.service';
import { SessionService } from '../../services/session.service';
import { ESTADO_RESERVA } from '../../utils/estados';

@Component({
  selector: 'app-reservas',
  imports: [
    DashboardLayout,
    DataTable,
    TableRow,
    Modal,
    ConfirmDialog,
    SearchBar,
    TabFilter,
    DateRangeFilter,
    EstadoCarga,
    Badge,
    Button,
    DatePipe,
  ],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas implements OnInit {
  reservas = signal<ReservaResponseDTO[]>([]);
  mesas = signal<MesaResponseDTO[]>([]);
  cargando = signal(true);
  error = signal(false);
  readonly estados = ESTADO_RESERVA;

  busqueda = signal('');
  tabActivo = signal('');
  filtroMesa = signal(0);
  rango = signal<RangoFechas>({ desde: '', hasta: '' });

  detalle = signal<ReservaResponseDTO | null>(null);
  porCancelar = signal<ReservaResponseDTO | null>(null);

  readonly tabs: Tab[] = [
    { label: 'Todas', value: '' },
    { label: 'Pendientes', value: 'PENDIENTE' },
    { label: 'Confirmadas', value: 'CONFIRMADA' },
    { label: 'Completadas', value: 'COMPLETADA' },
    { label: 'Canceladas', value: 'CANCELADA' },
  ];

  readonly columnas: TableColumn[] = [
    { label: 'Código' },
    { label: 'Cliente' },
    { label: 'Fecha' },
    { label: 'Hora' },
    { label: 'Mesa', align: 'center' },
    { label: 'Personas', align: 'center' },
    { label: 'Estado' },
    { label: '', align: 'right' },
  ];

  constructor(
    private reservaService: ReservaService,
    private mesaService: MesaService,
    private toast: ToastService,
    public sesion: SessionService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    forkJoin({ reservas: this.reservaService.listar(), mesas: this.mesaService.listar() }).subscribe({
      next: ({ reservas, mesas }) => {
        this.reservas.set([...reservas].sort((a, b) => a.fechaHora.localeCompare(b.fechaHora)));
        this.mesas.set(mesas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  get reservasFiltradas(): ReservaResponseDTO[] {
    const estado = this.tabActivo();
    const mesa = this.filtroMesa();
    const q = this.busqueda().toLowerCase();
    const { desde, hasta } = this.rango();
    return this.reservas().filter(
      r =>
        (!estado || r.estado === estado) &&
        (!mesa || r.numeroMesa === mesa) &&
        (!desde || r.fecha >= desde) &&
        (!hasta || r.fecha <= hasta) &&
        (!q || `${r.nombreCliente} ${r.correoCliente} ${r.idReservaCompuesta}`.toLowerCase().includes(q)),
    );
  }

  get hayFiltros(): boolean {
    const { desde, hasta } = this.rango();
    return !!(this.filtroMesa() || desde || hasta);
  }

  limpiarFiltros(): void {
    this.filtroMesa.set(0);
    this.rango.set({ desde: '', hasta: '' });
  }

  cambiarEstado(r: ReservaResponseDTO, estado: EstadoReserva): void {
    this.detalle.set(null);
    this.reservaService.cambiarEstado(r.idReserva, estado).subscribe(actualizada => {
      this.reservas.update(lista => lista.map(x => (x.idReserva === actualizada.idReserva ? actualizada : x)));
      this.toast.show(`Reserva ${r.idReservaCompuesta} → ${ESTADO_RESERVA[estado].label}`, 'success');
    });
  }

  pedirCancelar(r: ReservaResponseDTO): void {
    this.detalle.set(null);
    this.porCancelar.set(r);
  }

  confirmarCancelar(): void {
    const r = this.porCancelar();
    this.porCancelar.set(null);
    if (r) this.cambiarEstado(r, 'CANCELADA');
  }
}
