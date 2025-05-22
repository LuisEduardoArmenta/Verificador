from django.shortcuts import render
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Profesor, Materia, Salon, RegistroAsistencia
from .serializers import ProfesorSerializer, MateriaSerializer, SalonSerializer, RegistroAsistenciaSerializer, HorarioVerificadorSerializer
from horarios.models import HorarioGrupo

class ProfesorListCreateView(generics.ListCreateAPIView):
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer

class ProfesorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer

class MateriaListCreateView(generics.ListCreateAPIView):
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer

class MateriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer

class SalonListCreateView(generics.ListCreateAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonSerializer

class SalonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonSerializer

class RegistroAsistenciaListCreateView(generics.ListCreateAPIView):
    queryset = RegistroAsistencia.objects.all()
    serializer_class = RegistroAsistenciaSerializer

class RegistroAsistenciaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RegistroAsistencia.objects.all()
    serializer_class = RegistroAsistenciaSerializer

class VerificadorViewSet(viewsets.ModelViewSet):
    serializer_class = RegistroAsistenciaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo mostrar registros del verificador actual
        return RegistroAsistencia.objects.filter(verificador=self.request.user)

    def perform_create(self, serializer):
        serializer.save(verificador=self.request.user)

    @action(detail=False, methods=['get'])
    def mis_horarios(self, request):
        """Obtener los horarios asignados al verificador"""
        horarios = HorarioGrupo.objects.filter(verificador=request.user)
        serializer = HorarioVerificadorSerializer(horarios, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='horario/(?P<horario_id>[^/.]+)')
    def horario(self, request, horario_id=None):
        """Obtener el detalle de un horario específico"""
        try:
            horario = HorarioGrupo.objects.get(
                id=horario_id,
                verificador=request.user
            )
            serializer = HorarioVerificadorSerializer(horario)
            return Response(serializer.data)
        except HorarioGrupo.DoesNotExist:
            return Response(
                {'error': 'Horario no encontrado o no asignado'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def registrar_asistencia(self, request):
        """Registrar la asistencia de un profesor"""
        horario_detalle_id = request.data.get('horario_detalle')
        estado = request.data.get('estado')
        observaciones = request.data.get('observaciones', '')

        try:
            horario_detalle = HorarioGrupo.objects.get(
                detalles__id=horario_detalle_id,
                verificador=request.user
            ).detalles.get(id=horario_detalle_id)
        except HorarioGrupo.DoesNotExist:
            return Response(
                {'error': 'Horario no encontrado o no asignado'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Verificar si ya existe un registro para hoy
        fecha_actual = timezone.now().date()
        registro, created = RegistroAsistencia.objects.get_or_create(
            horario_detalle=horario_detalle,
            fecha=fecha_actual,
            defaults={
                'estado': estado,
                'observaciones': observaciones,
                'verificador': request.user
            }
        )

        if not created:
            registro.estado = estado
            registro.observaciones = observaciones
            registro.save()

        serializer = self.get_serializer(registro)
        return Response(serializer.data)