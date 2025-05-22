from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import (
    Edificio, Aula, Carrera, Grupo, Materia,
    Horario, AsignacionVerificador, RegistroAsistencia,
    HorarioGrupo, HorarioDetalle, Profesor
)
from .serializers import (
    EdificioSerializer, AulaSerializer, CarreraSerializer,
    GrupoSerializer, MateriaSerializer, HorarioSerializer,
    AsignacionVerificadorSerializer, RegistroAsistenciaSerializer,
    HorarioGrupoSerializer, HorarioDetalleSerializer, ProfesorSerializer
)

User = get_user_model()

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.role == 'admin'

class EdificioViewSet(viewsets.ModelViewSet):
    queryset = Edificio.objects.all()
    serializer_class = EdificioSerializer
    permission_classes = [permissions.IsAuthenticated]

class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer
    permission_classes = [permissions.IsAuthenticated]

class CarreraViewSet(viewsets.ModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer
    permission_classes = [permissions.IsAuthenticated]

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    serializer_class = GrupoSerializer
    permission_classes = [permissions.IsAuthenticated]

class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer
    permission_classes = [permissions.IsAuthenticated]

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def por_verificador(self, request):
        if request.user.role != 'verificador':
            return Response(
                {'error': 'Solo los verificadores pueden ver sus horarios asignados'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        asignaciones = AsignacionVerificador.objects.filter(
            verificador=request.user,
            activo=True
        )
        horarios = [asignacion.horario for asignacion in asignaciones]
        serializer = self.get_serializer(horarios, many=True)
        return Response(serializer.data)

class AsignacionVerificadorViewSet(viewsets.ModelViewSet):
    queryset = AsignacionVerificador.objects.all()
    serializer_class = AsignacionVerificadorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return AsignacionVerificador.objects.all()
        return AsignacionVerificador.objects.filter(verificador=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            return Response(
                {'error': 'Solo los administradores pueden crear asignaciones'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()

class RegistroAsistenciaViewSet(viewsets.ModelViewSet):
    queryset = RegistroAsistencia.objects.all()
    serializer_class = RegistroAsistenciaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return RegistroAsistencia.objects.all()
        return RegistroAsistencia.objects.filter(
            asignacion__verificador=self.request.user
        )

    def perform_create(self, serializer):
        asignacion_id = self.request.data.get('asignacion')
        asignacion = get_object_or_404(AsignacionVerificador, id=asignacion_id)
        
        if self.request.user.role == 'verificador' and asignacion.verificador != self.request.user:
            return Response(
                {'error': 'No puedes registrar asistencia para horarios no asignados'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save()

# Nuevas vistas para la gestión de horarios por grupo
class HorarioGrupoViewSet(viewsets.ModelViewSet):
    queryset = HorarioGrupo.objects.all()
    serializer_class = HorarioGrupoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = HorarioGrupo.objects.all()
        if self.request.user.role == 'verificador':
            return queryset.filter(verificador=self.request.user)
        return queryset

    @action(detail=True, methods=['post'])
    def asignar_verificador(self, request, pk=None):
        horario = self.get_object()
        verificador_id = request.data.get('verificadorId')
        
        try:
            verificador = User.objects.get(id=verificador_id, role='verificador')
            horario.verificador = verificador
            horario.estado = 'asignado'
            horario.save()
            
            serializer = self.get_serializer(horario)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'Verificador no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def marcar_verificado(self, request, pk=None):
        horario = self.get_object()
        if horario.verificador != request.user:
            return Response(
                {'error': 'No tienes permiso para verificar este horario'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        horario.estado = 'verificado'
        horario.save()
        serializer = self.get_serializer(horario)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def verificadores_disponibles(self, request):
        verificadores = User.objects.filter(role='verificador')
        print("Verificadores encontrados:", [{
            'id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'email': user.email
        } for user in verificadores])
        
        response = Response([{
            'id': user.id,
            'nombre': user.full_name or user.username,
            'email': user.email
        } for user in verificadores])
        
        # Agregar headers para evitar cacheo
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        
        return response

class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer
    permission_classes = [permissions.IsAuthenticated]
