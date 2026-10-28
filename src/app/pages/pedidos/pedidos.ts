import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { PedidoCard } from '../../components/organisms/pedido-card/pedido-card';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TextareaField } from '../../components/molecules/textarea-field/textarea-field';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { DateRangeFilter, RangoFechas } from '../../components/molecules/date-range-filter/date-range-filter';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { Button } from '../../components/atoms/button/button';
import {
  ClienteRequestDTO,
  DetallePedidoRequestDTO,
  EstadoPedido,
  PedidoResponseDTO,
  ProductoResponseDTO,
} from '../../models/model';
import { PEDIDOS_MOCK } from '../../mocks/pedidos.mock';
import { MESAS_MOCK } from '../../mocks/mesas.mock';
import { CLIENTES_MOCK } from '../../mocks/clientes.mock';
import { PRODUCTOS_MOCK } from '../../mocks/productos.mock';
import { USUARIOS_MOCK } from '../../mocks/usuarios.mock';
import { PrecioPipe } from '../../pipes/precio.pipe';
import { ToastService } from '../../services/toast.service';
import { ESTADO_PEDIDO } from '../../utils/estados';

@Component({
  selector: 'app-pedidos',
  imports: [
    DashboardLayout,
    PedidoCard,
    Modal,
    ConfirmDialog,
    FormField,
    TextareaField,
    SearchBar,
    TabFilter,
    DateRangeFilter,
    EmptyState,
    Button,
    PrecioPipe,
    DatePipe,
  ],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {
  readonly pedidos = PEDIDOS_MOCK;
  readonly todasLasMesas = MESAS_MOCK;
  readonly clientes = CLIENTES_MOCK;
  readonly productos = PRODUCTOS_MOCK;
  readonly meseros = USUARIOS_MOCK.filter(u => u.rol === 'MESERO');
  readonly estados = ESTADO_PEDIDO;

  // Filtros
  tabActivo = signal('');
  filtroMesa = signal(0);
  filtroMesero = signal(0);
  rango = signal<RangoFechas>({ desde: '', hasta: '' });

  // Modales
  modalVisible = signal(false);
  detalleVisible = signal(false);
  pedidoDetalle = signal<PedidoResponseDTO | null>(null);
  porCancelar = signal<PedidoResponseDTO | null>(null);

  // Formulario "Nuevo pedido"
  numeroMesa = 0;
  idCliente = 0;
  busquedaCliente = '';
  clienteNuevo = false;
  nuevoCliente: ClienteRequestDTO = this.clienteVacio();
  observaciones = '';
  detalles: DetallePedidoRequestDTO[] = [{ idProducto: 0, cantidad: 1 }];

  readonly tabs: Tab[] = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'En preparación', value: 'EN_PREPARACION' },
    { label: 'Entregado', value: 'ENTREGADO' },
    { label: 'Pagado', value: 'PAGADO' },
    { label: 'Cancelado', value: 'CANCELADO' },
  ];

  constructor(
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  // Desde Mesas: ?mesa=N filtra por mesa; ?mesa=N&nuevo=1 abre "Nuevo pedido" con la mesa elegida.
  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const mesa = Number(params.get('mesa') ?? 0);
    if (params.get('nuevo')) {
      this.abrirCrear(mesa);
    } else if (mesa) {
      this.filtroMesa.set(mesa);
    }
  }

  get pedidosFiltrados(): PedidoResponseDTO[] {
    const estado = this.tabActivo();
    const mesa = this.filtroMesa();
    const mesero = this.filtroMesero();
    const { desde, hasta } = this.rango();
    return this.pedidos.filter(p => {
      const dia = p.fecha.slice(0, 10);
      return (
        (!estado || p.estado === estado) &&
        (!mesa || p.numeroMesa === mesa) &&
        (!mesero || p.idUsuario === mesero) &&
        (!desde || dia >= desde) &&
        (!hasta || dia <= hasta)
      );
    });
  }

  get hayFiltros(): boolean {
    const { desde, hasta } = this.rango();
    return !!(this.filtroMesa() || this.filtroMesero() || desde || hasta);
  }

  limpiarFiltros(): void {
    this.filtroMesa.set(0);
    this.filtroMesero.set(0);
    this.rango.set({ desde: '', hasta: '' });
  }

  // --- Acciones de la tarjeta (solo visual por ahora) ---

  avanzar(e: { pedido: PedidoResponseDTO; estado: EstadoPedido }): void {
    this.toast.show(`Pedido #${e.pedido.idPedido} → ${ESTADO_PEDIDO[e.estado].label}`, 'success');
  }

  confirmarCancelar(): void {
    this.toast.show(`Pedido #${this.porCancelar()?.idPedido} cancelado`, 'success');
    this.porCancelar.set(null);
  }

  cobrar(p: PedidoResponseDTO): void {
    this.toast.show(`Cobro del pedido #${p.idPedido}: la pantalla de cobro llega en la fase 4`, 'info');
  }

  verFactura(p: PedidoResponseDTO): void {
    this.toast.show(`Factura del pedido #${p.idPedido}: el comprobante llega en la fase 4`, 'info');
  }

  verDetalle(pedido: PedidoResponseDTO): void {
    this.pedidoDetalle.set(pedido);
    this.detalleVisible.set(true);
  }

  // --- Nuevo pedido ---

  get mesasDisponibles() {
    return this.todasLasMesas.filter(m => m.estado === 'DISPONIBLE' || m.numeroMesa === this.numeroMesa);
  }

  get clientesFiltrados() {
    const q = this.busquedaCliente.toLowerCase();
    if (!q) return this.clientes;
    return this.clientes.filter(c => `${c.nombre} ${c.apellido} ${c.correo}`.toLowerCase().includes(q));
  }

  producto(id: number): ProductoResponseDTO | undefined {
    return this.productos.find(p => p.idProducto === id);
  }

  agotado(p: ProductoResponseDTO): boolean {
    return !p.disponibilidad || p.stock <= 0;
  }

  subtotalLinea(d: DetallePedidoRequestDTO): number {
    return (this.producto(d.idProducto)?.precio ?? 0) * (d.cantidad || 0);
  }

  get subtotalPedido(): number {
    return this.detalles.reduce((total, d) => total + this.subtotalLinea(d), 0);
  }

  abrirCrear(mesa = 0): void {
    this.numeroMesa = mesa;
    this.idCliente = 0;
    this.busquedaCliente = '';
    this.clienteNuevo = false;
    this.nuevoCliente = this.clienteVacio();
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
    this.toast.show(`Pedido creado para la mesa ${this.numeroMesa || '—'}`, 'success');
  }

  private clienteVacio(): ClienteRequestDTO {
    return { nombre: '', apellido: '', correo: '', telefono: '' };
  }
}
