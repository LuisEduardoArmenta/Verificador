import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HorarioAsignado, RegistroAsistencia } from '../interfaces/verificador.interface';

@Injectable({
  providedIn: 'root'
})
export class VerificadorService {
  private apiUrl = `${environment.apiUrl}/asistencia/verificador`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getHorariosAsignados(): Observable<HorarioAsignado[]> {
    return this.http.get<HorarioAsignado[]>(`${this.apiUrl}/mis_horarios/`, {
      headers: this.getHeaders()
    });
  }

  getHistorialVerificaciones(): Observable<RegistroAsistencia[]> {
    return this.http.get<RegistroAsistencia[]>(`${this.apiUrl}/`, {
      headers: this.getHeaders()
    });
  }

  registrarAsistencia(registro: Partial<RegistroAsistencia>): Observable<RegistroAsistencia> {
    return this.http.post<RegistroAsistencia>(`${this.apiUrl}/registrar/`, registro, {
      headers: this.getHeaders()
    });
  }

  getDetalleHorario(id: number) {
    return this.http.get<HorarioAsignado>(`${this.apiUrl}/horario/${id}/`, { headers: this.getHeaders() });
  }
} 