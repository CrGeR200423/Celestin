// Mostrar detalles del aplicante
function mostrarDetallesAplicante(id) {
    // Aquí normalmente harías una petición AJAX para obtener los datos del aplicante
    // Por ahora usamos datos de ejemplo
    const aplicante = {
        id: id,
        nombre: "María González",
        documento: "1023456789",
        fechaNacimiento: "15/03/2010",
        grado: "3° Primaria",
        acudiente: "Laura González",
        telefono: "3001234567",
        email: "acudiente@example.com",
        direccion: "Calle 123 #45-67",
        fechaAplicacion: "20/05/2023"
    };

    // Llenar los datos en el modal
    document.getElementById('detalle-nombre').textContent = aplicante.nombre;
    document.getElementById('detalle-documento').textContent = aplicante.documento;
    document.getElementById('detalle-fecha-nac').textContent = aplicante.fechaNacimiento;
    document.getElementById('detalle-grado').textContent = aplicante.grado;
    document.getElementById('detalle-acudiente').textContent = aplicante.acudiente;
    document.getElementById('detalle-telefono').textContent = aplicante.telefono;
    document.getElementById('detalle-email').textContent = aplicante.email;
    document.getElementById('detalle-direccion').textContent = aplicante.direccion;
    document.getElementById('detalle-fecha-apl').textContent = aplicante.fechaAplicacion;

    // Mostrar el modal
    document.getElementById('modal-aplicante').style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal-aplicante').style.display = 'none';
}

// Mostrar confirmación de aceptación
function confirmarAceptacion() {
    document.getElementById('mensaje-confirmacion').textContent = "¿Está seguro que desea aceptar este aplicante?";
    document.getElementById('modal-confirmacion').style.display = 'block';
}

// Cerrar confirmación
function cerrarConfirmacion() {
    document.getElementById('modal-confirmacion').style.display = 'none';
}

// Aceptar aplicante (acción final)
function aceptarAplicante() {
    // Aquí iría la lógica para aceptar al aplicante
    alert("Aplicante aceptado correctamente");
    cerrarConfirmacion();
    cerrarModal();
    // Recargar la lista de aplicantes o actualizar la UI
}

// Rechazar aplicante
function rechazarAplicante() {
    if (confirm("¿Está seguro que desea rechazar este aplicante?")) {
        // Aquí iría la lógica para rechazar al aplicante
        alert("Aplicante rechazado");
        cerrarModal();
        // Recargar la lista de aplicantes o actualizar la UI
    }
}

// Cerrar modales al hacer clic fuera del contenido
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}