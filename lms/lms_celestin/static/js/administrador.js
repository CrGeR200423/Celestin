document.addEventListener("DOMContentLoaded", function() {
    // Función para mostrar/ocultar el menú en móviles
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    // Navegación entre secciones
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute("href").substring(1);
            
            // Ocultar todas las secciones
            document.querySelectorAll("section").forEach(section => {
                section.classList.remove("active");
            });
            
            // Mostrar la sección seleccionada
            document.getElementById(targetSection).classList.add("active");
            
            // Cerrar menú en móviles
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Mostrar la primera sección por defecto
    document.querySelector("section").classList.add("active");

    // Inicializar eventos para estudiantes
    document.getElementById('btnNuevoEstudiante')?.addEventListener('click', function() {
        document.getElementById('modal-nuevo-estudiante').style.display = 'block';
    });

    // Inicializar eventos para profesores
    document.getElementById('btnNuevoProfesor')?.addEventListener('click', function() {
        document.getElementById('modal-nuevo-profesor').style.display = 'block';
    });

    // Eventos para búsqueda y filtros de estudiantes
    document.getElementById('buscarEstudiante')?.addEventListener('input', function() {
        filtrarEstudiantes();
    });

    document.getElementById('filtroGrado')?.addEventListener('change', function() {
        filtrarEstudiantes();
    });

    document.getElementById('filtroEstado')?.addEventListener('change', function() {
        filtrarEstudiantes();
    });

    // Eventos para búsqueda y filtros de profesores
    document.getElementById('buscarProfesor')?.addEventListener('input', function() {
        filtrarProfesores();
    });

    document.getElementById('filtroEspecialidad')?.addEventListener('change', function() {
        filtrarProfesores();
    });

    // Inicializar gestión de curs
    cargarEstudiantesIniciales();
});

// Función mejorada para cerrar sesión
function cerrarSesion() {
    const confirmar = confirm("¿Estás seguro de que quieres cerrar sesión?");
    
    if (confirmar) {
        // Aquí podrías añadir lógica para limpiar la sesión
        console.log("Cerrando sesión...");
        window.location.href = "home.html";
    } else {
        console.log("Cierre de sesión cancelado");
    }
    
    return confirmar;
}

// --------------------------------------------------
// Gestión de Estudiantes
// --------------------------------------------------

    // Actualizar contador

// --------------------------------------------------
// Gestión de Profesores
// --------------------------------------------------



// --------------------------------------------------
// Gestión de Cursos (existente)
// --------------------------------------------------



// --------------------------------------------------
// Función para cambiar el estado de prematrículas
// --------------------------------------------------

function togglePrematriculas() {
    const habilitado = document.getElementById('togglePrematriculas').checked;
    localStorage.setItem('prematriculasHabilitadas', habilitado);
    actualizarTextoEstado(habilitado);
    
    // Enviar al servidor (ejemplo con fetch)
    fetch('/api/toggle-prematriculas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habilitado })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Estado actualizado:', data);
        // Disparar evento para actualizar otras pestañas
        const event = new Event('prematriculaChanged');
        window.dispatchEvent(event);
        // Actualizar en esta pestaña
        actualizarMenuPrematriculas();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function actualizarTextoEstado(habilitado) {
    document.getElementById('estadoPrematriculas').textContent = 
        habilitado ? 'Habilitado' : 'Deshabilitado';
}

function actualizarMenuPrematriculas() {
    // Lógica para actualizar el menú según el estado
    console.log('Menú de prematrículas actualizado');
}

// --------------------------------------------------
// Función para mostrar notificaciones
// --------------------------------------------------

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;
    notificacion.className = 'notificacion ' + tipo;
    notificacion.style.display = 'block';
    
    setTimeout(() => {
        notificacion.style.display = 'none';
    }, 3000);
}