import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VerificadorService } from '../../services/verificador.service';
import { HorarioAsignado, DetalleHorario } from '../../interfaces/verificador.interface';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
declare var bootstrap: any;

@Component({
  selector: 'app-registro-asistencia',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './registro-asistencia.component.html',
  styleUrls: ['./registro-asistencia.component.css']
})
export class RegistroAsistenciaComponent implements OnInit, AfterViewInit {
  horario: HorarioAsignado | null = null;
  loading: boolean = true;
  error: string | null = null;
  registroForm: FormGroup;
  detalleSeleccionado: DetalleHorario | null = null;
  modal: any;
  registroExitoso: boolean = false;

  constructor(
    private verificadorService: VerificadorService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.registroForm = this.fb.group({
      estado: ['presente', Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDetalleHorario(Number(id));
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const modalElement = document.getElementById('modalRegistro');
      if (modalElement) {
        this.modal = new bootstrap.Modal(modalElement);
      }
    }, 0);
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

  abrirModalRegistro(detalle: DetalleHorario): void {
    this.detalleSeleccionado = detalle;
    this.registroForm.reset({
      estado: 'presente',
      observaciones: ''
    });
    if (this.modal) {
      this.modal.show();
    }
  }

  onSubmit(): void {
    if (this.registroForm.valid && this.detalleSeleccionado) {
      const registro = {
        horario_detalle: this.detalleSeleccionado.id,
        estado: this.registroForm.get('estado')?.value,
        observaciones: this.registroForm.get('observaciones')?.value
      };

      this.verificadorService.registrarAsistencia(registro).subscribe({
        next: () => {
          if (this.modal) {
            this.modal.hide();
          }
          this.registroExitoso = true;
          setTimeout(() => {
            this.registroExitoso = false;
            this.cargarDetalleHorario(this.detalleSeleccionado?.horario_id || 0);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al registrar asistencia:', error);
          this.error = 'Error al registrar la asistencia';
        }
      });
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

  registrarAsistencia(detalle: DetalleHorario, estado: 'presente' | 'retardo' | 'falta'): void {
    const registro = {
      horario_detalle: detalle.id,
      estado: estado,
      observaciones: ''
    };

    this.verificadorService.registrarAsistencia(registro).subscribe({
      next: () => {
        this.registroExitoso = true;
        setTimeout(() => {
          this.registroExitoso = false;
          this.cargarDetalleHorario(detalle.horario_id);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al registrar asistencia:', error);
        this.error = 'Error al registrar la asistencia';
      }
    });
  }
}
