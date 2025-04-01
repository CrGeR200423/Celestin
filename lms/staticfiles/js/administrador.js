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
});

// Función mejorada para cerrar sesión
function cerrarSesion() {
    const confirmar = confirm("¿Estás seguro de que quieres cerrar sesión?");
    
    if (confirmar) {
        // Aquí podrías añadir lógica para limpiar la sesión
        console.log("Cerrando sesión...");
        window.location.href = "";
    } else {
        console.log("Cierre de sesión cancelado");
    }
    
    return confirmar;
}

// --------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo (en un caso real, estos vendrían de una API)
    const cursos = [
        { id: 1, nombre: "Matemáticas Básicas", docente: "Juan Pérez", estudiantes: [101, 102, 103] },
        { id: 2, nombre: "Ciencias Naturales", docente: "María Gómez", estudiantes: [101, 104] },
        { id: 3, nombre: "Literatura", docente: "No asignado", estudiantes: [102, 103, 105] }
    ];

    const estudiantes = [
        { id: 101, nombre: "Carlos Sánchez", documento: "1001234567" },
        { id: 102, nombre: "Ana Rodríguez", documento: "1002345678" },
        { id: 103, nombre: "Luis Martínez", documento: "1003456789" },
        { id: 104, nombre: "Sofía García", documento: "1004567890" },
        { id: 105, nombre: "Pedro López", documento: "1005678901" }
    ];

    const docentes = [
        { id: 201, nombre: "Juan Pérez", especialidad: "Matemáticas" },
        { id: 202, nombre: "María Gómez", especialidad: "Ciencias" },
        { id: 203, nombre: "Carlos Ruiz", especialidad: "Literatura" },
        { id: 204, nombre: "Laura Díaz", especialidad: "Matemáticas" }
    ];

    // Variables para seguimiento
    let cursoSeleccionado = null;
    let docenteSeleccionado = null;

    // Elementos del DOM
    const listaCursos = document.getElementById('lista-cursos');
    const estudiantesCursoDiv = document.getElementById('estudiantes-curso');
    const nombreCursoSeleccionado = document.getElementById('nombre-curso-seleccionado');
    const listaEstudiantes = document.getElementById('lista-estudiantes');
    const asignarDocenteBtn = document.getElementById('asignar-docente-btn');
    const modalDocente = document.getElementById('modal-docente');
    const nombreCursoModal = document.getElementById('nombre-curso-modal');
    const listaDocentes = document.getElementById('lista-docentes');
    const confirmarDocenteBtn = document.getElementById('confirmar-docente');
    const buscarDocenteInput = document.getElementById('buscar-docente');
    const cerrarModal = document.querySelector('.cerrar-modal');

    // Cargar lista de cursos
    function cargarCursos() {
        listaCursos.innerHTML = '';
        cursos.forEach(curso => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>${curso.docente}</td>
                <td><button class="btn-ver-estudiantes" data-id="${curso.id}">Ver Estudiantes</button></td>
            `;
            listaCursos.appendChild(fila);
        });

        // Agregar event listeners a los botones
        document.querySelectorAll('.btn-ver-estudiantes').forEach(btn => {
            btn.addEventListener('click', function() {
                const cursoId = parseInt(this.getAttribute('data-id'));
                mostrarEstudiantes(cursoId);
            });
        });
    }

    // Mostrar estudiantes de un curso
    function mostrarEstudiantes(cursoId) {
        cursoSeleccionado = cursos.find(c => c.id === cursoId);
        if (!cursoSeleccionado) return;

        nombreCursoSeleccionado.textContent = cursoSeleccionado.nombre;
        listaEstudiantes.innerHTML = '';

        cursoSeleccionado.estudiantes.forEach(estId => {
            const estudiante = estudiantes.find(e => e.id === estId);
            if (estudiante) {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${estudiante.id}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.documento}</td>
                `;
                listaEstudiantes.appendChild(fila);
            }
        });

        estudiantesCursoDiv.style.display = 'block';
    }

    // Mostrar modal para asignar docente
    asignarDocenteBtn.addEventListener('click', function() {
        if (!cursoSeleccionado) return;
        
        nombreCursoModal.textContent = cursoSeleccionado.nombre;
        cargarDocentes();
        modalDocente.style.display = 'block';
    });

    // Cargar lista de docentes en el modal
    function cargarDocentes(busqueda = '') {
        listaDocentes.innerHTML = '';
        const busquedaLower = busqueda.toLowerCase();
        
        docentes.filter(docente => 
            docente.nombre.toLowerCase().includes(busquedaLower) || 
            docente.especialidad.toLowerCase().includes(busquedaLower)
        ).forEach(docente => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><input type="radio" name="docente" value="${docente.id}" ${docenteSeleccionado?.id === docente.id ? 'checked' : ''}></td>
                <td>${docente.nombre}</td>
                <td>${docente.especialidad}</td>
            `;
            listaDocentes.appendChild(fila);
        });

        // Agregar event listeners a los radios
        document.querySelectorAll('input[name="docente"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const docenteId = parseInt(this.value);
                    docenteSeleccionado = docentes.find(d => d.id === docenteId);
                }
            });
        });
    }

    // Buscar docentes
    buscarDocenteInput.addEventListener('input', function() {
        cargarDocentes(this.value);
    });

    // Confirmar asignación de docente
    confirmarDocenteBtn.addEventListener('click', function() {
        if (!cursoSeleccionado || !docenteSeleccionado) {
            alert('Por favor seleccione un docente');
            return;
        }

        // Actualizar el curso con el nuevo docente
        const cursoIndex = cursos.findIndex(c => c.id === cursoSeleccionado.id);
        if (cursoIndex !== -1) {
            cursos[cursoIndex].docente = docenteSeleccionado.nombre;
            cargarCursos();
            
            // Actualizar la visualización actual si es el curso seleccionado
            if (cursoSeleccionado) {
                mostrarEstudiantes(cursoSeleccionado.id);
            }
        }

        modalDocente.style.display = 'none';
        docenteSeleccionado = null;
    });

    // Cerrar modal
    cerrarModal.addEventListener('click', function() {
        modalDocente.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === modalDocente) {
            modalDocente.style.display = 'none';
        }
    });

    // Inicializar
    cargarCursos();
});

// ------------------------------------------------

