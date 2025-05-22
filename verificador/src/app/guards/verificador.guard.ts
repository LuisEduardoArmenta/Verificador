import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class VerificadorGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getRole();
      if (role === 'verificador') {
        return true;  // Permite el acceso si es verificador
      }
    }
    this.router.navigate(['/login']);  // Redirige al login si no es verificador
    return false;
  }
}