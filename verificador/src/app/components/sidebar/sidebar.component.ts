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
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  userName: string = 'Luis Armenta';
  userRole: string = 'Verificador';

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'bi-speedometer2'
    },
    {
      label: 'Horarios Asignados',
      route: '/verificaciones',
      icon: 'bi-calendar-check'
    },
    {
      label: 'Historial',
      route: '/verificaciones/historial',
      icon: 'bi-clock-history'
    },
    {
      label: 'Reportes',
      route: '/reportes',
      icon: 'bi-file-earmark-text'
    }
  ];

  constructor(private router: Router) {}

  onSettings(): void {
    this.router.navigate(['/configuracion']);
  }

  onLogout(): void {
    // Aquí iría la lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}
