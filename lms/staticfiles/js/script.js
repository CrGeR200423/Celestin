// CARRUSEL DEL BANNER - Responsivo
let currentIndexBanner = 0;
const slidesBanner = document.querySelectorAll("#carousel-banner .carousel-slide");
const totalSlidesBanner = slidesBanner.length;
let bannerInterval;

function startBannerInterval() {
    bannerInterval = setInterval(() => {
        nextSlideBanner();
    }, 4000);
}

function showSlideBanner(index) {
    const carousel = document.querySelector("#carousel-banner .carousel");
    if (index >= totalSlidesBanner) {
        currentIndexBanner = 0;
    } else if (index < 0) {
        currentIndexBanner = totalSlidesBanner - 1;
    } else {
        currentIndexBanner = index;
    }
    const offset = -currentIndexBanner * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

function nextSlideBanner() {
    showSlideBanner(currentIndexBanner + 1);
}

function prevSlideBanner() {
    showSlideBanner(currentIndexBanner - 1);
}

// Pausar el carrusel cuando el usuario interactúa
document.querySelector("#carousel-banner").addEventListener("mouseenter", () => {
    clearInterval(bannerInterval);
});

document.querySelector("#carousel-banner").addEventListener("mouseleave", () => {
    startBannerInterval();
});

// Iniciar el intervalo
startBannerInterval();

// Ajustar altura del carrusel en dispositivos móviles
function adjustCarouselHeight() {
    const carouselContainer = document.querySelector(".carousel-container");
    if (window.innerWidth <= 768) {
        carouselContainer.style.height = "300px";
    } else if (window.innerWidth <= 992) {
        carouselContainer.style.height = "400px";
    } else {
        carouselContainer.style.height = "550px";
    }
}

// Ejecutar al cargar y al redimensionar
window.addEventListener("load", adjustCarouselHeight);
window.addEventListener("resize", adjustCarouselHeight);

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