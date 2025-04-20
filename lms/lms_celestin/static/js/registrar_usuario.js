// registrar_usuario.js

// Mostrar el formulario según el tipo de usuario seleccionado
function mostrarFormulario() {
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    
    // Ocultar todos los formularios primero
    document.getElementById('formularioEstudiante').style.display = 'none';
    document.getElementById('formularioDocente').style.display = 'none';
    document.getElementById('formularioAdministrador').style.display = 'none';
    
    // Mostrar el formulario correspondiente
    if (tipoUsuario === 'Estudiante') {
        document.getElementById('formularioEstudiante').style.display = 'block';
        inicializarValidacionesEstudiante();
    } else if (tipoUsuario === 'Profesor') {
        document.getElementById('formularioDocente').style.display = 'block';
        document.getElementById('tituloFormulario').textContent = 'Datos del Docente';
        inicializarValidacionesProfesorAdmin();
    } else if (tipoUsuario === 'Administrador') {
        document.getElementById('formularioAdministrador').style.display = 'block';
        document.getElementById('tituloFormulario').textContent = 'Datos del Administrador';
        inicializarValidacionesProfesorAdmin();
    }
}
// ==================== VALIDACIONES ====================
function inicializarValidacionesEstudiante() {
    // Campos requeridos para estudiante
    const camposEstudiante = [
        'primer_nombre_estudiante', 'primer_apellido_estudiante',
        'tipo_documento_estudiante', 'numero_documento_estudiante',
        'fecha_nacimiento_estudiante', 'nombre_padre_tutor1',
        'tipo_documento_padre', 'numero_documento_padre',
        'telefono_padre', 'correo_padre', 'direccion_estudiante'
    ];

    camposEstudiante.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('blur', () => validarCampo(campoId));
        }
    });

    // Validaciones específicas
    document.getElementById('numero_documento_estudiante').addEventListener('input', validarSoloNumeros);
    document.getElementById('numero_documento_padre').addEventListener('input', validarSoloNumeros);
    document.getElementById('telefono_padre').addEventListener('input', validarTelefono);
    document.getElementById('correo_padre').addEventListener('input', validarCorreo);
}

function inicializarValidacionesProfesorAdmin() {
    // Campos requeridos para profesor/administrador
    const camposProfesorAdmin = [
        'primer_nombre', 'primer_apellido',
        'tipo_documento', 'numero_documento',
        'direccion', 'correo', 'telefono'
    ];

    camposProfesorAdmin.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('blur', () => validarCampo(campoId));
        }
    });

    // Validaciones específicas
    document.getElementById('numero_documento').addEventListener('input', validarSoloNumeros);
    document.getElementById('telefono').addEventListener('input', validarTelefono);
    document.getElementById('correo').addEventListener('input', validarCorreo);
}

// Funciones de validación
function validarCampo(campoId) {
    const campo = document.getElementById(campoId);
    const error = document.getElementById(`error-${campoId}`);
    
    if (!campo.value.trim() && campo.required) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validarSoloNumeros(e) {
    const value = e.target.value;
    const errorId = `error-${e.target.id}`;
    const errorElement = document.getElementById(errorId);
    
    if (!/^\d*$/.test(value)) {
        errorElement.textContent = 'Solo se permiten números';
        errorElement.style.display = 'block';
        e.target.value = value.replace(/[^\d]/g, '');
    } else {
        errorElement.style.display = 'none';
    }
}

function validarTelefono(e) {
    const value = e.target.value;
    const errorId = `error-${e.target.id}`;
    const errorElement = document.getElementById(errorId);
    
    if (value.length !== 10 || !/^\d+$/.test(value)) {
        errorElement.textContent = 'Debe tener 10 dígitos numéricos';
        errorElement.style.display = 'block';
        return false;
    }
    errorElement.style.display = 'none';
    return true;
}

function validarCorreo(e) {
    const value = e.target.value;
    const errorId = `error-${e.target.id}`;
    const errorElement = document.getElementById(errorId);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regex.test(value)) {
        errorElement.textContent = 'Ingrese un correo válido';
        errorElement.style.display = 'block';
        return false;
    }
    errorElement.style.display = 'none';
    return true;
}

// ==================== ENVÍO DEL FORMULARIO ====================
async function registrarUsuario(tipo) {
    // Validar tipo de usuario
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    if (!tipoUsuario) {
        document.getElementById('error-tipoUsuario').style.display = 'block';
        return;
    }

    // Validar campos según el tipo
    let formularioValido = true;
    if (tipoUsuario === 'Estudiante') {
        formularioValido = validarFormularioEstudiante();
    } else {
        formularioValido = validarFormularioProfesorAdmin();
    }

    if (!formularioValido) {
        alert('Por favor complete todos los campos requeridos correctamente.');
        return;
    }

    // Enviar datos
    const formId = tipoUsuario === 'Estudiante' ? 'formEstudiante' : 'formProfesorAdmin';
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const url = tipoUsuario === 'Estudiante' ? '/registrar/estudiante/' : '/registrar/docente/';

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': form.querySelector('[name=csrfmiddlewaretoken]').value,
            },
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                window.location.href = '/administrador/'; // Redirección exitosa
            } else {
                alert(result.message || 'Error al registrar');
            }
        } else {
            alert('Error en el servidor');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Funciones auxiliares de validación completa
function validarFormularioEstudiante() {
    let valido = true;
    const camposRequeridos = [
        'primer_nombre_estudiante', 'primer_apellido_estudiante',
        'tipo_documento_estudiante', 'numero_documento_estudiante',
        'fecha_nacimiento_estudiante', 'nombre_padre_tutor1',
        'tipo_documento_padre', 'numero_documento_padre',
        'telefono_padre', 'correo_padre', 'direccion_estudiante'
    ];

    camposRequeridos.forEach(campoId => {
        if (!validarCampo(campoId)) valido = false;
    });

    return valido;
}

function validarFormularioProfesorAdmin() {
    let valido = true;
    const camposRequeridos = [
        'primer_nombre', 'primer_apellido',
        'tipo_documento', 'numero_documento',
        'direccion', 'correo', 'telefono'
    ];

    camposRequeridos.forEach(campoId => {
        if (!validarCampo(campoId)) valido = false;
    });

    return valido;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tipoUsuario').addEventListener('change', mostrarFormulario);
});

