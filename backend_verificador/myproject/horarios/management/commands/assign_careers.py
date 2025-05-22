from django.core.management.base import BaseCommand
from horarios.models import Profesor, Carrera

class Command(BaseCommand):
    help = 'Asigna carreras a los profesores que no tienen una'

    def handle(self, *args, **kwargs):
        # Obtener o crear la carrera de Ingeniería de Software
        carrera_isw, created = Carrera.objects.get_or_create(
            codigo='ISW',
            defaults={
                'nombre': 'Ingeniería de Software',
                'descripcion': 'Carrera de Ingeniería de Software'
            }
        )

        # Asignar la carrera a todos los profesores que no tengan una
        profesores_sin_carrera = Profesor.objects.filter(carrera__isnull=True)
        count = profesores_sin_carrera.count()
        
        if count > 0:
            profesores_sin_carrera.update(carrera=carrera_isw)
            self.stdout.write(
                self.style.SUCCESS(f'Se asignó la carrera a {count} profesores')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('Todos los profesores ya tienen una carrera asignada')
            ) 