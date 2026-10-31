import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { DataTable, TableColumn, TableRow } from '../../components/organisms/data-table/data-table';
import { Modal } from '../../components/organisms/modal/modal';
import { FacturaDetalle } from '../../components/organisms/factura-detalle/factura-detalle';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { StatCard } from '../../components/molecules/stat-card/stat-card';
import { DateRangeFilter, RangoFechas } from '../../components/molecules/date-range-filter/date-range-filter';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { FacturaResponseDTO, PedidoResponseDTO } from '../../models/model';
import { FacturaService } from '../../services/factura.service';
import { PedidoService } from '../../services/pedido.service';
import { PrecioPipe } from '../../pipes/precio.pipe';
import { ESTADO_FACTURA } from '../../utils/estados';

@Component({
  selector: 'app-facturas',
  imports: [
    DashboardLayout,
    DataTable,
    TableRow,
    Modal,
    FacturaDetalle,
    SearchBar,
    StatCard,
    DateRangeFilter,
    EstadoCarga,
    Badge,
    Button,
    PrecioPipe,
    DatePipe,
  ],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css',
})
export class Facturas implements OnInit {
  readonly estados = ESTADO_FACTURA;

  facturas = signal<FacturaResponseDTO[]>([]);
  cargando = signal(true);
  error = signal(false);

  busqueda = signal('');
  rango = signal<RangoFechas>({ desde: '', hasta: '' });
  seleccionada = signal<FacturaResponseDTO | null>(null);
  // La factura no trae mesa ni productos: se piden al abrirla.
  pedidoSeleccionado = signal<PedidoResponseDTO | null>(null);

  readonly columnas: TableColumn[] = [
    { label: 'N° factura' },
    { label: 'Fecha' },
    { label: 'Pedido', align: 'center' },
    { label: 'Cliente' },
    { label: 'Mesero' },
    { label: 'Pago' },
    { label: 'Total', align: 'right' },
    { label: 'Estado' },
    { label: '', align: 'right' },
  ];

  constructor(
    private facturaService: FacturaService,
    private pedidoService: PedidoService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  // El rango de fechas se filtra en el back; la búsqueda por texto, aquí.
  cargar(): void {
    const { desde, hasta } = this.rango();
    this.cargando.set(true);
    this.error.set(false);
    this.facturaService.listar(desde, hasta).subscribe({
      next: facturas => {
        this.facturas.set([...facturas].sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  cambiarRango(rango: RangoFechas): void {
    this.rango.set(rango);
    this.cargar();
  }

  get facturasFiltradas(): FacturaResponseDTO[] {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.facturas();
    return this.facturas().filter(f => `${f.numFactura} ${f.nombreCliente} ${f.correoCliente}`.toLowerCase().includes(q));
  }

  get totalVendido(): number {
    return this.facturasFiltradas.reduce((t, f) => t + f.total, 0);
  }

  get totalPropinas(): number {
    return this.facturasFiltradas.reduce((t, f) => t + f.propina, 0);
  }

  metodos(f: FacturaResponseDTO): string {
    return f.pagos.map(p => p.tipoMetodoPago.charAt(0) + p.tipoMetodoPago.slice(1).toLowerCase()).join(' + ');
  }

  abrir(f: FacturaResponseDTO): void {
    this.pedidoSeleccionado.set(null);
    this.seleccionada.set(f);
    this.pedidoService.obtener(f.idPedido).subscribe(p => this.pedidoSeleccionado.set(p));
  }

  imprimir(): void {
    window.print();
  }
}
