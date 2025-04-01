from django.shortcuts import render

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

