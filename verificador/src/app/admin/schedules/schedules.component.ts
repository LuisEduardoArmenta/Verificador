import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { SchedulesService, Edificio, Aula, Carrera, Grupo, Materia, HorarioGrupo, HorarioDetalle, Profesor } from '../../services/schedules.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { NgLetDirective } from '../../directives/ng-let.directive';
import { HorariosService } from '../../services/horarios.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    AdminSidebarComponent, 
    NgLetDirective
  ],
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  // Estado actual
  seccionActual: 'horarios' | 'edificios' | 'aulas' | 'carreras' | 'grupos' | 'materias' | 'profesores' = 'horarios';
  modoEdicion: boolean = false;
  mostrarModal: boolean = false;
  mostrarModalDetalles: boolean = false;

  // Listas de datos
  edificios: Edificio[] = [];
  aulas: Aula[] = [];
  carreras: Carrera[] = [];
  grupos: Grupo[] = [];
  materias: Materia[] = [];
  horariosGrupo: HorarioGrupo[] = [];
  verificadoresDisponibles: any[] = [];
  profesores: Profesor[] = [];
  verificadores: any[] = [];

  // Objetos para edición/creación
  nuevoHorario: HorarioGrupo = {
    grupo: 0,
    carrera: 0,
    edificio: 0,
    aula: 0,
    periodo_escolar: '',
    estado: 'pendiente',
    detalles: []
  };
  nuevoEdificio: Edificio = { nombre: '', descripcion: '' };
  nuevaAula: Aula = { nombre: '', edificio: 0, capacidad: 0, descripcion: '' };
  nuevaCarrera: Carrera = { codigo: '', nombre: '', descripcion: '' };
  nuevoGrupo: Grupo = { nombre: '', descripcion: '', carrera: 0, semestre: 0 };
  nuevaMateria: Materia = { codigo: '', nombre: '', descripcion: '' };
  nuevoProfesor: Profesor = { nombre: '', apellido: '', email: '', carrera: 0, activo: true };

  horarioSeleccionado: HorarioGrupo | null = null;

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas: string[] = [];
  horaInicial = '13:00';  // 1 PM
  horaFinal = '19:00';    // 7 PM
  intervaloHoras = 60;    // minutos

  // Formularios
  horarioForm!: FormGroup;
  edificioForm!: FormGroup;
  aulaForm!: FormGroup;
  carreraForm!: FormGroup;
  grupoForm!: FormGroup;
  materiaForm!: FormGroup;
  profesorForm!: FormGroup;

  // Variables para el modal
  modalRef: any;
  elementoSeleccionado: any = null;

  // Lista temporal para almacenar todos los profesores
  todosLosProfesores: Profesor[] = [];

  constructor(
    private schedulesService: SchedulesService,
    private horariosService: HorariosService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    console.log('SchedulesComponent inicializado');
    this.inicializarFormularios();
    this.inicializarHoras();
  }

  private inicializarFormularios() {
    this.horarioForm = this.fb.group({
      grupo: ['', [Validators.required, Validators.min(1)]],
      carrera: ['', [Validators.required, Validators.min(1)]],
      edificio: ['', [Validators.required, Validators.min(1)]],
      aula: ['', [Validators.required, Validators.min(1)]],
      detalles: this.fb.array([])
    });

    this.edificioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });

    this.aulaForm = this.fb.group({
      nombre: ['', Validators.required],
      capacidad: ['', Validators.required],
      descripcion: [''],
      edificio: ['', Validators.required]
    });

    this.carreraForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['']
    });

    this.grupoForm = this.fb.group({
      nombre: ['', Validators.required],
      semestre: ['', Validators.required],
      descripcion: [''],
      carrera: ['', Validators.required]
    });

    this.materiaForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['']
    });

    this.profesorForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      carrera: [0, [Validators.required, Validators.min(1)]]
    });
  }

  inicializarHoras() {
    const [horaIni, minIni] = this.horaInicial.split(':').map(Number);
    const [horaFin, minFin] = this.horaFinal.split(':').map(Number);
    
    let horaActual = new Date();
    horaActual.setHours(horaIni, minIni, 0, 0);
    
    const horaFinalDate = new Date();
    horaFinalDate.setHours(horaFin, minFin, 0, 0);
    
    while (horaActual <= horaFinalDate) {
      this.horas.push(horaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      horaActual.setMinutes(horaActual.getMinutes() + this.intervaloHoras);
    }
  }

  agregarHora() {
    const ultimaHora = this.horas[this.horas.length - 1];
    const [hora, minutos] = ultimaHora.split(':').map(Number);
    const nuevaHora = new Date();
    nuevaHora.setHours(hora, minutos + this.intervaloHoras, 0, 0);
    
    if (nuevaHora.getHours() < parseInt(this.horaFinal.split(':')[0])) {
      this.horas.push(nuevaHora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }
  }

  eliminarHora(index: number) {
    if (this.horas.length > 1) {
      this.horas.splice(index, 1);
      // Limpiar detalles de la hora eliminada
      this.nuevoHorario.detalles = this.nuevoHorario.detalles.filter(
        d => d.hora !== this.horas[index]
      );
    }
  }

  ngOnInit() {
    this.cargarDatos();
    // Suscribirse a cambios en la carrera seleccionada
    this.horarioForm.get('carrera')?.valueChanges.subscribe(carreraId => {
      console.log('Carrera seleccionada:', carreraId);
      this.actualizarProfesoresPorCarrera(Number(carreraId));
    });
  }

  actualizarProfesoresPorCarrera(carreraId: number) {
    console.log('Actualizando profesores para carrera:', carreraId);
    console.log('Total de profesores disponibles:', this.todosLosProfesores.length);
    
    if (carreraId && carreraId !== 0) {
      const profesoresFiltrados = this.todosLosProfesores.filter(p => {
        console.log('Profesor:', p.nombre, p.apellido, 'Carrera:', p.carrera, 'Carrera seleccionada:', carreraId);
        return Number(p.carrera) === Number(carreraId);
      });
      console.log('Profesores filtrados por carrera:', profesoresFiltrados.length);
      console.log('Profesores filtrados:', profesoresFiltrados);
      this.profesores = profesoresFiltrados;
    } else {
      this.profesores = [...this.todosLosProfesores];
    }
  }

  async cargarDatos() {
    try {
      console.log('Cargando datos...');
      
      // Cargar verificadores primero y por separado
      const verificadoresDisponibles = await firstValueFrom(this.schedulesService.getVerificadoresDisponibles());
      console.log('Verificadores cargados (raw):', verificadoresDisponibles);
      
      // Asegurarse de que los nombres no estén vacíos
      this.verificadoresDisponibles = verificadoresDisponibles.map(v => ({
        ...v,
        nombre: v.nombre || v.email.split('@')[0] // Usar email como fallback si no hay nombre
      }));
      
      console.log('Verificadores procesados:', this.verificadoresDisponibles);

      // Cargar el resto de los datos
      const [edificios, aulas, carreras, grupos, materias, horariosGrupo, profesores] = await Promise.all([
        firstValueFrom(this.schedulesService.getEdificios()),
        firstValueFrom(this.schedulesService.getAulas()),
        firstValueFrom(this.schedulesService.getCarreras()),
        firstValueFrom(this.schedulesService.getGrupos()),
        firstValueFrom(this.schedulesService.getMaterias()),
        firstValueFrom(this.schedulesService.getHorariosGrupo()),
        firstValueFrom(this.schedulesService.getProfesores())
      ]);

      this.edificios = edificios;
      this.aulas = aulas;
      this.carreras = carreras;
      this.grupos = grupos;
      this.materias = materias;
      this.horariosGrupo = horariosGrupo;
      
      // Asegurarse de que los IDs de carrera sean números
      this.todosLosProfesores = profesores.map(p => ({
        ...p,
        carrera: Number(p.carrera)
      }));
      this.profesores = [...this.todosLosProfesores];

      console.log('Datos cargados exitosamente');
      console.log('Total de profesores cargados:', this.todosLosProfesores.length);
      console.log('Profesores disponibles:', this.profesores.length);
      console.log('Carreras disponibles:', this.carreras);
      console.log('Verificadores disponibles:', this.verificadoresDisponibles);
      console.log('Profesores con sus carreras:', this.todosLosProfesores.map(p => ({
        nombre: p.nombre,
        apellido: p.apellido,
        carrera: p.carrera
      })));

      // Si hay una carrera seleccionada, actualizar los profesores
      const carreraSeleccionada = this.horarioForm.get('carrera')?.value;
      if (carreraSeleccionada) {
        this.actualizarProfesoresPorCarrera(Number(carreraSeleccionada));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarError('Error al cargar los datos');
    }
  }

  cambiarSeccion(seccion: string) {
    console.log('Cambiando a sección:', seccion);
    this.seccionActual = seccion as 'horarios' | 'edificios' | 'aulas' | 'carreras' | 'grupos' | 'materias' | 'profesores';
    this.modoEdicion = false;
    this.limpiarFormularios();
  }

  async guardar() {
    try {
      console.log('Guardando', this.seccionActual);
      let resultado;

      switch (this.seccionActual) {
        case 'edificios':
          if (this.edificioForm.valid) {
            const edificio = this.edificioForm.value;
            resultado = this.modoEdicion && this.elementoSeleccionado
              ? await firstValueFrom(this.schedulesService.updateEdificio(this.elementoSeleccionado.id, edificio))
              : await firstValueFrom(this.schedulesService.createEdificio(edificio));
          }
          break;
        case 'aulas':
          if (this.aulaForm.valid) {
            const aula = this.aulaForm.value;
            resultado = this.modoEdicion && this.elementoSeleccionado
              ? await firstValueFrom(this.schedulesService.updateAula(this.elementoSeleccionado.id, aula))
              : await firstValueFrom(this.schedulesService.createAula(aula));
          }
          break;
        case 'carreras':
          if (this.carreraForm.valid) {
            const carrera = this.carreraForm.value;
            resultado = this.modoEdicion && this.elementoSeleccionado
              ? await firstValueFrom(this.schedulesService.updateCarrera(this.elementoSeleccionado.id, carrera))
              : await firstValueFrom(this.schedulesService.createCarrera(carrera));
          }
          break;
        case 'grupos':
          if (this.grupoForm.valid) {
            const grupo = this.grupoForm.value;
            resultado = this.modoEdicion && this.elementoSeleccionado
              ? await firstValueFrom(this.schedulesService.updateGrupo(this.elementoSeleccionado.id, grupo))
              : await firstValueFrom(this.schedulesService.createGrupo(grupo));
          }
          break;
        case 'materias':
          if (this.materiaForm.valid) {
            const materia = this.materiaForm.value;
            resultado = this.modoEdicion && this.elementoSeleccionado
              ? await firstValueFrom(this.schedulesService.updateMateria(this.elementoSeleccionado.id, materia))
              : await firstValueFrom(this.schedulesService.createMateria(materia));
          }
          break;
        case 'profesores':
          if (this.profesorForm.valid) {
            const profesor = this.profesorForm.value;
            console.log('Guardando profesor:', profesor);
            resultado = this.modoEdicion && this.elementoSeleccionado
              ? await firstValueFrom(this.schedulesService.updateProfesor(this.elementoSeleccionado.id, profesor))
              : await firstValueFrom(this.schedulesService.createProfesor(profesor));
          } else {
            this.mostrarError('Por favor complete todos los campos requeridos');
            return;
          }
          break;
        case 'horarios':
          if (this.horarioForm.valid) {
            // Validar que haya al menos un detalle de horario
            if (this.nuevoHorario.detalles.length === 0) {
              this.mostrarError('Debe agregar al menos una materia al horario');
              return;
            }

            // Validar que todos los detalles tengan materia y profesor
            const detallesIncompletos = this.nuevoHorario.detalles.some(
              detalle => !detalle.materia || !detalle.profesor
            );

            if (detallesIncompletos) {
              this.mostrarError('Todos los horarios deben tener materia y profesor asignados');
              return;
            }

            // Validar que no haya conflictos de horario
            if (!this.validarHorario()) {
              return;
            }

            const horario = {
              ...this.horarioForm.value,
              detalles: this.nuevoHorario.detalles,
              estado: 'pendiente'
            };

            resultado = this.modoEdicion && this.elementoSeleccionado
              ? await firstValueFrom(this.schedulesService.updateHorarioGrupo(this.elementoSeleccionado.id, horario))
              : await firstValueFrom(this.schedulesService.createHorarioGrupo(horario));
          } else {
            this.mostrarError('Por favor complete todos los campos requeridos');
            return;
          }
          break;
      }

      if (resultado) {
        console.log('Guardado exitoso:', resultado);
        await this.cargarDatos();
        this.cerrarModal();
        this.mostrarExito(this.modoEdicion ? 'Elemento actualizado correctamente' : 'Elemento creado correctamente');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      this.mostrarError('Error al guardar los datos');
    }
  }

  async eliminar(tipo: string, id: number) {
    try {
      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return;
      }

      console.log('Eliminando', tipo, 'con id:', id);
      
      switch (tipo) {
        case 'edificios':
          await firstValueFrom(this.schedulesService.deleteEdificio(id));
          break;
        case 'aulas':
          await firstValueFrom(this.schedulesService.deleteAula(id));
          break;
        case 'carreras':
          await firstValueFrom(this.schedulesService.deleteCarrera(id));
          break;
        case 'grupos':
          await firstValueFrom(this.schedulesService.deleteGrupo(id));
          break;
        case 'materias':
          await firstValueFrom(this.schedulesService.deleteMateria(id));
          break;
        case 'horarios':
          await firstValueFrom(this.schedulesService.deleteHorarioGrupo(id));
          break;
      }

      console.log('Eliminación exitosa');
      await this.cargarDatos();
      this.mostrarExito('Elemento eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      this.mostrarError('Error al eliminar el elemento');
    }
  }

  editar(item: any) {
    console.log('Editando item:', item);
    this.modoEdicion = true;
    this.elementoSeleccionado = item;

    switch (this.seccionActual) {
      case 'edificios':
        this.nuevoEdificio = { ...item };
        this.edificioForm.patchValue(item);
        break;
      case 'aulas':
        this.nuevaAula = { ...item };
        this.aulaForm.patchValue(item);
        break;
      case 'carreras':
        this.nuevaCarrera = { ...item };
        this.carreraForm.patchValue(item);
        break;
      case 'grupos':
        this.nuevoGrupo = { ...item };
        this.grupoForm.patchValue(item);
        break;
      case 'materias':
        this.nuevaMateria = { ...item };
        this.materiaForm.patchValue(item);
        break;
      case 'horarios':
        this.horarioSeleccionado = { ...item };
        this.nuevoHorario = { ...item };
        this.horarioForm.patchValue(item);
        break;
      case 'profesores':
        this.nuevoProfesor = { ...item };
        this.profesorForm.patchValue({
          ...item,
          carrera: item.carrera || 0
        });
        break;
    }

    this.mostrarModal = true;
  }

  limpiarFormularios() {
    console.log('Limpiando formularios');
    this.nuevoEdificio = { nombre: '', descripcion: '' };
    this.nuevaAula = { nombre: '', edificio: 0, capacidad: 0, descripcion: '' };
    this.nuevaCarrera = { codigo: '', nombre: '', descripcion: '' };
    this.nuevoGrupo = { nombre: '', descripcion: '', carrera: 0, semestre: 0 };
    this.nuevaMateria = { codigo: '', nombre: '', descripcion: '' };
    this.nuevoHorario = {
      grupo: 0,
      carrera: 0,
      edificio: 0,
      aula: 0,
      periodo_escolar: '',
      estado: 'pendiente',
      detalles: []
    };
    this.horarioSeleccionado = null;
    this.modoEdicion = false;
    this.nuevoProfesor = { 
      nombre: '', 
      apellido: '', 
      email: '', 
      carrera: 0, 
      activo: true 
    };

    // Resetear los formularios reactivos
    this.horarioForm.reset();
    this.edificioForm.reset();
    this.aulaForm.reset();
    this.carreraForm.reset();
    this.grupoForm.reset();
    this.materiaForm.reset();
    this.profesorForm.reset();

    // Resetear los valores por defecto de los selectores
    this.horarioForm.patchValue({
      grupo: 0,
      carrera: 0,
      edificio: 0,
      aula: 0
    });
    this.aulaForm.patchValue({
      edificio: 0
    });
    this.grupoForm.patchValue({
      carrera: 0
    });
    this.profesorForm.patchValue({
      carrera: 0
    });
  }

  // Alias para mantener consistencia con el template
  limpiarFormulario() {
    this.limpiarFormularios();
  }

  // Métodos para el modal
  abrirModal(modo: 'crear' | 'editar' = 'crear', elemento?: any) {
    this.modoEdicion = modo === 'editar';
    this.elementoSeleccionado = elemento;
    
    if (modo === 'editar' && elemento) {
      switch (this.seccionActual) {
        case 'horarios':
          this.horarioForm.patchValue(elemento);
          break;
        case 'edificios':
          this.edificioForm.patchValue(elemento);
          break;
        case 'aulas':
          this.aulaForm.patchValue(elemento);
          break;
        case 'carreras':
          this.carreraForm.patchValue(elemento);
          break;
        case 'grupos':
          this.grupoForm.patchValue(elemento);
          break;
        case 'materias':
          this.materiaForm.patchValue(elemento);
          break;
        case 'profesores':
          this.profesorForm.patchValue(elemento);
          break;
      }
    }
    
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.limpiarFormularios();
  }

  // Métodos para alertas
  mostrarExito(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      timer: 2000,
      showConfirmButton: false
    });
  }

  mostrarError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }

  // Método para obtener el título de la sección actual
  getTituloSeccion(): string {
    switch (this.seccionActual) {
      case 'edificios':
        return 'Edificio';
      case 'aulas':
        return 'Aula';
      case 'carreras':
        return 'Carrera';
      case 'grupos':
        return 'Grupo';
      case 'materias':
        return 'Materia';
      case 'horarios':
        return 'Horario';
      case 'profesores':
        return 'Profesor';
      default:
        return '';
    }
  }

  // Métodos auxiliares para obtener nombres
  getNombreEdificio(id: number): string {
    const edificio = this.edificios.find(e => e.id === id);
    return edificio ? edificio.nombre : 'No encontrado';
  }

  getNombreAula(id: number): string {
    const aula = this.aulas.find(a => a.id === id);
    return aula ? aula.nombre : 'No encontrado';
  }

  getNombreCarrera(id: number): string {
    const carrera = this.carreras.find(c => c.id === id);
    return carrera ? carrera.nombre : 'No encontrado';
  }

  getNombreGrupo(id: number): string {
    const grupo = this.grupos.find(g => g.id === id);
    return grupo ? grupo.descripcion : 'No encontrado';
  }

  getNombreMateria(id: number): string {
    const materia = this.materias.find(m => m.id === id);
    return materia ? materia.descripcion : 'No encontrado';
  }

  async asignarVerificador(horarioId: number, verificadorId: string) {
    try {
      const id = parseInt(verificadorId);
      if (isNaN(id)) return;
      
      await firstValueFrom(this.schedulesService.asignarVerificador(horarioId, id));
      await Swal.fire('Éxito', 'Verificador asignado correctamente', 'success');
      await this.cargarDatos();
    } catch (error) {
      console.error('Error al asignar verificador:', error);
      await Swal.fire('Error', 'Hubo un error al asignar el verificador', 'error');
    }
  }

  async marcarVerificado(horarioId: number) {
    try {
      await firstValueFrom(this.schedulesService.marcarVerificado(horarioId));
      await Swal.fire('Éxito', 'Horario marcado como verificado', 'success');
      await this.cargarDatos();
    } catch (error) {
      console.error('Error al marcar como verificado:', error);
      await Swal.fire('Error', 'Hubo un error al marcar el horario como verificado', 'error');
    }
  }

  agregarDetalle(dia: string, hora: string) {
    console.log('Agregando detalle para:', dia, hora);
    const detalle: HorarioDetalle = {
      hora,
      dia,
      materia: 0,
      profesor: 0
    };
    this.nuevoHorario.detalles.push(detalle);
    console.log('Detalles actuales:', this.nuevoHorario.detalles);
    
    // Asegurarse de que los profesores estén actualizados
    const carreraSeleccionada = this.horarioForm.get('carrera')?.value;
    if (carreraSeleccionada) {
      this.actualizarProfesoresPorCarrera(carreraSeleccionada);
    }
  }

  eliminarDetalle(index: number) {
    if (index >= 0 && index < this.nuevoHorario.detalles.length) {
      this.nuevoHorario.detalles.splice(index, 1);
    }
  }

  // Método para validar que no haya conflictos de horarios
  validarHorario(): boolean {
    // Validar que haya al menos un detalle
    if (this.nuevoHorario.detalles.length === 0) {
      this.mostrarError('Debe agregar al menos una materia al horario');
      return false;
    }

    // Validar que todos los detalles tengan materia y profesor
    const detallesIncompletos = this.nuevoHorario.detalles.some(
      detalle => !detalle.materia || !detalle.profesor
    );

    if (detallesIncompletos) {
      this.mostrarError('Todos los horarios deben tener materia y profesor asignados');
      return false;
    }

    // Validar que no haya conflictos de horario para el mismo profesor
    const detallesPorProfesor = this.nuevoHorario.detalles.reduce((acc, detalle) => {
      if (!acc[detalle.profesor]) {
        acc[detalle.profesor] = [];
      }
      acc[detalle.profesor].push(detalle);
      return acc;
    }, {} as { [key: number]: HorarioDetalle[] });

    for (const profesorId in detallesPorProfesor) {
      const detalles = detallesPorProfesor[profesorId];
      const horariosAgrupados = detalles.reduce((acc, detalle) => {
        const key = `${detalle.dia}_${detalle.hora}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(detalle);
        return acc;
      }, {} as { [key: string]: HorarioDetalle[] });

      for (const key in horariosAgrupados) {
        if (horariosAgrupados[key].length > 1) {
          const profesor = this.profesores.find(p => p.id === parseInt(profesorId));
          this.mostrarError(`El profesor ${profesor?.nombre} ${profesor?.apellido} tiene un conflicto de horario en ${key.replace('_', ' ')}`);
          return false;
        }
      }
    }

    // Validar que no haya conflictos de horario para el mismo grupo
    const detallesPorGrupo = this.nuevoHorario.detalles.reduce((acc, detalle) => {
      const key = `${detalle.dia}_${detalle.hora}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(detalle);
      return acc;
    }, {} as { [key: string]: HorarioDetalle[] });

    for (const key in detallesPorGrupo) {
      if (detallesPorGrupo[key].length > 1) {
        this.mostrarError(`Hay un conflicto de horario para el grupo en ${key.replace('_', ' ')}`);
        return false;
      }
    }

    return true;
  }

  editarHorario(horario: HorarioGrupo) {
    this.editar(horario);
  }

  eliminarHorario(id: number) {
    this.eliminar('horarios', id);
  }

  // Métodos para obtener nombres (alias para el template)
  obtenerNombreGrupo(id: number): string {
    return this.getNombreGrupo(id);
  }

  obtenerNombreCarrera(id: number): string {
    return this.getNombreCarrera(id);
  }

  obtenerNombreEdificio(id: number): string {
    return this.getNombreEdificio(id);
  }

  obtenerNombreAula(id: number): string {
    return this.getNombreAula(id);
  }

  // Método para obtener el nombre del verificador
  obtenerNombreVerificador(id: number | undefined): string {
    if (!id) return 'No asignado';
    const verificador = this.verificadoresDisponibles.find(v => v.id === id);
    return verificador ? `${verificador.nombre}` : 'No asignado';
  }

  // Método para obtener el detalle del horario
  obtenerDetalleHorario(hora: string, dia: string): HorarioDetalle | undefined {
    return this.nuevoHorario.detalles.find(d => d.hora === hora && d.dia === dia);
  }

  // Método para obtener profesores por carrera
  getProfesoresPorCarrera(carreraId: number): Profesor[] {
    console.log('Obteniendo profesores para carrera:', carreraId);
    if (!carreraId) {
      console.log('Retornando todos los profesores:', this.todosLosProfesores.length);
      return this.todosLosProfesores;
    }
    const profesoresFiltrados = this.todosLosProfesores.filter(p => p.carrera === carreraId);
    console.log('Profesores filtrados:', profesoresFiltrados.length);
    return profesoresFiltrados;
  }

  // Método para obtener nombre del profesor
  getNombreProfesor(id: number): string {
    const profesor = this.profesores.find(p => p.id === id);
    return profesor ? `${profesor.nombre} ${profesor.apellido}` : 'No encontrado';
  }

  // Método para guardar profesor
  async guardarProfesor() {
    try {
      if (this.modoEdicion && this.nuevoProfesor.id) {
        await firstValueFrom(this.schedulesService.updateProfesor(this.nuevoProfesor.id, this.nuevoProfesor));
      } else {
        await firstValueFrom(this.schedulesService.createProfesor(this.nuevoProfesor));
      }
      
      await this.cargarDatos();
      this.cerrarModal();
      this.mostrarExito(this.modoEdicion ? 'Profesor actualizado correctamente' : 'Profesor creado correctamente');
    } catch (error) {
      console.error('Error al guardar profesor:', error);
      this.mostrarError('Error al guardar el profesor');
    }
  }

  // Método para eliminar profesor
  async eliminarProfesor(id: number) {
    try {
      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return;
      }

      await firstValueFrom(this.schedulesService.deleteProfesor(id));
      await this.cargarDatos();
      this.mostrarExito('Profesor eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
      this.mostrarError('Error al eliminar el profesor');
    }
  }

  // Métodos para manejar formularios
  guardarEdificio() {
    if (this.edificioForm.valid) {
      const edificio = this.edificioForm.value;
      if (this.modoEdicion && this.elementoSeleccionado) {
        this.schedulesService.updateEdificio(this.elementoSeleccionado.id, edificio).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar edificio:', error);
          }
        });
      } else {
        this.schedulesService.createEdificio(edificio).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear edificio:', error);
          }
        });
      }
    }
  }

  guardarAula() {
    if (this.aulaForm.valid) {
      const aula = this.aulaForm.value;
      if (this.modoEdicion && this.elementoSeleccionado) {
        this.schedulesService.updateAula(this.elementoSeleccionado.id, aula).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar aula:', error);
          }
        });
      } else {
        this.schedulesService.createAula(aula).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear aula:', error);
          }
        });
      }
    }
  }

  guardarCarrera() {
    if (this.carreraForm.valid) {
      const carrera = this.carreraForm.value;
      if (this.modoEdicion && this.elementoSeleccionado) {
        this.schedulesService.updateCarrera(this.elementoSeleccionado.id, carrera).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar carrera:', error);
          }
        });
      } else {
        this.schedulesService.createCarrera(carrera).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear carrera:', error);
          }
        });
      }
    }
  }

  guardarGrupo() {
    if (this.grupoForm.valid) {
      const grupo = this.grupoForm.value;
      if (this.modoEdicion && this.elementoSeleccionado) {
        this.schedulesService.updateGrupo(this.elementoSeleccionado.id, grupo).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar grupo:', error);
          }
        });
      } else {
        this.schedulesService.createGrupo(grupo).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear grupo:', error);
          }
        });
      }
    }
  }

  guardarMateria() {
    if (this.materiaForm.valid) {
      const materia = this.materiaForm.value;
      if (this.modoEdicion && this.elementoSeleccionado) {
        this.schedulesService.updateMateria(this.elementoSeleccionado.id, materia).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar materia:', error);
          }
        });
      } else {
        this.schedulesService.createMateria(materia).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear materia:', error);
          }
        });
      }
    }
  }

  // Método para cargar datos al editar
  cargarDatosEdicion() {
    if (this.modoEdicion && this.elementoSeleccionado) {
      switch (this.seccionActual) {
        case 'edificios':
          this.edificioForm.patchValue(this.elementoSeleccionado);
          break;
        case 'aulas':
          this.aulaForm.patchValue(this.elementoSeleccionado);
          break;
        case 'carreras':
          this.carreraForm.patchValue(this.elementoSeleccionado);
          break;
        case 'grupos':
          this.grupoForm.patchValue(this.elementoSeleccionado);
          break;
        case 'materias':
          this.materiaForm.patchValue(this.elementoSeleccionado);
          break;
        case 'profesores':
          this.profesorForm.patchValue(this.elementoSeleccionado);
          break;
        case 'horarios':
          this.horarioForm.patchValue(this.elementoSeleccionado);
          break;
      }
    }
  }

  // Método para ver detalles del horario
  verDetallesHorario(horario: HorarioGrupo) {
    console.log('Mostrando detalles del horario:', horario);
    this.horarioSeleccionado = horario;
    this.mostrarModalDetalles = true;
  }

  // Método para cerrar el modal de detalles
  cerrarModalDetalles() {
    this.mostrarModalDetalles = false;
    this.horarioSeleccionado = null;
  }

  // Método para obtener el detalle del horario seleccionado
  obtenerDetalleHorarioSeleccionado(hora: string, dia: string): HorarioDetalle | undefined {
    if (!this.horarioSeleccionado) return undefined;
    return this.horarioSeleccionado.detalles.find(d => d.hora === hora && d.dia === dia);
  }

  // Método para obtener el nombre de la materia
  obtenerNombreMateria(id: number): string {
    const materia = this.materias.find(m => m.id === id);
    return materia ? materia.nombre : 'No encontrado';
  }

  exportarPDF(horario: HorarioGrupo) {
    try {
      const doc = new jsPDF();
      
      // Configuración de fuentes y colores
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 152, 219); // Azul
      
      // Título
      doc.setFontSize(24);
      doc.text('Horario de Clases', 105, 20, { align: 'center' });
      
      // Línea decorativa
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Información del grupo
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80); // Azul oscuro
      doc.setFont('helvetica', 'normal');
      
      // Primera columna
      doc.text('Información del Grupo', 20, 40);
      doc.setFontSize(10);
      doc.text(`Grupo: ${this.obtenerNombreGrupo(horario.grupo)}`, 20, 48);
      doc.text(`Carrera: ${this.obtenerNombreCarrera(horario.carrera)}`, 20, 56);
      
      // Segunda columna
      doc.setFontSize(12);
      doc.text('Ubicación', 105, 40);
      doc.setFontSize(10);
      doc.text(`Edificio: ${this.obtenerNombreEdificio(horario.edificio)}`, 105, 48);
      doc.text(`Aula: ${this.obtenerNombreAula(horario.aula)}`, 105, 56);
      
      // Verificador
      doc.setFontSize(12);
      doc.text('Verificador Asignado', 20, 70);
      doc.setFontSize(10);
      doc.text(this.obtenerNombreVerificador(horario.verificador) || 'No asignado', 20, 78);
      
      // Línea separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 85, 190, 85);
      
      // Tabla de horario
      const tableData = this.horas.map(hora => {
        const row = [hora];
        this.diasSemana.forEach(dia => {
          const detalle = this.obtenerDetalleHorarioSeleccionado(hora, dia);
          if (detalle && detalle.materia) {
            const materia = this.obtenerNombreMateria(detalle.materia);
            const profesor = this.getNombreProfesor(detalle.profesor);
            row.push(`Materia: ${materia}\n\nProfesor: \n${profesor}`);
          } else {
            row.push('');
          }
        });
        return row;
      });

      autoTable(doc, {
        startY: 90,
        head: [['Hora', ...this.diasSemana]],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 34 },
          2: { cellWidth: 34 },
          3: { cellWidth: 34 },
          4: { cellWidth: 34 },
          5: { cellWidth: 34 }
        },
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index > 0) {
            const cell = data.cell;
            if (cell.text) {
              cell.styles.fontStyle = 'bold';
            }
          }
        }
      });

      // Pie de página
      const pageCount = (doc as any).internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Guardar el PDF
      doc.save(`horario_${this.obtenerNombreGrupo(horario.grupo)}.pdf`);
      this.toastr.success('PDF generado correctamente', 'Éxito');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.toastr.error('Error al generar el PDF', 'Error');
    }
  }
}
