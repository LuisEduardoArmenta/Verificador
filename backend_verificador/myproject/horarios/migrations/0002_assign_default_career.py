from django.db import migrations

def assign_default_career(apps, schema_editor):
    Profesor = apps.get_model('horarios', 'Profesor')
    Carrera = apps.get_model('horarios', 'Carrera')
    
    # Obtener la primera carrera (o crear una si no existe)
    default_career, created = Carrera.objects.get_or_create(
        codigo='ISW',
        defaults={
            'nombre': 'Ingeniería de Software',
            'descripcion': 'Carrera de Ingeniería de Software'
        }
    )
    
    # Asignar la carrera por defecto a todos los profesores que no tengan una
    Profesor.objects.filter(carrera__isnull=True).update(carrera=default_career)

class Migration(migrations.Migration):
    dependencies = [
        ('horarios', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(assign_default_career),
    ] 