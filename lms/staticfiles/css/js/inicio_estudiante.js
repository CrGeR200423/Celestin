// Función para cambiar de sección sin recargar la página
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });

    // Mostrar la sección seleccionada
    document.getElementById(seccion).classList.add("active");
}
// Datos simulados de calificaciones
const calificaciones = [
    { asignatura: "Matemáticas", nota: 4.5, observacion: "Muy bien" },
    { asignatura: "Ciencias", nota: 3.2, observacion: "Puede mejorar" },
    { asignatura: "Historia", nota: 2.8, observacion: "Debe reforzar" },
    { asignatura: "Inglés", nota: 4.8, observacion: "Excelente" },
    { asignatura: "Arte", nota: 3.9, observacion: "Buen desempeño" }
];

// Función para mostrar las calificaciones en la tabla
function mostrarCalificaciones() {
    const gradesBody = document.getElementById("gradesBody");
    gradesBody.innerHTML = ""; // Limpiar tabla antes de agregar datos

    calificaciones.forEach(calif => {
        const row = document.createElement("tr");

        // Aplicar colores según la calificación
        let gradeClass = "good";
        if (calif.nota < 3.0) {
            gradeClass = "bad";
        } else if (calif.nota < 4.0) {
            gradeClass = "regular";
        }

        row.innerHTML = `
            <td>${calif.asignatura}</td>
            <td class="grade ${gradeClass}">${calif.nota.toFixed(1)}</td>
            <td>${calif.observacion}</td>
        `;
        gradesBody.appendChild(row);
    });
}

// Llamar a la función cuando se muestra la sección de calificaciones
document.addEventListener("DOMContentLoaded", () => {
    mostrarCalificaciones();
});
// Datos simulados del observador
const observaciones = [
    {
        fecha: "05/03/2024",
        academico: "Buen rendimiento en matemáticas.",
        comportamiento: "Participativo en clase.",
        estrategias: "Seguir practicando problemas avanzados.",
        firmaEstudiante: "✔",
        firmaProfesor: "✔"
    },
    {
        fecha: "20/02/2024",
        academico: "Necesita mejorar en comprensión lectora.",
        comportamiento: "Conversaciones fuera de lugar.",
        estrategias: "Realizar ejercicios de lectura en casa.",
        firmaEstudiante: "✔",
        firmaProfesor: "✔"
    }
];

// Función para mostrar las observaciones en la tabla
function mostrarObservador() {
    const observerBody = document.getElementById("observerBody");
    observerBody.innerHTML = ""; // Limpiar antes de agregar datos

    observaciones.forEach(obs => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" value="${obs.fecha}" readonly></td>
            <td><input type="text" value="${obs.academico}" readonly></td>
            <td><input type="text" value="${obs.comportamiento}" readonly></td>
            <td><input type="text" value="${obs.estrategias}" readonly></td>
            <td><input type="text" value="${obs.firmaEstudiante}" readonly></td>
            <td><input type="text" value="${obs.firmaProfesor}" readonly></td>
        `;
        observerBody.appendChild(row);
    });
}

// Llamar a la función cuando se muestra la sección de observador
document.addEventListener("DOMContentLoaded", () => {
    mostrarObservador();
});
// Datos simulados de asignaturas
const asignaturas = [
    { nombre: "Matemáticas", docente: "Prof. Ana López", horario: "Lunes y Miércoles 8:00 - 10:00 AM" },
    { nombre: "Ciencias", docente: "Prof. Juan Pérez", horario: "Martes y Jueves 10:00 - 12:00 PM" },
    { nombre: "Historia", docente: "Prof. María Rodríguez", horario: "Lunes y Miércoles 2:00 - 4:00 PM" },
    { nombre: "Inglés", docente: "Prof. Carlos Gómez", horario: "Viernes 8:00 - 10:00 AM" },
    { nombre: "Arte", docente: "Prof. Sofía Martínez", horario: "Viernes 2:00 - 4:00 PM" }
];

// Función para mostrar las asignaturas en la tabla
function mostrarAsignaturas() {
    const subjectsBody = document.getElementById("subjectsBody");
    subjectsBody.innerHTML = ""; // Limpiar antes de agregar datos

    asignaturas.forEach(asignatura => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" value="${asignatura.nombre}" readonly></td>
            <td><input type="text" value="${asignatura.docente}" readonly></td>
            <td><input type="text" value="${asignatura.horario}" readonly></td>
        `;
        subjectsBody.appendChild(row);
    });
}

// Llamar a la función cuando se muestra la sección de asignaturas
document.addEventListener("DOMContentLoaded", () => {
    mostrarAsignaturas();
});
// Datos simulados del estudiante
const estudiante = {
    nombre: "Juan Pérez",
    documento: "123456789",
    grado: "Cuarto 2024",
    fechaNacimiento: "15/04/2012"
};

// Función para mostrar el perfil del estudiante
function mostrarPerfil() {
    document.getElementById("perfilNombre").value = estudiante.nombre;
    document.getElementById("perfilDocumento").value = estudiante.documento;
    document.getElementById("perfilGrado").value = estudiante.grado;
    document.getElementById("perfilFechaNacimiento").value = estudiante.fechaNacimiento;
}

// Llamar a la función cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarPerfil();
});
// Simulación de cierre de sesión
function cerrarSesion() {
    alert("Cerrando sesión...");
    window.location.href = "home.html"; // Redirige a la página de inicio de sesión
}
