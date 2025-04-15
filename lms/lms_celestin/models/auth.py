from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLES = (
        ('EST', 'Estudiante'),
        ('DOC', 'Docente'),
        ('ADM', 'Administrador'),
    )
    
    # Cambio crucial: Añade unique=True al campo email
    email = models.EmailField('correo electrónico', unique=True)
    
    rol = models.CharField(max_length=3, choices=ROLES, default='EST')
    telefono = models.CharField(max_length=15, blank=True, null=True)
    
    # Especifica que el email será usado para login
    USERNAME_FIELD = 'email'
    
    # Los campos requeridos al crear un superusuario
    REQUIRED_FIELDS = ['username']  # username sigue siendo requerido para algunos comandos
    
    class Meta:
        db_table = 'custom_user'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'