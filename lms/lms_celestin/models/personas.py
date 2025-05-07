from datetime import timezone
from django.db import models
from django.conf import settings
from psycopg import Transaction
from .auth import CustomUser
from django.core.validators import RegexValidator
from django.utils.crypto import get_random_string

class Persona(models.Model):
    TIPO_DOCUMENTO_CHOICES = [
        ('RC', 'Registro Civil'),
        ('TI', 'Tarjeta de Identidad'),
        ('CC', 'Cédula de Ciudadanía'),
    ]
    
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]

    tipo_documento = models.CharField(
        max_length=2,
        choices=TIPO_DOCUMENTO_CHOICES
    )
    documento = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(r'^[0-9]+$', 'Solo números permitidos')]
    )
    primer_nombre = models.CharField(max_length=50)
    segundo_nombre = models.CharField(max_length=50, blank=True, null=True)
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    direccion = models.TextField()
    municipio = models.CharField(max_length=100)
    barrio = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^[0-9]{10}$', 'Requiere 10 dígitos')]
    )
    email = models.EmailField(blank=True, null=True)

    class Meta:
        db_table = 'personas'
        indexes = [
            models.Index(fields=['documento']),
            models.Index(fields=['primer_apellido', 'primer_nombre']),
        ]

    def __str__(self):
        return f"{self.nombre_completo} ({self.documento})"

    @property
    def nombre_completo(self):
        nombres = f"{self.primer_nombre} {self.segundo_nombre or ''}".strip()
        apellidos = f"{self.primer_apellido} {self.segundo_apellido or ''}".strip()
        return f"{nombres} {apellidos}"


class Estudiante(models.Model):
    ESTADOS = (
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),
        ('RETIRADO', 'Retirado'),
    )

    GRADOS = (
        ('00', 'Transición'),
        ('01', 'Primero'),
        ('02', 'Segundo'),
        ('03', 'Tercero'),
        ('04', 'Cuarto'),
        ('05', 'Quinto'),
    )

    usuario = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='estudiante'
    )
    persona = models.OneToOneField(
        Persona,
        on_delete=models.CASCADE,
        related_name='estudiante'
    )
    codigo_estudiante = models.CharField(max_length=20, unique=True)
    grado = models.CharField(max_length=2, choices=GRADOS)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='ACTIVO')
    fecha_ingreso = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'estudiantes'

    def __str__(self):
        return f"{self.persona} - Grado {self.get_grado_display()}"

class Acudiente(models.Model):
    PARENTESCO_CHOICES = [
        ('PADRE', 'Padre'),
        ('MADRE', 'Madre'),
        ('TUTOR', 'Tutor'),
        ('OTRO', 'Otro'),
    ]

    persona = models.ForeignKey(
        Persona,
        on_delete=models.CASCADE,
        related_name='acudiente_de'
    )
    estudiante = models.ForeignKey(
        Estudiante,
        on_delete=models.CASCADE,
        related_name='acudientes'
    )
    parentesco = models.CharField(max_length=10, choices=PARENTESCO_CHOICES)
    es_principal = models.BooleanField(default=False)
    es_contacto_emergencia = models.BooleanField(default=False)

    class Meta:
        db_table = 'acudientes_estudiantes'
        unique_together = ('persona', 'estudiante')

    def __str__(self):
        return f"{self.persona} ({self.get_parentesco_display()})"


class AcudientesAlumnos(models.Model):
    acudiente = models.ForeignKey(Acudiente, on_delete=models.CASCADE)
    alumno = models.ForeignKey(Estudiante, on_delete=models.CASCADE)

    class Meta:
        db_table = 'acudientes_alumnos'
        unique_together = ('acudiente', 'alumno')



class Administradores(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='administrador',null=True)
    id_persona = models.OneToOneField(Persona, on_delete=models.CASCADE, db_column='id_persona')

    class Meta:
        db_table = 'administradores'

class Docentes(models.Model):
    especialidad = models.CharField(max_length=100)
    titulos = models.TextField(blank=True, null=True)
    id_persona = models.OneToOneField(Persona, on_delete=models.CASCADE, db_column='id_persona')
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='docente', null=True)

    class Meta:
        db_table = 'docentes'

class FichaEstudiante(models.Model):
    estudiante = models.OneToOneField(
        Estudiante,
        on_delete=models.CASCADE,
        related_name='ficha'
    )
    eps = models.CharField(max_length=100, blank=True, null=True)
    ips = models.CharField(max_length=100, blank=True, null=True)
    sisben = models.BooleanField(default=False)
    familias_accion = models.BooleanField(default=False)
    discapacidad = models.BooleanField(default=False)
    tipo_discapacidad = models.CharField(max_length=100, blank=True, null=True)
    nombre_padre = models.CharField(max_length=100, blank=True, null=True)
    telefono_padre = models.CharField(max_length=15, blank=True, null=True)
    nombre_madre = models.CharField(max_length=100, blank=True, null=True)
    telefono_madre = models.CharField(max_length=15, blank=True, null=True)
    contacto_emergencia = models.CharField(max_length=100)
    telefono_emergencia = models.CharField(max_length=15)

    class Meta:
        db_table = 'fichas_estudiantes'

    def __str__(self):
        return f"Ficha de {self.estudiante}"


