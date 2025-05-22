import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    console.log('AuthService: Intentando login para usuario:', username);
    return this.http
      .post(`${this.apiUrl}/login/`, { username, password })
      .pipe(
        tap((response: any) => {
          console.log('AuthService: Login exitoso, guardando datos...', response);
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('user_role', response.role);
          localStorage.setItem('username', response.username);
          console.log('AuthService: Role guardado:', response.role);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  logout(): void {
    console.log('AuthService: Cerrando sesión...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    console.log('AuthService: Verificando autenticación, token existe:', !!token);
    return !!token;
  }

  getRole(): string | null {
    const role = localStorage.getItem('user_role');
    console.log('AuthService: Obteniendo role:', role);
    return role;
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}