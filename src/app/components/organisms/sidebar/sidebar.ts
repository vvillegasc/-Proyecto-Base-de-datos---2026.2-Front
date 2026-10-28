import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsuarioResponseDTO } from '../../../models/model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Meseros', path: '/meseros' },
    { label: 'Productos', path: '/productos' },
    { label: 'Categorías', path: '/categorias' },
    { label: 'Mesas', path: '/mesas' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Reservas', path: '/reservas' },
    { label: 'Pedidos', path: '/pedidos' },
    { label: 'Facturas', path: '/facturas' },
  ];

  readonly usuario: Pick<UsuarioResponseDTO, 'nombres' | 'rol'> = {
    nombres: 'Administrador',
    rol: 'ADMINISTRADOR',
  };
}
