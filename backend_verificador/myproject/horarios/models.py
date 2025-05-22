from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class Edificio(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

class Aula(models.Model):
    nombre = models.CharField(max_length=100)
    edificio = models.ForeignKey(Edificio, on_delete=models.CASCADE, related_name='aulas')
    capacidad = models.IntegerField()
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} - {self.edificio.nombre}"

class Carrera(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

class Grupo(models.Model):
    nombre = models.CharField(max_length=100)
    carrera = models.ForeignKey(Carrera, on_delete=models.CASCADE, related_name='grupos')
    semestre = models.IntegerField()
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} - {self.carrera.nombre}"

class Materia(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

class Horario(models.Model):
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    profesor = models.CharField(max_length=100)
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE)
    dia_semana = models.CharField(max_length=20)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    def __str__(self):
        return f"{self.materia.nombre} - {self.grupo.nombre}"

class Profesor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    carrera = models.ForeignKey(Carrera, on_delete=models.CASCADE)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class HorarioGrupo(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('asignado', 'Asignado'),
        ('verificado', 'Verificado')
    ]

    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, related_name='horarios')
    carrera = models.ForeignKey(Carrera, on_delete=models.CASCADE)
    edificio = models.ForeignKey(Edificio, on_delete=models.CASCADE)
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE)
    verificador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='horarios_verificados')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Horario de {self.grupo.nombre}"

class HorarioDetalle(models.Model):
    horario = models.ForeignKey(HorarioGrupo, on_delete=models.CASCADE, related_name='detalles')
    hora = models.CharField(max_length=5)  # Formato "HH:MM"
    dia = models.CharField(max_length=20)  # Lunes, Martes, etc.
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['horario', 'hora', 'dia']

    def __str__(self):
        return f"{self.dia} {self.hora} - {self.materia.nombre}"

class AsignacionVerificador(models.Model):
    verificador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='asignaciones')
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE, related_name='asignaciones')
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        unique_together = ['verificador', 'horario']

    def __str__(self):
        return f"{self.verificador.username} - {self.horario}"

class RegistroAsistencia(models.Model):
    asignacion = models.ForeignKey(AsignacionVerificador, on_delete=models.CASCADE, related_name='registros')
    fecha = models.DateField()
    hora = models.TimeField()
    profesor_presente = models.BooleanField(default=False)
    observaciones = models.TextField(blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['asignacion', 'fecha', 'hora']

    def __str__(self):
        return f"{self.asignacion.horario} - {self.fecha} {self.hora}"
