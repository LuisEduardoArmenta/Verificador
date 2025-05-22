import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'bi-speedometer2' },
    { label: 'Gestión de Usuarios', route: '/admin/users', icon: 'bi-people' },
    { label: 'Gestión de Horarios', route: '/admin/schedules', icon: 'bi-calendar' },
    { label: 'Reportes', route: '/admin/reports', icon: 'bi-file-earmark-text' }
  ];

  userName: string = localStorage.getItem('username') || 'Administrador';
  userRole: string = localStorage.getItem('user_role') || 'admin';

  constructor(private router: Router) {}

  onSettings(): void {
    this.router.navigate(['/admin/settings']);
  }

  onLogout(): void {
    // Aquí iría la lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}