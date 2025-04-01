const imagesNatacion = [
    './img/natacion_3.jpg',
    './img/natacion_4.jpg',
    './img/natacion_5.jpg'
];

const imagesKarate = [
    './img/foto_karate_.jpg',
    './img/foto_karate_1.jpg',
    './img/foto_karate_2.jpg'
];

const imagesDanza = [
    './img/danza_3.jpg',
    './img/danza_4.jpg',
    './img/danza_5.jpg'
];

let currentIndexNatacion = 0;
let currentIndexKarate = 0;
let currentIndexDanza = 0;

const imageElementNatacion = document.getElementById('imageNatacion');
const prevBtnNatacion = document.getElementById('prevBtnNatacion');
const nextBtnNatacion = document.getElementById('nextBtnNatacion');

const imageElementKarate = document.getElementById('imageKarate');
const prevBtnKarate = document.getElementById('prevBtnKarate');
const nextBtnKarate = document.getElementById('nextBtnKarate');

const imageElementDanza = document.getElementById('imageDanza');
const prevBtnDanza = document.getElementById('prevBtnDanza');
const nextBtnDanza = document.getElementById('nextBtnDanza');

// Función para mostrar la imagen de natación
function showImageNatacion(index) {
    imageElementNatacion.src = imagesNatacion[index];
}

function showPrevImageNatacion() {
    currentIndexNatacion = (currentIndexNatacion - 1 + imagesNatacion.length) % imagesNatacion.length;
    showImageNatacion(currentIndexNatacion);
}

function showNextImageNatacion() {
    currentIndexNatacion = (currentIndexNatacion + 1) % imagesNatacion.length;
    showImageNatacion(currentIndexNatacion);
}

// Funciones para karate
function showImageKarate(index) {
    imageElementKarate.src = imagesKarate[index];
}

function showPrevImageKarate() {
    currentIndexKarate = (currentIndexKarate - 1 + imagesKarate.length) % imagesKarate.length;
    showImageKarate(currentIndexKarate);
}

function showNextImageKarate() {
    currentIndexKarate = (currentIndexKarate + 1) % imagesKarate.length;
    showImageKarate(currentIndexKarate);
}

// Funciones para danza
function showImageDanza(index) {
    imageElementDanza.src = imagesDanza[index];
}

function showPrevImageDanza() {
    currentIndexDanza = (currentIndexDanza - 1 + imagesDanza.length) % imagesDanza.length;
    showImageDanza(currentIndexDanza);
}

function showNextImageDanza() {
    currentIndexDanza = (currentIndexDanza + 1) % imagesDanza.length;
    showImageDanza(currentIndexDanza);
}

// Agregar listeners a los botones Natación
prevBtnNatacion.addEventListener('click', showPrevImageNatacion);
nextBtnNatacion.addEventListener('click', showNextImageNatacion);

// Agregar listeners a los botones Karate
prevBtnKarate.addEventListener('click', showPrevImageKarate);
nextBtnKarate.addEventListener('click', showNextImageKarate);

// Agregar listeners a los botones Danza
prevBtnDanza.addEventListener('click', showPrevImageDanza);
nextBtnDanza.addEventListener('click', showNextImageDanza);

// Mostrar imagen inicial
showImageNatacion(currentIndexNatacion);
showImageKarate(currentIndexKarate);
showImageDanza(currentIndexDanza);

// Cambiar imágenes automáticamente cada 5 segundos
setInterval(showNextImageNatacion, 5000);
setInterval(showNextImageKarate, 5000);
setInterval(showNextImageDanza, 5000);

