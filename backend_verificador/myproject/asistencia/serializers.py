from rest_framework import serializers
from .models import Profesor, Materia, Salon, RegistroAsistencia
from horarios.models import HorarioGrupo, HorarioDetalle

class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = '__all__'

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = '__all__'

class SalonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = '__all__'

class RegistroAsistenciaSerializer(serializers.ModelSerializer):
    materia_nombre = serializers.CharField(source='horario_detalle.materia.nombre', read_only=True)
    profesor_nombre = serializers.CharField(source='horario_detalle.profesor.nombre', read_only=True)
    aula_nombre = serializers.CharField(source='horario_detalle.horario.aula.nombre', read_only=True)
    edificio_nombre = serializers.CharField(source='horario_detalle.horario.edificio.nombre', read_only=True)
    grupo_nombre = serializers.CharField(source='horario_detalle.horario.grupo.nombre', read_only=True)
    hora = serializers.CharField(source='horario_detalle.hora', read_only=True)
    dia = serializers.CharField(source='horario_detalle.dia', read_only=True)

    class Meta:
        model = RegistroAsistencia
        fields = [
            'id', 'horario_detalle', 'fecha', 'estado', 'observaciones',
            'materia_nombre', 'profesor_nombre', 'aula_nombre', 'edificio_nombre',
            'grupo_nombre', 'hora', 'dia'
        ]
        read_only_fields = ['verificador']

class HorarioVerificadorSerializer(serializers.ModelSerializer):
    detalles = serializers.SerializerMethodField()
    grupo_nombre = serializers.CharField(source='grupo.nombre', read_only=True)
    carrera_nombre = serializers.CharField(source='carrera.nombre', read_only=True)
    edificio_nombre = serializers.CharField(source='edificio.nombre', read_only=True)
    aula_nombre = serializers.CharField(source='aula.nombre', read_only=True)

    class Meta:
        model = HorarioGrupo
        fields = [
            'id', 'grupo_nombre', 'carrera_nombre', 'edificio_nombre',
            'aula_nombre', 'estado', 'detalles'
        ]

    def get_detalles(self, obj):
        detalles = obj.detalles.all()
        return [{
            'id': detalle.id,
            'hora': detalle.hora,
            'dia': detalle.dia,
            'materia': detalle.materia.nombre,
            'profesor': f"{detalle.profesor.nombre} {detalle.profesor.apellido}",
            'registros': RegistroAsistenciaSerializer(
                detalle.registros_asistencia.all(), many=True
            ).data
        } for detalle in detalles]