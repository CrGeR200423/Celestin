from django.urls import path
from . import views

urlpatterns = [
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
    path('registrar/estudiante/', views.registrar_estudiante, name='registrar_estudiante'),
    path('registrar/docente/', views.registrar_docente, name='registrar_docente'),
    path('registrar/administrador/', views.registrar_administrador, name='registrar_administrador'),
    path('cambiar-estado-usuario/<int:user_id>/', views.cambiar_estado_usuario, name='cambiar_estado_usuario'),
    path('eliminar-usuario/<int:user_id>/', views.eliminar_usuario, name='eliminar_usuario'),
    path('administradores/', views.administradores, name='administradores'),
    path('editar-usuario/<int:user_id>/', views.editar_usuario, name='editar_usuario'),
]
