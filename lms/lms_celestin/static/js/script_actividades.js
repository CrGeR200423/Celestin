// Versión modificada para funcionar con Django
document.addEventListener('DOMContentLoaded', function() {
    // Configuración centralizada de los carruseles
    const carrusels = {
        natacion: {
            element: document.getElementById('carruselNatacion'),
            currentIndex: 0,
            interval: null
        },
        karate: {
            element: document.getElementById('carruselKarate'),
            currentIndex: 0,
            interval: null
        },
        danza: {
            element: document.getElementById('carruselDanza'),
            currentIndex: 0,
            interval: null
        }
    };

    // Obtener las imágenes del atributo data-images de cada carrusel
    for (const key in carrusels) {
        if (carrusels[key].element) {
            carrusels[key].images = JSON.parse(carrusels[key].element.getAttribute('data-images'));
            carrusels[key].imgElement = carrusels[key].element.querySelector('img');
        }
    }

    // Función genérica para cambiar imagen
    function changeImage(carrusel, direction = 'next') {
        if (!carrusel || !carrusel.images || !carrusel.imgElement) return;
        
        const totalImages = carrusel.images.length;
        
        if (direction === 'next') {
            carrusel.currentIndex = (carrusel.currentIndex + 1) % totalImages;
        } else {
            carrusel.currentIndex = (carrusel.currentIndex - 1 + totalImages) % totalImages;
        }
        
        // Agregar efecto de transición
        carrusel.imgElement.style.opacity = 0;
        setTimeout(() => {
            carrusel.imgElement.src = carrusel.images[carrusel.currentIndex];
            carrusel.imgElement.style.opacity = 1;
        }, 300);
    }

    // Función para iniciar el intervalo automático
    function startAutoRotation(carrusel) {
        // Limpiar intervalo existente si hay uno
        if (carrusel.interval) clearInterval(carrusel.interval);
        
        // Configurar nuevo intervalo (cada 5 segundos)
        carrusel.interval = setInterval(() => {
            changeImage(carrusel);
        }, 5000);
    }

    // Función para pausar el auto-rotado al interactuar
    function setupCarruselInteractions(carrusel) {
        if (!carrusel.element) return;

        const prevBtn = carrusel.element.querySelector('.prevBtn');
        const nextBtn = carrusel.element.querySelector('.nextBtn');

        // Event listeners para botones
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                changeImage(carrusel, 'prev');
                resetAutoRotation(carrusel);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                changeImage(carrusel);
                resetAutoRotation(carrusel);
            });
        }

        // Pausar al pasar el ratón (solo en desktop)
        if (window.innerWidth > 768) {
            carrusel.element.addEventListener('mouseenter', () => {
                if (carrusel.interval) clearInterval(carrusel.interval);
            });

            carrusel.element.addEventListener('mouseleave', () => {
                startAutoRotation(carrusel);
            });
        }
    }

    // Función para reiniciar el auto-rotado
    function resetAutoRotation(carrusel) {
        if (carrusel.interval) clearInterval(carrusel.interval);
        startAutoRotation(carrusel);
    }

    // Inicializar todos los carruseles
    function initCarrusels() {
        for (const key in carrusels) {
            const carrusel = carrusels[key];
            
            if (!carrusel.element || !carrusel.imgElement || !carrusel.images) continue;
            
            // Mostrar primera imagen
            carrusel.imgElement.src = carrusel.images[0];
            carrusel.imgElement.style.transition = 'opacity 0.3s ease';
            
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