from django.db import models
from django.conf import settings

class Personas(models.Model):
    tipo_documento = models.CharField(max_length=9)
    documento = models.CharField(unique=True, max_length=50)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    sexo = models.CharField(max_length=4)
    direccion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'personas'


class Acudientes(models.Model):
    correo = models.CharField(max_length=100, blank=True, null=True)
    id_persona = models.ForeignKey(Personas, on_delete=models.CASCADE, db_column='id_persona')

    class Meta:
        db_table = 'acudientes'


class Alumnos(models.Model):
    codigo_estudiante = models.CharField(unique=True, max_length=100)
    id_persona = models.ForeignKey(Personas, on_delete=models.CASCADE, db_column='id_persona')
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # Usa la referencia correcta
        on_delete=models.CASCADE,
        related_name='alumno')

    class Meta:
        db_table = 'alumnos'


class AcudientesAlumnos(models.Model):
    acudiente = models.ForeignKey(Acudientes, on_delete=models.CASCADE)
    alumno = models.ForeignKey(Alumnos, on_delete=models.CASCADE)

    class Meta:
        db_table = 'acudientes_alumnos'
        unique_together = ('acudiente', 'alumno')



class Administradores(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='administrador',null=True)
    id_persona = models.OneToOneField(Personas, on_delete=models.CASCADE, db_column='id_persona')

    class Meta:
        db_table = 'administradores'

class Docentes(models.Model):
    especialidad = models.CharField(max_length=100)
    titulos = models.TextField(blank=True, null=True)
    id_persona = models.OneToOneField(Personas, on_delete=models.CASCADE, db_column='id_persona')
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='docente', null=True)

    class Meta:
        db_table = 'docentes'