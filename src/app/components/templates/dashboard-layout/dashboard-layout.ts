import { Component, signal } from '@angular/core';
import { Sidebar } from '../../organisms/sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  // Solo aplica en pantallas angostas: ahí el sidebar se oculta y se abre con el botón ☰.
  menuAbierto = signal(false);
}
