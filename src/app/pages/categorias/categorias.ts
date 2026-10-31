import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { DataTable, TableColumn, TableRow } from '../../components/organisms/data-table/data-table';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TextareaField } from '../../components/molecules/textarea-field/textarea-field';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { CategoriaRequestDTO, CategoriaResponseDTO, ProductoResponseDTO } from '../../models/model';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { ToastService } from '../../services/toast.service';
import { ESTADO_CATEGORIA } from '../../utils/estados';

import { ErroresCampo, erroresDeCampo } from '../../utils/errores';
@Component({
  selector: 'app-categorias',
  imports: [
    DashboardLayout,
    DataTable,
    TableRow,
    Modal,
    ConfirmDialog,
    FormField,
    TextareaField,
    TabFilter,
    EstadoCarga,
    Badge,
    Button,
    FormsModule,
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  readonly estados = ESTADO_CATEGORIA;

  categorias = signal<CategoriaResponseDTO[]>([]);
  private productos = signal<ProductoResponseDTO[]>([]);
  cargando = signal(true);
  error = signal(false);
  guardando = signal(false);
  // Errores de validación del back, por campo.
  errores = signal<ErroresCampo>({});

  tabActivo = signal('');
  modalVisible = signal(false);
  editando = signal<CategoriaResponseDTO | null>(null);
  porEliminar = signal<CategoriaResponseDTO | null>(null);

  form: CategoriaRequestDTO = this.formVacio();

  readonly tabs: Tab[] = [
    { label: 'Todas', value: '' },
    { label: 'Activas', value: 'ACTIVA' },
    { label: 'Inactivas', value: 'INACTIVA' },
  ];

  readonly columnas: TableColumn[] = [
    { label: 'Categoría' },
    { label: 'Descripción' },
    { label: 'Productos', align: 'center' },
    { label: 'Estado' },
    { label: '', align: 'right' },
  ];

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    forkJoin({ categorias: this.categoriaService.listar(), productos: this.productoService.listar() }).subscribe({
      next: ({ categorias, productos }) => {
        this.categorias.set(categorias);
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  get categoriasFiltradas(): CategoriaResponseDTO[] {
    const estado = this.tabActivo();
    return estado ? this.categorias().filter(c => c.estado === estado) : this.categorias();
  }

  // El back no da el conteo: se cuenta sobre la lista de productos.
  cantidadProductos(nombre: string): number {
    return this.productos().filter(p => p.nombreCategoria === nombre).length;
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = this.formVacio();
    this.errores.set({});
    this.modalVisible.set(true);
  }

  abrirEditar(c: CategoriaResponseDTO): void {
    this.editando.set(c);
    this.form = { nombreCategoria: c.nombreCategoria, estado: c.estado, descripcion: c.descripcion };
    this.errores.set({});
    this.modalVisible.set(true);
  }

  guardar(): void {
    const editando = this.editando();
    const peticion = editando
      ? this.categoriaService.actualizar(editando.nombreCategoria, this.form)
      : this.categoriaService.crear(this.form);
    this.guardando.set(true);
    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalVisible.set(false);
        this.toast.show(editando ? 'Categoría actualizada' : 'Categoría creada', 'success');
        this.cargar();
      },
      error: err => {
        this.guardando.set(false);
        this.errores.set(erroresDeCampo(err));
      },
    });
  }

  // No hay endpoint de estado: se envía la categoría completa con el otro estado.
  cambiarEstado(c: CategoriaResponseDTO): void {
    const estado = c.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
    this.categoriaService.actualizar(c.nombreCategoria, { ...c, estado }).subscribe(() => {
      this.toast.show(`Categoría "${c.nombreCategoria}" ${estado === 'ACTIVA' ? 'activada' : 'desactivada'}`, 'success');
      this.cargar();
    });
  }

  confirmarEliminar(): void {
    const c = this.porEliminar();
    if (!c) return;
    this.categoriaService.eliminar(c.nombreCategoria).subscribe({
      next: () => {
        this.porEliminar.set(null);
        this.toast.show(`Categoría "${c.nombreCategoria}" eliminada`, 'success');
        this.cargar();
      },
      error: () => this.porEliminar.set(null),
    });
  }

  private formVacio(): CategoriaRequestDTO {
    return { nombreCategoria: '', estado: 'ACTIVA', descripcion: '' };
  }
}
