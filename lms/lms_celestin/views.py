
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
from .models .auth import CustomUser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404


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
    return render(request, 'administradores')

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
            with transaction.atomic():
                documento = request.POST['documento']
                email_acudiente = request.POST['correo_acudiente']
                username = f"est_{documento}"
                password_temp = documento

                # Crear usuario
                user = CustomUser.objects.create_user(
                    email=email_acudiente,
                    username=username,
                    password=make_password(password_temp),
                    rol='EST',
                    is_active=True
                )

                # Persona estudiante
                estudiante_persona = Personas.objects.create(
                    tipo_documento=request.POST['tipo_documento'],
                    documento=documento,
                    nombres=request.POST['nombres'],
                    apellidos=request.POST['apellidos'],
                    fecha_nacimiento=request.POST['fecha_nacimiento'],
                    sexo=request.POST['sexo'],
                    direccion=request.POST['direccion']
                )

                # Alumno
                alumno = Alumnos.objects.create(
                    codigo_estudiante=request.POST['codigo_estudiante'],
                    id_persona=estudiante_persona,
                    usuario=user
                )

                # Persona acudiente
                acudiente_persona = Personas.objects.create(
                    tipo_documento=request.POST['tipo_documento_acudiente'],
                    documento=request.POST['documento_acudiente'],
                    nombres=request.POST['nombre_acudiente'],
                    apellidos='',
                    sexo='',
                    direccion=request.POST['direccion_acudiente']
                )

                # Acudiente
                acudiente = Acudientes.objects.create(
                    correo=email_acudiente,
                    id_persona=acudiente_persona
                )

                # Relación
                AcudientesAlumnos.objects.create(
                    acudiente=acudiente,
                    alumno=alumno
                )

                messages.success(request, "✅ Estudiante registrado correctamente.")
                return redirect('formulario')

        except Exception as e:
            messages.error(request, f"❌ Error al registrar: {str(e)}")

    return render(request, 'formulario_usuario.html')



