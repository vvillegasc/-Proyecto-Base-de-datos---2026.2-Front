import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { DataTable, TableColumn, TableRow } from '../../components/organisms/data-table/data-table';
import { Modal } from '../../components/organisms/modal/modal';
import { FacturaDetalle } from '../../components/organisms/factura-detalle/factura-detalle';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { StatCard } from '../../components/molecules/stat-card/stat-card';
import { DateRangeFilter, RangoFechas } from '../../components/molecules/date-range-filter/date-range-filter';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { FacturaResponseDTO, PedidoResponseDTO } from '../../models/model';
import { FACTURAS_MOCK } from '../../mocks/facturas.mock';
import { PEDIDOS_MOCK } from '../../mocks/pedidos.mock';
import { PrecioPipe } from '../../pipes/precio.pipe';
import { ToastService } from '../../services/toast.service';
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
    Badge,
    Button,
    PrecioPipe,
    DatePipe,
  ],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css',
})
export class Facturas {
  readonly facturas = FACTURAS_MOCK;
  readonly estados = ESTADO_FACTURA;

  busqueda = signal('');
  rango = signal<RangoFechas>({ desde: '', hasta: '' });
  seleccionada = signal<FacturaResponseDTO | null>(null);

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

  constructor(private toast: ToastService) {}

  get facturasFiltradas(): FacturaResponseDTO[] {
    const q = this.busqueda().toLowerCase();
    const { desde, hasta } = this.rango();
    return this.facturas.filter(f => {
      const dia = f.fecha.slice(0, 10);
      return (
        (!desde || dia >= desde) &&
        (!hasta || dia <= hasta) &&
        (!q || `${f.numFactura} ${f.nombreCliente} ${f.correoCliente}`.toLowerCase().includes(q))
      );
    });
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

  pedidoDe(f: FacturaResponseDTO): PedidoResponseDTO | null {
    return PEDIDOS_MOCK.find(p => p.idPedido === f.idPedido) ?? null;
  }

  imprimir(): void {
    this.toast.show('Imprimir: disponible al conectar con el back', 'info');
  }

  reenviar(f: FacturaResponseDTO): void {
    this.toast.show(`Factura ${f.numFactura} reenviada a ${f.correoCliente}`, 'success');
  }
}
