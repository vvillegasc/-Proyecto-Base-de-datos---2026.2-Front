import { Routes } from '@angular/router';
import { authGuard, invitadoGuard, rolGuard } from './guards/auth.guards';

const soloAdmin = { canActivate: [authGuard, rolGuard], data: { roles: ['ADMINISTRADOR'] } };
const personal = { canActivate: [authGuard] };

// Cada pantalla se descarga al entrar a su ruta (carga diferida) para que el bundle inicial sea liviano.
export const routes: Routes = [
  // Público
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
  { path: 'reservar', loadComponent: () => import('./pages/reservar/reservar').then(m => m.Reservar) },
  {
    path: 'login',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },

  // Solo administrador
  { path: 'dashboard', ...soloAdmin, loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'meseros', ...soloAdmin, loadComponent: () => import('./pages/meseros/meseros').then(m => m.Meseros) },
  {
    path: 'categorias',
    ...soloAdmin,
    loadComponent: () => import('./pages/categorias/categorias').then(m => m.Categorias),
  },

  // Administrador y mesero (cada página oculta lo que no le toca al rol)
  { path: 'productos', ...personal, loadComponent: () => import('./pages/productos/productos').then(m => m.Productos) },
  { path: 'mesas', ...personal, loadComponent: () => import('./pages/mesas/mesas').then(m => m.Mesas) },
  { path: 'clientes', ...personal, loadComponent: () => import('./pages/clientes/clientes').then(m => m.Clientes) },
  { path: 'reservas', ...personal, loadComponent: () => import('./pages/reservas/reservas').then(m => m.Reservas) },
  { path: 'pedidos', ...personal, loadComponent: () => import('./pages/pedidos/pedidos').then(m => m.Pedidos) },
  { path: 'facturas', ...personal, loadComponent: () => import('./pages/facturas/facturas').then(m => m.Facturas) },

  { path: '**', redirectTo: '' },
];
