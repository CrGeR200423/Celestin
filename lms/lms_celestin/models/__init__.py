# models/__init__.py
from .auth import CustomUser
from .personas import Persona, Estudiante, Docentes, Administradores, Acudiente, AcudientesAlumnos,Aplicante, FichaEstudiante, DatosExtraAplicante
from .academicos import Cursos, Asignaturas, Matriculas, AsignarAsignaturasCursos, CursosDocentes
from .otros import Observadores, BancoLogros, Calificaciones, Departamentos, Municipios

# Opcional si agregas más archivos:
# from .relaciones import ...
# from .geografia import ...

__all__ = [
    "CustomUser","Persona", "Estudiante", "Docentes", "Administradores", "Acudiente", "AcudientesAlumnos",
    "Cursos", "Asignaturas", "Matriculas", "AsignarAsignaturasCursos", "CursosDocentes",
    "Observadores", "BancoLogros", "Calificaciones", "Departamentos", "Municipios","Aplicante", "FichaEstudiante",
    "DatosExtraAplicante"
]