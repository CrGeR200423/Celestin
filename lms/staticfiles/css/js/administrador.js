document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".sidebar ul li a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            let target = this.getAttribute("href").substring(1);
            document.querySelectorAll("main section").forEach(section => {
                section.style.display = section.id === target ? "block" : "none";
            });
        });
    });
});
// Simulación de cierre de sesión
function cerrarSesion() {
    alert("Cerrando sesión...");
    window.location.href = "home.html"; // Redirige a la página de inicio de sesión
}