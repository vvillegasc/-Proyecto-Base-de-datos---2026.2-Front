import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { PedidoCard } from '../../components/organisms/pedido-card/pedido-card';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { CobroForm } from '../../components/organisms/cobro-form/cobro-form';
import { FacturaDetalle } from '../../components/organisms/factura-detalle/factura-detalle';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TextareaField } from '../../components/molecules/textarea-field/textarea-field';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { DateRangeFilter, RangoFechas } from '../../components/molecules/date-range-filter/date-range-filter';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { ProductoSelector } from '../../components/molecules/producto-selector/producto-selector';
import { Button } from '../../components/atoms/button/button';
import {
  ClienteRequestDTO,
  ClienteResponseDTO,
  DetallePedidoRequestDTO,
  EstadoPedido,
  FacturaRequestDTO,
  FacturaResponseDTO,
  MesaResponseDTO,
  PedidoResponseDTO,
  ProductoResponseDTO,
  TipoMetodoPago,
} from '../../models/model';
import { PedidoService } from '../../services/pedido.service';
import { MesaService } from '../../services/mesa.service';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';
import { MetodoPagoService } from '../../services/metodo-pago.service';
import { PagoService } from '../../services/pago.service';
import { FacturaService } from '../../services/factura.service';
import { PrecioPipe } from '../../pipes/precio.pipe';
import { ToastService } from '../../services/toast.service';
import { SessionService } from '../../services/session.service';
import { PropinasService } from '../../services/propinas.service';
import { ESTADO_PEDIDO } from '../../utils/estados';

