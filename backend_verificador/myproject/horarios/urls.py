from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EdificioViewSet, AulaViewSet, CarreraViewSet,
    GrupoViewSet, MateriaViewSet, HorarioViewSet,
    HorarioGrupoViewSet, ProfesorViewSet
)

router = DefaultRouter()
router.register(r'edificios', EdificioViewSet)
router.register(r'aulas', AulaViewSet)
router.register(r'carreras', CarreraViewSet)
router.register(r'grupos', GrupoViewSet)
router.register(r'materias', MateriaViewSet)
router.register(r'horarios', HorarioViewSet)
router.register(r'horarios-grupo', HorarioGrupoViewSet)
router.register(r'profesores', ProfesorViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 