class Aplicante(models.Model):
    ESTADOS = (
        ('PENDIENTE', 'Pendiente'),
        ('APROBADO', 'Aprobado'),
        ('RECHAZADO', 'Rechazado'),
    )

    ESTATUS_CHOICES = [
        ('NUEVO', 'Nuevo'),
        ('REPITENTE', 'Repitente'),
    ]

    # Información personal (similar a Persona pero para pre-matrícula)
    tipo_documento = models.CharField(max_length=2)
    documento = models.CharField(max_length=20, unique=True)
    primer_nombre = models.CharField(max_length=50)
    segundo_nombre = models.CharField(max_length=50, blank=True, null=True)
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=1)
    direccion = models.TextField()
    municipio = models.CharField(max_length=100)
    barrio = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=15)
    
    # Información académica
    grado_solicitado = models.CharField(max_length=2, choices=Estudiante.GRADOS)
    estatus = models.CharField(max_length=10, choices=ESTATUS_CHOICES, default='NUEVO')
    
    # Información familiar (para pre-matrícula)
    nombre_acudiente = models.CharField(max_length=100)
    telefono_acudiente = models.CharField(max_length=15)
    email_acudiente = models.EmailField()
    
    # Estado del proceso
    estado = models.CharField(max_length=10, choices=ESTADOS, default='PENDIENTE')
    fecha_aplicacion = models.DateTimeField(auto_now_add=True)
    fecha_revision = models.DateTimeField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'aplicantes'

    def convertir_a_estudiante(self):
        """Convierte un aplicante en estudiante registrado"""
        with Transaction.atomic():
            # 1. Crear Persona
            persona = Persona.objects.create(
                tipo_documento=self.tipo_documento,
                documento=self.documento,
                primer_nombre=self.primer_nombre,
                segundo_nombre=self.segundo_nombre,
                primer_apellido=self.primer_apellido,
                segundo_apellido=self.segundo_apellido,
                fecha_nacimiento=self.fecha_nacimiento,
                sexo=self.sexo,
                direccion=self.direccion,
                municipio=self.municipio,
                barrio=self.barrio,
                telefono=self.telefono,
                email=self.email_acudiente
            )
            
            # 2. Crear Usuario
            user = CustomUser.objects.create_user(
                documento=self.documento,
                password=get_random_string(12),
                email=self.email_acudiente,
                first_name=self.primer_nombre,
                last_name=self.primer_apellido,
                rol='EST'
            )
            
            # 3. Crear Estudiante
            estudiante = Estudiante.objects.create(
                usuario=user,
                persona=persona,
                codigo_estudiante=f"EST-{self.documento}",
                grado=self.grado_solicitado,
                estado='ACTIVO'
            )
            
            # 4. Crear Ficha
            FichaEstudiante.objects.create(
            estudiante=estudiante,
            nombre_padre=self.datos_extra.nombre_padre,
            telefono_padre=self.datos_extra.telefono_padre,
            nombre_madre=self.datos_extra.nombre_madre,
            telefono_madre=self.datos_extra.telefono_madre,
            contacto_emergencia=self.datos_extra.contacto_emergencia,
            telefono_emergencia=self.datos_extra.telefono_emergencia,
            eps=self.datos_extra.eps,
            ips=self.datos_extra.ips,
            familias_accion=self.datos_extra.familias_accion,
            discapacidad=self.datos_extra.discapacidad,
            tipo_discapacidad=self.datos_extra.tipo_discapacidad
        )
            
            # 5. Actualizar estado
            self.estado = 'APROBADO'
            self.fecha_revision = timezone.now()
            self.save()
            
            return estudiante

class DatosExtraAplicante(models.Model):
    aplicante = models.OneToOneField(Aplicante,on_delete=models.CASCADE,related_name='datos_extra')
    nombre_padre = models.CharField(max_length=100, blank=True, null=True)
    telefono_padre = models.CharField(max_length=15, blank=True, null=True)
    nombre_madre = models.CharField(max_length=100, blank=True, null=True)
    telefono_madre = models.CharField(max_length=15, blank=True, null=True)
    contacto_emergencia = models.CharField(max_length=100)
    telefono_emergencia = models.CharField(max_length=15)
    eps = models.CharField(max_length=100, blank=True, null=True)
    ips = models.CharField(max_length=100, blank=True, null=True)
    familias_accion = models.BooleanField(default=False)
    discapacidad = models.BooleanField(default=False)
    tipo_discapacidad = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'datos_extra_aplicantes'