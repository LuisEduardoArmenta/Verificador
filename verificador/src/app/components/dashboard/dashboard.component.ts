import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface StatCard {
    label: string;
    value: number;
    icon: string;
    iconClass: string;
    textClass: string;
  }
  
  interface ClassInfo {
    professor: string;
    subject: string;
    classroom: string;
    time: string;
    status: string;
    statusClass: string;
  }
  
  interface Activity {
    description: string;
    time: string;
    icon: string;
    iconClass: string;
    textClass: string;
  }
  
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})export class DashboardComponent implements OnInit {
    notificationCount: number = 3;
  
    statsData: StatCard[] = [
      {
        label: 'Verificaciones Hoy',
        value: 24,
        icon: 'bi-clipboard-check',
        iconClass: 'bg-primary bg-opacity-10',
        textClass: 'text-primary'
      },
      {
        label: 'Clases en Curso',
        value: 8,
        icon: 'bi-mortarboard',
        iconClass: 'bg-success bg-opacity-10',
        textClass: 'text-success'
      },
      {
        label: 'Inasistencias',
        value: 2,
        icon: 'bi-exclamation-circle',
        iconClass: 'bg-danger bg-opacity-10',
        textClass: 'text-danger'
      },
      {
        label: 'Salones Asignados',
        value: 12,
        icon: 'bi-door-open',
        iconClass: 'bg-info bg-opacity-10',
        textClass: 'text-info'
      }
    ];
    currentClasses: ClassInfo[] = [
        {
          professor: 'Dr. Roberto García',
          subject: 'Cálculo Diferencial',
          classroom: 'A-201',
          time: '10:00 - 11:30',
          status: 'En clase',
          statusClass: 'bg-success'
        },
        {
          professor: 'Dra. María López',
          subject: 'Programación',
          classroom: 'Lab-102',
          time: '10:30 - 12:00',
          status: 'Pendiente',
          statusClass: 'bg-warning'
        }
      ];
    
      recentActivity: Activity[] = [
        {
          description: 'Verificación completada - A-201',
          time: 'Hace 5 minutos',
          icon: 'bi-check-circle',
          iconClass: 'bg-success bg-opacity-10',
          textClass: 'text-success'
        },
        {
          description: 'Retraso reportado - Lab-102',
          time: 'Hace 15 minutos',
          icon: 'bi-exclamation-circle',
          iconClass: 'bg-warning bg-opacity-10',
          textClass: 'text-warning'
        }
      ];
      constructor(private router: Router) {}

      ngOnInit(): void {
        // Aquí podrías cargar datos iniciales desde un servicio
      }
    
      onNewVerification(): void {
        this.router.navigate(['/verificaciones/nueva']);
      }
    
      onViewAllClasses(): void {
        this.router.navigate(['/verificaciones']);
      }
    
      onVerifyClass(classInfo: ClassInfo): void {
        // Implementar lógica de verificación
        console.log('Verificando clase:', classInfo);
      }
    
      onGenerateReport(): void {
        this.router.navigate(['/reportes/generar']);
      }
    
      onViewSchedule(): void {
        this.router.navigate(['/horarios']);
      }
    }