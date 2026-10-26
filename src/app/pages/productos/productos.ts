import { Component, signal } from '@angular/core';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { ProductoCard } from '../../components/organisms/producto-card/producto-card';
import { ProductoForm } from '../../components/organisms/producto-form/producto-form';
import { Modal } from '../../components/organisms/modal/modal';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { Button } from '../../components/atoms/button/button';
import { ProductoRequestDTO, ProductoResponseDTO } from '../../models/model';
import { PRODUCTOS_MOCK } from '../../mocks/productos.mock';
import { CATEGORIAS_MOCK } from '../../mocks/categorias.mock';

import { EmptyState } from '../../components/molecules/empty-state/empty-state';

@Component({
  selector: 'app-productos',
  imports: [DashboardLayout, ProductoCard, ProductoForm, Modal, SearchBar, TabFilter, Button, EmptyState],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  readonly productos = PRODUCTOS_MOCK;
  busqueda = signal('');
  categoriaActiva = signal('');
  modalVisible = signal(false);
  editando = signal<ProductoResponseDTO | null>(null);

  form: ProductoRequestDTO = this.formVacio();

  readonly tabs: Tab[] = [
    { label: 'Todos', value: '' },
    ...CATEGORIAS_MOCK.map(c => ({ label: c.nombreCategoria, value: c.nombreCategoria })),
  ];

  cambiarCategoria(value: string): void {
    this.categoriaActiva.set(value);
    this.busqueda.set('');
  }

  get productosFiltrados(): ProductoResponseDTO[] {
    let lista = this.productos;
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
    this.modalVisible.set(false);
  }

  eliminar(_id: number): void {}

  private formVacio(): ProductoRequestDTO {
    return { nombre: '', descripcion: '', precio: 0, disponibilidad: true, stock: 0, imagenUrl: '', nombreCategoria: '' };
  }
}
