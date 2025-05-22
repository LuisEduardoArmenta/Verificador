export interface HorarioAsignado {
  id: number;
  grupo_nombre: string;
  carrera_nombre: string;
  edificio_nombre: string;
  aula_nombre: string;
  estado: string;
  detalles: DetalleHorario[];
}

export interface DetalleHorario {
  id: number;
  horario_id: number;
  hora: string;
  dia: string;
  materia: string;
  profesor: string;
  registros: RegistroAsistencia[];
}

export interface RegistroAsistencia {
  id: number;
  horario_detalle: number;
  fecha: string;
  estado: 'presente' | 'retardo' | 'falta';
  observaciones?: string;
  materia_nombre: string;
  profesor_nombre: string;
  aula_nombre: string;
  edificio_nombre: string;
  grupo_nombre: string;
  hora: string;
  dia: string;
} 