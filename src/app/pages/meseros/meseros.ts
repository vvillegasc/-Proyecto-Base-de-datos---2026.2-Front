import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { DataTable, TableColumn, TableRow } from '../../components/organisms/data-table/data-table';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { FormField } from '../../components/molecules/form-field/form-field';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { Avatar } from '../../components/atoms/avatar/avatar';
import { Badge } from '../../components/atoms/badge/badge';
import { Button } from '../../components/atoms/button/button';
import { EstadoUsuario, RolUsuario, UsuarioRequestDTO, UsuarioResponseDTO } from '../../models/model';
import { UsuarioService } from '../../services/usuario.service';
import { ToastService } from '../../services/toast.service';
import { ESTADO_USUARIO } from '../../utils/estados';

import { ErroresCampo, erroresDeCampo } from '../../utils/errores';
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
    EstadoCarga,
    Avatar,
    Badge,
    Button,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './meseros.html',
  styleUrl: './meseros.css',
})
export class Meseros implements OnInit {
  usuarios = signal<UsuarioResponseDTO[]>([]);
  cargando = signal(true);
  error = signal(false);
  guardando = signal(false);
  // Errores de validación del back, por campo.
  errores = signal<ErroresCampo>({});
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

  constructor(
    private usuarioService: UsuarioService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.usuarioService.listar().subscribe({
      next: usuarios => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  get usuariosFiltrados(): UsuarioResponseDTO[] {
    const estado = this.tabActivo();
    const q = this.busqueda().toLowerCase();
    return this.usuarios().filter(
      u =>
        (!estado || u.estado === estado) &&
        (!q || `${u.nombres} ${u.apellidos} ${u.correo}`.toLowerCase().includes(q)),
    );
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = this.formVacio();
    this.errores.set({});
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
    this.errores.set({});
    this.modalVisible.set(true);
  }

  guardar(): void {
    const editando = this.editando();
    const peticion = editando
      ? this.usuarioService.actualizar(editando.idUsuario, this.form)
      : this.usuarioService.crear(this.form);
    this.guardando.set(true);
    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalVisible.set(false);
        this.toast.show(editando ? 'Usuario actualizado' : 'Mesero registrado', 'success');
        this.cargar();
      },
      error: err => {
        this.guardando.set(false);
        this.errores.set(erroresDeCampo(err));
      },
    });
  }

  // Activar no pide confirmación; desactivar sí, porque le corta el acceso.
  cambiarEstado(u: UsuarioResponseDTO): void {
    if (u.estado === 'ACTIVO') {
      this.porDesactivar.set(u);
    } else {
      this.aplicarEstado(u, 'ACTIVO');
    }
  }

  confirmarDesactivar(): void {
    const u = this.porDesactivar();
    this.porDesactivar.set(null);
    if (u) this.aplicarEstado(u, 'INACTIVO');
  }

  confirmarEliminar(): void {
    const u = this.porEliminar();
    if (!u) return;
    this.usuarioService.eliminar(u.idUsuario).subscribe({
      next: () => {
        this.porEliminar.set(null);
        this.toast.show(`${u.nombres} ${u.apellidos} eliminado`, 'success');
        this.cargar();
      },
      error: () => this.porEliminar.set(null),
    });
  }

  private aplicarEstado(u: UsuarioResponseDTO, estado: EstadoUsuario): void {
    this.usuarioService.cambiarEstado(u.idUsuario, estado).subscribe(() => {
      this.toast.show(`${u.nombres} ${u.apellidos} ${estado === 'ACTIVO' ? 'activado' : 'desactivado'}`, 'success');
      this.cargar();
    });
  }

  private formVacio(): UsuarioRequestDTO {
    const estado: EstadoUsuario = 'ACTIVO';
    return { nombres: '', apellidos: '', correo: '', contrasena: '', rol: 'MESERO', dosFacHab: false, estado };
  }
}
