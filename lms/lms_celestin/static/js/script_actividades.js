document.addEventListener('DOMContentLoaded', function() {
    // Configuración centralizada de los carruseles
    const carrusels = {
        natacion: {
            id: 'carruselNatacion',
            currentIndex: 0,
            interval: null
        },
        karate: {
            id: 'carruselKarate',
            currentIndex: 0,
            interval: null
        },
        danza: {
            id: 'carruselDanza',
            currentIndex: 0,
            interval: null
        }
    };

    // Inicializar propiedades de los carruseles
    for (const key in carrusels) {
        const carrusel = carrusels[key];
        carrusel.element = document.getElementById(carrusel.id);
        
        if (carrusel.element) {
            try {
                carrusel.images = JSON.parse(carrusel.element.getAttribute('data-images'));
                carrusel.imgElement = carrusel.element.querySelector('img');
                carrusel.prevBtn = carrusel.element.querySelector('.prevBtn');
                carrusel.nextBtn = carrusel.element.querySelector('.nextBtn');
            } catch (e) {
                console.error(`Error al inicializar carrusel ${key}:`, e);
                continue;
            }
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
        if (!carrusel) return;
        
        // Limpiar intervalo existente si hay uno
        if (carrusel.interval) clearInterval(carrusel.interval);
        
        // Configurar nuevo intervalo (cada 5 segundos)
        carrusel.interval = setInterval(() => {
            changeImage(carrusel);
        }, 5000);
    }

    // Función para configurar interacciones
    function setupCarruselInteractions(carrusel) {
        if (!carrusel || !carrusel.element) return;

        // Event listeners para botones
        if (carrusel.prevBtn) {
            carrusel.prevBtn.addEventListener('click', () => {
                changeImage(carrusel, 'prev');
                resetAutoRotation(carrusel);
            });
        }
        
        if (carrusel.nextBtn) {
            carrusel.nextBtn.addEventListener('click', () => {
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
        if (!carrusel) return;
        if (carrusel.interval) clearInterval(carrusel.interval);
        startAutoRotation(carrusel);
    }

    // Inicializar todos los carruseles
    function initCarrusels() {
        for (const key in carrusels) {
            const carrusel = carrusels[key];
            
            if (!carrusel.element || !carrusel.imgElement || !carrusel.images) {
                console.warn(`Carrusel ${key} no se pudo inicializar correctamente`);
                continue;
            }
            
            // Mostrar primera imagen
            carrusel.imgElement.src = carrusel.images[0];
            carrusel.imgElement.style.transition = 'opacity 0.3s ease';
            carrusel.imgElement.style.opacity = 1;
            
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

function toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const submenuItem = event.target.closest('.has-submenu');
    const wasActive = submenuItem.classList.contains('active');
    
    // Cerrar todos los submenús primero
    document.querySelectorAll('.has-submenu').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abrir el actual si no estaba activo
    if (!wasActive) {
        submenuItem.classList.add('active');
    }
}

// Cerrar submenús al hacer clic en cualquier parte
document.addEventListener('click', function() {
    document.querySelectorAll('.has-submenu').forEach(item => {
        item.classList.remove('active');
    });
});