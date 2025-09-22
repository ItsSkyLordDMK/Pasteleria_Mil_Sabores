document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtiene el ID del producto de la URL
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');

    // 2. Carga el JSON de productos
    fetch('../assets/data/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            return response.json();
        })
        .then(productos => {
            // 3. Busca el producto que coincide con el ID de la URL
            const producto = productos.find(p => p.id === productoId);

            if (producto) {
                const imagenPrincipal = document.getElementById('producto-imagen');
                const miniaturas = document.querySelectorAll('.mini-imagen');
                const prevBtn = document.querySelector('.prev-btn');
                const nextBtn = document.querySelector('.next-btn');

                // Prepara un array con todas las imágenes
                const todasLasImagenes = [
                    producto.imagen_principal,
                    producto.imagen1,
                    producto.imagen2,
                    producto.imagen3
                ].filter(url => url);

                let imagenActualIndex = 0;
                
                const actualizarImagen = () => {
                    if (todasLasImagenes.length > 0) {
                        imagenPrincipal.src = todasLasImagenes[imagenActualIndex];
                    } else {
                        imagenPrincipal.src = 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible';
                    }
                };

                // Asigna URLs a las miniaturas
                if (miniaturas.length > 0) {
                    miniaturas[0].src = todasLasImagenes[1] || 'https://via.placeholder.com/150';
                    miniaturas[1].src = todasLasImagenes[2] || 'https://via.placeholder.com/150';
                    miniaturas[2].src = todasLasImagenes[3] || 'https://via.placeholder.com/150';
                }
                
                // Lógica de navegación con botones
                if (prevBtn && nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        imagenActualIndex = (imagenActualIndex + 1) % todasLasImagenes.length;
                        actualizarImagen();
                    });

                    prevBtn.addEventListener('click', () => {
                        imagenActualIndex = (imagenActualIndex - 1 + todasLasImagenes.length) % todasLasImagenes.length;
                        actualizarImagen();
                    });
                }
                
                // Lógica para que las miniaturas cambien la imagen principal
                miniaturas.forEach((miniatura, index) => {
                    miniatura.addEventListener('click', () => {
                        imagenActualIndex = index + 1;
                        if (imagenActualIndex < todasLasImagenes.length) {
                             actualizarImagen();
                        }
                    });
                });
                
                // Carga inicial de la imagen principal
                actualizarImagen();

                // Llena el resto de la información del producto
                document.getElementById('producto-titulo').textContent = producto.nombre;
                document.getElementById('producto-precio').textContent = `$${producto.precio}`;
                document.getElementById('producto-descripcion').textContent = producto.descripcion;

            } else {
                document.getElementById('producto-detalle-container').innerHTML = '<p class="text-center text-danger">Producto no encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Hubo un problema al obtener los productos:', error);
            document.getElementById('producto-detalle-container').innerHTML = '<p class="text-center text-danger">Error al cargar los detalles del producto.</p>';
        });
});