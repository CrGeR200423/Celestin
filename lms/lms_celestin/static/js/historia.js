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