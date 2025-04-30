from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLES = (
        ('EST', 'Estudiante'),
        ('DOC', 'Docente'),
        ('ADM', 'Administrador'),
    )

    email = models.EmailField('correo electrónico', unique=True)
    documento = models.CharField(max_length=50, unique=True, null=True)  # <- CAMPO CLAVE
    rol = models.CharField(max_length=3, choices=ROLES, default='EST')
    telefono = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = 'documento'  # <- AQUÍ
    REQUIRED_FIELDS = ['email', 'username']

    class Meta:
        db_table = 'custom_user'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
