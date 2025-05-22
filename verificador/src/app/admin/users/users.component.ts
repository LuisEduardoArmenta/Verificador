import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent,],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  editingUser: User | null = null;
  showModal: boolean = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('Iniciando carga de usuarios...');
    const token = localStorage.getItem('access_token');
    console.log('Token disponible:', !!token);
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Usuarios cargados exitosamente:', users);
        this.users = users;
        this.filteredUsers = users;
        this.error = null;
      },
      error: (error) => {
        console.error('Error detallado:', error);
        this.error = 'Error al cargar los usuarios. Por favor, verifica que tienes permisos de administrador.';
        if (error.status === 401) {
          this.error = 'No autorizado. Por favor, inicia sesión nuevamente.';
        }
      }
    });
  }

  onSearch(): void {
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editUser(user: User): void {
    console.log('Editando usuario:', user);
    if (!user.id) {
      console.error('El usuario no tiene ID');
      return;
    }
    this.editingUser = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      password: ''
    };
    this.showModal = true;
  }

  deleteUser(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  saveUser(): void {
    if (!this.editingUser || !this.editingUser.id) {
      console.error('No hay usuario seleccionado o no tiene ID');
      return;
    }

    console.log('Guardando usuario:', this.editingUser);
    
    const userData: Partial<User> = {
      username: this.editingUser.username,
      full_name: this.editingUser.full_name,
      phone: this.editingUser.phone,
      email: this.editingUser.email,
      role: this.editingUser.role
    };

    if (this.editingUser.password && this.editingUser.password.trim() !== '') {
      userData.password = this.editingUser.password;
    }

    console.log('Datos a enviar:', userData);

    this.userService.updateUser(this.editingUser.id, userData).subscribe({
      next: (updatedUser) => {
        console.log('Usuario actualizado:', updatedUser);
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.filteredUsers[index] = updatedUser;
        }
        this.showModal = false;
        this.editingUser = null;
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        alert('Error al actualizar el usuario');
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
  }

  getRoleBadgeClass(role: string): string {
    return role === 'admin' ? 'bg-danger' : 'bg-primary';
  }
}