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
    { label: 'Productos', path: '/productos' },
    { label: 'Mesas', path: '/mesas' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Pedidos', path: '/pedidos' },
  ];

  readonly usuario: Pick<UsuarioResponseDTO, 'nombres' | 'rol'> = {
    nombres: 'Administrador',
    rol: 'ADMINISTRADOR',
  };
}
