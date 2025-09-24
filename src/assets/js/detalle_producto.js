// detalle_producto.js - Con funcionalidad del carrito

// Obtener el ID del producto desde la URL
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');

    console.log('Cargando detalle del producto:', productoId);

    // Validar que se haya proporcionado un ID
    fetch('../assets/data/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        // Procesar los productos cargados
        .then(productos => {
            console.log('Productos cargados:', productos.length);
            const producto = productos.find(p => p.id === productoId);

            // Verificar si se encontró el producto
            if (producto) {
                console.log('Producto encontrado:', producto.nombre);
                
                // Actualiza los elementos de la página con los datos del producto
                document.getElementById('producto-titulo').textContent = producto.nombre;
                document.getElementById('producto-precio').textContent = `$${producto.precio.toLocaleString('es-CL')}`;
                document.getElementById('producto-descripcion').textContent = producto.descripcion;

                // Elementos del carrusel y las miniaturas
                const imagenPrincipal = document.getElementById('producto-imagen');
                const miniaturas = document.querySelectorAll('.mini-imagen');
                const prevBtn = document.querySelector('.prev-btn');
                const nextBtn = document.querySelector('.next-btn');
                
                // Lista de todas las URLs de las imágenes
                const todasLasImagenes = [
                    producto.imagen_principal,
                    producto.imagen1,
                    producto.imagen2,
                    producto.imagen3
                ].filter(url => url && url.trim() !== '');

                // Índice de la imagen actualmente mostrada
                let imagenActualIndex = 0;
                
                // Función para actualizar la imagen principal
                const actualizarImagen = () => {
                    if (todasLasImagenes.length > 0) {
                        imagenPrincipal.src = todasLasImagenes[imagenActualIndex];
                    } else {
                        imagenPrincipal.src = 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible';
                    }
                };
                
                // Carga las miniaturas
                miniaturas.forEach((miniatura, index) => {
                    const imagenUrl = todasLasImagenes[index + 1]; // +1 porque la primera es la principal
                    
                    if (imagenUrl) {
                        miniatura.src = imagenUrl;
                        miniatura.alt = `Miniatura ${index + 1}`;
                        miniatura.style.display = 'block';
                        miniatura.style.cursor = 'pointer';
                    } else {
                        miniatura.style.display = 'none';
                    }
                });
                
                // Maneja los clics de los botones de navegación
                if (prevBtn && nextBtn && todasLasImagenes.length > 1) {
                    nextBtn.addEventListener('click', () => {
                        imagenActualIndex = (imagenActualIndex + 1) % todasLasImagenes.length;
                        actualizarImagen();
                    });

                    // Maneja el clic en el botón anterior
                    prevBtn.addEventListener('click', () => {
                        imagenActualIndex = (imagenActualIndex - 1 + todasLasImagenes.length) % todasLasImagenes.length;
                        actualizarImagen();
                    });
                    // Mostrar botones si hay más de una imagen
                } else if (todasLasImagenes.length <= 1) {
                    // Ocultar botones si solo hay una imagen
                    if (prevBtn) prevBtn.style.display = 'none';
                    if (nextBtn) nextBtn.style.display = 'none';
                }
                
                // Maneja los clics de las miniaturas
                miniaturas.forEach((miniatura, index) => {
                    miniatura.addEventListener('click', () => {
                        imagenActualIndex = index + 1; // +1 porque la primera es la principal
                        if (imagenActualIndex < todasLasImagenes.length) {
                            actualizarImagen();
                        }
                    });
                });
                
                // Muestra la primera imagen al cargar la página
                actualizarImagen();

                // ===========================
                // FUNCIONALIDAD DEL CARRITO
                // ===========================
                
                // Configurar el botón de añadir al carrito
                const btnAnadirCarrito = document.getElementById('btn-anadir-carro');
                // Input de cantidad
                const inputCantidad = document.getElementById('cantidad');
                
                // Validar que existan los elementos
                if (btnAnadirCarrito && inputCantidad) {
                    console.log('Botón de carrito configurado');
                    
                    // Maneja el clic en el botón de añadir al carrito
                    btnAnadirCarrito.addEventListener('click', () => {
                        const cantidad = parseInt(inputCantidad.value) || 1;
                        
                        // Validar cantidad
                        if (cantidad < 1) {
                            alert('La cantidad debe ser mayor a 0');
                            inputCantidad.value = 1;
                            return;
                        }
                        
                        // Limitar la cantidad máxima a 10
                        if (cantidad > 10) {
                            alert('La cantidad máxima es 10 unidades');
                            inputCantidad.value = 10;
                            return;
                        }
                        
                        // Agregar al carrito
                        console.log(`Agregando ${cantidad} unidades del producto ${productoId}`);
                        
                        // Verificar que el carrito esté disponible
                        if (window.agregarAlCarrito) {
                            // Agregar la cantidad especificada
                            // Si cantidad es 1, agregar una vez
                            // Si cantidad es 3, agregar 3 veces (para que se sume en el carrito)
                            for (let i = 0; i < cantidad; i++) {
                                window.agregarAlCarrito(productoId);
                            }
                            
                            // Feedback visual al usuario
                            const textoOriginal = btnAnadirCarrito.textContent;
                            btnAnadirCarrito.textContent = 'Agregado al carrito!';
                            btnAnadirCarrito.classList.add('btn-success');
                            btnAnadirCarrito.disabled = true;
                            
                            // Restaurar el botón después de 2 segundos
                            setTimeout(() => {
                                btnAnadirCarrito.textContent = textoOriginal;
                                btnAnadirCarrito.classList.remove('btn-success');
                                btnAnadirCarrito.disabled = false;
                            }, 2000);
                            
                            // Resetear la cantidad a 1
                            inputCantidad.value = 1;
                            
                        // Si el carrito no está disponible, mostrar un error
                        } else {
                            console.error('Sistema de carrito no disponible');
                            alert('Error: No se pudo agregar al carrito. Intenta recargar la página.');
                        }
                    });
                    
                    // Validación en tiempo real del input de cantidad
                    inputCantidad.addEventListener('input', () => {
                        const valor = parseInt(inputCantidad.value);
                        if (valor < 1) {
                            inputCantidad.value = 1;
                        } else if (valor > 10) {
                            inputCantidad.value = 10;
                        }
                    });
                    
                    // Prevenir valores negativos con las teclas
                    inputCantidad.addEventListener('keydown', (e) => {
                        // Permitir: backspace, delete, tab, escape, enter
                        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                            // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                            (e.keyCode === 65 && e.ctrlKey === true) ||
                            (e.keyCode === 67 && e.ctrlKey === true) ||
                            (e.keyCode === 86 && e.ctrlKey === true) ||
                            (e.keyCode === 88 && e.ctrlKey === true) ||
                            // Permitir: home, end, left, right
                            (e.keyCode >= 35 && e.keyCode <= 39)) {
                            return;
                        }
                        // Asegurar que es un número y detener keypress si no lo es
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                        }
                    });
                    
                
                } else {
                    console.error('Botón de agregar al carrito o input de cantidad no encontrado');
                }

            // Si no se encontró el producto, mostrar un mensaje de error
            } else {
                console.error('Producto no encontrado con ID:', productoId);
                document.getElementById('producto-detalle-container').innerHTML = `
                    <div class="text-center">
                        <h2 class="text-danger">Producto no encontrado</h2>
                        <p>No se pudo encontrar el producto con ID: ${productoId}</p>
                        <a href="productos.html" class="btn" style="background-color: var(--color-acento-chocolate); color: white;">Volver a productos</a>
                    </div>
                `;
            }
        })
        // Capturar errores en la carga del JSON
        .catch(error => {
            console.error('Error al cargar productos:', error);
            document.getElementById('producto-detalle-container').innerHTML = `
                <div class="text-center">
                    <h2 class="text-danger">Error al cargar el producto</h2>
                    <p>Hubo un problema al cargar los detalles del producto.</p>
                    <p class="text-muted">Error: ${error.message}</p>
                    <a href="productos.html" class="btn" style="background-color: var(--color-acento-chocolate); color: white;">Volver a productos</a>
                </div>
            `;
        });
});
console.log('Script detalle_producto.js cargado');