import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { VerificadorService } from '../../services/verificador.service';
import { HorarioAsignado, DetalleHorario } from '../../interfaces/verificador.interface';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-detalle-horario',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="d-flex">
      <app-sidebar></app-sidebar>
      <div class="flex-grow-1 ms-3" style="margin-left: 250px !important;">
        <div class="container-fluid py-4">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h4 class="mb-0">Detalle del Horario</h4>
                  <button class="btn btn-secondary" routerLink="/verificaciones">
                    <i class="bi bi-arrow-left"></i> Volver
                  </button>
                </div>
                <div class="card-body">
                  <!-- Loading spinner -->
                  <div *ngIf="loading" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Cargando...</span>
                    </div>
                  </div>

                  <!-- Error message -->
                  <div *ngIf="error" class="alert alert-danger" role="alert">
                    {{ error }}
                  </div>

                  <!-- Horario details -->
                  <div *ngIf="!loading && !error && horario" class="row">
                    <div class="col-md-6">
                      <h5>Información General</h5>
                      <table class="table">
                        <tr>
                          <th>Grupo:</th>
                          <td>{{ horario.grupo_nombre }}</td>
                        </tr>
                        <tr>
                          <th>Carrera:</th>
                          <td>{{ horario.carrera_nombre }}</td>
                        </tr>
                        <tr>
                          <th>Edificio:</th>
                          <td>{{ horario.edificio_nombre }}</td>
                        </tr>
                        <tr>
                          <th>Aula:</th>
                          <td>{{ horario.aula_nombre }}</td>
                        </tr>
                        <tr>
                          <th>Estado:</th>
                          <td>
                            <span class="badge" [ngClass]="getEstadoClass(horario.estado)">
                              {{ horario.estado }}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div class="col-md-6">
                      <h5>Detalles del Horario</h5>
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Día</th>
                            <th>Hora</th>
                            <th>Materia</th>
                            <th>Profesor</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let detalle of ordenarDias(horario.detalles)">
                            <td>{{ detalle.dia }}</td>
                            <td>{{ detalle.hora }}</td>
                            <td>{{ detalle.materia }}</td>
                            <td>{{ detalle.profesor }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- No data message -->
                  <div *ngIf="!loading && !error && !horario" class="text-center py-4">
                    <p class="text-muted">No se encontró el horario</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      padding: 0.5em 1em;
    }
  `]
})
export class DetalleHorarioComponent implements OnInit {
  horario: HorarioAsignado | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private verificadorService: VerificadorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDetalleHorario(Number(id));
    }
  }

  cargarDetalleHorario(id: number): void {
    this.loading = true;
    this.verificadorService.getDetalleHorario(id).subscribe({
      next: (data) => {
        this.horario = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar el detalle del horario';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'bg-success';
      case 'pendiente':
        return 'bg-warning';
      case 'inactivo':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  ordenarDias(detalles: DetalleHorario[]): DetalleHorario[] {
    const ordenDias: Record<string, number> = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6,
      'Domingo': 7
    };
    
    return [...detalles].sort((a, b) => {
      const ordenA = ordenDias[a.dia] || 999;
      const ordenB = ordenDias[b.dia] || 999;
      if (ordenA === ordenB) {
        return a.hora.localeCompare(b.hora);
      }
      return ordenA - ordenB;
    });
  }
} 