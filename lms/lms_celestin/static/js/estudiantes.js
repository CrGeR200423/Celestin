function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function cerrarModalEstudiante() {
    document.getElementById('modal-nuevo-estudiante').style.display = 'none';
    const formulario = document.getElementById('formulario-matricula');
    if (formulario) formulario.reset();
}

function cargarEstudiantes() {
    fetch('/obtener_estudiantes/')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tabla = document.getElementById('tablaEstudiantes');
                tabla.innerHTML = '';
                data.estudiantes.forEach(estudiante => {
                    agregarEstudianteATabla(estudiante);
                });
                actualizarContadorEstudiantes();
            }
        })
        .catch(error => {
            console.error('Error al cargar estudiantes:', error);
            mostrarNotificacion('Error al cargar estudiantes', 'error');
        });
}

function agregarEstudianteATabla(estudiante) {
    const tabla = document.getElementById('tablaEstudiantes');
    const fila = document.createElement('tr');
    fila.setAttribute('data-id', estudiante.id);

    fila.innerHTML = `
        <td>${estudiante.codigo}</td>
        <td>${estudiante.nombre_completo}</td>
        <td>${estudiante.grado}</td>
        <td>${estudiante.edad} años</td>
        <td><span class="badge ${estudiante.estado === 'Activo' ? 'badge-success' : 'badge-warning'}">${estudiante.estado}</span></td>
        <td>
            <button class="btn btn-sm btn-icon" title="Editar" onclick="editarEstudiante('${estudiante.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-icon" title="Ver" onclick="verEstudiante('${estudiante.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-icon btn-danger" title="Eliminar" onclick="eliminarEstudiante('${estudiante.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    tabla.appendChild(fila);
}

function guardarEstudiante() {
    const formData = {
        tipo_documento: document.getElementById('tipo_documento').value,
        identificacion: document.getElementById('identificacion').value,
        primer_nombre: document.getElementById('primer_nombre').value,
        segundo_nombre: document.getElementById('segundo_nombre').value || '',
        primer_apellido: document.getElementById('primer_apellido').value,
        segundo_apellido: document.getElementById('segundo_apellido').value || '',
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        sexo: document.querySelector('input[name="sexo"]:checked')?.value || '',
        direccion: document.getElementById('direccion').value,
        municipio: document.getElementById('municipio').value,
        barrio: document.getElementById('barrio').value || '',
        telefono: document.getElementById('telefono').value,
        grado_solicitado: document.getElementById('grado_solicitado').value,
        estado: document.querySelector('input[name="estado"]:checked')?.value || 'NUEVO',
        eps: document.getElementById('eps').value || '',
        ips: document.getElementById('ips').value || '',
        sisben: document.querySelector('input[name="sisben"]:checked')?.value === 'SI',
        familias_accion: document.querySelector('input[name="familias_accion"]:checked')?.value === 'SI',
        discapacidad: document.querySelector('input[name="discapacidad"]:checked')?.value === 'SI',
        tipo_discapacidad: document.getElementById('tipo_discapacidad').value || '',
        nombre_acudiente: document.getElementById('nombre_acudiente').value,
        telefono_acudiente: document.getElementById('telefono_acudiente').value,
        email_acudiente: document.getElementById('email_acudiente').value || '',
        nombre_padre: document.getElementById('nombre_padre').value || '',
        telefono_padre: document.getElementById('telefono_padre').value || '',
        nombre_madre: document.getElementById('nombre_madre').value || '',
        telefono_madre: document.getElementById('telefono_madre').value || '',
        contacto_emergencia: document.getElementById('contacto_emergencia').value,
        telefono_emergencia: document.getElementById('telefono_emergencia').value
    };

    // Validación básica
    if (!formData.primer_nombre || !formData.primer_apellido || !formData.identificacion ||
        !formData.fecha_nacimiento || !formData.sexo || !formData.direccion ||
        !formData.telefono || !formData.grado_solicitado || !formData.nombre_acudiente ||
        !formData.telefono_acudiente || !formData.contacto_emergencia || !formData.telefono_emergencia) {
        mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
        return;
    }

    if (formData.email_acudiente && !formData.email_acudiente.includes('@')) {
        mostrarNotificacion('Correo del acudiente inválido', 'error');
        return;
    }

    fetch('/registrar_estudiante/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacion(data.message, 'success');
            agregarEstudianteATabla(data.estudiante);
            cerrarModalEstudiante();
            actualizarContadorEstudiantes();
        } else {
            mostrarNotificacion(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarNotificacion('Error al conectar con el servidor', 'error');
    });
}

function filtrarEstudiantes() {
    const busqueda = document.getElementById('buscarEstudiante').value.toLowerCase();
    const grado = document.getElementById('filtroGrado').value;
    const estado = document.getElementById('filtroEstado').value.toLowerCase();

    const filas = document.getElementById('tablaEstudiantes').querySelectorAll('tr');
    let contador = 0;

    filas.forEach(fila => {
        const nombre = fila.cells[1].textContent.toLowerCase();
        const gradoFila = fila.cells[2].textContent.split('°')[0].trim();
        const estadoFila = fila.cells[4].textContent.toLowerCase();

        const coincideBusqueda = nombre.includes(busqueda);
        const coincideGrado = grado === '' || gradoFila === grado;
        const coincideEstado = estado === '' || estadoFila.includes(estado);

        if (coincideBusqueda && coincideGrado && coincideEstado) {
            fila.style.display = '';
            contador++;
        } else {
            fila.style.display = 'none';
        }
    });

    const total = filas.length;
    document.querySelector('.table-info').textContent =
        `Mostrando ${contador > 0 ? 1 : 0}-${contador} de ${total} estudiantes`;
}

function eliminarEstudiante(id) {
    if (confirm('¿Está seguro de eliminar este estudiante?')) {
        fetch(`/eliminar_estudiante/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion(data.message, 'success');
                document.querySelector(`#tablaEstudiantes tr[data-id="${id}"]`)?.remove();
                actualizarContadorEstudiantes();
            } else {
                mostrarNotificacion(data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error al eliminar estudiante', 'error');
        });
    }
}

function actualizarContadorEstudiantes() {
    const total = document.getElementById('tablaEstudiantes').querySelectorAll('tr').length;
    const mostrados = document.getElementById('tablaEstudiantes').querySelectorAll('tr:not([style*="display: none"])').length;
    document.querySelector('.table-info').textContent =
        `Mostrando ${mostrados > 0 ? 1 : 0}-${mostrados} de ${total} estudiantes`;
}

document.addEventListener("DOMContentLoaded", function () {
    cargarEstudiantes();

    document.getElementById('btnNuevoEstudiante').addEventListener('click', function () {
        document.getElementById('modal-nuevo-estudiante').style.display = 'block';
    });

    document.getElementById('buscarEstudiante').addEventListener('input', filtrarEstudiantes);
    document.getElementById('filtroGrado').addEventListener('change', filtrarEstudiantes);
    document.getElementById('filtroEstado').addEventListener('change', filtrarEstudiantes);
});
