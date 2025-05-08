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
    fetch('/listar_postulados/')
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
        
        // Iconos para datos extra
        const iconoDiscapacidad = aplicante.tiene_discapacidad ? 
            '<i class="fas fa-wheelchair text-warning" title="Tiene discapacidad"></i>' : '';
        const iconoFamilias = aplicante.familias_accion ? 
            '<i class="fas fa-users text-info" title="Familia en Acción"></i>' : '';
        const iconoEmergencia = aplicante.tiene_contacto_emergencia ? 
            '<i class="fas fa-phone text-success" title="Tiene contacto de emergencia"></i>' : '';
        
        // Mostrar fecha de postulación (fecha de creación de la prematrícula)
        const fechaPostulacion = aplicante.fecha_creacion ? 
            new Date(aplicante.fecha_creacion).toLocaleDateString() : 
            (aplicante.fecha_postulacion ? new Date(aplicante.fecha_postulacion).toLocaleDateString() : 'No especificada');
        
        // Mapeo de estados para asegurar consistencia
        let estadoClase = 'warning'; // Por defecto pendiente
        if (aplicante.estado === 'ACEPTADO' || aplicante.estado === 'APROBADO') {
            estadoClase = 'success';
        } else if (aplicante.estado === 'RECHAZADO') {
            estadoClase = 'danger';
        }
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${aplicante.nombre_completo}</td>
            <td>${aplicante.documento}</td>
            <td>${aplicante.grado_solicitado || 'No especificado'}</td>
            <td>${fechaPostulacion}</td>
            <td>
                <span class="badge badge-${estadoClase}">
                    ${aplicante.estado || 'PENDIENTE'}
                </span>
                <span class="ml-2">
                    ${iconoDiscapacidad}
                    ${iconoFamilias}
                    ${iconoEmergencia}
                </span>
            </td>
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

// Función para filtrar aplicantes (ajustar para que coincida con los estados)
function filtrarAplicantes() {
    const busqueda = document.getElementById('buscar-aplicante').value.toLowerCase();
    const filtroGrado = document.getElementById('filtro-grado').value;
    const filtroEstado = document.getElementById('filtro-estado').value;
    
    // Obtener todos los aplicantes de la tabla
    const filas = document.querySelectorAll('#lista-aplicantes tr');
    
    let contadorVisibles = 0;
    
    filas.forEach(fila => {
        if (fila.cells.length > 1) { // Ignorar filas de mensajes
            const nombre = fila.cells[1].textContent.toLowerCase();
            const grado = fila.cells[3].textContent;
            const estado = fila.cells[5].textContent.trim();
            
            // Verificar si cumple con todos los filtros
            const cumpleBusqueda = nombre.includes(busqueda);
            const cumpleGrado = !filtroGrado || grado.includes(filtroGrado);
            const cumpleEstado = !filtroEstado || estado.includes(filtroEstado);
            
            // Mostrar u ocultar según filtros
            if (cumpleBusqueda && cumpleGrado && cumpleEstado) {
                fila.style.display = '';
                contadorVisibles++;
            } else {
                fila.style.display = 'none';
            }
        }
    });
    
    // Actualizar contador
    document.getElementById('info-aplicantes').textContent = 
        `Mostrando ${contadorVisibles} de ${filas.length} postulados`;
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
                        <strong>Municipio:</strong> ${aplicante.municipio || 'No especificado'}
                    </div>
                    <div class="detalle-item">
                        <strong>Barrio:</strong> ${aplicante.barrio || 'No especificado'}
                    </div>
                    <div class="detalle-item">
                        <strong>Teléfono:</strong> ${aplicante.telefono || 'No especificado'}
                    </div>
                    <div class="detalle-item">
                        <strong>Grado solicitado:</strong> ${aplicante.grado_solicitado || 'No especificado'}
                    </div>
                    <div class="detalle-item">
                        <strong>Estado:</strong> ${aplicante.estado || 'Pendiente'}
                    </div>
                `;
                
                // Sección de datos extra
                if (aplicante.datos_extra) {
                    html += `<h4 class="detalle-subtitulo">Datos Adicionales</h4>`;
                    
                    html += `
                        <div class="detalle-item">
                            <strong>Contacto de Emergencia:</strong> ${aplicante.datos_extra.contacto_emergencia || 'No especificado'}
                        </div>
                        <div class="detalle-item">
                            <strong>Teléfono de Emergencia:</strong> ${aplicante.datos_extra.telefono_emergencia || 'No especificado'}
                        </div>
                        <div class="detalle-item">
                            <strong>Familias en Acción:</strong> ${aplicante.datos_extra.familias_accion}
                        </div>
                        <div class="detalle-item">
                            <strong>Discapacidad:</strong> ${aplicante.datos_extra.discapacidad}
                        </div>
                    `;
                    
                    if (aplicante.datos_extra.discapacidad === 'SI') {
                        html += `
                            <div class="detalle-item">
                                <strong>Tipo de Discapacidad:</strong> ${aplicante.datos_extra.tipo_discapacidad || 'No especificado'}
                            </div>
                        `;
                    }
                }
                
                // Sección de acudientes
                if (aplicante.acudientes && aplicante.acudientes.length > 0) {
                    html += `<h4 class="detalle-subtitulo">Acudientes</h4>`;
                    aplicante.acudientes.forEach(acudiente => {
                        if (acudiente.nombre) {
                            html += `
                                <div class="detalle-item">
                                    <strong>${acudiente.parentesco || 'Acudiente'}:</strong> 
                                    ${acudiente.nombre || 'No especificado'}
                                    ${acudiente.telefono ? `- Tel: ${acudiente.telefono}` : ''}
                                    ${acudiente.correo ? `- Email: ${acudiente.correo}` : ''}
                                </div>
                            `;
                        }
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
            if (data.password) {
                setTimeout(() => {
                    alert(`Usuario creado:\n\nUsuario: est_${data.estudiante_documento || data.documento}\nContraseña temporal: ${data.password}\n\nDebe cambiarla en el primer inicio de sesión.`);
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