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

        document.addEventListener('DOMContentLoaded', function() {
            const formulario = document.getElementById('formulario-matricula');
            
            // Desactivar validación por defecto
            formulario.setAttribute('novalidate', true);
            
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
                
                // Campos requeridos
                const requeridos = formulario.querySelectorAll('[required]');
                requeridos.forEach(input => {
                    validarRequerido(input);
                });
            }
            
            // Validar al enviar
            formulario.addEventListener('submit', function(e) {
                e.preventDefault();
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
                
                // Validar teléfonos
                const telefonos = ['telefono', 'telefono_acudiente', 'telefono_emergencia'];
                telefonos.forEach(id => {
                    const input = document.getElementById(id);
                    if(input && input.value && input.value.length !== 10) {
                        mostrarError(input, 'El teléfono debe tener 10 dígitos');
                        valido = false;
                    }
                });
                
                // Validar email
                const email = document.getElementById('email_acudiente');
                if(email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                    mostrarError(email, 'Ingrese un correo válido');
                    valido = false;
                }
                
                if(valido) {
                    // Simular envío
                    const btn = formulario.querySelector('.btn-enviar');
                    btn.textContent = 'Enviando...';
                    btn.disabled = true;
                    
                    setTimeout(() => {
                        alert('Matrícula enviada con éxito');
                        btn.textContent = 'ENVIAR MATRÍCULA';
                        btn.disabled = false;
                        formulario.reset();
                    }, 1500);
                } else {
                    // Desplazarse al primer error
                    const primerError = document.querySelector('.error-message');
                    if(primerError) {
                        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
            
            // Iniciar validaciones
            aplicarValidaciones();
        });
