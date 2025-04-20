// Función para cambiar el estado de un usuario
function cambiarEstado(userId, activar) {
    if (confirm(`¿Está seguro que desea ${activar ? 'habilitar' : 'inhabilitar'} este usuario?`)) {
        fetch(`/cambiar-estado-usuario/${userId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'activar': activar
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload(); // Recargar para ver los cambios
            } else {
                alert('Error al actualizar el estado');
            }
        });
    }
}

// Función para eliminar usuario
function confirmarEliminacion(userId) {
    console.log("Tipo de userId:", typeof userId, "Valor:", userId);
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
        console.log("Enviando solicitud para eliminar usuario ID:", userId);
        fetch(`/eliminar-usuario/${userId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log("Respuesta recibida:", response);
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);
            if (data.success) {
                location.reload();
            } else {
                alert('Error al eliminar usuario: ' + (data.error || ''));
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Error de conexión');
        });
    }
}

// Función auxiliar para obtener cookies
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

// Cargar usuarios al cargar la página
document.addEventListener("DOMContentLoaded", cargarUsuarios);