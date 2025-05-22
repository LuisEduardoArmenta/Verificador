import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent {
  userData = {
    full_name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    password2: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.userData.password !== this.userData.password2) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.router.navigate(['/login']); // Redirige al login
      },
      error: (error) => {
        console.error('Error en el registro', error);
        alert('Error en el registro');
      },
    });
  }
}