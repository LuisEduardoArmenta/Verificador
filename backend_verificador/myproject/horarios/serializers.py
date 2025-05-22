from rest_framework import serializers
from .models import (
    Edificio, Aula, Carrera, Grupo, Materia,
    Horario, AsignacionVerificador, RegistroAsistencia,
    HorarioGrupo, HorarioDetalle, Profesor
)

class EdificioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edificio
        fields = '__all__'

class AulaSerializer(serializers.ModelSerializer):
    edificio_nombre = serializers.CharField(source='edificio.nombre', read_only=True)

    class Meta:
        model = Aula
        fields = '__all__'

class CarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrera
        fields = '__all__'

class GrupoSerializer(serializers.ModelSerializer):
    carrera_nombre = serializers.CharField(source='carrera.nombre', read_only=True)

    class Meta:
        model = Grupo
        fields = '__all__'

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    grupo_nombre = serializers.CharField(source='grupo.nombre', read_only=True)
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    aula_nombre = serializers.CharField(source='aula.nombre', read_only=True)
    edificio_nombre = serializers.CharField(source='aula.edificio.nombre', read_only=True)

    class Meta:
        model = Horario
        fields = '__all__'

class AsignacionVerificadorSerializer(serializers.ModelSerializer):
    horario_detalle = HorarioSerializer(source='horario', read_only=True)
    verificador_nombre = serializers.CharField(source='verificador.full_name', read_only=True)

    class Meta:
        model = AsignacionVerificador
        fields = '__all__'

class RegistroAsistenciaSerializer(serializers.ModelSerializer):
    asignacion_detalle = AsignacionVerificadorSerializer(source='asignacion', read_only=True)

    class Meta:
        model = RegistroAsistencia
        fields = '__all__'

# Nuevos serializers para la gestión de horarios por grupo
class ProfesorSerializer(serializers.ModelSerializer):
    carrera_nombre = serializers.CharField(source='carrera.nombre', read_only=True)

    class Meta:
        model = Profesor
        fields = ['id', 'nombre', 'apellido', 'email', 'carrera', 'carrera_nombre', 'activo']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class HorarioDetalleSerializer(serializers.ModelSerializer):
    materia_nombre = serializers.CharField(source='materia.descripcion', read_only=True)
    profesor_nombre = serializers.CharField(source='profesor.__str__', read_only=True)

    class Meta:
        model = HorarioDetalle
        fields = ['id', 'hora', 'dia', 'materia', 'materia_nombre', 'profesor', 'profesor_nombre']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class HorarioGrupoSerializer(serializers.ModelSerializer):
    detalles = HorarioDetalleSerializer(many=True)
    grupo_nombre = serializers.CharField(source='grupo.descripcion', read_only=True)
    carrera_nombre = serializers.CharField(source='carrera.descripcion', read_only=True)
    edificio_nombre = serializers.CharField(source='edificio.nombre', read_only=True)
    aula_nombre = serializers.CharField(source='aula.nombre', read_only=True)
    verificador_nombre = serializers.SerializerMethodField()

    class Meta:
        model = HorarioGrupo
        fields = ['id', 'grupo', 'grupo_nombre', 'carrera', 'carrera_nombre', 
                 'edificio', 'edificio_nombre', 'aula', 'aula_nombre',
                 'estado', 'verificador', 'verificador_nombre',
                 'detalles', 'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

    def get_verificador_nombre(self, obj):
        return obj.verificador.get_full_name() if obj.verificador else None

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        horario = HorarioGrupo.objects.create(**validated_data)
        for detalle_data in detalles_data:
            HorarioDetalle.objects.create(horario=horario, **detalle_data)
        return horario

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop('detalles')
        # Actualizar campos del horario
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Eliminar detalles existentes
        instance.detalles.all().delete()

        # Crear nuevos detalles
        for detalle_data in detalles_data:
            HorarioDetalle.objects.create(horario=instance, **detalle_data)

        return instance 