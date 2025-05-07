from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLES = (
        ('EST', 'Estudiante'),
        ('DOC', 'Docente'),
        ('ADM', 'Administrador'),
    )

    # Cambiar USERNAME_FIELD a documento
    documento = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='Documento'
    )
    rol = models.CharField(max_length=3, choices=ROLES, default='EST')
    
    USERNAME_FIELD = 'documento'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    class Meta:
        db_table = 'usuarios'

    def save(self, *args, **kwargs):
        # Auto-generar username si no existe
        if not self.username:
            self.username = f"{self.rol.lower()}_{self.documento}"
        super().save(*args, **kwargs)
