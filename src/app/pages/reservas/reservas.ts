import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { DataTable, TableColumn, TableRow } from '../../components/organisms/data-table/data-table';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { DateRangeFilter, RangoFechas } from '../../components/molecules/date-range-filter/date-range-filter';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { EstadoReserva, ReservaResponseDTO } from '../../models/model';
import { RESERVAS_MOCK } from '../../mocks/reservas.mock';
import { MESAS_MOCK } from '../../mocks/mesas.mock';
import { ToastService } from '../../services/toast.service';
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
    Badge,
    Button,
    DatePipe,
  ],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas {
  readonly reservas = [...RESERVAS_MOCK].sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));
  readonly mesas = MESAS_MOCK;
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

  constructor(private toast: ToastService) {}

  get reservasFiltradas(): ReservaResponseDTO[] {
    const estado = this.tabActivo();
    const mesa = this.filtroMesa();
    const q = this.busqueda().toLowerCase();
    const { desde, hasta } = this.rango();
    return this.reservas.filter(
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
    this.toast.show(`Reserva ${r.idReservaCompuesta} → ${ESTADO_RESERVA[estado].label}`, 'success');
  }

  pedirCancelar(r: ReservaResponseDTO): void {
    this.detalle.set(null);
    this.porCancelar.set(r);
  }

  confirmarCancelar(): void {
    this.toast.show(`Reserva ${this.porCancelar()?.idReservaCompuesta} cancelada`, 'success');
    this.porCancelar.set(null);
  }
}
