import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Inicio } from './pages/inicio/inicio';
import { Reservar } from './pages/reservar/reservar';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Mesas } from './pages/mesas/mesas';
import { Clientes } from './pages/clientes/clientes';
import { Pedidos } from './pages/pedidos/pedidos';
import { Meseros } from './pages/meseros/meseros';
import { Categorias } from './pages/categorias/categorias';
import { Reservas } from './pages/reservas/reservas';
import { Facturas } from './pages/facturas/facturas';

export const routes: Routes = [
  { path: '', component: Inicio, pathMatch: 'full' },
  { path: 'reservar', component: Reservar },
  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'productos', component: Productos },
  { path: 'mesas', component: Mesas },
  { path: 'clientes', component: Clientes },
  { path: 'pedidos', component: Pedidos },
  { path: 'meseros', component: Meseros },
  { path: 'categorias', component: Categorias },
  { path: 'reservas', component: Reservas },
  { path: 'facturas', component: Facturas },
  { path: '**', redirectTo: '' },
];
