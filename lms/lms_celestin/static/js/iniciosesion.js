const usuarios = [
    { username: "adminUser", password: "adminPass", role: "administrador" },
    { username: "studentUser", password: "studentPass", role: "estudiante" }
];

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const userType = document.getElementById("user-type").value;

    
    const usuarioValido = usuarios.find(user => user.username === username && user.password === password);

    if (!usuarioValido) {
        alert("Usuario o contraseña incorrectos.");
    } else if (usuarioValido.role !== userType) {
        alert("El rol seleccionado no coincide con el usuario.");
    } else {
        alert(`Inicio de sesión exitoso. Bienvenido ${username} como ${userType}!`);

        
        if (userType === "administrador") {
            window.location.href = "/administrador/";
        } else if (userType === "estudiante") {
            window.location.href = "/estudiante/"; // Asegúrate de que coincida con la URL de urls.py
        }
    }
});
