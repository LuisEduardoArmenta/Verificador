import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Verification {
  id: number;
  datetime: Date;
  professor: string;
  subject: string;
  classroom: string;
  status: string;
  observations: string;
  checker: string;
}

interface Professor {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface Classroom {
  id: number;
  name: string;
}

@Component({
  selector: 'app-verificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SidebarComponent],
  templateUrl: './verificaciones.component.html',
  styleUrl: './verificaciones.component.css'
})
export class VerificacionesComponent implements OnInit {
  // Datos de ejemplo
  verificaciones: Verification[] = [
    {
      id: 1,
      datetime: new Date(),
      professor: 'Dr. Roberto García',
      subject: 'Cálculo Diferencial',
      classroom: 'A-201',
      status: 'presente',
      observations: 'Clase normal',
      checker: 'Juan Pérez'
    },
    {
      id: 2,
      datetime: new Date(),
      professor: 'Dra. María López',
      subject: 'Programación',
      classroom: 'Lab-102',
      status: 'retardo',
      observations: '10 minutos de retraso',
      checker: 'Juan Pérez'
    }
  ];

  professors: Professor[] = [
    { id: 1, name: 'Dr. Roberto García' },
    { id: 2, name: 'Dra. María López' }
  ];

  subjects: Subject[] = [
    { id: 1, name: 'Cálculo Diferencial' },
    { id: 2, name: 'Programación' }
  ];

  classrooms: Classroom[] = [
    { id: 1, name: 'A-201' },
    { id: 2, name: 'Lab-102' }
  ];

  // Variables de control
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  Math = Math;
  editingVerification: boolean = false;
  verificationForm: FormGroup;

  filters = {
    date: '',
    professor: '',
    status: '',
    classroom: ''
  };

  constructor(private fb: FormBuilder) {
    this.verificationForm = this.fb.group({
      professor: ['', Validators.required],
      subject: ['', Validators.required],
      classroom: ['', Validators.required],
      status: ['presente', Validators.required],
      observations: ['']
    });
  }

  ngOnInit(): void {
    this.totalItems = this.verificaciones.length;
    this.calculateTotalPages();
  }

  onSearch(): void {
    // Implementar lógica de búsqueda
    console.log('Buscando:', this.searchTerm);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'presente':
        return 'bg-success';
      case 'ausente':
        return 'bg-danger';
      case 'retardo':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  openNewVerificationModal(): void {
    this.editingVerification = false;
    this.verificationForm.reset({status: 'presente'});
    // Aquí se abriría el modal usando Bootstrap
  }

  editVerification(verification: Verification): void {
    this.editingVerification = true;
    this.verificationForm.patchValue({
      professor: verification.professor,
      subject: verification.subject,
      classroom: verification.classroom,
      status: verification.status,
      observations: verification.observations
    });
    // Aquí se abriría el modal usando Bootstrap
  }

  deleteVerification(verification: Verification): void {
    if (confirm('¿Está seguro de eliminar esta verificación?')) {
      // Implementar lógica de eliminación
      console.log('Eliminando verificación:', verification);
    }
  }

  saveVerification(): void {
    if (this.verificationForm.valid) {
      // Implementar lógica de guardado
      console.log('Guardando verificación:', this.verificationForm.value);
      // Cerrar modal después de guardar
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }
}