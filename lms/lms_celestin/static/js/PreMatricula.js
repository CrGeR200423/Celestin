document.addEventListener('DOMContentLoaded', function() {
    // Función para el menú desplegable
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

    const formulario = document.getElementById('formulario-matricula');
    
    // Desactivar validación por defecto
    formulario.setAttribute('novalidate', true);
    
    // Variable para controlar envíos duplicados
    let isSubmitting = false;
    
    // Validar campos numéricos
    function validarNumeros(input) {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Validar teléfonos (10 dígitos)
    function validarTelefono(input) {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
        
        input.addEventListener('blur', function() {
            if(this.value && this.value.length !== 10) {
                mostrarError(this, 'El teléfono debe tener 10 dígitos');
            } else {
                limpiarError(this);
            }
        });
    }
    
    // Validar correo electrónico
    function validarEmail(input) {
        input.addEventListener('blur', function() {
            if(this.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
                mostrarError(this, 'Ingrese un correo válido');
            } else {
                limpiarError(this);
            }
        });
    }
    
    // Validar fecha de nacimiento
    function validarFechaNacimiento(input) {
        input.addEventListener('blur', function() {
            if(this.value) {
                const fechaNac = new Date(this.value);
                const hoy = new Date();
                if(fechaNac >= hoy) {
                    mostrarError(this, 'La fecha no puede ser futura');
                } else {
                    limpiarError(this);
                }
            }
        });
    }
    
    // Mostrar error
    function mostrarError(input, mensaje) {
        limpiarError(input);
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = mensaje;
        input.classList.add('error');
        input.parentNode.appendChild(error);
    }
    
    // Limpiar error
    function limpiarError(input) {
        const error = input.parentNode.querySelector('.error-message');
        if(error) error.remove();
        input.classList.remove('error');
    }
    
    // Validar campo requerido
    function validarRequerido(input) {
        input.addEventListener('blur', function() {
            if(this.required && !this.value.trim()) {
                mostrarError(this, 'Este campo es obligatorio');
            } else {
                limpiarError(this);
            }
        });
    }
    
    // Aplicar validaciones
    function aplicarValidaciones() {
        // Campos numéricos
        const numericos = ['identificacion', 'telefono', 'telefono_padre', 
                        'telefono_madre', 'telefono_acudiente', 'telefono_emergencia'];
        numericos.forEach(id => {
            const input = document.getElementById(id);
            if(input) validarNumeros(input);
        });
        
        // Teléfonos
        const telefonos = ['telefono', 'telefono_padre', 'telefono_madre', 
                        'telefono_acudiente', 'telefono_emergencia'];
        telefonos.forEach(id => {
            const input = document.getElementById(id);
            if(input) validarTelefono(input);
        });
        
        // Email
        const email = document.getElementById('email_acudiente');
        if(email) validarEmail(email);
        
        // Fecha nacimiento
        const fechaNac = document.getElementById('fecha_nacimiento');
        if(fechaNac) validarFechaNacimiento(fechaNac);
        
        // Campos requeridos
        const requeridos = formulario.querySelectorAll('[required]');
        requeridos.forEach(input => {
            validarRequerido(input);
        });
    }
    
    // Aplicar las validaciones al cargar la página
    aplicarValidaciones();
    
    // Validar al enviar
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if(isSubmitting) return;
        
        let valido = true;
        
        // Limpiar errores previos
        formulario.querySelectorAll('.error-message').forEach(e => e.remove());
        formulario.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
        
        // Validar todos los campos requeridos
        const requeridos = formulario.querySelectorAll('[required]');
        requeridos.forEach(input => {
            if(!input.value.trim()) {
                mostrarError(input, 'Este campo es obligatorio');
                valido = false;
            }
        });
        
        // Validar teléfonos (si existen en el formulario)
        const telefonos = ['telefono', 'telefono_acudiente', 'telefono_emergencia'];
        telefonos.forEach(id => {
            const input = document.getElementById(id);
            if(input && input.value && input.value.length !== 10) {
                mostrarError(input, 'El teléfono debe tener 10 dígitos');
                valido = false;
            }
        });
        
        // Validar email acudiente
        const email = document.getElementById('email_acudiente');
        if(email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            mostrarError(email, 'Ingrese un correo válido');
            valido = false;
        }
        
        // Validar fecha de nacimiento
        const fechaNacimiento = document.getElementById('fecha_nacimiento');
        if(fechaNacimiento && fechaNacimiento.value) {
            const fechaNac = new Date(fechaNacimiento.value);
            const hoy = new Date();
            if(fechaNac >= hoy) {
                mostrarError(fechaNacimiento, 'La fecha de nacimiento no puede ser futura');
                valido = false;
            }
        }
        
        if(valido) {
            const btn = formulario.querySelector('.btn-enviar');
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            isSubmitting = true;
            
            // Mostrar spinner
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            btn.appendChild(spinner);
            
            // Recopilar datos del formulario (ajustado para coincidir con las views de Django)
            const formData = {
                primer_nombre: document.getElementById('primer_nombre').value.trim(),
                segundo_nombre: document.getElementById('segundo_nombre').value.trim(),
                primer_apellido: document.getElementById('primer_apellido').value.trim(),
                segundo_apellido: document.getElementById('segundo_apellido').value.trim(),
                tipo_documento: document.getElementById('tipo_documento').value,
                identificacion: document.getElementById('identificacion').value.trim(),
                fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
                sexo: document.getElementById('sexo').value,
                municipio: document.getElementById('municipio').value.trim(),
                departamento_expedicion: document.getElementById('departamento_expedicion').value.trim(),
                direccion: document.getElementById('direccion').value.trim(),
                barrio: document.getElementById('barrio').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                grado_solicitado: document.getElementById('grado_solicitado').value,
                estado: document.querySelector('input[name="estado"]:checked')?.value || '',
                nombre_padre: document.getElementById('nombre_padre').value.trim(),
                telefono_padre: document.getElementById('telefono_padre').value.trim(),
                nombre_madre: document.getElementById('nombre_madre').value.trim(),
                telefono_madre: document.getElementById('telefono_madre').value.trim(),
                nombre_acudiente: document.getElementById('nombre_acudiente').value.trim(),
                telefono_acudiente: document.getElementById('telefono_acudiente').value.trim(),
                contacto_emergencia: document.getElementById('contacto_emergencia').value.trim(),
                telefono_emergencia: document.getElementById('telefono_emergencia').value.trim(),
                correo_acudiente: document.getElementById('email_acudiente').value.trim(), // Cambiado a 'correo_acudiente'
                eps: document.getElementById('eps').value.trim(),
                ips: document.getElementById('ips').value.trim(),
                familias_accion: document.querySelector('input[name="familias_accion"]:checked')?.value === 'SI',
                discapacidad: document.querySelector('input[name="discapacidad"]:checked')?.value === 'SI',
                tipo_discapacidad: document.getElementById('tipo_discapacidad').value.trim()
            };
            
            // Enviar datos al servidor
            fetch('/api/prematricula/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                // Aunque sea un error 400, leemos el cuerpo de la respuesta
                return response.json().then(data => {
                    // Añadimos el status a los datos para poder verificarlo después
                    data.status = response.status;
                    return data;
                });
            })
            .then(data => {
                console.log(data);
                if (data.status >= 400) {
                    // Manejar errores del servidor que vienen con estado 400+
                    throw new Error(data.message || 'Error en la respuesta del servidor');
                }
                
                if (data.success) {
                    mostrarToast('✅ Prematrícula enviada con éxito. En espera de aprobación.', 'success');
                    formulario.reset();
                    
                    // Redirigir después de 3 segundos
                    setTimeout(() => {
                        window.location.href = '/prematricula/'; 
                    }, 3000);
                } else {
                    throw new Error(data.message || 'Error al procesar la solicitud');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarToast(`❌ Error al enviar prematrícula: ${error.message}`, 'error');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .finally(() => {
                isSubmitting = false;
                btn.textContent = 'ENVIAR MATRÍCULA';
                btn.disabled = false;
                spinner.remove();
            });
        } else {
            const primerError = document.querySelector('.error-message');
            if(primerError) {
                primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
        

    // Funciones auxiliares
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function mostrarToast(mensaje, tipo = 'success') {
        const toastContainer = document.getElementById('toast-container') || document.body;
        const toast = document.createElement('div');
        
        toast.textContent = mensaje;
        toast.className = `toast ${tipo}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background-color: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});