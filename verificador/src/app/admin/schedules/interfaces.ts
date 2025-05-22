export interface Edificio {
  id?: number;
  nombre: string;
  descripcion: string;
}

export interface Aula {
  id?: number;
  nombre: string;
  capacidad: number;
  edificio: number;
  descripcion: string;
}

export interface Carrera {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface Grupo {
  id?: number;
  nombre: string;
  semestre: number;
  carrera: number;
  descripcion: string;
}

export interface Materia {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface Profesor {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  carrera: number;
}

export interface Horario {
  id?: number;
  grupo: number;
  carrera: number;
  edificio: number;
  aula: number;
  periodo_escolar: string;
  estado: string;
  verificadores: number[];
  detalles: HorarioDetalle[];
}

export interface HorarioDetalle {
  id?: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  materia: number;
  profesor: number;
} 