import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AdminGuard: Verificando autenticación...');
    
    if (!this.authService.isAuthenticated()) {
      console.log('AdminGuard: Usuario no autenticado');
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.authService.getRole();
    console.log('AdminGuard: Role del usuario:', role);

    if (role === 'admin') {
      console.log('AdminGuard: Acceso permitido para admin');
      return true;
    }

    console.log('AdminGuard: Acceso denegado - no es admin');
    this.router.navigate(['/login']);
    return false;
  }
} 