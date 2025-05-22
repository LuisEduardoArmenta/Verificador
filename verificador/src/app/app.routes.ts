import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { VerificacionesComponent } from './components/verificaciones/verificaciones.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './admin/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { VerificadorGuard } from './guards/verificador.guard';
import { AdminGuard } from './guards/admin.guard';
import { SchedulesComponent } from './admin/schedules/schedules.component';
import { HorariosAsignadosComponent } from './verificaciones/horarios-asignados/horarios-asignados.component';
import { RegistroAsistenciaComponent } from './verificaciones/registro-asistencia/registro-asistencia.component';
import { HistorialVerificacionesComponent } from './verificaciones/historial-verificaciones/historial-verificaciones.component';
import { DetalleHorarioComponent } from './verificaciones/detalle-horario/detalle-horario.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },

  // Rutas para verificadores
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [VerificadorGuard]
  },
  { 
    path: 'verificaciones', 
    component: HorariosAsignadosComponent,
    canActivate: [VerificadorGuard]
  },
  {
    path: 'verificaciones/registro/:id',
    component: RegistroAsistenciaComponent,
    canActivate: [VerificadorGuard]
  },
  {
    path: 'verificaciones/historial',
    component: HistorialVerificacionesComponent,
    canActivate: [VerificadorGuard]
  },
  {
    path: 'verificaciones/detalle/:id',
    component: DetalleHorarioComponent,
    canActivate: [VerificadorGuard]
  },
  {
    path: 'reportes',
    component: HistorialVerificacionesComponent,
    canActivate: [VerificadorGuard]
  },
  
  // Rutas para administradores
  { 
    path: 'admin', 
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/users', 
    component: UsersComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/schedules', 
    component: SchedulesComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/reports', 
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/settings', 
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  }
];