
from django.shortcuts import render, redirect
from .models import Personas,Docentes,Administradores, Alumnos, Acudientes, AcudientesAlumnos
from django.contrib import messages
from django.contrib.auth.models import User  # Importar el modelo User de Django
from django.contrib.auth.hashers import make_password  # Para encriptar contraseñas
from django.core.mail import send_mail  # Para enviar credenciales por email
from django.conf import settings
from django.db import transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError


User = get_user_model()
# Create your views here.
def home(request):
    return render(request, 'home.html')

def conocenos(request):
    return render(request, 'conocenos.html')

def actividades(request):
    return render(request, 'actividades.html')

def prematricula(request):
    return render(request, 'PreMatricula.html')

def contactenos(request):
    return render(request, 'contactenos.html')

def inicio_sesion(request):
    return render(request, 'inicio_sesion.html')

def administrador(request):
    return render(request, 'administrador.html')

def formulario(request):
    return render(request, 'formulario_usuario.html')

def estudiante(request):
    return render(request,'inicio_estudiante.html')

def observador(request):
    return render(request, 'observador.html')

def himno(request):
    return render(request, 'Himno.html')

def historia(request):
    return render(request, 'Historia.html')




def registrar_estudiante(request):
    if request.method == 'POST':
        try:
            # ===== 1. Crear Usuario de Django (para autenticación) =====
            documento_estudiante = request.POST.get('documento')
            email_acudiente = request.POST.get('correo_acudiente')
            
            # Generar username y contraseña temporal (usando el documento)
            username = f"est_{documento_estudiante}"  # Ej: "est_123456789"
            password_temp = documento_estudiante  # La contraseña temporal será el documento
            
            # Crear el usuario en Django
            user = User.objects.create_user(
                email=email_acudiente,  # Usar el email del acudiente
                username=f"est_{documento_estudiante}",
                password=make_password(password_temp),  # Encriptar la contraseña
                rol='EST',
                is_active=True
        )
            
            
            # ===== 2. Crear Persona (estudiante) =====
            persona = Personas(
                tipo_documento=request.POST.get('tipo_documento'),
                documento=documento_estudiante,
                nombres=request.POST.get('nombres'),
                apellidos=request.POST.get('apellidos'),
                fecha_nacimiento=request.POST.get('fecha_nacimiento'),
                sexo=request.POST.get('sexo'),
                direccion=request.POST.get('direccion')
            )
            persona.save()

            # ===== 3. Crear Alumno =====
            alumno = Alumnos(
                codigo_estudiante=request.POST.get('codigo_estudiante'),
                id_persona=persona,
                usuario=user  # Añadir relación con el User de Django (necesitas agregar este campo al modelo)
            )
            alumno.save()

            # ===== 4. Crear Acudiente =====
            acudiente = Acudientes(
                correo=email_acudiente,
                id_persona=Personas.objects.create(
                    tipo_documento=request.POST.get('tipo_documento_acudiente'),
                    documento=request.POST.get('documento_acudiente'),
                    nombres=request.POST.get('nombre_acudiente'),
                    apellidos='',
                    sexo='',
                    direccion=request.POST.get('direccion_acudiente')
                )
            )
            acudiente.save()

            # ===== 5. Relación Acudiente-Alumno =====
            AcudientesAlumnos.objects.create(
                acudiente=acudiente,
                alumno=alumno
            )

            # ===== 6. Enviar credenciales por email =====
            asunto = "Credenciales de acceso - Sistema Escolar"
            mensaje = f"""
            ¡Bienvenido al sistema!
            
            Credenciales para el estudiante {persona.nombres} {persona.apellidos}:
            Usuario: {username}
            Contraseña temporal: {password_temp}
            
            Por seguridad, cambie su contraseña después del primer ingreso.
            """
            
            send_mail(
                asunto,
                mensaje,
                settings.EMAIL_HOST_USER,  # Configurar en settings.py
                [email_acudiente],
                fail_silently=False,
            )

            messages.success(request, "Estudiante registrado correctamente. Se enviaron las credenciales al acudiente.")
            return redirect('administrador')

        except Exception as e:
            messages.error(request, f"Error al registrar: {str(e)}")
    
    return render(request, 'formulario_usuario.html')


