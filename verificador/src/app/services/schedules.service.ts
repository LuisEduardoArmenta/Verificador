import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Edificio {
  id?: number;
  nombre: string;
  descripcion: string;
}

export interface Aula {
  id?: number;
  nombre: string;
  edificio: number;
  capacidad: number;
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
  carrera: number;
  semestre: number;
  descripcion: string;
}

export interface Materia {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface Horario {
  id?: number;
  materia: number;
  grupo: number;
  profesor: string;
  aula: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface HorarioDetalle {
  id?: number;
  hora: string;
  dia: string;
  materia: number;
  profesor: number;
}

export interface HorarioGrupo {
  id?: number;
  grupo: number;
  carrera: number;
  edificio: number;
  aula: number;
  periodo_escolar: string;
  verificador?: number;
  estado: 'pendiente' | 'asignado' | 'verificado';
  detalles: HorarioDetalle[];
}

export interface Profesor {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  carrera: number;
  carrera_nombre?: string;
  activo: boolean;
}

export interface Verificador {
  id: number;
  nombre: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private apiUrl = `${environment.apiUrl}/horarios`;

  constructor(private http: HttpClient) {
    console.log('SchedulesService initialized');
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Edificios
  getEdificios(): Observable<Edificio[]> {
    return this.http.get<Edificio[]>(`${this.apiUrl}/edificios/`, { headers: this.getHeaders() });
  }

  createEdificio(edificio: Edificio): Observable<Edificio> {
    return this.http.post<Edificio>(`${this.apiUrl}/edificios/`, edificio, { headers: this.getHeaders() });
  }

  updateEdificio(id: number, edificio: Partial<Edificio>): Observable<Edificio> {
    return this.http.put<Edificio>(`${this.apiUrl}/edificios/${id}/`, edificio, { headers: this.getHeaders() });
  }

  deleteEdificio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/edificios/${id}/`, { headers: this.getHeaders() });
  }

  // Aulas
  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/aulas/`, { headers: this.getHeaders() });
  }

  createAula(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(`${this.apiUrl}/aulas/`, aula, { headers: this.getHeaders() });
  }

  updateAula(id: number, aula: Partial<Aula>): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/aulas/${id}/`, aula, { headers: this.getHeaders() });
  }

  deleteAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/aulas/${id}/`, { headers: this.getHeaders() });
  }

  // Carreras
  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.apiUrl}/carreras/`, { headers: this.getHeaders() });
  }

  createCarrera(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(`${this.apiUrl}/carreras/`, carrera, { headers: this.getHeaders() });
  }

  updateCarrera(id: number, carrera: Partial<Carrera>): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.apiUrl}/carreras/${id}/`, carrera, { headers: this.getHeaders() });
  }

  deleteCarrera(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/carreras/${id}/`, { headers: this.getHeaders() });
  }

  // Grupos
  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.apiUrl}/grupos/`, { headers: this.getHeaders() });
  }

  createGrupo(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.apiUrl}/grupos/`, grupo, { headers: this.getHeaders() });
  }

  updateGrupo(id: number, grupo: Partial<Grupo>): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.apiUrl}/grupos/${id}/`, grupo, { headers: this.getHeaders() });
  }

  deleteGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/grupos/${id}/`, { headers: this.getHeaders() });
  }

  // Materias
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias/`, { headers: this.getHeaders() });
  }

  createMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(`${this.apiUrl}/materias/`, materia, { headers: this.getHeaders() });
  }

  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/materias/${id}/`, materia, { headers: this.getHeaders() });
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materias/${id}/`, { headers: this.getHeaders() });
  }

  // Horarios
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios/`, { headers: this.getHeaders() });
  }

  createHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(`${this.apiUrl}/horarios/`, horario, { headers: this.getHeaders() });
  }

  updateHorario(id: number, horario: Partial<Horario>): Observable<Horario> {
    return this.http.put<Horario>(`${this.apiUrl}/horarios/${id}/`, horario, { headers: this.getHeaders() });
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horarios/${id}/`, { headers: this.getHeaders() });
  }

  // Nuevos métodos para HorarioGrupo
  getHorariosGrupo(): Observable<HorarioGrupo[]> {
    return this.http.get<HorarioGrupo[]>(`${this.apiUrl}/horarios-grupo/`, { headers: this.getHeaders() });
  }

  getHorarioGrupo(id: number): Observable<HorarioGrupo> {
    return this.http.get<HorarioGrupo>(`${this.apiUrl}/horarios-grupo/${id}/`, { headers: this.getHeaders() });
  }

  createHorarioGrupo(horario: HorarioGrupo): Observable<HorarioGrupo> {
    return this.http.post<HorarioGrupo>(`${this.apiUrl}/horarios-grupo/`, horario, { headers: this.getHeaders() });
  }

  updateHorarioGrupo(id: number, horario: HorarioGrupo): Observable<HorarioGrupo> {
    return this.http.put<HorarioGrupo>(`${this.apiUrl}/horarios-grupo/${id}/`, horario, { headers: this.getHeaders() });
  }

  deleteHorarioGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horarios-grupo/${id}/`, { headers: this.getHeaders() });
  }

  asignarVerificador(horarioId: number, verificadorId: number): Observable<HorarioGrupo> {
    return this.http.post<HorarioGrupo>(
      `${this.apiUrl}/horarios-grupo/${horarioId}/asignar_verificador/`,
      { verificadorId },
      { headers: this.getHeaders() }
    );
  }

  marcarVerificado(horarioId: number): Observable<HorarioGrupo> {
    return this.http.post<HorarioGrupo>(
      `${this.apiUrl}/horarios-grupo/${horarioId}/marcar_verificado/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getVerificadoresDisponibles(): Observable<Verificador[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    return this.http.get<Verificador[]>(`${this.apiUrl}/horarios-grupo/verificadores_disponibles/`, { headers });
  }

  // Profesores
  getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(`${this.apiUrl}/profesores/`, { headers: this.getHeaders() });
  }

  createProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.post<Profesor>(`${this.apiUrl}/profesores/`, profesor, { headers: this.getHeaders() });
  }

  updateProfesor(id: number, profesor: Partial<Profesor>): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.apiUrl}/profesores/${id}/`, profesor, { headers: this.getHeaders() });
  }

  deleteProfesor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profesores/${id}/`, { headers: this.getHeaders() });
  }
} 