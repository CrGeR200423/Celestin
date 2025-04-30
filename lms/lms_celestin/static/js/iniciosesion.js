document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const document = document.getElementById("document").value.trim();
    const password = document.getElementById("password").value.trim();
    const userType = document.getElementById("user-type").value;

    // Enviar datos al servidor para autenticación
    fetch('/iniciar_sesion/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            documento: documento,
            password: password,
            userType: userType
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Inicio de sesión exitoso. Bienvenido ${username} como ${userType}!`);
            if (userType === "administrador") {
                window.location.href = "/administrador/";
            } else if (userType === "estudiante") {
                window.location.href = "/estudiante/";
            } else if (userType === "profesor") {
                window.location.href = "/docente/";
            }
        } else {
            alert(data.message || "Error en el inicio de sesión");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error en la conexión con el servidor");
    });
});

// Función para obtener el token CSRF
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