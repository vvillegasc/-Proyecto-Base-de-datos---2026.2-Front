import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { DataTable, TableColumn, TableRow } from '../../components/organisms/data-table/data-table';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TextareaField } from '../../components/molecules/textarea-field/textarea-field';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { CategoriaRequestDTO, CategoriaResponseDTO } from '../../models/model';
import { CATEGORIAS_MOCK } from '../../mocks/categorias.mock';
import { PRODUCTOS_MOCK } from '../../mocks/productos.mock';
import { ToastService } from '../../services/toast.service';
import { ESTADO_CATEGORIA } from '../../utils/estados';

@Component({
  selector: 'app-categorias',
  imports: [DashboardLayout, DataTable, TableRow, Modal, ConfirmDialog, FormField, TextareaField, TabFilter, Badge, Button, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias {
  readonly categorias = CATEGORIAS_MOCK;
  readonly estados = ESTADO_CATEGORIA;

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

  constructor(private toast: ToastService) {}

  get categoriasFiltradas(): CategoriaResponseDTO[] {
    const estado = this.tabActivo();
    return estado ? this.categorias.filter(c => c.estado === estado) : this.categorias;
  }

  cantidadProductos(nombre: string): number {
    return PRODUCTOS_MOCK.filter(p => p.nombreCategoria === nombre).length;
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = this.formVacio();
    this.modalVisible.set(true);
  }

  abrirEditar(c: CategoriaResponseDTO): void {
    this.editando.set(c);
    this.form = { nombreCategoria: c.nombreCategoria, estado: c.estado, descripcion: c.descripcion };
    this.modalVisible.set(true);
  }

  guardar(): void {
    this.modalVisible.set(false);
    this.toast.show(this.editando() ? 'Categoría actualizada' : 'Categoría creada', 'success');
  }

  cambiarEstado(c: CategoriaResponseDTO): void {
    const nuevo = c.estado === 'ACTIVA' ? 'desactivada' : 'activada';
    this.toast.show(`Categoría "${c.nombreCategoria}" ${nuevo}`, 'success');
  }

  confirmarEliminar(): void {
    this.toast.show(`Categoría "${this.porEliminar()?.nombreCategoria}" eliminada`, 'success');
    this.porEliminar.set(null);
  }

  private formVacio(): CategoriaRequestDTO {
    return { nombreCategoria: '', estado: 'ACTIVA', descripcion: '' };
  }
}
