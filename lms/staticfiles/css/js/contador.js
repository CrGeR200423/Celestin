/*Segunda-seccion contador*/
function animarContador(id, valorFinal, velocidad) {
    let contador = document.getElementById(id);
    let valorInicial = 0;
    let incremento = Math.ceil(valorFinal / 100); // Incremento gradual
    let intervalo = setInterval(() => {
        valorInicial += incremento;
        if (valorInicial >= valorFinal) {
            contador.innerText = valorFinal;
            clearInterval(intervalo);
        } else {
            contador.innerText = valorInicial;
        }
    }, velocidad);
}

// Ejecutar animaciones al cargar la página
window.onload = function() {
    animarContador("grad-count", 120, 20);
    animarContador("students-count", 250, 1);
    animarContador("prof-count", 139, 30);
};