def registrar_docente(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                # Validación básica
                required_fields = ['nombres', 'apellidos', 'tipo_documento', 'documento', 'especialidad', 'email']
                for field in required_fields:
                    if not request.POST.get(field):
                        raise ValidationError(f"El campo {field} es requerido")

                email = request.POST['email']
                documento = request.POST['documento']

                if User.objects.filter(email=email).exists():
                    raise ValidationError("Este correo ya está registrado")

                # Crear usuario
                username = f"doc_{documento}"
                password_temp = User.objects.make_random_password()

                user = User.objects.create_user(
                    email=email,
                    username=f"doc_{documento}",
                    password=make_password(password_temp),
                    rol='DOC',
                    is_active=True
                )

                # Crear Persona
                persona = Personas.objects.create(
                    tipo_documento=request.POST['tipo_documento'],
                    documento=documento,
                    nombres=request.POST['nombres'],
                    apellidos=request.POST['apellidos'],
                    sexo=request.POST.get('sexo', ''),
                    direccion=request.POST.get('direccion', '')
                )

                # Crear Docente
                docente = Docentes.objects.create(
                    especialidad=request.POST['especialidad'],
                    titulos=request.POST.get('titulos', ''),
                    id_persona=persona,
                    usuario=user
                )

                # Enviar credenciales
                try:
                    send_mail(
                        'Credenciales de acceso - Sistema Escolar',
                        f'''Usuario: {username}
Contraseña temporal: {password_temp}

Por seguridad, cambie su contraseña después del primer ingreso.''',
                        settings.EMAIL_HOST_USER,
                        [email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Error enviando email: {str(e)}")

                messages.success(request, "Docente registrado exitosamente!")
                return redirect('administrador')

        except ValidationError as e:
            messages.error(request, str(e))
        except Exception as e:
            messages.error(request, f"Error en el registro: {str(e)}")
    
    return render(request, 'formulario_usuario.html')

def registrar_administrador(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                required_fields = ['nombres', 'apellidos', 'tipo_documento', 'documento', 'email']
                for field in required_fields:
                    if not request.POST.get(field):
                        raise ValidationError(f"El campo {field} es requerido")

                email = request.POST['email']
                documento = request.POST['documento']

                if User.objects.filter(email=email).exists():
                    raise ValidationError("Este correo ya está registrado")

                # Crear usuario
                username = f"adm_{documento}"
                password_temp = User.objects.make_random_password()

                user = User.objects.create_user(
                    email=email,
                    username=f"adm_{documento}",
                    password=make_password(password_temp),
                    rol='ADM',
                    is_staff=True,
                    is_active=True
                )
            

                # Crear Persona
                persona = Personas.objects.create(
                    tipo_documento=request.POST['tipo_documento'],
                    documento=documento,
                    nombres=request.POST['nombres'],
                    apellidos=request.POST['apellidos'],
                    sexo=request.POST.get('sexo', ''),
                    direccion=request.POST.get('direccion', '')
                )

                # Crear Administrador
                Administradores.objects.create(
                    usuario=user.username,  # O podrías relacionarlo directamente con el User
                    id_persona=persona
                )

                # Enviar credenciales
                try:
                    send_mail(
                        'Credenciales de acceso - Sistema Escolar',
                        f'''Usuario: {username}
Contraseña temporal: {password_temp}

Por seguridad, cambie su contraseña después del primer ingreso.''',
                        settings.EMAIL_HOST_USER,
                        [email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Error enviando email: {str(e)}")

                messages.success(request, "Administrador registrado exitosamente!")
                return redirect('administrador')

        except ValidationError as e:
            messages.error(request, str(e))
        except Exception as e:
            messages.error(request, f"Error en el registro: {str(e)}")
    
    return render(request, 'formulario_usuario.html')