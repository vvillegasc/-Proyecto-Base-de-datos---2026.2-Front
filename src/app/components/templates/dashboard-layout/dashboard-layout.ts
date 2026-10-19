import { Component } from '@angular/core';
import { Sidebar } from '../../organisms/sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
