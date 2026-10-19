import { Component } from '@angular/core';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { StatCard } from '../../components/molecules/stat-card/stat-card';
import { PedidosRecientes } from '../../components/organisms/pedidos-recientes/pedidos-recientes';
import { MesasBoard } from '../../components/organisms/mesas-board/mesas-board';
import { DASHBOARD_MOCK } from '../../mocks/dashboard.mock';
import { PEDIDOS_MOCK } from '../../mocks/pedidos.mock';
import { MESAS_MOCK } from '../../mocks/mesas.mock';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardLayout, StatCard, PedidosRecientes, MesasBoard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly resumen = DASHBOARD_MOCK;
  readonly pedidosRecientes = PEDIDOS_MOCK.slice(0, 3);
  readonly mesas = MESAS_MOCK;

  get mesasDisponiblesLabel(): string {
    return `${this.resumen.mesasDisponibles} / ${this.mesas.length}`;
  }
}
