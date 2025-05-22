import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getRole();
      if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
        return false;
      } else if (role === 'verificador') {
        this.router.navigate(['/dashboard']);
        return false;
      }
    }
    return true;  // Permite el acceso al login si no está autenticado
  }
}