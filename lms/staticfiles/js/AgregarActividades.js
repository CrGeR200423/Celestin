document.addEventListener('DOMContentLoaded', function() {
    const seccionActividades = document.querySelector('.info-con-banner');
    let actividadActual = 0;
    const actividadesPorPagina = 1;
    const maxBotonesVisibles = 5;

    cargarActividades();

    function cargarActividades() {
        const novedades = JSON.parse(localStorage.getItem('novedades')) || [];
        novedades.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        if (novedades.length > 0) {
            mostrarNovedades(novedades);
        } else {
            mostrarPlaceholder();
        }
    }

    function mostrarNovedades(novedades) {
        let html = `
            <div class="info-izquierda">
                <h3>ACTIVIDADES RECIENTES</h3>
                <div class="actividad-contenido" id="actividad-contenido"></div>
                <div class="navegacion-actividades" id="navegacion-actividades"></div>
            </div>
            <div class="banner-actividades">
                <img id="imagen-actividad" src="" alt="Imagen actividad">
            </div>
        `;
        
        seccionActividades.innerHTML = html;
        actualizarActividad(novedades, 0);
        crearControlesNavegacion(novedades);
    }

    function actualizarActividad(novedades, indice) {
        const actividad = novedades[indice];
        const contenido = document.getElementById('actividad-contenido');
        const imagen = document.getElementById('imagen-actividad');
        
        contenido.innerHTML = `
            <div class="actividad-item">
                <h4>${actividad.titulo}</h4>
                <p>${actividad.descripcion}</p>
                <p class="fecha-actividad">${formatFecha(actividad.fecha)}</p>
            </div>
        `;
        
        if (actividad.imagenUrl) {
            imagen.src = actividad.imagenUrl;
            imagen.alt = actividad.titulo;
            imagen.style.display = 'block';
            
            imagen.onload = function() {
                this.style.maxWidth = '100%';
                this.style.maxHeight = '100%';
                this.style.objectFit = 'contain';
            };
        } else {
            imagen.style.display = 'none';
        }
        
        actividadActual = indice;
        actualizarBotonesNavegacion();
    }

    function crearControlesNavegacion(novedades) {
        const navegacion = document.getElementById('navegacion-actividades');
        navegacion.innerHTML = '';
        
        const totalActividades = novedades.length;
        const mostrarMas = totalActividades > maxBotonesVisibles;
        const limite = mostrarMas ? maxBotonesVisibles - 1 : maxBotonesVisibles;
        
        for (let i = 0; i < Math.min(limite, totalActividades); i++) {
            navegacion.appendChild(crearBotonNumero(i));
        }
        
        if (mostrarMas) {
            const botonMas = document.createElement('button');
            botonMas.className = 'numero-actividad mas-actividades';
            botonMas.textContent = '+';
            botonMas.title = 'Mostrar más actividades';
            botonMas.addEventListener('click', () => mostrarTodasActividades(novedades));
            navegacion.appendChild(botonMas);
        }
    }

    function mostrarTodasActividades(novedades) {
        const navegacion = document.getElementById('navegacion-actividades');
        navegacion.innerHTML = '';
        
        for (let i = 0; i < novedades.length; i++) {
            navegacion.appendChild(crearBotonNumero(i));
        }
    }

    function crearBotonNumero(indice) {
        const boton = document.createElement('button');
        boton.className = `numero-actividad ${indice === actividadActual ? 'activo' : ''}`;
        boton.textContent = (indice + 1).toString();
        boton.addEventListener('click', () => {
            const novedades = JSON.parse(localStorage.getItem('novedades')) || [];
            actualizarActividad(novedades, indice);
        });
        return boton;
    }

    function actualizarBotonesNavegacion() {
        document.querySelectorAll('.numero-actividad').forEach((btn, i) => {
            btn.classList.toggle('activo', i === actividadActual);
        });
    }

    function mostrarPlaceholder() {
        seccionActividades.innerHTML = `
            <div class="info-izquierda">
                <h3>ACTIVIDADES</h3>
                <p>Día de la Boyacensidad</p>
                <p>Celestin Freinet 2025</p>
            </div>
            <div class="banner-actividades">
                <img src="img/dia_1.jpg" alt="Banner Informativo">
            </div>
        `;
    }

    function formatFecha(fechaStr) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
    }
});