def registrar_docente(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                documento = request.POST['documento']
                email = request.POST['email']
                username = f"doc_{documento}"
                password_temp = documento

                if CustomUser.objects.filter(email=email).exists():
                    raise ValidationError("Este correo ya está registrado")

                if Personas.objects.filter(documento=documento).exists():
                    raise ValidationError("Este documento ya está registrado")

                user = CustomUser.objects.create_user(
                    email=email,
                    username=username,
                    password=make_password(password_temp),
                    rol='DOC',
                    is_active=True
                )

                persona = Personas.objects.create(
                    tipo_documento=request.POST['tipo_documento'],
                    documento=documento,
                    nombres=request.POST['nombres'],
                    apellidos=request.POST['apellidos'],
                    sexo=request.POST.get('sexo', ''),
                    direccion=request.POST.get('direccion', '')
                )

                docente = Docentes.objects.create(
                    especialidad=request.POST['especialidad'],
                    titulos=request.POST.get('titulos', ''),
                    id_persona=persona,
                    usuario=user
                )

                messages.success(request, "✅ Docente registrado correctamente.")
                return redirect('formulario')

        except Exception as e:
            messages.error(request, f"❌ Error al registrar docente: {str(e)}")

    return render(request, 'formulario_usuario.html')


def registrar_administrador(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                documento = request.POST['documento']
                email = request.POST['email']
                username = f"adm_{documento}"
                password_temp = documento

                if CustomUser.objects.filter(email=email).exists():
                    raise ValidationError("Este correo ya está registrado")

                user = CustomUser.objects.create_user(
                    email=email,
                    username=username,
                    password=make_password(password_temp),
                    rol='ADM',
                    is_staff=True,
                    is_active=True
                )

                persona = Personas.objects.create(
                    tipo_documento=request.POST['tipo_documento'],
                    documento=documento,
                    nombres=request.POST['nombres'],
                    apellidos=request.POST['apellidos'],
                    sexo=request.POST.get('sexo', ''),
                    direccion=request.POST.get('direccion', '')
                )

                Administradores.objects.create(
                    usuario=user,
                    id_persona=persona
                )

                messages.success(request, "✅ Administrador registrado correctamente.")
                return redirect('formulario')

        except Exception as e:
            messages.error(request, f"❌ Error al registrar administrador: {str(e)}")

    return render(request, 'formulario_usuario.html')

def administradores(request):
    usuarios = CustomUser.objects.select_related(
        'alumno', 'docente', 'administrador'
    ).all().order_by('-date_joined')

    usuarios_data = []
    for i, usuario in enumerate(usuarios, start=1):
        data = {
            'id': usuario.id,
            'numero': i,
            'email': usuario.email,
            'rol': usuario.get_rol_display(),
            'estado': 'Activo' if usuario.is_active else 'Inactivo'
        }

        if usuario.rol == 'EST' and hasattr(usuario, 'alumno'):
            persona = usuario.alumno.id_persona
            data.update({
                'nombre': f"{persona.nombres} {persona.apellidos}",
                'documento': persona.documento,
                'tipo_documento': persona.tipo_documento,
                'sexo': persona.sexo,
                'direccion': persona.direccion,
                'fecha_nacimiento': persona.fecha_nacimiento,
                'codigo': usuario.alumno.codigo_estudiante,
            })

        elif usuario.rol == 'DOC' and hasattr(usuario, 'docente'):
            persona = usuario.docente.id_persona
            data.update({
                'nombre': f"{persona.nombres} {persona.apellidos}",
                'documento': persona.documento,
                'tipo_documento': persona.tipo_documento,
                'sexo': persona.sexo,
                'direccion': persona.direccion,
                'especialidad': usuario.docente.especialidad,
                'titulos': usuario.docente.titulos,
            })

        elif usuario.rol == 'ADM' and hasattr(usuario, 'administrador'):
            persona = usuario.administrador.id_persona
            data.update({
                'nombre': f"{persona.nombres} {persona.apellidos}",
                'documento': persona.documento,
                'tipo_documento': persona.tipo_documento,
                'sexo': persona.sexo,
                'direccion': persona.direccion,
            })

        usuarios_data.append(data)

    return render(request, 'administrador.html', {'usuarios': usuarios_data})



def cambiar_estado_usuario(request, user_id):
    if request.method == 'POST':
        try:
            usuario = CustomUser.objects.get(id=user_id)
            activar = request.POST.get('activar', 'false').lower() == 'true'
            
            usuario.is_active = activar
            usuario.save()
            
            return JsonResponse({'success': True})
        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Usuario no encontrado'})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

from django.db import transaction

def eliminar_usuario(request, user_id):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                usuario = CustomUser.objects.get(id=user_id)

                if usuario.rol == 'EST' and hasattr(usuario, 'alumno'):
                    alumno = usuario.alumno
                    persona_estudiante = alumno.id_persona

                    # Obtener todas las relaciones de acudientes con este alumno
                    relaciones = AcudientesAlumnos.objects.filter(alumno=alumno)

                    # Verificamos los acudientes relacionados
                    for relacion in relaciones:
                        acudiente = relacion.acudiente
                        persona_acudiente = acudiente.id_persona

                        # Eliminar la relación
                        relacion.delete()

                        # Verificar si el acudiente tiene más alumnos
                        tiene_mas_alumnos = AcudientesAlumnos.objects.filter(acudiente=acudiente).exists()

                        if not tiene_mas_alumnos:
                            acudiente.delete()
                            persona_acudiente.delete()

                    # Eliminar alumno y su persona
                    alumno.delete()
                    persona_estudiante.delete()

                elif usuario.rol == 'DOC' and hasattr(usuario, 'docente'):
                    docente = usuario.docente
                    persona = docente.id_persona
                    docente.delete()
                    persona.delete()

                elif usuario.rol == 'ADM' and hasattr(usuario, 'administrador'):
                    administrador = usuario.administrador
                    persona = administrador.id_persona
                    administrador.delete()
                    persona.delete()

                usuario.delete()

                return JsonResponse({'success': True})

        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Usuario no encontrado'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Método no permitido'})




