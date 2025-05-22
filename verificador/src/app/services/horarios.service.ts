import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Edificio {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Aula {
  id: number;
  nombre: string;
  capacidad: number;
  descripcion: string;
  edificio: number;
  edificio_nombre: string;
}

export interface Carrera {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface Grupo {
  id: number;
  nombre: string;
  semestre: number;
  descripcion: string;
  carrera: number;
  carrera_nombre: string;
}

export interface Materia {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  carrera: number;
  carrera_nombre: string;
  activo: boolean;
}

export interface HorarioDetalle {
  id: number;
  hora: string;
  dia: string;
  materia: number;
  materia_nombre: string;
  profesor: number;
  profesor_nombre: string;
}

export interface HorarioGrupo {
  id: number;
  estado: string;
  aula: number;
  aula_nombre: string;
  carrera: number;
  carrera_nombre: string;
  edificio: number;
  edificio_nombre: string;
  grupo: number;
  grupo_nombre: string;
  verificador?: number;
  detalles: HorarioDetalle[];
}

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private apiUrl = `${environment.apiUrl}/horarios`;

  constructor(private http: HttpClient) { }

  // Métodos para Edificios
  getEdificios(): Observable<Edificio[]> {
    return this.http.get<Edificio[]>(`${this.apiUrl}/edificios/`);
  }

  createEdificio(edificio: Partial<Edificio>): Observable<Edificio> {
    return this.http.post<Edificio>(`${this.apiUrl}/edificios/`, edificio);
  }

  updateEdificio(id: number, edificio: Partial<Edificio>): Observable<Edificio> {
    return this.http.put<Edificio>(`${this.apiUrl}/edificios/${id}/`, edificio);
  }

  deleteEdificio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/edificios/${id}/`);
  }

  // Métodos para Aulas
  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/aulas/`);
  }

  createAula(aula: Partial<Aula>): Observable<Aula> {
    return this.http.post<Aula>(`${this.apiUrl}/aulas/`, aula);
  }

  updateAula(id: number, aula: Partial<Aula>): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/aulas/${id}/`, aula);
  }

  deleteAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/aulas/${id}/`);
  }

  // Métodos para Carreras
  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.apiUrl}/carreras/`);
  }

  createCarrera(carrera: Partial<Carrera>): Observable<Carrera> {
    return this.http.post<Carrera>(`${this.apiUrl}/carreras/`, carrera);
  }

  updateCarrera(id: number, carrera: Partial<Carrera>): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.apiUrl}/carreras/${id}/`, carrera);
  }

  deleteCarrera(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/carreras/${id}/`);
  }

  // Métodos para Grupos
  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.apiUrl}/grupos/`);
  }

  createGrupo(grupo: Partial<Grupo>): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.apiUrl}/grupos/`, grupo);
  }

  updateGrupo(id: number, grupo: Partial<Grupo>): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.apiUrl}/grupos/${id}/`, grupo);
  }

  deleteGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/grupos/${id}/`);
  }

  // Métodos para Materias
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias/`);
  }

  createMateria(materia: Partial<Materia>): Observable<Materia> {
    return this.http.post<Materia>(`${this.apiUrl}/materias/`, materia);
  }

  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/materias/${id}/`, materia);
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materias/${id}/`);
  }

  // Métodos para Profesores
  getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(`${this.apiUrl}/profesores/`);
  }

  createProfesor(profesor: Partial<Profesor>): Observable<Profesor> {
    return this.http.post<Profesor>(`${this.apiUrl}/profesores/`, profesor);
  }

  updateProfesor(id: number, profesor: Partial<Profesor>): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.apiUrl}/profesores/${id}/`, profesor);
  }

  deleteProfesor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profesores/${id}/`);
  }

  // Métodos para Horarios
  getHorarios(): Observable<HorarioGrupo[]> {
    return this.http.get<HorarioGrupo[]>(`${this.apiUrl}/horarios/`);
  }

  createHorario(horario: Partial<HorarioGrupo>): Observable<HorarioGrupo> {
    return this.http.post<HorarioGrupo>(`${this.apiUrl}/horarios/`, horario);
  }

  updateHorario(id: number, horario: Partial<HorarioGrupo>): Observable<HorarioGrupo> {
    return this.http.put<HorarioGrupo>(`${this.apiUrl}/horarios/${id}/`, horario);
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horarios/${id}/`);
  }

  // Métodos para Asignación de Verificadores
  asignarVerificador(horarioId: number, verificadorId: number): Observable<HorarioGrupo> {
    return this.http.post<HorarioGrupo>(`${this.apiUrl}/horarios/${horarioId}/asignar-verificador/`, { verificador_id: verificadorId });
  }

  quitarVerificador(horarioId: number): Observable<HorarioGrupo> {
    return this.http.post<HorarioGrupo>(`${this.apiUrl}/horarios/${horarioId}/quitar-verificador/`, {});
  }
} 