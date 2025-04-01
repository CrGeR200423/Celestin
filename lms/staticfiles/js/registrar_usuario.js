// Función para mostrar el formulario correspondiente
function mostrarFormulario() {
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    document.getElementById("formularioEstudiante").style.display = "none";
    document.getElementById("formularioProfesorAdmin").style.display = "none";

    if (tipoUsuario === "Estudiante") {
        document.getElementById("formularioEstudiante").style.display = "block";
        inicializarValidacionEstudiante();
    } else if (tipoUsuario === "Profesor" || tipoUsuario === "Administrador") {
        document.getElementById("formularioProfesorAdmin").style.display = "block";
        document.getElementById("tituloFormulario").textContent = 
            tipoUsuario === "Profesor" ? "Datos del Profesor" : "Datos del Administrador";
        inicializarValidacionProfesorAdmin();
    }
}

// Validaciones para formulario de estudiante
function inicializarValidacionEstudiante() {
    const campos = {
        'primer_nombre_estudiante': validarCampo,
        'primer_apellido_estudiante': validarCampo,
        'numero_documento_estudiante': validarDocumento,
        'fecha_nacimiento_estudiante': validarCampo,
        'edad_estudiante': validarEdad,
        'grado_estudiante': validarCampo,
        'nombre_padre_tutor1': validarCampo,
        'numero_documento_padre': validarDocumento,
        'telefono_padre': validarTelefono,
        'correo_padre': validarCorreo,
        'direccion_estudiante': validarCampo
    };

    Object.entries(campos).forEach(([id, validacion]) => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('input', () => validacion(campo));
            campo.addEventListener('blur', () => validacion(campo));
        }
    });
}

// Validaciones para formulario de profesor/administrador
function inicializarValidacionProfesorAdmin() {
    const campos = {
        'primer_nombre': validarCampo,
        'primer_apellido': validarCampo,
        'tipo_documento': validarCampo,
        'numero_documento': validarDocumento,
        'direccion': validarCampo,
        'correo': validarCorreo,
        'telefono': validarTelefono
    };

    Object.entries(campos).forEach(([id, validacion]) => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('input', () => validacion(campo));
            campo.addEventListener('blur', () => validacion(campo));
        }
    });
}

// Funciones de validación
function validarCampo(campo) {
    const errorId = `error-${campo.id}`;
    const mensajeError = document.getElementById(errorId);
    
    if (!mensajeError) return true;
    
    if (campo.required && campo.value.trim() === '') {
        mensajeError.style.display = 'block';
        return false;
    }
    mensajeError.style.display = 'none';
    return true;
}

function validarTelefono(campo) {
    const errorId = `error-${campo.id}`;
    const mensajeError = document.getElementById(errorId);
    
    if (!/^\d*$/.test(campo.value)) {
        mensajeError.textContent = 'Solo se permiten números';
        mensajeError.style.display = 'block';
        return false;
    } else if (campo.value.length !== 10) {
        mensajeError.textContent = 'Debe tener 10 dígitos';
        mensajeError.style.display = 'block';
        return false;
    }
    return validarCampo(campo);
}

function validarEdad(campo) {
    const errorId = `error-${campo.id}`;
    const mensajeError = document.getElementById(errorId);
    
    if (!/^\d*$/.test(campo.value)) {
        mensajeError.textContent = 'Solo se permiten números';
        mensajeError.style.display = 'block';
        return false;
    } else if (campo.value < 1 || campo.value > 99) {
        mensajeError.textContent = 'Edad inválida (1-99)';
        mensajeError.style.display = 'block';
        return false;
    }
    return validarCampo(campo);
}

function validarDocumento(campo) {
    const errorId = `error-${campo.id}`;
    const mensajeError = document.getElementById(errorId);
    
    if (!/^\d*$/.test(campo.value)) {
        mensajeError.textContent = 'Solo se permiten números';
        mensajeError.style.display = 'block';
        return false;
    }
    return validarCampo(campo);
}

function validarCorreo(campo) {
    const errorId = `error-${campo.id}`;
    const mensajeError = document.getElementById(errorId);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regex.test(campo.value)) {
        mensajeError.textContent = 'Ingrese un correo válido';
        mensajeError.style.display = 'block';
        return false;
    }
    return validarCampo(campo);
}

