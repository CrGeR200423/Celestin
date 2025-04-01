from django.db import models

# Create your models here.
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Acudientes(models.Model):
    correo = models.CharField(max_length=100, blank=True, null=True)
    id_persona = models.ForeignKey('Personas', on_delete= models.CASCADE, db_column='id_persona')
    id_alumno = models.ForeignKey('Alumnos', on_delete= models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'acudientes'


class Administradores(models.Model):
    usuario = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    id_persona = models.ForeignKey('Personas',on_delete= models.CASCADE, db_column='id_persona')

    class Meta:
        
        db_table = 'administradores'


class Alumnos(models.Model):
    codigo_estudiante = models.CharField(unique=True, max_length=100)
    id_persona = models.ForeignKey('Personas',on_delete= models.CASCADE, db_column='id_persona')

    class Meta:
        
        db_table = 'alumnos'


class AsignarAsignaturasCursos(models.Model):
    id_asignatura = models.ForeignKey('Asignaturas',on_delete= models.CASCADE, db_column='id_asignatura')
    id_curso = models.ForeignKey('Cursos',on_delete= models.CASCADE, db_column='id_curso')

    class Meta:
        
        db_table = 'asignar_asignaturas_cursos'


class Asignaturas(models.Model):
    nombre = models.CharField(unique=True, max_length=100)
    cantidad_horas = models.IntegerField()
    id_docente = models.ForeignKey('Docentes',on_delete= models.CASCADE, db_column='id_docente')

    class Meta:
        
        db_table = 'asignaturas'


class BancoJuegos(models.Model):
    fecha = models.DateField()
    analisis = models.CharField(max_length=255)
    id_alumno = models.ForeignKey(Alumnos,on_delete= models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'banco_juegos'


class Calificaciones(models.Model):
    calificacion = models.DecimalField(max_digits=4, decimal_places=2)
    primer_parcial = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    segundo_parcial = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    tercer_parcial = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    fecha_calificacion_primer_parcial = models.DateField(blank=True, null=True)
    fecha_calificacion_segundo_parcial = models.DateField(blank=True, null=True)
    fecha_calificacion_tercer_parcial = models.DateField(blank=True, null=True)
    id_alumno = models.ForeignKey(Alumnos,on_delete= models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'calificaciones'


class Cursos(models.Model):
    nombre_curso = models.CharField(unique=True, max_length=45)
    jornada = models.CharField(max_length=6)
    cantidad_alumnos = models.IntegerField()

    class Meta:
        db_table = 'cursos'


class Departamentos(models.Model):
    nombre = models.CharField(max_length=45)

    class Meta:
        db_table = 'departamentos'


class Docentes(models.Model):
    especialidad = models.CharField(max_length=100)
    titulos = models.CharField(max_length=255, blank=True, null=True)
    id_persona = models.ForeignKey('Personas',on_delete= models.CASCADE, db_column='id_persona')

    class Meta:
        
        db_table = 'docentes'


class Matriculas(models.Model):
    fecha_matricula = models.DateField()
    estado = models.CharField(max_length=50)
    grado = models.CharField(max_length=20)
    anio_academico = models.IntegerField()  # This field type is a guess.
    observaciones = models.TextField(blank=True, null=True)
    id_alumno = models.ForeignKey(Alumnos,on_delete= models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'matriculas'


class Observadores(models.Model):
    fecha = models.DateField()
    anotacion = models.CharField(max_length=255)
    id_alumno = models.ForeignKey(Alumnos,on_delete= models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'observadores'


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
