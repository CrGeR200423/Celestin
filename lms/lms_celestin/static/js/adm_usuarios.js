// Función para redirigir a la página de registro
function agregarUsuario() {
    // Limpiar datos de edición si los hay
    localStorage.removeItem("usuarioAModificar");
    window.location.href = "/formulario/";
}

// Función para cargar usuarios desde localStorage
function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || []);
    const tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = ""; // Limpiar tabla

    usuarios.forEach((usuario, index) => {
        const num = index + 1;
        const nombre = usuario.tipo === "Estudiante" 
            ? usuario.datos.nombre 
            : `${usuario.datos.primerNombre} ${usuario.datos.segundoNombre || ''} ${usuario.datos.primerApellido}`;
        
        const fila = tabla.insertRow();
        fila.innerHTML = `
            <td>${num}</td>
            <td>${nombre}</td>
            <td>${usuario.tipo}</td>
            <td>
                <button class="modificar" onclick="modificarUsuario(${index})">✏️ Modificar</button>
                <button class="ver" onclick="verUsuario(${index})">👁️ Ver</button>
                <button class="eliminar" onclick="confirmarEliminacion(this)">❌ Eliminar</button>
            </td>
            <td>
                <button class="habilitar ${usuario.estado === 'Habilitado' ? 'activo' : ''}" onclick="cambiarEstado(this, true)">🟢 Habilitar</button>
                <button class="inhabilitar ${usuario.estado === 'Inhabilitado' ? 'activo' : ''}" onclick="cambiarEstado(this, false)">🔴 Inhabilitar</button>
            </td>
        `;
    });
}

// Función para modificar usuario
function modificarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (index >= 0 && index < usuarios.length) {
        localStorage.setItem("usuarioAModificar", JSON.stringify({index, usuario: usuarios[index]}));
        window.location.href = "formulario_usuario.html";
    }
}

// Función para ver detalles del usuario
function verUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (index >= 0 && index < usuarios.length) {
        alert(JSON.stringify(usuarios[index], null, 2));
    }
}

// Función para confirmar eliminación
function confirmarEliminacion(btn) {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
        eliminarUsuario(btn);
    }
}

// Función para eliminar usuario
function eliminarUsuario(btn) {
    const fila = btn.closest("tr");
    const index = fila.rowIndex - 1; // Restar 1 por el encabezado
    
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (index >= 0 && index < usuarios.length) {
        usuarios.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
    
    fila.remove();
}

// Función para cambiar estado
function cambiarEstado(boton, estado) {
    const fila = boton.closest("tr");
    const btnHabilitar = fila.querySelector(".habilitar");
    const btnInhabilitar = fila.querySelector(".inhabilitar");

    if (estado) {
        btnHabilitar.classList.add("activo");
        btnInhabilitar.classList.remove("activo");
    } else {
        btnHabilitar.classList.remove("activo");
        btnInhabilitar.classList.add("activo");
    }
}

// Cargar usuarios al cargar la página
document.addEventListener("DOMContentLoaded", cargarUsuarios);