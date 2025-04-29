// Función auxiliar para obtener el token CSRF
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

// Función para mostrar toasts visuales
function mostrarToast(mensaje, tipo = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.textContent = mensaje;
    toast.style.backgroundColor = tipo === 'success' ? '#4CAF50' : '#f44336';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.marginTop = '10px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    toast.style.transition = 'opacity 0.5s ease';
    toast.style.opacity = '1';
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Función para cambiar el estado activo/inactivo del usuario
function cambiarEstado(userId, activar) {
    const confirmacion = activar ? "habilitar" : "inhabilitar";
    if (confirm(`¿Está seguro que desea ${confirmacion} este usuario?`)) {
        fetch(`/cambiar-estado-usuario/${userId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'activar': activar })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarToast(`✅ Usuario ${activar ? 'habilitado' : 'inhabilitado'} correctamente`, 'success');
                // Actualiza el botón visualmente o recarga
                setTimeout(() => location.reload(), 1000);
            } else {
                mostrarToast('❌ Error al actualizar estado', 'error');
            }
        });
    }
}

// Función para eliminar un usuario
function confirmarEliminacion(userId) {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
        fetch(`/eliminar-usuario/${userId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const fila = document.querySelector(`tr[data-user-id="${userId}"]`);
                if (fila) fila.remove();
                mostrarToast('✅ Usuario eliminado exitosamente', 'success');
            } else {
                mostrarToast('❌ Error al eliminar usuario: ' + (data.error || ''), 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarToast('❌ Error de conexión con el servidor', 'error');
        });
    }
}

function editarUsuario(userId) {
    window.location.href = `/editar-usuario/${userId}/`;
}

function cerrarModalUsuario() {
    document.getElementById("modalVerUsuarioDetalles").style.display = "none";
}

// Función para ver usuario (actualizada)
function verUsuario(userId) {
    const userDataScript = document.getElementById(`usuario_data_${userId}`);
    if (!userDataScript) {
        mostrarToast('No se encontraron datos del usuario.', 'error');
        return;
    }

    try {
        const user = JSON.parse(userDataScript.textContent);
        let html = "<div class='user-details'>";

        // Agrega todos los campos disponibles
        if (user.nombre) html += `<p><strong>Nombre:</strong> ${user.nombre}</p>`;
        if (user.email) html += `<p><strong>Email:</strong> ${user.email}</p>`;
        if (user.rol) html += `<p><strong>Rol:</strong> ${user.rol}</p>`;
        if (user.documento) html += `<p><strong>Documento:</strong> ${user.documento}</p>`;
        if (user.tipo_documento) html += `<p><strong>Tipo Documento:</strong> ${user.tipo_documento}</p>`;
        if (user.sexo) html += `<p><strong>Sexo:</strong> ${user.sexo}</p>`;
        if (user.direccion) html += `<p><strong>Dirección:</strong> ${user.direccion}</p>`;
        if (user.fecha_nacimiento) html += `<p><strong>Fecha Nacimiento:</strong> ${user.fecha_nacimiento}</p>`;
        
        // Campos específicos por rol
        if (user.codigo_estudiante) html += `<p><strong>Código Estudiante:</strong> ${user.codigo_estudiante}</p>`;
        if (user.especialidad) html += `<p><strong>Especialidad:</strong> ${user.especialidad}</p>`;
        if (user.titulos) html += `<p><strong>Títulos:</strong> ${user.titulos}</p>`;

        html += "</div>";
        
        document.getElementById('detalleUsuario').innerHTML = html;
        document.getElementById('modalVerUsuarioDetalles').style.display = 'block';
    } catch (e) {
        mostrarToast('Error al cargar los datos del usuario.', 'error');
        console.error('Error parsing user data:', e);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalVerUsuarioDetalles');
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            // Si el clic fue directamente en el modal (no en su contenido)
            if (e.target === modal) {
                cerrarModalUsuario();
            }
        });
    }
});

