import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Productos', path: '/productos' },
    { label: 'Mesas', path: '/mesas' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Pedidos', path: '/pedidos' },
  ];

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {}

  get usuario() {
    return this.sessionService.usuario();
  }

  cerrarSesion(): void {
    this.sessionService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
