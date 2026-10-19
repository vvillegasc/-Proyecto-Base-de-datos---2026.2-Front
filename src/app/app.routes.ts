import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Mesas } from './pages/mesas/mesas';
import { Clientes } from './pages/clientes/clientes';
import { Pedidos } from './pages/pedidos/pedidos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'productos', component: Productos },
  { path: 'mesas', component: Mesas },
  { path: 'clientes', component: Clientes },
  { path: 'pedidos', component: Pedidos },
  { path: '**', redirectTo: 'login' },
];
