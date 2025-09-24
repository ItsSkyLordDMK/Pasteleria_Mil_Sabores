let productosJSON = [];

// Muestra los productos en la grilla
function mostrarProductos(productos) {
  const grid = document.getElementById("productos-grid");
  if (!grid) {
    console.error('El elemento con ID "productos-grid" no se encontró.');
    return;
  }

  grid.innerHTML = '';

  // Crear y añadir cada producto al grid
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.className = "producto-container";

    // Crear URL para el detalle del producto
    const urlDetalle = `detalle_producto.html?id=${producto.id}`;

    //
    div.innerHTML = `
      <img src="${producto.imagen_principal}" alt="${producto.nombre}" class="producto-img">
      
      <a href="${urlDetalle}" class="enlace-titulo">
        <h2 class="producto-titulo">${producto.nombre}</h2>
      </a>
      
      <p class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</p>
      <button class="btn-añadir" data-id="${producto.id}">
        <i class="bi bi-cart-plus"></i> Añadir
      </button>
    `;
    grid.appendChild(div);
  });

  console.log('Productos mostrados:', productos.length);
}

// Cargar productos desde el JSON al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  console.log('Cargando productos...');
  
  // Ruta 
  fetch("../assets/data/productos.json")
    .then((response) => {
      // Verificar si la respuesta es correcta
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    // Procesar los productos cargados
    .then((productos) => {
      productosJSON = productos;
      mostrarProductos(productos);
      console.log('Productos cargados exitosamente');
    })
    .catch((error) => {
      console.error("Error al cargar productos:", error);
    });

  // Código del header (tu código original)
  const header = document.querySelector(".topbar");
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Función para manejar el scroll
  function onScroll() {
    if (window.innerWidth <= 768) {
      if (window.scrollY > lastScrollY) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }
      lastScrollY = window.scrollY;
    } else {
      header.style.transform = "translateY(0)";
    }
    ticking = false;
  }

  // Escuchar el evento de scroll
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
});

