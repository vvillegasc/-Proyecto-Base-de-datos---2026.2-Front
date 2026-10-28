import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RolUsuario } from '../../../models/model';
import { SessionService } from '../../../services/session.service';
import { USUARIOS_MOCK } from '../../../mocks/usuarios.mock';

interface NavItem {
  label: string;
  path: string;
}

const MENU: Record<RolUsuario, NavItem[]> = {
  ADMINISTRADOR: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Meseros', path: '/meseros' },
    { label: 'Productos', path: '/productos' },
    { label: 'Categorías', path: '/categorias' },
    { label: 'Mesas', path: '/mesas' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Reservas', path: '/reservas' },
    { label: 'Pedidos', path: '/pedidos' },
    { label: 'Facturas', path: '/facturas' },
  ],
  MESERO: [
    { label: 'Mesas', path: '/mesas' },
    { label: 'Pedidos', path: '/pedidos' },
    { label: 'Cobros y facturas', path: '/facturas' },
    { label: 'Reservas', path: '/reservas' },
    { label: 'Menú', path: '/productos' },
    { label: 'Clientes', path: '/clientes' },
  ],
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly navItems = computed(() => {
    const rol = this.sesion.rol();
    return rol ? MENU[rol] : [];
  });

  constructor(
    public sesion: SessionService,
    private router: Router,
  ) {}

  cerrarSesion(): void {
    this.sesion.cerrar();
    this.router.navigate(['/login']);
  }

  // TEMPORAL (solo para revisar el diseño con mocks): cambia de rol sin volver a iniciar sesión.
  // Se borra en la fase 9 junto con los mocks.
  verComo(rol: RolUsuario): void {
    const usuario = USUARIOS_MOCK.find(u => u.rol === rol && u.estado === 'ACTIVO');
    if (!usuario) return;
    this.sesion.iniciar('token-simulado', usuario);
    this.router.navigate([this.sesion.inicio()]);
  }
}
