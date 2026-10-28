import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { DataTable, TableColumn, TableRow } from '../../components/organisms/data-table/data-table';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { FormField } from '../../components/molecules/form-field/form-field';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { Avatar } from '../../components/atoms/avatar/avatar';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { EstadoUsuario, RolUsuario, UsuarioRequestDTO, UsuarioResponseDTO } from '../../models/model';
import { USUARIOS_MOCK } from '../../mocks/usuarios.mock';
import { ToastService } from '../../services/toast.service';
import { ESTADO_USUARIO } from '../../utils/estados';

@Component({
  selector: 'app-meseros',
  imports: [
    DashboardLayout,
    DataTable,
    TableRow,
    Modal,
    ConfirmDialog,
    FormField,
    SearchBar,
    TabFilter,
    Avatar,
    Badge,
    Button,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './meseros.html',
  styleUrl: './meseros.css',
})
export class Meseros {
  readonly usuarios = USUARIOS_MOCK;
  readonly estados = ESTADO_USUARIO;
  readonly roles: RolUsuario[] = ['MESERO', 'ADMINISTRADOR'];

  busqueda = signal('');
  tabActivo = signal('');
  modalVisible = signal(false);
  editando = signal<UsuarioResponseDTO | null>(null);
  porEliminar = signal<UsuarioResponseDTO | null>(null);
  porDesactivar = signal<UsuarioResponseDTO | null>(null);

  form: UsuarioRequestDTO = this.formVacio();

  readonly tabs: Tab[] = [
    { label: 'Todos', value: '' },
    { label: 'Activos', value: 'ACTIVO' },
    { label: 'Inactivos', value: 'INACTIVO' },
  ];

  readonly columnas: TableColumn[] = [
    { label: 'Usuario' },
    { label: 'Rol' },
    { label: 'Estado' },
    { label: '2FA', align: 'center' },
    { label: 'Inicio' },
    { label: '', align: 'right' },
  ];

  constructor(private toast: ToastService) {}

  get usuariosFiltrados(): UsuarioResponseDTO[] {
    const estado = this.tabActivo();
    const q = this.busqueda().toLowerCase();
    return this.usuarios.filter(
      u =>
        (!estado || u.estado === estado) &&
        (!q || `${u.nombres} ${u.apellidos} ${u.correo}`.toLowerCase().includes(q)),
    );
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = this.formVacio();
    this.modalVisible.set(true);
  }

  abrirEditar(u: UsuarioResponseDTO): void {
    this.editando.set(u);
    this.form = {
      nombres: u.nombres,
      apellidos: u.apellidos,
      correo: u.correo,
      contrasena: '',
      rol: u.rol,
      dosFacHab: u.dosFacHab,
      estado: u.estado,
    };
    this.modalVisible.set(true);
  }

  guardar(): void {
    this.modalVisible.set(false);
    this.toast.show(this.editando() ? 'Usuario actualizado' : 'Mesero registrado', 'success');
  }

  // Activar no pide confirmación; desactivar sí, porque le corta el acceso.
  cambiarEstado(u: UsuarioResponseDTO): void {
    if (u.estado === 'ACTIVO') {
      this.porDesactivar.set(u);
    } else {
      this.toast.show(`${u.nombres} ${u.apellidos} activado`, 'success');
    }
  }

  confirmarDesactivar(): void {
    const u = this.porDesactivar();
    this.toast.show(`${u?.nombres} ${u?.apellidos} desactivado`, 'success');
    this.porDesactivar.set(null);
  }

  confirmarEliminar(): void {
    const u = this.porEliminar();
    this.toast.show(`${u?.nombres} ${u?.apellidos} eliminado`, 'success');
    this.porEliminar.set(null);
  }

  private formVacio(): UsuarioRequestDTO {
    const estado: EstadoUsuario = 'ACTIVO';
    return { nombres: '', apellidos: '', correo: '', contrasena: '', rol: 'MESERO', dosFacHab: false, estado };
  }
}
