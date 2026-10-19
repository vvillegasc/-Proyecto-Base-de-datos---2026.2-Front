import { Component, signal } from '@angular/core';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { ClienteCard } from '../../components/organisms/cliente-card/cliente-card';
import { Modal } from '../../components/organisms/modal/modal';
import { FormField } from '../../components/molecules/form-field/form-field';
import { SearchBar } from '../../components/molecules/search-bar/search-bar';
import { Button } from '../../components/atoms/button/button';
import { ClienteRequestDTO, ClienteResponseDTO } from '../../models/model';
import { CLIENTES_MOCK } from '../../mocks/clientes.mock';

@Component({
  selector: 'app-clientes',
  imports: [DashboardLayout, ClienteCard, Modal, FormField, SearchBar, Button],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  readonly clientes = CLIENTES_MOCK;
  busqueda = signal('');
  modalVisible = signal(false);
  editando = signal<ClienteResponseDTO | null>(null);

  form: ClienteRequestDTO = { nombres: '', apellidos: '', correo: '', telefono: '' };

  get clientesFiltrados(): ClienteResponseDTO[] {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.clientes;
    return this.clientes.filter(c =>
      `${c.nombres} ${c.apellidos} ${c.correo}`.toLowerCase().includes(q),
    );
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = { nombres: '', apellidos: '', correo: '', telefono: '' };
    this.modalVisible.set(true);
  }

  abrirEditar(c: ClienteResponseDTO): void {
    this.editando.set(c);
    this.form = { nombres: c.nombres, apellidos: c.apellidos, correo: c.correo, telefono: c.telefono };
    this.modalVisible.set(true);
  }

  guardar(): void {
    this.modalVisible.set(false);
  }

  eliminar(_id: number): void {}
}
