import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  full_name: string;
  phone: string;
  email: string;
  role: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUsers(): Observable<User[]> {
    console.log('Obteniendo usuarios...');
    return this.http.get<User[]>(`${this.apiUrl}/users/`, { headers: this.getHeaders() }).pipe(
      map(users => users.map(user => ({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role
      })))
    );
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    console.log('Actualizando usuario:', id, userData);
    return this.http.put<User>(`${this.apiUrl}/users/${id}/`, userData, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}/`, { headers: this.getHeaders() });
  }
} 