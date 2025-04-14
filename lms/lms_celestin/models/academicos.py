from django.db import models
from .personas import Docentes
from .personas import Alumnos

class Asignaturas(models.Model):
    nombre = models.CharField(unique=True, max_length=100)
    cantidad_horas = models.IntegerField()
    id_docente = models.ForeignKey(Docentes, on_delete=models.CASCADE, db_column='id_docente')

    class Meta:
        db_table = 'asignaturas'


class Cursos(models.Model):
    nombre_curso = models.CharField(unique=True, max_length=45)
    jornada = models.CharField(max_length=6)
    cantidad_alumnos = models.IntegerField()

    class Meta:
        db_table = 'cursos'


class AsignarAsignaturasCursos(models.Model):
    id_asignatura = models.ForeignKey(Asignaturas, on_delete=models.CASCADE, db_column='id_asignatura')
    id_curso = models.ForeignKey(Cursos, on_delete=models.CASCADE, db_column='id_curso')

    class Meta:
        db_table = 'asignar_asignaturas_cursos'
        unique_together = ('id_asignatura', 'id_curso')


class CursosDocentes(models.Model):
    id_curso = models.ForeignKey(Cursos, on_delete=models.CASCADE, db_column='id_curso')
    id_docente = models.ForeignKey(Docentes, on_delete=models.CASCADE, db_column='id_docente')

    class Meta:
        db_table = 'cursos_docentes'
        unique_together = ('id_curso', 'id_docente')


class Matriculas(models.Model):
    fecha_matricula = models.DateField()
    estado = models.CharField(max_length=50)
    grado = models.CharField(max_length=20)
    anio_academico = models.IntegerField()
    observaciones = models.TextField(blank=True, null=True)
    id_alumno = models.ForeignKey(Alumnos, on_delete=models.CASCADE, db_column='id_alumno')

    class Meta:
        db_table = 'matriculas'