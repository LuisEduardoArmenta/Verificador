from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class Command(BaseCommand):
    help = 'Actualiza los nombres de los verificadores basándose en sus emails'

    def handle(self, *args, **kwargs):
        verificadores = User.objects.filter(role='verificador')
        
        for verificador in verificadores:
            # Extraer nombre del email
            email = verificador.email
            username = email.split('@')[0]
            
            # Convertir username a formato nombre
            name_parts = username.replace('.', ' ').split()
            first_name = name_parts[0].capitalize()
            last_name = ' '.join(name_parts[1:]).capitalize() if len(name_parts) > 1 else ''
            
            # Actualizar el usuario
            verificador.first_name = first_name
            verificador.last_name = last_name
            verificador.save()
            
            self.stdout.write(
                self.style.SUCCESS(f'Verificador actualizado: {first_name} {last_name} ({email})')
            ) 