// Función para mostrar los productos en la grilla
function mostrarProductos(productos) {
  const grid = document.getElementById('productos-grid');
  if (!grid) {
    console.error('El elemento con ID "productos-grid" no se encontró.');
    return;
  }

  productos.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto-container';
    
    // Crea el enlace con el ID del producto para la URL
    const urlDetalle = `detalle_producto.html?id=${producto.id}`;

    div.innerHTML = `
      <img src="${producto.imagen_principal}" alt="${producto.nombre}" class="producto-img">
      
      <a href="${urlDetalle}" class="enlace-titulo">
        <h2 class="producto-titulo">${producto.nombre}</h2>
      </a>
      
      <p class="producto-precio">$${producto.precio}</p>
      <button class="btn-añadir">Añadir</button>
    `;
    grid.appendChild(div);
  });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  fetch('../assets/data/productos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('La respuesta de la red no fue correcta');
      }
      return response.json();
    })
    .then(productos => {
      mostrarProductos(productos);
    })
    .catch(error => {
      console.error('Hubo un problema al obtener el archivo de productos:', error);
    });
});