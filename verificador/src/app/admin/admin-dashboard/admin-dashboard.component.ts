import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { SchedulesService } from '../../services/schedules.service';
import { Chart, registerables } from 'chart.js';
import { firstValueFrom } from 'rxjs';

Chart.register(...registerables);

interface Actividad {
  titulo: string;
  descripcion: string;
  fecha: Date;
}

interface Alerta {
  titulo: string;
  descripcion: string;
  fecha: Date;
  tipo: 'warning' | 'danger';
}

interface ConflictoHorario {
  id: number;
  descripcion: string;
  tipo: 'profesor' | 'aula' | 'grupo';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // Totales
  totalHorariosActivos: number = 0;
  totalHorariosPendientes: number = 0;
  totalHorariosVerificados: number = 0;
  totalProfesoresActivos: number = 0;

  // Actividades y alertas
  actividadesRecientes: Actividad[] = [];
  alertas: Alerta[] = [];

  constructor(private schedulesService: SchedulesService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    try {
      // Cargar datos de horarios
      const horarios = await firstValueFrom(this.schedulesService.getHorariosGrupo());
      this.totalHorariosActivos = horarios?.length || 0;
      this.totalHorariosPendientes = horarios?.filter(h => h.estado === 'pendiente').length || 0;
      this.totalHorariosVerificados = horarios?.filter(h => h.estado === 'verificado').length || 0;

      // Cargar datos de profesores
      const profesores = await firstValueFrom(this.schedulesService.getProfesores());
      this.totalProfesoresActivos = profesores?.filter(p => p.activo).length || 0;

      // Inicializar gráficos
      this.inicializarGraficos(horarios || []);

      // Cargar actividades recientes
      this.cargarActividadesRecientes(horarios || []);

      // Cargar alertas
      this.cargarAlertas(horarios || [], profesores || []);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    }
  }

  private inicializarGraficos(horarios: any[]) {
    // Gráfico de estado de horarios
    const ctxEstado = document.getElementById('estadoHorariosChart') as HTMLCanvasElement;
    new Chart(ctxEstado, {
      type: 'bar',
      data: {
        labels: ['Pendientes', 'Verificados'],
        datasets: [{
          label: 'Estado de Horarios',
          data: [
            horarios.filter(h => h.estado === 'pendiente').length,
            horarios.filter(h => h.estado === 'verificado').length
          ],
          backgroundColor: ['#ffc107', '#28a745']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Gráfico de horarios por carrera
    const ctxCarrera = document.getElementById('horariosPorCarreraChart') as HTMLCanvasElement;
    const carreras = [...new Set(horarios.map(h => h.carrera))];
    new Chart(ctxCarrera, {
      type: 'pie',
      data: {
        labels: carreras.map(c => this.getNombreCarrera(c)),
        datasets: [{
          data: carreras.map(c => horarios.filter(h => h.carrera === c).length),
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8',
            '#6610f2', '#fd7e14', '#20c997', '#e83e8c', '#6f42c1'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  private cargarActividadesRecientes(horarios: any[]) {
    this.actividadesRecientes = horarios
      .sort((a, b) => new Date(b.fecha_actualizacion).getTime() - new Date(a.fecha_actualizacion).getTime())
      .slice(0, 5)
      .map(h => ({
        titulo: `Horario ${h.id}`,
        descripcion: `Estado: ${h.estado}`,
        fecha: new Date(h.fecha_actualizacion)
      }));
  }

  private cargarAlertas(horarios: any[], profesores: any[]) {
    this.alertas = [];

    // Alertas de horarios pendientes
    const horariosPendientes = horarios.filter(h => h.estado === 'pendiente');
    if (horariosPendientes.length > 0) {
      this.alertas.push({
        titulo: 'Horarios Pendientes',
        descripcion: `Hay ${horariosPendientes.length} horarios pendientes de verificación`,
        fecha: new Date(),
        tipo: 'warning'
      });
    }

    // Alertas de conflictos de horario
    const conflictos = this.detectarConflictos(horarios);
    if (conflictos.length > 0) {
      this.alertas.push({
        titulo: 'Conflictos de Horario',
        descripcion: `Se detectaron ${conflictos.length} conflictos de horario`,
        fecha: new Date(),
        tipo: 'danger'
      });
    }
  }

  private detectarConflictos(horarios: any[]): ConflictoHorario[] {
    const conflictos: ConflictoHorario[] = [];
    
    // Implementar lógica de detección de conflictos
    // Por ejemplo, detectar si un profesor tiene clases en el mismo horario
    horarios.forEach(horario => {
      const detallesPorProfesor = new Map<number, Set<string>>();
      
      horario.detalles?.forEach((detalle: any) => {
        if (!detallesPorProfesor.has(detalle.profesor)) {
          detallesPorProfesor.set(detalle.profesor, new Set());
        }
        
        const key = `${detalle.dia}_${detalle.hora}`;
        if (detallesPorProfesor.get(detalle.profesor)?.has(key)) {
          conflictos.push({
            id: horario.id,
            descripcion: `Conflicto de horario para el profesor en ${detalle.dia} ${detalle.hora}`,
            tipo: 'profesor'
          });
        } else {
          detallesPorProfesor.get(detalle.profesor)?.add(key);
        }
      });
    });
    
    return conflictos;
  }

  private getNombreCarrera(id: number): string {
    // Implementar lógica para obtener nombre de carrera
    return `Carrera ${id}`;
  }
}
