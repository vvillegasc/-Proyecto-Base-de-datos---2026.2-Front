import { Component, signal } from '@angular/core';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { MesaCard } from '../../components/organisms/mesa-card/mesa-card';
import { Modal } from '../../components/organisms/modal/modal';
import { FormField } from '../../components/molecules/form-field/form-field';
import { TabFilter, Tab } from '../../components/molecules/tab-filter/tab-filter';
import { Button } from '../../components/atoms/button/button';
import { EstadoMesa, MesaRequestDTO, MesaResponseDTO } from '../../models/model';
import { MESAS_MOCK } from '../../mocks/mesas.mock';

import { EmptyState } from '../../components/molecules/empty-state/empty-state';

@Component({
  selector: 'app-mesas',
  imports: [DashboardLayout, MesaCard, Modal, FormField, TabFilter, Button, EmptyState],
  templateUrl: './mesas.html',
  styleUrl: './mesas.css',
})
export class Mesas {
  readonly mesas = MESAS_MOCK;
  tabActivo = signal('');
  modalVisible = signal(false);
  editando = signal<MesaResponseDTO | null>(null);

  form: MesaRequestDTO = { numeroMesa: 1, capacidad: 2, estado: 'DISPONIBLE' };

  readonly estados: EstadoMesa[] = ['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'EN_MANTENIMIENTO'];

  readonly tabs: Tab[] = [
    { label: 'Todas', value: '' },
    { label: 'Disponibles', value: 'DISPONIBLE' },
    { label: 'Ocupadas', value: 'OCUPADA' },
    { label: 'Reservadas', value: 'RESERVADA' },
  ];

  get mesasFiltradas(): MesaResponseDTO[] {
    const estado = this.tabActivo();
    return estado ? this.mesas.filter(m => m.estado === estado) : this.mesas;
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form = { numeroMesa: 1, capacidad: 2, estado: 'DISPONIBLE' };
    this.modalVisible.set(true);
  }

  abrirEditar(m: MesaResponseDTO): void {
    this.editando.set(m);
    this.form = { numeroMesa: m.numeroMesa, capacidad: m.capacidad, estado: m.estado };
    this.modalVisible.set(true);
  }

  guardar(): void {
    this.modalVisible.set(false);
  }

  eliminar(_numeroMesa: number): void {}
}
