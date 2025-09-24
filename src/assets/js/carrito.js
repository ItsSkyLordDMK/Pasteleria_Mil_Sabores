// Clase para gestionar el carrito de compras
class CarritoManager {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Carrito almacenado en localStorage
        this.productos = []; // Lista de productos disponibles
        this.modalInstance = null; // Instancia del modal
        this.toastInstance = null; // Instancia de toast
        
        this.init();
    }

    // Inicializa el carrito
    async init() {
        try {
            await this.cargarProductos();
            this.setupModal();
            this.setupEventos();
            this.actualizarContadorCarrito();
            console.log('CarritoManager inicializado correctamente');
        } catch (error) {
            console.error('Error inicializando carrito:', error);
        }
    }

    // Carga los productos desde el archivo JSON
    async cargarProductos() {
        try {
            // Ruta relativa al archivo JSON
            const response = await fetch('../assets/data/productos.json');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            this.productos = await response.json();
            console.log('Productos cargados:', this.productos.length);
        } catch (error) {
            console.error('Error cargando productos:', error);
            // Fallback con algunos productos del JSON
            this.productos = [
                {
                    "id": "TC001",
                    "categoria": "Tortas Cuadradas",
                    "nombre": "Torta Cuadrada de Chocolate",
                    "descripcion": "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas.",
                    "precio": 45000,
                    "imagen_principal": "../img/torta_cuadrada_chocolate.jpg"
                },
                {
                    "id": "PI001",
                    "categoria": "Postres Individuales",
                    "nombre": "Mousse de Chocolate",
                    "descripcion": "Postre individual cremoso y suave, hecho con chocolate de alta calidad.",
                    "precio": 5000,
                    "imagen_principal": "../img/mousse_chocolate.png"
                }
            ];
            console.log('Usando productos de respaldo');
        }
    }

    // Configura el modal del carrito
    setupModal() {
        // Buscar modal existente primero
        let modalElement = document.getElementById('carritoModal');
        
        if (!modalElement) {
            console.log('Modal no encontrado, creándolo...');
            this.crearModalHTML();
            modalElement = document.getElementById('carritoModal');
        }
        
        if (modalElement && typeof bootstrap !== 'undefined') {
            this.modalInstance = new bootstrap.Modal(modalElement);
            // Configurar el toast después de que el modal esté listo
            const toastElement = document.getElementById('compra-toast');
            if(toastElement) {
                this.toastInstance = new bootstrap.Toast(toastElement);
            }
            console.log('Modal configurado correctamente');
        } else {
            console.error('Bootstrap no está disponible o modal no se pudo crear');
        }
    }

    // Crea el HTML del modal del carrito
    crearModalHTML() {
        const modalHTML = `
            <div class="modal fade" id="carritoModal" tabindex="-1" aria-labelledby="carritoModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <header class="modal-header">
                            <h2 class="modal-title" id="carritoModalLabel">Mi carrito de compras</h2>
                            <button type="button" data-bs-dismiss="modal" aria-label="Cerrar" style="background:none;border:none;font-size:2rem;line-height:1;color:#333;opacity:0.8;cursor:pointer;">&times;</button>
                        </header>
                        <main class="modal-body">
                            <div class="row">
                                <section class="col-lg-8 col-md-7">
                                    <div id="lista-productos-carrito">
                                        <p class="text-center text-muted">El carrito está vacío.</p>
                                    </div>
                                </section>
                                <aside class="col-lg-4 col-md-5">
                                    <div class="resumen-carrito p-3">
                                        <h4 class="mb-3">TOTAL:</h4>
                                        <p class="h3 mb-3" id="total-carrito">$ 0</p>
                                        <hr>
                                        <div class="mb-3">
                                            <label for="cupon-descuento" class="form-label">Cupón de descuento</label>
                                            <input type="text" id="cupon-descuento" class="form-control" placeholder="Ingresa tu cupón">
                                        </div>
                                        <button type="button" id="btn-pagar" class="btn btn-pagar w-100">
                                            <i class="bi bi-credit-card"></i> PAGAR
                                        </button>
                                    </div>
                                </aside>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <!-- Contenedor para toasts -->
            <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
                <div id="compra-toast" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            ¡Compra realizada con éxito!
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Configura los eventos del carrito
    setupEventos() {
        // Evento del botón del carrito
        const cartButton = document.getElementById('cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Botón de carrito clickeado');
                this.abrirCarrito();
            });
            console.log('Evento del botón carrito configurado');
        } else {
            console.warn('Botón de carrito no encontrado con ID "cart-button"');
        }

        // Eventos usando delegación de eventos
        document.addEventListener('click', (e) => {
            // Debug para botones de añadir
            if (e.target.classList.contains('btn-añadir')) {
                console.log('Botón añadir clickeado:', e.target.dataset.id);
            }

            // Botones de aumentar, disminuir y añadir al carrito
            //Aumentar cantidad
            if (e.target.closest('.btn-aumentar')) {
                const id = e.target.closest('.btn-aumentar').dataset.id;
                console.log('Aumentar cantidad:', id);
                this.cambiarCantidad(id, 1);
            //Disminuir cantidad
            } else if (e.target.closest('.btn-disminuir')) {
                const id = e.target.closest('.btn-disminuir').dataset.id;
                console.log('Disminuir cantidad:', id);
                this.cambiarCantidad(id, -1);
            //Añadir al carrito
            } else if (e.target.closest('.btn-añadir')) {
                const id = e.target.closest('.btn-añadir').dataset.id;
                console.log('Agregar al carrito:', id);
                this.agregarAlCarrito(id);
            //Pagar
            } else if (e.target.closest('#btn-pagar')) {
                // Evento para el botón "Pagar" dentro del modal
                this.realizarPago();
            }
        });
    }

    // Agrega un producto al carrito
    agregarAlCarrito(productoId) {
        console.log('Intentando agregar producto:', productoId);
        console.log('Productos disponibles:', this.productos.length);
        
        // Buscar el producto en la lista de productos
        const producto = this.productos.find(p => p.id === productoId);
        if (!producto) {
            console.error('Producto no encontrado:', productoId);
            console.log('IDs disponibles:', this.productos.map(p => p.id));
            return;
        }

        // Verificar si el producto ya está en el carrito
        const productoExistente = this.carrito.find(p => p.id === productoId);
        if (productoExistente) {
            productoExistente.cantidad++;
            console.log('Cantidad aumentada para:', producto.nombre);
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
            console.log('Producto agregado:', producto.nombre);
        }

        // Guardar y actualizar
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.abrirCarrito();
    }

    // Cambia la cantidad de un producto en el carrito
    cambiarCantidad(productoId, cambio) {
        const producto = this.carrito.find(p => p.id === productoId);
        if (!producto) return;

        producto.cantidad += cambio;

        // Si la cantidad es 0 o menos, eliminar el producto del carrito
        if (producto.cantidad <= 0) {
            this.carrito = this.carrito.filter(p => p.id !== productoId);
            console.log('Producto eliminado del carrito:', productoId);
        }

        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarContadorCarrito();
    }

    // Abre el modal del carrito
    abrirCarrito() {
        console.log('Intentando abrir carrito...');
        this.renderizarCarrito();
        if (this.modalInstance) {
            this.modalInstance.show();
            console.log('Modal mostrado');
        } else {
            console.error('Modal no está inicializado');
            // Intentar reinicializar
            this.setupModal();
            if (this.modalInstance) {
                this.modalInstance.show();
            }
        }
    }

    // Renderiza el contenido del carrito
    renderizarCarrito() {
        const lista = document.getElementById('lista-productos-carrito');
        const totalElement = document.getElementById('total-carrito');
        
        // Verificar que el elemento exista
        if (!lista) {
            console.error('Elemento lista-productos-carrito no encontrado');
            return;
        }

        // Si el carrito está vacío
        if (this.carrito.length === 0) {
            lista.innerHTML = '<p class="text-center text-muted">El carrito está vacío.</p>';
            if (totalElement) totalElement.textContent = '$ 0';
            return;
        }

        // Limpiar la lista y calcular el total
        lista.innerHTML = '';
        let total = 0;


        // Recorrer los productos en el carrito y crear el HTML
        this.carrito.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

        
            let imagenSrc = producto.imagen_principal || '';
            
            if (imagenSrc.startsWith('../assets/img/')) {
                imagenSrc = '/src/assets/img/' + imagenSrc.split('../assets/img/')[1];
            } else if (imagenSrc.startsWith('../img/')) {
                imagenSrc = '/src/assets/img/' + imagenSrc.split('../img/')[1];
            }
            const imagenHTML = imagenSrc ? 
                `<img src="${imagenSrc}" alt="${producto.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">` :
                `<div style="width: 80px; height: 80px; background-color: var(--color-acento-suave); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-image" style="font-size: 2rem; color: var(--color-texto-principal);"></i>
                </div>`;

            const productoHTML = `
                <article class="producto-carrito">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            ${imagenHTML}
                        </div>
                        <div class="flex-grow-1">
                            <h5 class="mb-1">${producto.nombre}</h5>
                            <p class="text-muted mb-1 small">${producto.descripcion}</p>
                            <p class="fw-bold mb-0">$${subtotal.toLocaleString('es-CL')}</p>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn-cantidad btn-disminuir" data-id="${producto.id}" aria-label="Disminuir cantidad">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="mx-2 fw-bold">${producto.cantidad}</span>
                            <button class="btn-cantidad btn-aumentar" data-id="${producto.id}" aria-label="Aumentar cantidad">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                </article>
            `;
            lista.innerHTML += productoHTML;
        });

        // Actualizar el total
        if (totalElement) {
            totalElement.textContent = `$ ${total.toLocaleString('es-CL')}`;
        }

        // Debug
        console.log('Carrito renderizado:', this.carrito.length, 'productos');
    }

    // Actualiza el contador de productos en el carrito
    actualizarContadorCarrito() {
        const contador = document.getElementById('cart-count');
        if (contador) {
            const totalProductos = this.carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
            contador.textContent = totalProductos;
        }
    }

    // Guarda el carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    // Método para manejar el pago
    // Realiza el pago y vacía el carrito
    realizarPago() {
        if (this.carrito.length > 0) {
            console.log('Procesando pago...');
            this.vaciarCarrito();
            this.modalInstance.hide();
            this.mostrarToast();
            console.log('Pago realizado y carrito vaciado');
        } else {
            console.log('El carrito está vacío, no se puede realizar el pago');
        }
    }

    // Método para mostrar el toast
    // Muestra un toast de confirmación de compra
    mostrarToast() {
        if (this.toastInstance) {
            this.toastInstance.show();
        } else {
            console.error('Toast no está inicializado');
        }
    }

    // Métodos públicos
    // Devuelve el array del carrito
    obtenerCarrito() {
        return this.carrito;
    }

    // Devuelve el total del carrito
    obtenerTotal() {
        return this.carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    }

    // Devuelve la cantidad total de productos en el carrito
    obtenerCantidadTotal() {
        return this.carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    }

    // Vacía el carrito
    vaciarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.renderizarCarrito();
    }

    // Método estático para obtener la instancia única
    // Devuelve la instancia única del carrito
    static getInstance() {
        if (!window.carritoInstance) {
            window.carritoInstance = new CarritoManager();
        }
        return window.carritoInstance;
    }
}

// Inicializa el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando carrito...');
    // Solo inicializar si no existe ya una instancia
    if (!window.carritoManager) {
        window.carritoManager = CarritoManager.getInstance();
    }
});

// Función global para agregar productos al carrito desde otras páginas
window.agregarAlCarrito = function(productoId) {
    console.log('Función global agregarAlCarrito llamada:', productoId);
    if (window.carritoManager) {
        window.carritoManager.agregarAlCarrito(productoId);
    } else {
        console.error('CarritoManager no está inicializado');
        // Intentar inicializar
        window.carritoManager = CarritoManager.getInstance();
        setTimeout(() => {
            if (window.carritoManager) {
                window.carritoManager.agregarAlCarrito(productoId);
            }
        }, 100);
    }
};

// Función global para abrir el carrito desde otras páginas
window.abrirCarrito = function() {
    if (window.carritoManager) {
        window.carritoManager.abrirCarrito();
    }
};

// Función global para obtener el carrito desde otras páginas
window.obtenerCarrito = function() {
    return window.carritoManager ? window.carritoManager.obtenerCarrito() : [];
};

// Debug
console.log('Script carrito.js cargado');
