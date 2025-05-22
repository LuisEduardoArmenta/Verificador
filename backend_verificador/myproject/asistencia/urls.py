from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    ProfesorListCreateView, ProfesorDetailView,
    MateriaListCreateView, MateriaDetailView,
    SalonListCreateView, SalonDetailView,
    RegistroAsistenciaListCreateView, RegistroAsistenciaDetailView
)

router = DefaultRouter()
router.register(r'verificador', views.VerificadorViewSet, basename='verificador')

urlpatterns = [
    path('profesores/', ProfesorListCreateView.as_view(), name='profesor-list-create'),
    path('profesores/<int:pk>/', ProfesorDetailView.as_view(), name='profesor-detail'),
    path('materias/', MateriaListCreateView.as_view(), name='materia-list-create'),
    path('materias/<int:pk>/', MateriaDetailView.as_view(), name='materia-detail'),
    path('salones/', SalonListCreateView.as_view(), name='salon-list-create'),
    path('salones/<int:pk>/', SalonDetailView.as_view(), name='salon-detail'),
    path('registros/', RegistroAsistenciaListCreateView.as_view(), name='registro-list-create'),
    path('registros/<int:pk>/', RegistroAsistenciaDetailView.as_view(), name='registro-detail'),
    path('', include(router.urls)),
]