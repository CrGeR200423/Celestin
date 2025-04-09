document.addEventListener('DOMContentLoaded', function() {
    // 1. Configuración centralizada de los carruseles (usando data-attributes del HTML)
    const carrusels = {};
    const carruselElements = document.querySelectorAll('.carrusel');

    // Inicializar cada carrusel encontrado en el DOM
    carruselElements.forEach((carruselElement) => {
        const carruselId = carruselElement.id.replace('carrusel', '').toLowerCase();
        const imgElement = carruselElement.querySelector('img');
        
        if (!imgElement) {
            console.error(`No se encontró la imagen en el carrusel ${carruselId}`);
            return;
        }

        // Obtener imágenes del data-attribute (ejemplo: data-images='["/static/images/natacion_1.jpg", ...]')
        const images = JSON.parse(carruselElement.getAttribute('data-images')) || [];
        
        if (images.length === 0) {
            console.warn(`No hay imágenes definidas para el carrusel ${carruselId}`);
            return;
        }

        carrusels[carruselId] = {
            images: images,
            currentIndex: 0,
            element: imgElement,
            interval: null
        };
    });

    // 2. Función para cambiar imagen (avanzar/retroceder)
    function changeImage(carrusel, direction = 'next') {
        if (!carrusel || !carrusel.element) return;

        const totalImages = carrusel.images.length;
        carrusel.currentIndex = direction === 'next' 
            ? (carrusel.currentIndex + 1) % totalImages 
            : (carrusel.currentIndex - 1 + totalImages) % totalImages;

        carrusel.element.src = carrusel.images[carrusel.currentIndex];
    }

    // 3. Iniciar rotación automática (cada 5 segundos)
    function startAutoRotation(carrusel) {
        if (!carrusel) return;
        
        if (carrusel.interval) {
            clearInterval(carrusel.interval);
        }
        
        carrusel.interval = setInterval(() => {
            changeImage(carrusel);
        }, 5000);
    }

    // 4. Configurar interacciones (botones y hover)
    function setupCarruselInteractions(carrusel) {
        const container = carrusel.element.closest('.carrusel');
        if (!container) return;

        const prevBtn = container.querySelector('.prevBtn');
        const nextBtn = container.querySelector('.nextBtn');

        // Botones de navegación
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                changeImage(carrusel, 'prev');
                resetAutoRotation(carrusel);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                changeImage(carrusel, 'next');
                resetAutoRotation(carrusel);
            });
        }

        // Pausar al hacer hover (solo en desktop)
        if (window.innerWidth > 768) {
            container.addEventListener('mouseenter', () => {
                if (carrusel.interval) clearInterval(carrusel.interval);
            });

            container.addEventListener('mouseleave', () => {
                startAutoRotation(carrusel);
            });
        }
    }

    // 5. Reiniciar rotación automática después de interacción
    function resetAutoRotation(carrusel) {
        startAutoRotation(carrusel);
    }

    // 6. Inicializar todos los carruseles
    function initCarrusels() {
        for (const key in carrusels) {
            const carrusel = carrusels[key];
            
            // Mostrar primera imagen
            if (carrusel.images.length > 0) {
                carrusel.element.src = carrusel.images[0];
            }
            
            // Configurar interacciones
            setupCarruselInteractions(carrusel);
            
            // Iniciar rotación automática
            startAutoRotation(carrusel);
        }
    }

    // 7. Ajustar altura del carrusel según el tamaño de pantalla
    function adjustCarouselHeight() {
        const carruseles = document.querySelectorAll('.carrusel');
        const height = window.innerWidth <= 768 ? '180px' : 
                    window.innerWidth <= 992 ? '220px' : '250px';
        
        carruseles.forEach(carrusel => {
            carrusel.style.height = height;
        });
    }

    // Inicialización final
    if (Object.keys(carrusels).length > 0) {
        initCarrusels();
        adjustCarouselHeight();
    } else {
        console.warn('No se encontraron carruseles para inicializar.');
    }

    // Reajustar al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        adjustCarouselHeight();
    });
});