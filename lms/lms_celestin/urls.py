from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('conocenos/', views.conocenos, name='conocenos'),
    path('actividades/', views.actividades, name='actividades'),
    path('prematricula/', views.prematricula, name='prematricula'),
    path('contactenos/', views.contactenos, name='contactenos'),
    path('inicio_sesion/', views.inicio_sesion, name='iniciosesion'),
    path('administrador/', views.administrador, name='administrador'),
    path('formulario/', views.formulario, name='formulario'),
    path('observador/', views.observador, name='observador'),
    path('inicio_estudiante/', views.estudiante, name='estudiante')
]
