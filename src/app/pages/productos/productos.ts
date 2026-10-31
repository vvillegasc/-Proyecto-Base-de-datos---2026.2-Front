import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { ProductoCard } from '../../components/organisms/producto-card/producto-card';
import { ProductoForm } from '../../components/organisms/producto-form/producto-form';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { Button } from '../../components/atoms/button/button';
import { CategoriaResponseDTO, ProductoRequestDTO, ProductoResponseDTO } from '../../models/model';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { ToastService } from '../../services/toast.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-productos',
  imports: [
    DashboardLayout,
    ProductoCard,
    ProductoForm,
    Modal,
    ConfirmDialog,
    SearchBar,
    TabFilter,
    EmptyState,
    EstadoCarga,
    Button,
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos = signal<ProductoResponseDTO[]>([]);
  categorias = signal<CategoriaResponseDTO[]>([]);
  cargando = signal(true);
  error = signal(false);
  guardando = signal(false);

  busqueda = signal('');
  categoriaActiva = signal('');
  modalVisible = signal(false);
  editando = signal<ProductoResponseDTO | null>(null);
  porEliminar = signal<ProductoResponseDTO | null>(null);

  form: ProductoRequestDTO = this.formVacio();

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private toast: ToastService,
    public sesion: SessionService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    forkJoin({ productos: this.productoService.listar(), categorias: this.categoriaService.listar() }).subscribe({
      next: ({ productos, categorias }) => {
        this.productos.set(productos);
        this.categorias.set(categorias);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  // El mesero solo ve las categorías activas (las inactivas no están en el menú).
  get tabs(): Tab[] {
    const categorias = this.sesion.esAdmin() ? this.categorias() : this.categorias().filter(c => c.estado === 'ACTIVA');
    return [{ label: 'Todos', value: '' }, ...categorias.map(c => ({ label: c.nombreCategoria, value: c.nombreCategoria }))];
  }

  cambiarCategoria(value: string): void {
    this.categoriaActiva.set(value);
    this.busqueda.set('');
  }

  get productosFiltrados(): ProductoResponseDTO[] {
    let lista = this.productos();
    const cat = this.categoriaActiva();
    if (cat) lista = lista.filter(p => p.nombreCategoria === cat);
    const q = this.busqueda().toLowerCase();
    if (q) lista = lista.filter(p => p.nombre.toLowerCase().includes(q));
    return lista;
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = this.formVacio();
    this.modalVisible.set(true);
  }

  abrirEditar(p: ProductoResponseDTO): void {
    this.editando.set(p);
    this.form = {
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      disponibilidad: p.disponibilidad,
      stock: p.stock,
      imagenUrl: p.imagenUrl,
      nombreCategoria: p.nombreCategoria,
    };
    this.modalVisible.set(true);
  }

  guardar(): void {
    const editando = this.editando();
    const peticion = editando
      ? this.productoService.actualizar(editando.idProducto, this.form)
      : this.productoService.crear(this.form);
    this.guardando.set(true);
    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalVisible.set(false);
        this.toast.show(editando ? 'Producto actualizado' : 'Producto creado', 'success');
        this.cargar();
      },
      error: () => this.guardando.set(false),
    });
  }

  confirmarEliminar(): void {
    const p = this.porEliminar();
    if (!p) return;
    this.productoService.eliminar(p.idProducto).subscribe({
      next: () => {
        this.porEliminar.set(null);
        this.toast.show(`Producto "${p.nombre}" eliminado`, 'success');
        this.cargar();
      },
      error: () => this.porEliminar.set(null),
    });
  }

  private formVacio(): ProductoRequestDTO {
    return { nombre: '', descripcion: '', precio: 0, disponibilidad: true, stock: 0, imagenUrl: '', nombreCategoria: '' };
  }
}
