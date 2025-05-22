import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VerificadorService } from '../../services/verificador.service';
import { RegistroAsistencia } from '../../interfaces/verificador.interface';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-historial-verificaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './historial-verificaciones.component.html',
  styleUrls: ['./historial-verificaciones.component.css']
})
export class HistorialVerificacionesComponent implements OnInit {
  registros: RegistroAsistencia[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private verificadorService: VerificadorService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.loading = true;
    this.verificadorService.getHistorialVerificaciones().subscribe({
      next: (data) => {
        this.registros = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar el historial';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'presente':
        return 'bg-success';
      case 'retardo':
        return 'bg-warning';
      case 'falta':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
