// Versión optimizada del script_actividades.js
document.addEventListener('DOMContentLoaded', function() {
    // Configuración centralizada de los carruseles
    const carrusels = {
        natacion: {
            images: [
                './img/natacion_3.jpg',
                './img/natacion_4.jpg',
                './img/natacion_5.jpg'
            ],
            currentIndex: 0,
            element: document.getElementById('imageNatacion'),
            interval: null
        },
        karate: {
            images: [
                './img/foto_karate_.jpg',
                './img/foto_karate_1.jpg',
                './img/foto_karate_2.jpg'
            ],
            currentIndex: 0,
            element: document.getElementById('imageKarate'),
            interval: null
        },
        danza: {
            images: [
                './img/danza_3.jpg',
                './img/danza_4.jpg',
                './img/danza_5.jpg'
            ],
            currentIndex: 0,
            element: document.getElementById('imageDanza'),
            interval: null
        }
    };

    // Función genérica para cambiar imagen
    function changeImage(carrusel, direction = 'next') {
        const totalImages = carrusel.images.length;
        
        if (direction === 'next') {
            carrusel.currentIndex = (carrusel.currentIndex + 1) % totalImages;
        } else {
            carrusel.currentIndex = (carrusel.currentIndex - 1 + totalImages) % totalImages;
        }
        
        carrusel.element.src = carrusel.images[carrusel.currentIndex];
    }

    // Función para iniciar el intervalo automático
    function startAutoRotation(carrusel) {
        // Limpiar intervalo existente si hay uno
        if (carrusel.interval) clearInterval(carrusel.interval);
        
        // Configurar nuevo intervalo
        carrusel.interval = setInterval(() => {
            changeImage(carrusel);
        }, 5000);
    }

    // Función para pausar el auto-rotado al interactuar
    function setupCarruselInteractions(carrusel) {
        const container = carrusel.element.parentElement;
        const prevBtn = container.querySelector('.btn:first-child');
        const nextBtn = container.querySelector('.btn:last-child');

        // Event listeners para botones
        prevBtn.addEventListener('click', () => {
            changeImage(carrusel, 'prev');
            resetAutoRotation(carrusel);
        });
        
        nextBtn.addEventListener('click', () => {
            changeImage(carrusel);
            resetAutoRotation(carrusel);
        });

        // Pausar al pasar el ratón (solo en desktop)
        if (window.innerWidth > 768) {
            container.addEventListener('mouseenter', () => {
                if (carrusel.interval) clearInterval(carrusel.interval);
            });

            container.addEventListener('mouseleave', () => {
                startAutoRotation(carrusel);
            });
        }
    }

    // Función para reiniciar el auto-rotado
    function resetAutoRotation(carrusel) {
        startAutoRotation(carrusel);
    }

    // Inicializar todos los carruseles
    function initCarrusels() {
        for (const key in carrusels) {
            const carrusel = carrusels[key];
            
            // Mostrar primera imagen
            carrusel.element.src = carrusel.images[0];
            
            // Configurar interacciones
            setupCarruselInteractions(carrusel);
            
            // Iniciar rotación automática
            startAutoRotation(carrusel);
        }
    }

    // Ajustar altura del carrusel según el tamaño de pantalla
    function adjustCarouselHeight() {
        const carruseles = document.querySelectorAll('.carrusel');
        const height = window.innerWidth <= 768 ? '180px' : 
                        window.innerWidth <= 992 ? '220px' : '250px';
        
        carruseles.forEach(carrusel => {
            carrusel.style.height = height;
        });
    }

    // Inicializar todo cuando el DOM esté listo
    initCarrusels();
    adjustCarouselHeight();

    // Reajustar al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        adjustCarouselHeight();
        
        // Reiniciar interacciones para actualizar el comportamiento hover
        for (const key in carrusels) {
            setupCarruselInteractions(carrusels[key]);
        }
    });
});