import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VerificadorService } from '../../services/verificador.service';
import { HorarioAsignado } from '../../interfaces/verificador.interface';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-horarios-asignados',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './horarios-asignados.component.html',
  styleUrls: ['./horarios-asignados.component.css']
})
export class HorariosAsignadosComponent implements OnInit {
  horarios: HorarioAsignado[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private verificadorService: VerificadorService) {}

  ngOnInit(): void {
    this.cargarHorarios();
  }

  cargarHorarios(): void {
    this.loading = true;
    this.verificadorService.getHorariosAsignados().subscribe({
      next: (data) => {
        this.horarios = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los horarios';
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
}
