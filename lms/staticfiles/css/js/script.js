// 1️⃣ CARRUSEL DEL BANNER
let currentIndexBanner = 0;
const slidesBanner = document.querySelectorAll("#carousel-banner .carousel-slide");
const totalSlidesBanner = slidesBanner.length;

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

// Cambio automático del carrusel del banner cada 4 segundos
setInterval(() => {
    nextSlideBanner();
}, 4000);


// 2️⃣ CARRUSEL DE CONTENIDO
let currentIndexContent = 0;
const slidesContent = document.querySelectorAll("#carousel-content .carousel-slide");
const totalSlidesContent = slidesContent.length;

function showSlideContent(index) {
    const carousel = document.querySelector("#carousel-content .carousel");
    if (index >= totalSlidesContent) {
        currentIndexContent = 0;
    } else if (index < 0) {
        currentIndexContent = totalSlidesContent - 1;
    } else {
        currentIndexContent = index;
    }
    const offset = -currentIndexContent * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

function nextSlideContent() {
    showSlideContent(currentIndexContent + 1);
}

function prevSlideContent() {
    showSlideContent(currentIndexContent - 1);
}

// Cambio automático del carrusel de contenido cada 5 segundos
setInterval(() => {
    nextSlideContent();
}, 5000);


// MENÚ HAMBURGUESA
document.querySelector('.menu-hamburguesa').addEventListener('click', function() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('open');
    document.querySelector('.close-button').style.display = navLinks.classList.contains('open') ? 'block' : 'none';
});

document.querySelector('.close-button').addEventListener('click', function() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.remove('open');
    document.querySelector('.close-button').style.display = 'none';
});

document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks.contains(event.target) && !document.querySelector('.menu-hamburguesa').contains(event.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        document.querySelector('.close-button').style.display = 'none';
    }
});


// FORMULARIO DE CONTACTO
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    document.getElementById('formResponse').innerText = `Gracias ${nombre}, su formulario ha sido enviado. Nos pondremos en contacto a través del email: ${email}.`;
    this.reset();
});


// BUSCADOR 
const searchContainer = document.getElementById('search-container');
const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');

searchIcon.addEventListener('click', () => {
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
    }
});