import { ErroresCampo, erroresDeCampo } from '../../utils/errores';
@Component({
  selector: 'app-pedidos',
  imports: [
    DashboardLayout,
    PedidoCard,
    Modal,
    ConfirmDialog,
    CobroForm,
    FacturaDetalle,
    FormField,
    TextareaField,
    SearchBar,
    TabFilter,
    DateRangeFilter,
    EmptyState,
    EstadoCarga,
    ProductoSelector,
    Button,
    PrecioPipe,
    DatePipe,
  ],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {
  readonly estados = ESTADO_PEDIDO;

  pedidos = signal<PedidoResponseDTO[]>([]);
  todasLasMesas = signal<MesaResponseDTO[]>([]);
  clientes = signal<ClienteResponseDTO[]>([]);
  productos = signal<ProductoResponseDTO[]>([]);
  metodosPago = signal<TipoMetodoPago[]>([]);
  cargando = signal(true);
  cargandoCatalogos = signal(true);
  error = signal(false);
  guardando = signal(false);
  errores = signal<ErroresCampo>({});
  pagando = signal(false);

  tabActivo = signal('');
  filtroMesa = signal(0);
  filtroMesero = signal(0);
  rango = signal<RangoFechas>({ desde: '', hasta: '' });

  modalVisible = signal(false);
  detalleVisible = signal(false);
  pedidoDetalle = signal<PedidoResponseDTO | null>(null);
  porCancelar = signal<PedidoResponseDTO | null>(null);
  porCobrar = signal<PedidoResponseDTO | null>(null);
  factura = signal<{ factura: FacturaResponseDTO; pedido: PedidoResponseDTO; aviso: string } | null>(null);

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
    private pedidoService: PedidoService,
    private mesaService: MesaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private metodoPagoService: MetodoPagoService,
    private pagoService: PagoService,
    private facturaService: FacturaService,
    private toast: ToastService,
    private propinas: PropinasService,
    public sesion: SessionService,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const mesa = Number(params.get('mesa') ?? 0);
    const cobrar = Number(params.get('cobrar') ?? 0);
    if (cobrar && this.sesion.esMesero()) {
      this.pedidoService.obtener(cobrar).subscribe(p => this.porCobrar.set(p));
    } else if (params.get('nuevo') && this.sesion.esMesero()) {
      this.abrirCrear(mesa);
    } else if (mesa) {
      this.filtroMesa.set(mesa);
    }
    this.cargarCatalogos();
    this.cargar();
  }

  cargar(): void {
    if (!this.pedidos().length) this.cargando.set(true);
    this.error.set(false);
    this.pedidoService.listar().subscribe({
      next: pedidos => {
        const servidor = new Map(pedidos.map(p => [p.idPedido, p]));
        this.cambiosLocales.forEach((p, id) => servidor.set(id, p));
        this.pedidos.set([...servidor.values()].sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cambiosLocales.clear();
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  private cargarCatalogos(): void {
    this.cargandoCatalogos.set(true);
    forkJoin({
      mesas: this.mesaService.listar(),
      clientes: this.clienteService.listar(),
      productos: this.productoService.listar(),
      metodos: this.metodoPagoService.listar(),
    }).subscribe({
      next: ({ mesas, clientes, productos, metodos }) => {
        this.todasLasMesas.set(mesas);
        this.clientes.set(clientes);
        this.productos.set(productos);
        this.metodosPago.set(metodos.map(m => m.tipo));
        this.cargandoCatalogos.set(false);
      },
      error: () => this.cargandoCatalogos.set(false),
    });
  }

  private cambiosLocales = new Map<number, PedidoResponseDTO>();

  private actualizarEnLista(pedido: PedidoResponseDTO): void {
    if (this.cargando()) this.cambiosLocales.set(pedido.idPedido, pedido);
    this.pedidos.update(lista =>
      lista.some(x => x.idPedido === pedido.idPedido)
        ? lista.map(x => (x.idPedido === pedido.idPedido ? pedido : x))
        : [pedido, ...lista],
    );
  }

  get meseros(): { idUsuario: number; nombre: string }[] {
    const vistos = new Map<number, string>();
    this.pedidos().forEach(p => vistos.set(p.idUsuario, p.nombreUsuario));
    return [...vistos].map(([idUsuario, nombre]) => ({ idUsuario, nombre }));
  }

  get pedidosFiltrados(): PedidoResponseDTO[] {
    const estado = this.tabActivo();
    const mesa = this.filtroMesa();
    const mesero = this.filtroMesero();
    const { desde, hasta } = this.rango();
    return this.pedidos().filter(p => {
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


  avanzar(e: { pedido: PedidoResponseDTO; estado: EstadoPedido }): void {
    this.cambiarEstado(e.pedido, e.estado);
  }

  confirmarCancelar(): void {
    const p = this.porCancelar();
    this.porCancelar.set(null);
    if (p) this.cambiarEstado(p, 'CANCELADO');
  }

  cobrar(p: PedidoResponseDTO): void {
    this.porCobrar.set(p);
  }

  confirmarPago(req: FacturaRequestDTO): void {
    const pedido = this.porCobrar();
    if (!pedido) return;
    this.pagando.set(true);
    this.pagoService.pagar(req).subscribe({
      next: factura => {
        this.pagando.set(false);
        this.porCobrar.set(null);
        this.factura.set({
          factura,
          pedido,
          aviso: `Pago registrado. Factura enviada a ${factura.correoCliente}. Mesa ${pedido.numeroMesa} liberada.`,
        });
        this.actualizarEnLista({ ...pedido, estado: 'PAGADO' });
        this.cargarCatalogos();
        this.propinas.actualizar();
      },
      error: () => this.pagando.set(false),
    });
  }

  verFactura(p: PedidoResponseDTO): void {
    this.facturaService.porPedido(p.idPedido).subscribe(factura => this.factura.set({ factura, pedido: p, aviso: '' }));
  }

  imprimirFactura(): void {
    window.print();
  }

  verDetalle(pedido: PedidoResponseDTO): void {
    this.pedidoDetalle.set(pedido);
    this.detalleVisible.set(true);
  }

  private cambiarEstado(p: PedidoResponseDTO, estado: EstadoPedido): void {
    this.pedidoService.cambiarEstado(p.idPedido, estado).subscribe(actualizado => {
      this.actualizarEnLista(actualizado);
      if (estado === 'CANCELADO') this.cargarCatalogos();
      this.toast.show(`Pedido #${p.idPedido} → ${ESTADO_PEDIDO[estado].label}`, 'success');
    });
  }


  get mesasDisponibles(): MesaResponseDTO[] {
    return this.todasLasMesas().filter(m => m.estado === 'DISPONIBLE' || m.numeroMesa === this.numeroMesa);
  }

  get clientesFiltrados(): ClienteResponseDTO[] {
    const q = this.busquedaCliente.toLowerCase();
    if (!q) return this.clientes();
    return this.clientes().filter(c => `${c.nombre} ${c.apellido} ${c.correo}`.toLowerCase().includes(q));
  }

  producto(id: number): ProductoResponseDTO | undefined {
    return this.productos().find(p => p.idProducto === id);
  }

  subtotalLinea(d: DetallePedidoRequestDTO): number {
    return (this.producto(d.idProducto)?.precio ?? 0) * (d.cantidad || 0);
  }

  get subtotalPedido(): number {
    return this.detalles.reduce((total, d) => total + this.subtotalLinea(d), 0);
  }

  get puedeCrear(): boolean {
    const cliente = this.clienteNuevo
      ? !!(this.nuevoCliente.nombre && this.nuevoCliente.apellido && this.nuevoCliente.correo && this.nuevoCliente.telefono)
      : !!this.idCliente;
    return !!this.numeroMesa && cliente && this.detalles.some(d => d.idProducto && d.cantidad > 0);
  }

  abrirCrear(mesa = 0): void {
    this.numeroMesa = mesa;
    this.idCliente = 0;
    this.busquedaCliente = '';
    this.clienteNuevo = false;
    this.nuevoCliente = this.clienteVacio();
    this.observaciones = '';
    this.detalles = [{ idProducto: 0, cantidad: 1 }];
    this.errores.set({});
    this.modalVisible.set(true);
  }

  agregarDetalle(): void {
    this.detalles = [...this.detalles, { idProducto: 0, cantidad: 1 }];
  }

  quitarDetalle(i: number): void {
    this.detalles = this.detalles.filter((_, idx) => idx !== i);
  }

  guardar(): void {
    const usuario = this.sesion.usuario();
    if (!usuario || !this.puedeCrear) return;
    const cliente$ = this.clienteNuevo
      ? this.clienteService.crear(this.nuevoCliente)
      : of({ idCliente: this.idCliente } as ClienteResponseDTO);
    this.guardando.set(true);
    cliente$
      .pipe(
        switchMap(cliente =>
          this.pedidoService.crear({
            idCliente: cliente.idCliente,
            numeroMesa: this.numeroMesa,
            idUsuario: usuario.idUsuario,
            observaciones: this.observaciones,
            detalles: this.detalles.filter(d => d.idProducto && d.cantidad > 0),
          }),
        ),
      )
      .subscribe({
        next: pedido => {
          this.guardando.set(false);
          this.modalVisible.set(false);
          this.toast.show(`Pedido #${pedido.idPedido} creado para la mesa ${pedido.numeroMesa}`, 'success');
          this.actualizarEnLista(pedido);
          this.cargarCatalogos();
        },
        error: err => {
        this.guardando.set(false);
        this.errores.set(erroresDeCampo(err));
      },
      });
  }

  private clienteVacio(): ClienteRequestDTO {
    return { nombre: '', apellido: '', correo: '', telefono: '' };
  }
}
