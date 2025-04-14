# models/__init__.py
from .personas import Personas, Alumnos, Docentes, Administradores, Acudientes, AcudientesAlumnos
from .academicos import Cursos, Asignaturas, Matriculas, AsignarAsignaturasCursos, CursosDocentes
from .otros import Observadores, BancoLogros, Calificaciones, Departamentos, Municipios

# Opcional si agregas más archivos:
# from .relaciones import ...
# from .geografia import ...

__all__ = [
    "Personas", "Alumnos", "Docentes", "Administradores", "Acudientes", "AcudientesAlumnos",
    "Cursos", "Asignaturas", "Matriculas", "AsignarAsignaturasCursos", "CursosDocentes",
    "Observadores", "BancoLogros", "Calificaciones", "Departamentos", "Municipios"
]