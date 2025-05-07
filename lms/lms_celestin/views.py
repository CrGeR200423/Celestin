
from django.shortcuts import render, redirect
from .models import Persona,Docentes,Administradores,Estudiante, Acudiente, AcudientesAlumnos, Aplicante, FichaEstudiante
from django.contrib import messages
from django.contrib.auth.models import User  # Importar el modelo User de Django
from django.contrib.auth.hashers import make_password  # Para encriptar contraseñas
from django.core.mail import send_mail  # Para enviar credenciales por email
from django.conf import settings
from django.db import IntegrityError, transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models .auth import CustomUser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
import json
import string
from django.utils.crypto import get_random_string

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

                # Validar duplicados
                if CustomUser.objects.filter(documento=documento).exists():
                    raise ValidationError("Este documento ya está registrado.")
                if Persona.objects.filter(documento=documento).exists():
                    raise ValidationError("Este documento ya está registrado.")
                if CustomUser.objects.filter(email=email_acudiente).exists():
                    raise ValidationError("Este correo ya está registrado.")

                username = f"est_{documento}"
                password_temp = get_random_string(8, string.ascii_letters + string.digits)

                # Crear usuario
                user = CustomUser.objects.create_user(
                    documento=documento,
                    email=email_acudiente,
                    username=username,
                    password=make_password(password_temp),
                    rol='EST',
                    is_active=True
                )

                # Persona estudiante
                estudiante_persona = Persona.objects.create(
                    tipo_documento=request.POST['tipo_documento'],
                    documento=documento,
                    nombres=request.POST['nombres'],
                    apellidos=request.POST['apellidos'],
                    fecha_nacimiento=request.POST['fecha_nacimiento'],
                    sexo=request.POST['sexo'],
                    direccion=request.POST['direccion']
                )

                # Alumno
                alumno = Estudiante.objects.create(
                    codigo_estudiante=request.POST['codigo_estudiante'],
                    id_persona=estudiante_persona,
                    usuario=user
                )

                # Persona acudiente
                acudiente_persona = Persona.objects.create(
                    tipo_documento=request.POST['tipo_documento_acudiente'],
                    documento=request.POST['documento_acudiente'],
                    nombres=request.POST['nombre_acudiente'],
                    apellidos='',
                    sexo='',
                    direccion=request.POST['direccion_acudiente']
                )

                # Acudiente
                acudiente = Acudiente.objects.create(
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

        except ValidationError as e:
            messages.error(request, f"❌ Error de validación: {str(e)}")
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
                caracteres = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
                password_temp = get_random_string(8, caracteres)

                if CustomUser.objects.filter(email=email).exists():
                    raise ValidationError("Este correo ya está registrado")

                if Persona.objects.filter(documento=documento).exists():
                    raise ValidationError("Este documento ya está registrado")

                user = CustomUser.objects.create_user(
                    documento=documento,
                    email=email,
                    username=username,
                    password=make_password(password_temp),
                    rol='DOC',
                    is_active=True
                )

                persona = Persona.objects.create(
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
                caracteres = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
                password_temp = get_random_string(8, caracteres)

                if CustomUser.objects.filter(email=email).exists():
                    raise ValidationError("Este correo ya está registrado")

                user = CustomUser.objects.create_user(
                    documento=documento,
                    email=email,
                    username=username,
                    password=make_password(password_temp),
                    rol='ADM',
                    is_staff=True,
                    is_active=True
                )

                persona = Persona.objects.create(
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
        'estudiante', 'docente', 'administrador'
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

        if usuario.rol == 'EST' and hasattr(usuario, 'estudiante'):
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


@csrf_exempt
def iniciar_sesion(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            documento = data.get('documento')
            password = data.get('password')
            user_type = data.get('userType')

            if not documento or not password or not user_type:
                return JsonResponse({
                    'success': False,'message': 'Documento, contraseña y tipo de usuario son requeridos.'}, status=400)

            # Autenticar al usuario
            user = authenticate(request, username=documento, password=password)
            
            if user is None:
                return JsonResponse({
                    'success': False,'message': 'Usuario o contraseña incorrectos.'}, status=401)

            # Verificar el rol del usuario
            role_mapping = {
                'administrador': 'ADM',
                'profesor': 'DOC',
                'estudiante': 'EST'
            }
            
            expected_role = role_mapping.get(user_type)
            
            if user.rol != expected_role:
                return JsonResponse({
                    'success': False,'message': 'El rol seleccionado no coincide con el usuario.'}, status=403)

            login(request, user)
            return JsonResponse({
                'success': True,'message': 'Autenticación exitosa.'
            })

        except Exception as e:
            return JsonResponse({
                'success': False,'message': f'Error en el servidor: {str(e)}'}, status=500)
    
    return JsonResponse({
        'success': False,'message': 'Método no permitido.'}, status=405)

@csrf_exempt
def prematricula_estudiante(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validar campos requeridos
            campos_requeridos = [
                'primer_nombre', 'primer_apellido', 'tipo_documento', 
                'identificacion', 'fecha_nacimiento', 'sexo', 'direccion',
                'municipio', 'telefono', 'grado_solicitado', 'estado',
                'nombre_acudiente', 'telefono_acudiente', 'contacto_emergencia',
                'telefono_emergencia'
            ]
            
            for campo in campos_requeridos:
                if campo not in data or not data[campo]:
                    return JsonResponse({
                        'success': False,'message': f'El campo {campo} es requerido'}, status=400)
            
            # Validar duplicados
            if Aplicante.objects.filter(documento=data['identificacion']).exists():
                return JsonResponse({
                    'success': False,'message': 'Ya existe un aplicante con este número de documento'}, status=400)
            
            # Convertir valores de radio buttons a booleanos
            data['familias_accion'] = data.get('familias_accion', 'NO') == 'SI'
            data['discapacidad'] = data.get('discapacidad', 'NO') == 'SI'
            
            # Crear el aplicante
            aplicante = Aplicante.objects.create(
                primer_nombre=data['primer_nombre'],
                segundo_nombre=data.get('segundo_nombre', ''),
                primer_apellido=data['primer_apellido'],
                segundo_apellido=data.get('segundo_apellido', ''),
                tipo_documento=data['tipo_documento'],
                documento=data['identificacion'],
                fecha_nacimiento=data['fecha_nacimiento'],
                sexo=data['sexo'],
                direccion=data['direccion'],
                municipio=data['municipio'],
                barrio=data['barrio'],
                telefono=data['telefono'],
                grado_solicitado=data['grado_solicitado'],
                estado=data['estado'],
                nombre_acudiente=data['nombre_acudiente'],
                telefono_acudiente=data['telefono_acudiente'],
                contacto_emergencia=data['contacto_emergencia'],
                telefono_emergencia=data['telefono_emergencia'],
                familias_accion=data['familias_accion'],
                discapacidad=data['discapacidad'],
                tipo_discapacidad=data.get('tipo_discapacidad', '')
            )
            
            return JsonResponse({
                'success': True,'message': 'Prematrícula registrada. En espera de aprobación.','aplicante_id': aplicante.id
            })
            
        except IntegrityError:
            return JsonResponse({
                'success': False,'message': 'Ya existe un aplicante con este número de documento'}, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,'message': f'Error al procesar la solicitud: {str(e)}'}, status=400)
    
    return JsonResponse({
        'success': False,'message': 'Método no permitido'}, status=405)

@csrf_exempt
def aceptar_aplicante(request, aplicante_id):
    try:
        aplicante = Aplicante.objects.get(id=aplicante_id)

        # Validar si el aplicante ya ha sido aceptado
        if Estudiante.objects.filter(id_persona__documento=aplicante.documento).exists():
            return JsonResponse({
                'success': False,'message': 'Este aplicante ya ha sido aceptado.'}, status=400)

        # Crear persona del estudiante
        persona_est = Persona.objects.create(
            nombres=f"{aplicante.primer_nombre} {aplicante.segundo_nombre}",
            apellidos=f"{aplicante.primer_apellido} {aplicante.segundo_apellido}",
            tipo_documento=aplicante.tipo_documento,
            documento=aplicante.documento,
            fecha_nacimiento=aplicante.fecha_nacimiento,
            sexo=aplicante.sexo,
            direccion=aplicante.direccion
        )

        # Crear alumno
        alumno = Estudiante.objects.create(
            codigo_estudiante=aplicante.codigo_estudiante,
            id_persona=persona_est
        )

        # Crear ficha estudiante
        FichaEstudiante.objects.create(
            alumno=alumno,
            estado="ACTIVO"
        )

        # Crear acudiente principal
        acudiente_persona = Persona.objects.create(
            nombres=aplicante.nombre_acudiente,
            apellidos="",
            tipo_documento="CC",
            documento=f"ACUD_{aplicante.documento}",
            direccion=aplicante.direccion
        )

        acudiente = Acudiente.objects.create(
            correo=aplicante.correo_acudiente,
            telefono=aplicante.telefono_acudiente,
            parentesco="TUTOR",
            id_persona=acudiente_persona
        )

        AcudientesAlumnos.objects.create(
            alumno=alumno,
            acudiente=acudiente
        )

        # Crear usuario para el estudiante
        username = f"est_{aplicante.documento}"
        password_temp = get_random_string(8)

        user = CustomUser.objects.create_user(
            documento=aplicante.documento,
            email=aplicante.correo_acudiente,
            username=username,
            password=make_password(password_temp),
            rol='EST',
            is_active=True
        )

        alumno.usuario = user
        alumno.save()

        # Eliminar aplicante
        aplicante.delete()

        return JsonResponse({
            'success': True,
            'message': 'Aplicante aceptado correctamente.',
            'password': password_temp
        })

    except Aplicante.DoesNotExist:
        return JsonResponse({
            'success': False,'message': 'Aplicante no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,'message': f'Error al aceptar aplicante: {str(e)}'}, status=400)

@csrf_exempt
def rechazar_aplicante(request, aplicante_id):
    try:
        aplicante = Aplicante.objects.get(id=aplicante_id)
        aplicante.delete()
        return JsonResponse({'success': True, 'message': 'Aplicante eliminado correctamente'})
    except Aplicante.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Aplicante no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)



@csrf_exempt
def get_aplicante(request, aplicante_id):
    try:
        aplicante = Aplicante.objects.get(id=aplicante_id)
        data = {
            'id': aplicante.id,
            'nombre_completo': f"{aplicante.nombres} {aplicante.apellidos}",
            'documento': aplicante.documento,
            'fecha_nacimiento': aplicante.fecha_nacimiento.strftime('%Y-%m-%d') if aplicante.fecha_nacimiento else None,
            'sexo': aplicante.sexo,
            'direccion': aplicante.direccion,
            'codigo_estudiante': aplicante.codigo_estudiante,
            'acudientes': [
                {
                    'parentesco': 'PADRE',
                    'nombre': aplicante.nombre_padre,
                    'telefono': aplicante.telefono_padre,
                    'correo': ''
                },
                {
                    'parentesco': 'MADRE',
                    'nombre': aplicante.nombre_madre,
                    'telefono': aplicante.telefono_madre,
                    'correo': ''
                },
                {
                    'parentesco': 'TUTOR',
                    'nombre': aplicante.nombre_acudiente,
                    'telefono': aplicante.telefono_acudiente,
                    'correo': aplicante.correo_acudiente
                }
            ]
        }

        return JsonResponse({'success': True, 'aplicante': data})

    except Aplicante.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Aplicante no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)

@csrf_exempt
def listar_postulados(request):
    try:
        aplicantes = Aplicante.objects.all().order_by('-id')
        data = []

        for aplicante in aplicantes:
            data.append({
                'id': aplicante.id,
                'nombre_completo': f"{aplicante.primer_nombre} {aplicante.segundo_nombre} {aplicante.primer_apellido} {aplicante.segundo_apellido}",
                'documento': aplicante.documento,
                'fecha_nacimiento': aplicante.fecha_nacimiento.strftime('%Y-%m-%d') if aplicante.fecha_nacimiento else '',
                'sexo': aplicante.sexo,
                'direccion': aplicante.direccion,
                'telefono': aplicante.telefono,
                'grado_ingresa': aplicante.grado_ingresa,
                'estatus': aplicante.estatus,
            })

        return JsonResponse({
            'success': True,'postulados': data
        })

    except Exception as e:
        return JsonResponse({
            'success': False,'message': f'Error al listar postulados: {str(e)}'}, status=400)
