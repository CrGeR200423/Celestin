// Mostrar notificación toast
function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Obtener cookie CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Cargar aplicantes al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarAplicantes();
});

// Cargar lista de aplicantes
function cargarAplicantes() {
    fetch('/listar-postulados/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar aplicantes');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                renderizarAplicantes(data.postulados);
            } else {
                mostrarToast(data.message || 'Error al cargar aplicantes', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarToast('Error al cargar aplicantes', 'error');
        });
}

// Renderizar lista de aplicantes en la tabla
function renderizarAplicantes(aplicantes) {
    const tbody = document.getElementById('lista-aplicantes');
    tbody.innerHTML = '';
    
    if (aplicantes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay postulados registrados</td>
            </tr>
        `;
        return;
    }
    
    aplicantes.forEach((aplicante, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${aplicante.nombre_completo || aplicante.primer_nombre + ' ' + aplicante.primer_apellido}</td>
            <td>${aplicante.documento}</td>
            <td>${aplicante.grado_ingresa || 'No especificado'}</td>
            <td>${new Date(aplicante.fecha_nacimiento).toLocaleDateString() || 'No especificada'}</td>
            <td><span class="badge badge-warning">Pendiente</span></td>
            <td>
                <button class="btn btn-sm btn-icon" 
                        onclick="mostrarDetallesAplicante(${aplicante.id})" 
                        title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Mostrar detalles del aplicante
function mostrarDetallesAplicante(id) {
    fetch(`/get-aplicante/${id}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar detalles');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const aplicante = data.aplicante;
                const detalles = document.getElementById('detalles-aplicante');
                
                // Formatear los datos del aplicante
                const fechaNacimiento = aplicante.fecha_nacimiento ? 
                    new Date(aplicante.fecha_nacimiento).toLocaleDateString() : 'No especificada';
                
                // Construir HTML de los detalles
                let html = `
                    <div class="detalle-item">
                        <strong>Nombre Completo:</strong> ${aplicante.primer_nombre} ${aplicante.segundo_nombre || ''} ${aplicante.primer_apellido} ${aplicante.segundo_apellido || ''}
                    </div>
                    <div class="detalle-item">
                        <strong>Documento:</strong> ${aplicante.documento} (${aplicante.tipo_documento})
                    </div>
                    <div class="detalle-item">
                        <strong>Fecha de Nacimiento:</strong> ${fechaNacimiento}
                    </div>
                    <div class="detalle-item">
                        <strong>Sexo:</strong> ${aplicante.sexo || 'No especificado'}
                    </div>
                    <div class="detalle-item">
                        <strong>Dirección:</strong> ${aplicante.direccion || 'No especificada'}
                    </div>
                    <div class="detalle-item">
                        <strong>Teléfono:</strong> ${aplicante.telefono || 'No especificado'}
                    </div>
                    <div class="detalle-item">
                        <strong>Grado solicitado:</strong> ${aplicante.grado_ingresa || 'No especificado'}
                    </div>
                    <div class="detalle-item">
                        <strong>Estado:</strong> ${aplicante.estatus || 'Pendiente'}
                    </div>
                `;
                
                // Sección de acudientes
                if (aplicante.acudientes && aplicante.acudientes.length > 0) {
                    html += `<h4 class="detalle-subtitulo">Acudientes</h4>`;
                    aplicante.acudientes.forEach(acudiente => {
                        html += `
                            <div class="detalle-item">
                                <strong>${acudiente.parentesco || 'Acudiente'}:</strong> 
                                ${acudiente.nombre || 'No especificado'}
                                ${acudiente.telefono ? `- Tel: ${acudiente.telefono}` : ''}
                                ${acudiente.correo ? `- Email: ${acudiente.correo}` : ''}
                            </div>
                        `;
                    });
                }
                
                detalles.innerHTML = html;
                document.getElementById('modal-aplicante').style.display = 'block';
                document.getElementById('modal-aplicante').dataset.aplicanteId = id;
            } else {
                mostrarToast(data.message || 'Error al cargar detalles', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarToast('Error al cargar detalles del aplicante', 'error');
        });
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal-aplicante').style.display = 'none';
}

// Mostrar confirmación de aceptación
function confirmarAceptacion() {
    document.getElementById('mensaje-confirmacion').textContent = 
        "¿Está seguro que desea aceptar este aplicante? Se creará un usuario para el estudiante.";
    document.getElementById('modal-confirmacion').style.display = 'block';
}

// Cerrar confirmación
function cerrarConfirmacion() {
    document.getElementById('modal-confirmacion').style.display = 'none';
}

// Aceptar aplicante
function aceptarAplicante() {
    const id = document.getElementById('modal-aplicante').dataset.aplicanteId;
    const btnConfirmar = document.querySelector('#modal-confirmacion button.btn-primary');
    
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    
    fetch(`/aceptar-aplicante/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarToast('✅ Aplicante aceptado correctamente', 'success');
            cerrarConfirmacion();
            cerrarModal();
            cargarAplicantes(); // Actualizar la lista
            
            // Mostrar datos de acceso si vienen en la respuesta
            if (data.username && data.password) {
                setTimeout(() => {
                    alert(`Usuario creado:\n\nEmail: ${data.username}\nContraseña temporal: ${data.password}\n\nDebe cambiarla en el primer inicio de sesión.`);
                }, 500);
            }
        } else {
            throw new Error(data.message || 'Error al aceptar aplicante');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarToast(`❌ ${error.message}`, 'error');
    })
    .finally(() => {
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = 'Confirmar';
    });
}

// Rechazar aplicante
function rechazarAplicante() {
    const id = document.getElementById('modal-aplicante').dataset.aplicanteId;
    
    if (confirm("¿Está seguro que desea rechazar este aplicante?\n\nEsta acción no se puede deshacer y eliminará todos los datos del postulado.")) {
        fetch(`/rechazar-aplicante/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                mostrarToast('❌ Aplicante rechazado correctamente', 'success');
                cerrarModal();
                cargarAplicantes(); // Actualizar la lista
            } else {
                throw new Error(data.message || 'Error al rechazar aplicante');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarToast(`❌ ${error.message}`, 'error');
        });
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}

// Actualizar automáticamente cada 30 segundos (opcional)
setInterval(cargarAplicantes, 30000);