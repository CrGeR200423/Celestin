from django.urls import path
from . import views

urlpatterns = [
    # Páginas básicas
    path('', views.home, name='home'),
    path('conocenos/', views.conocenos, name='conocenos'),
    path('actividades/', views.actividades, name='actividades'),
    path('prematricula/', views.prematricula, name='prematricula'),
    path('contactenos/', views.contactenos, name='contactenos'),
    path('inicio_sesion/', views.inicio_sesion, name='inicio_sesion'),
    path('administrador/', views.administrador, name='administrador'),
    path('formulario/', views.formulario, name='formulario'),
    path('observador/', views.observador, name='observador'),
    path('estudiante/', views.estudiante, name='estudiante'),
    path('himno/', views.himno, name='himno'),
    path('historia/', views.historia, name='historia'),

    # Gestión de usuarios
    path('registrar/estudiante/', views.registrar_estudiante, name='registrar_estudiante'),
    path('registrar/docente/', views.registrar_docente, name='registrar_docente'),
    path('registrar/administrador/', views.registrar_administrador, name='registrar_administrador'),
    path('usuarios/cambiar-estado/<int:user_id>/', views.cambiar_estado_usuario, name='cambiar_estado_usuario'),
    path('usuarios/eliminar/<int:user_id>/', views.eliminar_usuario, name='eliminar_usuario'),
    path('usuarios/editar/<int:user_id>/', views.editar_usuario, name='editar_usuario'),
    path('usuarios/', views.administradores, name='administradores'),

    # API para prematrículas (POST)
    path('api/prematricula/', views.prematricula_estudiante, name='prematricula_estudiante'),

    # API para gestión de aplicantes (GET/POST)
    path('api/aplicantes/', views.listar_postulados, name='listar_postulados'),
    path('api/aplicantes/<int:aplicante_id>/', views.get_aplicante, name='get_aplicante'),
    path('api/aplicantes/<int:aplicante_id>/aceptar/', views.aceptar_aplicante, name='aceptar_aplicante'),
    path('api/aplicantes/<int:aplicante_id>/rechazar/', views.rechazar_aplicante, name='rechazar_aplicante'),
]