def editar_usuario(request, user_id):
    usuario = get_object_or_404(CustomUser, id=user_id)

    if request.method == 'POST':
        try:
            with transaction.atomic():
                if usuario.rol == 'EST' and hasattr(usuario, 'alumno'):
                    alumno = usuario.alumno
                    persona = alumno.id_persona

                    persona.nombres = request.POST['nombres']
                    persona.apellidos = request.POST['apellidos']
                    persona.tipo_documento = request.POST['tipo_documento']
                    persona.documento = request.POST['documento']
                    persona.fecha_nacimiento = request.POST['fecha_nacimiento']
                    persona.sexo = request.POST['sexo']
                    persona.direccion = request.POST['direccion']
                    persona.save()

                    alumno.codigo_estudiante = request.POST['codigo_estudiante']
                    alumno.save()

                    messages.success(request, "✅ Estudiante actualizado correctamente.")

                elif usuario.rol == 'DOC' and hasattr(usuario, 'docente'):
                    docente = usuario.docente
                    persona = docente.id_persona

                    persona.nombres = request.POST['nombres']
                    persona.apellidos = request.POST['apellidos']
                    persona.tipo_documento = request.POST['tipo_documento']
                    persona.documento = request.POST['documento']
                    persona.sexo = request.POST.get('sexo', '')
                    persona.direccion = request.POST.get('direccion', '')
                    persona.save()

                    docente.especialidad = request.POST['especialidad']
                    docente.titulos = request.POST.get('titulos', '')
                    docente.save()

                    usuario.email = request.POST['email']
                    usuario.save()

                    messages.success(request, "✅ Docente actualizado correctamente.")

                elif usuario.rol == 'ADM' and hasattr(usuario, 'administrador'):
                    administrador = usuario.administrador
                    persona = administrador.id_persona

                    persona.nombres = request.POST['nombres']
                    persona.apellidos = request.POST['apellidos']
                    persona.tipo_documento = request.POST['tipo_documento']
                    persona.documento = request.POST['documento']
                    persona.sexo = request.POST.get('sexo', '')
                    persona.direccion = request.POST.get('direccion', '')
                    persona.save()

                    usuario.email = request.POST['email']
                    usuario.save()

                    messages.success(request, "✅ Administrador actualizado correctamente.")

                return redirect('administradores')

        except Exception as e:
            messages.error(request, f"❌ Error al actualizar: {str(e)}")

    # Modo GET: cargar formulario con datos
    datos = {}
    if usuario.rol == 'EST' and hasattr(usuario, 'alumno'):
        alumno = usuario.alumno
        persona = alumno.id_persona
        datos = {
            'nombres': persona.nombres,
            'apellidos': persona.apellidos,
            'tipo_documento': persona.tipo_documento,
            'documento': persona.documento,
            'fecha_nacimiento': persona.fecha_nacimiento,
            'sexo': persona.sexo,
            'direccion': persona.direccion,
            'codigo_estudiante': alumno.codigo_estudiante,
        }
        rol = 'Estudiante'

    elif usuario.rol == 'DOC' and hasattr(usuario, 'docente'):
        docente = usuario.docente
        persona = docente.id_persona
        datos = {
            'nombres': persona.nombres,
            'apellidos': persona.apellidos,
            'tipo_documento': persona.tipo_documento,
            'documento': persona.documento,
            'sexo': persona.sexo,
            'direccion': persona.direccion,
            'especialidad': docente.especialidad,
            'titulos': docente.titulos,
            'email': usuario.email,
        }
        rol = 'Profesor'

    elif usuario.rol == 'ADM' and hasattr(usuario, 'administrador'):
        administrador = usuario.administrador
        persona = administrador.id_persona
        datos = {
            'nombres': persona.nombres,
            'apellidos': persona.apellidos,
            'tipo_documento': persona.tipo_documento,
            'documento': persona.documento,
            'sexo': persona.sexo,
            'direccion': persona.direccion,
            'email': usuario.email,
        }
        rol = 'Administrador'

    else:
        rol = 'Otro'

    return render(request, 'formulario_usuario.html', {
        'modo_edicion': True,
        'usuario_id': usuario.id,
        'rol': rol,
        'datos': datos,
    })
