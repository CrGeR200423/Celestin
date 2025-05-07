from django.db import models
from .personas import Estudiante

class BancoLogros(models.Model):
    fecha = models.DateField()
    analisis = models.CharField(max_length=255)
    id_alumno = models.ForeignKey(Estudiante, on_delete=models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'banco_logros'


class Calificaciones(models.Model):
    calificacion = models.DecimalField(max_digits=4, decimal_places=2)
    primer_parcial = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    segundo_parcial = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    tercer_parcial = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    fecha_calificacion_primer_parcial = models.DateField(blank=True, null=True)
    fecha_calificacion_segundo_parcial = models.DateField(blank=True, null=True)
    fecha_calificacion_tercer_parcial = models.DateField(blank=True, null=True)
    id_alumno = models.ForeignKey(Estudiante, on_delete=models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'calificaciones'


class Observadores(models.Model):
    fecha = models.DateField()
    anotacion = models.CharField(max_length=255)
    id_alumno = models.ForeignKey(Estudiante, on_delete=models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'observadores'


class Departamentos(models.Model):
    nombre = models.CharField(max_length=45)

    class Meta:
        db_table = 'departamentos'


class Municipios(models.Model):
    nombre = models.CharField(max_length=45)
    id_departamento = models.ForeignKey(Departamentos, on_delete=models.CASCADE, db_column='id_departamento')

    class Meta:
        db_table = 'municipios'