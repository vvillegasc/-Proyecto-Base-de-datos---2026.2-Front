import { Component, OnInit, signal } from '@angular/core';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { ClienteCard } from '../../components/organisms/cliente-card/cliente-card';
import { Modal } from '../../components/organisms/modal/modal';
import { ConfirmDialog } from '../../components/organisms/confirm-dialog/confirm-dialog';
import { FormField } from '../../components/molecules/form-field/form-field';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { Button } from '../../components/atoms/button/button';
import { ClienteRequestDTO, ClienteResponseDTO } from '../../models/model';
import { ClienteService } from '../../services/cliente.service';
import { ToastService } from '../../services/toast.service';
import { SessionService } from '../../services/session.service';

import { ErroresCampo, erroresDeCampo } from '../../utils/errores';
@Component({
  selector: 'app-clientes',
  imports: [DashboardLayout, ClienteCard, Modal, ConfirmDialog, FormField, SearchBar, EmptyState, EstadoCarga, Button],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes = signal<ClienteResponseDTO[]>([]);
  cargando = signal(true);
  error = signal(false);
  guardando = signal(false);
  // Errores de validación del back, por campo.
  errores = signal<ErroresCampo>({});

  busqueda = signal('');
  modalVisible = signal(false);
  editando = signal<ClienteResponseDTO | null>(null);
  porEliminar = signal<ClienteResponseDTO | null>(null);

  form: ClienteRequestDTO = this.formVacio();

  constructor(
    private clienteService: ClienteService,
    private toast: ToastService,
    public sesion: SessionService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.clienteService.listar().subscribe({
      next: clientes => {
        this.clientes.set(clientes);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  get clientesFiltrados(): ClienteResponseDTO[] {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.clientes();
    return this.clientes().filter(c => `${c.nombre} ${c.apellido} ${c.correo}`.toLowerCase().includes(q));
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = this.formVacio();
    this.errores.set({});
    this.modalVisible.set(true);
  }

  abrirEditar(c: ClienteResponseDTO): void {
    this.editando.set(c);
    this.form = { nombre: c.nombre, apellido: c.apellido, correo: c.correo, telefono: c.telefono };
    this.errores.set({});
    this.modalVisible.set(true);
  }

  guardar(): void {
    const editando = this.editando();
    const peticion = editando
      ? this.clienteService.actualizar(editando.idCliente, this.form)
      : this.clienteService.crear(this.form);
    this.guardando.set(true);
    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalVisible.set(false);
        this.toast.show(editando ? 'Cliente actualizado' : 'Cliente registrado', 'success');
        this.cargar();
      },
      error: err => {
        this.guardando.set(false);
        this.errores.set(erroresDeCampo(err));
      },
    });
  }

  // Si el cliente tiene reservas activas, pedidos o facturas, el back responde 409 y el toast lo explica.
  confirmarEliminar(): void {
    const c = this.porEliminar();
    if (!c) return;
    this.porEliminar.set(null);
    this.clienteService.eliminar(c.idCliente).subscribe(() => {
      this.toast.show(`Cliente ${c.nombre} ${c.apellido} eliminado`, 'success');
      this.cargar();
    });
  }

  private formVacio(): ClienteRequestDTO {
    return { nombre: '', apellido: '', correo: '', telefono: '' };
  }
}
