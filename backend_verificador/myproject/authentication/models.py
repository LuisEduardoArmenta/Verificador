from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('verificador', 'Verificador'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='verificador')
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.username