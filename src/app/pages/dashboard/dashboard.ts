import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { StatCard } from '../../components/molecules/stat-card/stat-card';
import { EstadoCarga } from '../../components/molecules/estado-carga/estado-carga';
import { PedidosRecientes } from '../../components/organisms/pedidos-recientes/pedidos-recientes';
import { MesasBoard } from '../../components/organisms/mesas-board/mesas-board';
import { DashboardResumenDTO, MesaResponseDTO, PedidoResponseDTO } from '../../models/model';
import { DashboardService } from '../../services/dashboard.service';
import { PedidoService } from '../../services/pedido.service';
import { MesaService } from '../../services/mesa.service';
import { PrecioPipe } from '../../pipes/precio.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardLayout, StatCard, EstadoCarga, PedidosRecientes, MesasBoard, PrecioPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  resumen = signal<DashboardResumenDTO | null>(null);
  pedidosRecientes = signal<PedidoResponseDTO[]>([]);
  mesas = signal<MesaResponseDTO[]>([]);
  cargando = signal(true);
  error = signal(false);

  constructor(
    private dashboardService: DashboardService,
    private pedidoService: PedidoService,
    private mesaService: MesaService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    forkJoin({
      resumen: this.dashboardService.resumen(),
      pedidos: this.pedidoService.listar(),
      mesas: this.mesaService.listar(),
    }).subscribe({
      next: ({ resumen, pedidos, mesas }) => {
        this.resumen.set(resumen);
        // Los 3 más recientes primero.
        this.pedidosRecientes.set([...pedidos].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3));
        this.mesas.set(mesas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  get mesasDisponiblesLabel(): string {
    return `${this.resumen()?.mesasDisponibles ?? 0} / ${this.mesas().length}`;
  }
}