// Registrar/Actualizar usuario
function registrarUsuario(tipo = null) {
    // Obtener el tipo si no se proporcionó
    tipo = tipo || document.getElementById("tipoUsuario").value;
    
    if (!tipo) {
        alert("Por favor seleccione un tipo de usuario");
        document.getElementById("error-tipoUsuario").style.display = 'block';
        return;
    }

    // Validar campos según el tipo
    let valido = true;
    const campos = tipo === "Estudiante" ? 
        ['primer_nombre_estudiante', 'primer_apellido_estudiante', 'numero_documento_estudiante', 
         'fecha_nacimiento_estudiante', 'edad_estudiante', 'grado_estudiante', 'nombre_padre_tutor1',
         'numero_documento_padre', 'telefono_padre', 'correo_padre', 'direccion_estudiante'] :
        ['primer_nombre', 'primer_apellido', 'tipo_documento', 'numero_documento', 
         'direccion', 'correo', 'telefono'];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            const validator = id.includes('telefono') ? validarTelefono : 
                            id.includes('correo') ? validarCorreo :
                            id.includes('edad') ? validarEdad : 
                            id.includes('documento') ? validarDocumento : 
                            validarCampo;
            if (!validator(campo)) valido = false;
        }
    });

    if (!valido) {
        alert("Por favor complete correctamente todos los campos obligatorios");
        return;
    }

    // Crear objeto usuario
    const usuario = {
        tipo,
        datos: {},
        estado: "Habilitado",
        fechaRegistro: new Date().toISOString()
    };

    if (tipo === "Estudiante") {
        usuario.datos = {
            primerNombre: document.getElementById("primer_nombre_estudiante").value.trim(),
            segundoNombre: document.getElementById("segundo_nombre_estudiante").value.trim(),
            primerApellido: document.getElementById("primer_apellido_estudiante").value.trim(),
            segundoApellido: document.getElementById("segundo_apellido_estudiante").value.trim(),
            tipoDocumento: document.getElementById("tipo_documento_estudiante").value,
            numeroDocumento: document.getElementById("numero_documento_estudiante").value,
            fechaNacimiento: document.getElementById("fecha_nacimiento_estudiante").value,
            edad: document.getElementById("edad_estudiante").value,
            grado: document.getElementById("grado_estudiante").value,
            cicloEscolar: document.getElementById("ciclo_escolar_estudiante").value,
            padreTutor1: document.getElementById("nombre_padre_tutor1").value.trim(),
            tipoDocumentoPadre: document.getElementById("tipo_documento_padre").value,
            numeroDocumentoPadre: document.getElementById("numero_documento_padre").value,
            telefonoPadre: document.getElementById("telefono_padre").value,
            correoPadre: document.getElementById("correo_padre").value,
            direccion: document.getElementById("direccion_estudiante").value.trim(),
            condicionMedica: document.getElementById("condicion_medica_estudiante").value,
            detalleCondicion: document.getElementById("detalle_condicion_estudiante").value
        };
    } else {
        usuario.datos = {
            primerNombre: document.getElementById("primer_nombre").value.trim(),
            segundoNombre: document.getElementById("segundo_nombre").value.trim(),
            primerApellido: document.getElementById("primer_apellido").value.trim(),
            segundoApellido: document.getElementById("segundo_apellido").value.trim(),
            tipoDocumento: document.getElementById("tipo_documento").value,
            numeroDocumento: document.getElementById("numero_documento").value,
            titulos: document.getElementById("titulos").value,
            direccion: document.getElementById("direccion").value.trim(),
            correo: document.getElementById("correo").value,
            telefono: document.getElementById("telefono").value
        };
    }

    // Guardar en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarioEditando = JSON.parse(localStorage.getItem("usuarioAModificar"));
    
    if (usuarioEditando && usuarioEditando.index !== undefined) {
        // Actualizar usuario existente
        usuarios[usuarioEditando.index] = usuario;
        localStorage.removeItem("usuarioAModificar");
        alert("Usuario actualizado correctamente");
    } else {
        // Agregar nuevo usuario
        usuarios.push(usuario);
        alert("Usuario registrado correctamente");
    }
    
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    window.location.href = "administrador.html";
}

// Cargar usuario existente para edición
function cargarUsuarioExistente() {
    const usuarioEditando = JSON.parse(localStorage.getItem("usuarioAModificar"));
    if (usuarioEditando) {
        const { usuario, index } = usuarioEditando;
        document.getElementById("tipoUsuario").value = usuario.tipo;
        mostrarFormulario();
        
        // Llenar formulario con datos existentes
        if (usuario.tipo === "Estudiante") {
            Object.entries(usuario.datos).forEach(([key, value]) => {
                const elemento = document.getElementById(key);
                if (elemento) elemento.value = value || '';
            });
        } else {
            Object.entries(usuario.datos).forEach(([key, value]) => {
                const elemento = document.getElementById(key);
                if (elemento) elemento.value = value || '';
            });
        }
    }
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    const tipoUsuario = document.getElementById("tipoUsuario");
    if (tipoUsuario) tipoUsuario.addEventListener("change", mostrarFormulario);
    cargarUsuarioExistente();
});