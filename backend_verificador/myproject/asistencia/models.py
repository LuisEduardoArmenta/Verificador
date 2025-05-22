from django.db import models
from django.contrib.auth import get_user_model
from horarios.models import HorarioDetalle

User = get_user_model()

class Profesor(models.Model):
    nombre = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.nombre

class Materia(models.Model):
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre

class Salon(models.Model):
    nombre = models.CharField(max_length=50)
    capacidad = models.IntegerField()

    def __str__(self):
        return self.nombre

class RegistroAsistencia(models.Model):
    ESTADO_CHOICES = [
        ('presente', 'Presente'),
        ('retardo', 'Retardo'),
        ('falta', 'Falta'),
    ]

    horario_detalle = models.ForeignKey(HorarioDetalle, on_delete=models.CASCADE, related_name='registros_asistencia', null=True)
    fecha = models.DateField(null=True)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, null=True)
    observaciones = models.TextField(blank=True, null=True)
    verificador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registros_verificados', null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['horario_detalle', 'fecha']

    def __str__(self):
        return f"{self.horario_detalle.materia if self.horario_detalle else 'Sin horario'} - {self.fecha} - {self.estado}"