import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RolUsuario } from '../../../models/model';
import { SessionService } from '../../../services/session.service';
import { PropinasService } from '../../../services/propinas.service';
import { PrecioPipe } from '../../../pipes/precio.pipe';

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
  imports: [RouterLink, RouterLinkActive, PrecioPipe],
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
    public propinas: PropinasService,
    private router: Router,
  ) {
    this.propinas.cargarSiHaceFalta();
  }

  cerrarSesion(): void {
    this.sesion.cerrar();
    this.propinas.actualizar();
    this.router.navigate(['/login']);
  }
}
