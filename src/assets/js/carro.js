// cart.js

document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar el HTML del carrito
    const loadCartModal = async () => {
        try {
            const response = await fetch('../assets/html/cart.html'); // Asegúrate de que esta ruta sea correcta
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo del carrito.');
            }
            const cartHtml = await response.text();
            
            // Añade el HTML del carrito al final del body
            document.body.insertAdjacentHTML('beforeend', cartHtml);
            
            // Una vez que el modal esté en el DOM, podemos seleccionar los elementos y añadir los listeners
            const cartModal = document.getElementById('cart-modal');
            const closeBtn = document.querySelector('.close-btn');

            // Función para abrir el modal
            window.openCartModal = function() {
                cartModal.style.display = 'flex';
            };

            // Función para cerrar el modal
            window.closeCartModal = function() {
                cartModal.style.display = 'none';
            };

            // Asigna el evento para cerrar el modal
            if (closeBtn) {
                closeBtn.addEventListener('click', closeCartModal);
            }

            // Cierra el modal si el usuario hace clic fuera del contenido del carrito
            window.addEventListener('click', (event) => {
                if (event.target === cartModal) {
                    closeCartModal();
                }
            });

        } catch (error) {
            console.error('Error al cargar el modal del carrito:', error);
        }
    };

    // Carga el modal al inicio de la página
    loadCartModal();
});