// Precargar datos de usuarios en memoria para búsquedas más rápidas
document.addEventListener('DOMContentLoaded', function() {
    window.usuariosData = {};
    document.querySelectorAll('script[id^="usuario_data_"]').forEach(script => {
        try {
            const id = script.id.replace('usuario_data_', '');
            window.usuariosData[id] = JSON.parse(script.textContent);
        } catch (e) {
            console.error('Error al parsear datos de usuario:', e);
        }
    });
    
    // Configurar eventos
    document.getElementById('buscarUsuario').addEventListener('input', function() {
        document.getElementById('btnLimpiarBusqueda').style.display = 
            this.value ? 'block' : 'none';
    });
    
    // Cargar filtros guardados
    cargarFiltros();
    filtrarUsuarios();
});

// Función principal de filtrado
function filtrarUsuarios() {
    const textoBusqueda = document.getElementById('buscarUsuario').value.toLowerCase();
    const filtroRol = document.getElementById('filtroRol').value;
    const filtroEstado = document.getElementById('filtroEstado').value;
    
    Object.keys(window.usuariosData).forEach(id => {
        const fila = document.querySelector(`tr[data-user-id="${id}"]`);
        if (!fila) return;
        
        const user = window.usuariosData[id];
        let coincide = true;
        
        // Aplicar filtros
        if (textoBusqueda) {
            coincide = aplicarBusquedaAvanzada(textoBusqueda, user);
        }
        
        if (coincide && filtroRol) {
            coincide = user.rol.toLowerCase() === filtroRol.toLowerCase();
        }
        
        if (coincide && filtroEstado) {
            const estadoActual = user.estado === 'Activo' ? 'Activo' : 'Inactivo';
            coincide = estadoActual === filtroEstado;
        }
        
        fila.classList.toggle('hidden-by-filter', !coincide);
    });
    
    // Re-numerar filas visibles
    const filasVisibles = document.querySelectorAll('#tablaUsuarios tr[data-user-id]:not(.hidden-by-filter)');
    filasVisibles.forEach((fila, index) => {
        fila.querySelector('td:nth-child(2)').textContent = index + 1;
    });
    
    // Actualizar contador y filtros activos
    actualizarContadorResultados();
    actualizarFiltrosActivos();
    guardarFiltros();
}

// Búsqueda avanzada por campos específicos
function aplicarBusquedaAvanzada(texto, user) {
    const patrones = {
        'nombre:': 'nombre',
        'email:': 'email',
        'doc:': 'documento',
        'cod:': 'codigo_estudiante',
        'rol:': 'rol',
        'estado:': 'estado'
    };
    
    for (const [prefijo, campo] of Object.entries(patrones)) {
        if (texto.startsWith(prefijo)) {
            const valorBusqueda = texto.slice(prefijo.length).trim().toLowerCase();
            const valorCampo = String(user[campo] || '').toLowerCase();
            return valorCampo.includes(valorBusqueda);
        }
    }
    
    // Búsqueda normal si no coincide con ningún patrón
    const camposBusqueda = [
        user.nombre, 
        user.email, 
        user.documento,
        user.codigo_estudiante,
        user.especialidad,
        user.titulos
    ].join(' ').toLowerCase();
    
    return camposBusqueda.includes(texto.toLowerCase());
}

// Ordenar usuarios
function ordenarUsuarios() {
    const criterio = document.getElementById('filtroOrden').value;
    const filas = Array.from(document.querySelectorAll('#tablaUsuarios tr[data-user-id]:not(.hidden-by-filter)'));
    
    filas.sort((a, b) => {
        const idA = a.getAttribute('data-user-id');
        const idB = b.getAttribute('data-user-id');
        const userA = window.usuariosData[idA];
        const userB = window.usuariosData[idB];
        
        switch(criterio) {
            case 'nombre-asc':
                return userA.nombre.localeCompare(userB.nombre);
            case 'nombre-desc':
                return userB.nombre.localeCompare(userA.nombre);
            case 'fecha-asc':
                return new Date(userA.fecha_registro || 0) - new Date(userB.fecha_registro || 0);
            case 'fecha-desc':
                return new Date(userB.fecha_registro || 0) - new Date(userA.fecha_registro || 0);
            default:
                return 0;
        }
    });
    
    const tbody = document.querySelector('#tablaUsuarios');
    filas.forEach((fila, index) => {
        fila.querySelector('td:nth-child(2)').textContent = index + 1;
        tbody.appendChild(fila);
    });
    
    guardarFiltros();
}

