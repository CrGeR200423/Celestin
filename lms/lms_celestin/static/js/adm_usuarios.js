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

