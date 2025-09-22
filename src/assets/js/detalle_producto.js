document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');

    fetch('../assets/data/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            return response.json();
        })
        .then(productos => {
            const producto = productos.find(p => p.id === productoId);

            if (producto) {
                // Actualiza los elementos de la página con los datos del producto
                document.getElementById('producto-titulo').textContent = producto.nombre;
                document.getElementById('producto-precio').textContent = `$${producto.precio}`;
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
                ].filter(url => url);

                let imagenActualIndex = 0;
                
                const actualizarImagen = () => {
                    if (todasLasImagenes.length > 0) {
                        imagenPrincipal.src = todasLasImagenes[imagenActualIndex];
                    } else {
                        imagenPrincipal.src = 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible';
                    }
                };
                
                // Carga las miniaturas
                miniaturas.forEach((miniatura, index) => {
                    const imagenUrl = todasLasImagenes[index + 1];
                    if (imagenUrl) {
                        miniatura.src = imagenUrl;
                        miniatura.alt = `Miniatura ${index + 1}`;
                        miniatura.style.display = 'block';
                    } else {
                        miniatura.style.display = 'none';
                    }
                });
                
                // Maneja los clics de los botones de navegación
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
                
                // Maneja los clics de las miniaturas
                miniaturas.forEach((miniatura, index) => {
                    miniatura.addEventListener('click', () => {
                        imagenActualIndex = index + 1;
                        actualizarImagen();
                    });
                });
                
                // Muestra la primera imagen al cargar la página
                actualizarImagen();

            } else {
                document.getElementById('producto-detalle-container').innerHTML = '<p class="text-center text-danger">Producto no encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Hubo un problema al obtener los productos:', error);
            document.getElementById('producto-detalle-container').innerHTML = '<p class="text-center text-danger">Error al cargar los detalles del producto.</p>';
        });
});