// Limpiar búsqueda
function limpiarBusqueda() {
    document.getElementById('buscarUsuario').value = '';
    filtrarUsuarios();
    document.getElementById('btnLimpiarBusqueda').style.display = 'none';
}

// Limpiar todos los filtros
function limpiarFiltros() {
    document.getElementById('buscarUsuario').value = '';
    document.getElementById('filtroRol').selectedIndex = 0;
    document.getElementById('filtroEstado').selectedIndex = 0;
    document.getElementById('filtroOrden').selectedIndex = 0;
    filtrarUsuarios();
    document.getElementById('btnLimpiarBusqueda').style.display = 'none';
}

// Mostrar filtros activos
function actualizarFiltrosActivos() {
    const contenedor = document.getElementById('filtros-activos');
    contenedor.innerHTML = '';
    
    const textoBusqueda = document.getElementById('buscarUsuario').value;
    const rolSeleccionado = document.getElementById('filtroRol').value;
    const estadoSeleccionado = document.getElementById('filtroEstado').value;
    
    if (textoBusqueda) {
        contenedor.appendChild(crearFiltroActivo('Búsqueda: ' + textoBusqueda, 'limpiarBusqueda()'));
    }
    
    if (rolSeleccionado) {
        contenedor.appendChild(crearFiltroActivo('Rol: ' + rolSeleccionado, 
            `document.getElementById('filtroRol').selectedIndex = 0; filtrarUsuarios();`));
    }
    
    if (estadoSeleccionado) {
        contenedor.appendChild(crearFiltroActivo('Estado: ' + estadoSeleccionado, 
            `document.getElementById('filtroEstado').selectedIndex = 0; filtrarUsuarios();`));
    }
}

function crearFiltroActivo(texto, accion) {
    const filtro = document.createElement('div');
    filtro.className = 'filtro-activo';
    filtro.innerHTML = `
        ${texto}
        <button onclick="${accion}">×</button>
    `;
    return filtro;
}

// Actualizar contador de resultados
function actualizarContadorResultados() {
    const totalUsuarios = document.querySelectorAll('#tablaUsuarios tr[data-user-id]').length;
    const usuariosVisibles = document.querySelectorAll('#tablaUsuarios tr[data-user-id]:not(.hidden-by-filter)').length;
    
    document.getElementById('num-resultados').textContent = usuariosVisibles;
    document.getElementById('num-total').textContent = totalUsuarios;
}

// Persistencia de filtros
function guardarFiltros() {
    const filtros = {
        busqueda: document.getElementById('buscarUsuario').value,
        rol: document.getElementById('filtroRol').value,
        estado: document.getElementById('filtroEstado').value,
        orden: document.getElementById('filtroOrden').value
    };
    localStorage.setItem('filtrosUsuarios', JSON.stringify(filtros));
}

function cargarFiltros() {
    const filtrosGuardados = localStorage.getItem('filtrosUsuarios');
    if (filtrosGuardados) {
        const filtros = JSON.parse(filtrosGuardados);
        document.getElementById('buscarUsuario').value = filtros.busqueda || '';
        document.getElementById('filtroRol').value = filtros.rol || '';
        document.getElementById('filtroEstado').value = filtros.estado || '';
        document.getElementById('filtroOrden').value = filtros.orden || 'nombre-asc';
        
        if (filtros.busqueda) {
            document.getElementById('btnLimpiarBusqueda').style.display = 'block';
        }
    }
}

// Hacer la tabla completamente responsiva
function hacerTablaResponsiva() {
    if (window.innerWidth < 768) {
        const celdas = document.querySelectorAll('#tablaUsuarios td');
        const headers = document.querySelectorAll('#tablaUsuarios th');
        
        headers.forEach((header, index) => {
            celdas.forEach(celda => {
                if (celda.cellIndex === index) {
                    celda.setAttribute('data-label', header.textContent);
                }
            });
        });
    }
}

// Ejecutar al cargar y al redimensionar
window.addEventListener('load', hacerTablaResponsiva);
window.addEventListener('resize', hacerTablaResponsiva);