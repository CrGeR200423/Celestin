document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const imagenNovedadInput = document.getElementById('imagenNovedad');
    const previewImagenDiv = document.getElementById('previewImagen');
    const listaNovedades = document.getElementById('lista-novedades');
    const formAgregarNovedad = document.getElementById('formAgregarNovedad');

    // Variables para edición
    let editando = false;
    let idEdicion = null;

    // Cargar novedades al iniciar
    cargarNovedades();

    // Función para redimensionar imágenes
    function redimensionarImagen(file, maxWidth, maxHeight, callback) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                const ratio = Math.min(maxWidth/width, maxHeight/height);
                width = width * ratio;
                height = height * ratio;

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(callback, file.type, 0.8);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Preview de imagen
    imagenNovedadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!tiposPermitidos.includes(file.type)) {
                mostrarError('Solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
                this.value = '';
                previewImagenDiv.innerHTML = '<p class="texto-ayuda">Formato no válido</p>';
                return;
            }

            redimensionarImagen(file, 300, 200, function(blob) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImagenDiv.innerHTML = `
                        <img src="${event.target.result}" alt="Preview" class="preview-img">
                        <p class="texto-ayuda">Vista previa - La imagen se ajustará automáticamente</p>
                    `;
                };
                reader.readAsDataURL(blob);
            });
        }
    });

    // Función para subir/editar novedad
    window.subirNovedad = function() {
        const titulo = document.getElementById('tituloNovedad').value.trim();
        const descripcion = document.getElementById('descripcionNovedad').value.trim();
        const fecha = document.getElementById('fechaNovedad').value;
        const imagenFile = imagenNovedadInput.files[0];

        if (!titulo || !descripcion || !fecha) {
            mostrarError('Por favor complete todos los campos requeridos');
            return;
        }

        if (imagenFile) {
            const tamañoMaximoMB = 2;
            const tamañoMaximoBytes = tamañoMaximoMB * 1024 * 1024;
            
            if (imagenFile.size > tamañoMaximoBytes) {
                mostrarError(`La imagen (${(imagenFile.size/(1024*1024)).toFixed(2)}MB) excede el límite de ${tamañoMaximoMB}MB`);
                return;
            }

            redimensionarImagen(imagenFile, 600, 400, function(blob) {
                guardarNovedad(titulo, descripcion, fecha, blob);
            });
        } else {
            guardarNovedad(titulo, descripcion, fecha, null);
        }
    };

    // Función para guardar o actualizar novedad
    function guardarNovedad(titulo, descripcion, fecha, imagenBlob) {
        let novedades = JSON.parse(localStorage.getItem('novedades')) || [];
        let imagenUrl = imagenBlob ? URL.createObjectURL(imagenBlob) : '';

        if (editando) {
            // Actualizar novedad existente
            const index = novedades.findIndex(n => n.id === idEdicion);
            if (index !== -1) {
                novedades[index] = {
                    ...novedades[index],
                    titulo,
                    descripcion,
                    fecha,
                    imagenUrl: imagenUrl || novedades[index].imagenUrl
                };
                mostrarExito('Novedad actualizada exitosamente!');
            }
        } else {
            // Crear nueva novedad
            novedades.unshift({
                id: Date.now(),
                titulo,
                descripcion,
                fecha,
                imagenUrl
            });
            mostrarExito('Novedad agregada exitosamente!');
        }

        localStorage.setItem('novedades', JSON.stringify(novedades));
        cargarNovedades();
        cancelarEdicion();
    }

    // Función para editar novedad
    function editarNovedad(id) {
        const novedades = JSON.parse(localStorage.getItem('novedades')) || [];
        const novedad = novedades.find(n => n.id === id);
        
        if (novedad) {
            editando = true;
            idEdicion = id;
            
            document.getElementById('tituloNovedad').value = novedad.titulo;
            document.getElementById('descripcionNovedad').value = novedad.descripcion;
            document.getElementById('fechaNovedad').value = novedad.fecha.split('T')[0];
            
            if (novedad.imagenUrl) {
                previewImagenDiv.innerHTML = `
                    <img src="${novedad.imagenUrl}" alt="Preview" class="preview-img">
                    <p class="texto-ayuda">Imagen actual (puede cambiarla)</p>
                `;
            } else {
                previewImagenDiv.innerHTML = '<p class="texto-ayuda">No hay imagen actual</p>';
            }
            
            document.querySelector('.btn-subir').textContent = 'Actualizar Novedad';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Cancelar edición
    function cancelarEdicion() {
        editando = false;
        idEdicion = null;
        formAgregarNovedad.reset();
        previewImagenDiv.innerHTML = '';
        document.querySelector('.btn-subir').textContent = 'Subir Novedad';
    }

    // Cargar novedades en la tabla
    function cargarNovedades() {
        const novedades = JSON.parse(localStorage.getItem('novedades')) || [];
        listaNovedades.innerHTML = '';

        novedades.forEach(novedad => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${novedad.titulo}</td>
                <td>${formatFecha(novedad.fecha)}</td>
                <td>
                    <button class="btn-accion btn-editar" data-id="${novedad.id}">Editar</button>
                    <button class="btn-accion btn-eliminar" data-id="${novedad.id}">Eliminar</button>
                </td>
            `;
            listaNovedades.appendChild(fila);
        });

        // Agregar eventos a los botones
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarNovedad(id);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                eliminarNovedad(id);
            });
        });
    }

    // Eliminar novedad
    function eliminarNovedad(id) {
        if (confirm('¿Está seguro de eliminar esta novedad?')) {
            let novedades = JSON.parse(localStorage.getItem('novedades')) || [];
            novedades = novedades.filter(n => n.id !== id);
            localStorage.setItem('novedades', JSON.stringify(novedades));
            cargarNovedades();
            mostrarExito('Novedad eliminada correctamente');
            
            if (editando && idEdicion === id) {
                cancelarEdicion();
            }
        }
    }

    // Formatear fecha
    function formatFecha(fechaStr) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
    }

    // Mostrar mensajes
    function mostrarError(mensaje) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-mensaje error mostrar';
        alertDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${mensaje}</span>`;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.remove('mostrar');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }

    function mostrarExito(mensaje) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-mensaje exito mostrar';
        alertDiv.innerHTML = `<i class="fas fa-check-circle"></i><span>${mensaje}</span>`;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.remove('mostrar');
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }
});