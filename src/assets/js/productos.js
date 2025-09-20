// Array de productos en formato JSON
const productos = [
  {
    "titulo": "Torta Cuadrada de Chocolate",
    "precio": 45000,
    "imagen": "https://i.pinimg.com/736x/6b/20/cc/6b20cc37ec72db641e87577eecfb731b.jpg"
  },
  {
    "titulo": "Torta Cuadrada de Frutas ",
    "precio": 50000,
    "imagen": "https://th.bing.com/th/id/R.7a3baf119747284c3bcc310fcdfe5790?rik=GrjPEv5%2bbvPQXA&riu=http%3a%2f%2fwww.festas.biz%2fwp-content%2fuploads%2f2020%2f07%2fbolo-decorado-com-frutas-quadrado-11.png&ehk=MM4Rjkw6%2b7IOEg19sgZk7Awb1OILMlmOshIDzbI%2bScA%3d&risl=&pid=ImgRaw&r=0"
  },
  {
    "titulo": "Torta Circular de Vainilla",
    "precio": 40000,
    "imagen": "https://tortamaniaecuador.com/wp-content/uploads/2021/12/Tradicional-de-Vainilla.jpg"
  },
  {
    "titulo": "Torta Circular de Manjar",
    "precio": 42000,
    "imagen": ""
  },
  {
    "titulo": "Mousse de Chocolate",
    "precio": 5000,
    "imagen": "https://static.vecteezy.com/system/resources/previews/045/701/144/original/chocolate-mousse-in-a-glass-on-transparent-background-free-png.png"
  },
  {
    "titulo": "Tiramisú Clásico",
    "precio": 5500,
    "imagen": "https://static.vecteezy.com/system/resources/thumbnails/032/069/302/small_2x/classic-italian-tiramisu-cake-isolated-on-transparent-background-ai-generative-free-png.png"
  },
  {
    "titulo": "Torta Sin Azúcar De Naranja",
    "precio": 48000,
    "imagen": "https://thumbs.dreamstime.com/b/tarta-de-naranja-vainilla-aislada-en-blanco-pastel-aislado-con-fondo-227909177.jpg"
  },
  {
    "titulo": "Cheesecake Sin Azúcar",
    "precio": 47000,
    "imagen": "https://img.freepik.com/fotos-premium/fondo-blanco-tarta-queso-fresa-aislado_978190-703.jpg?w=2000"
  },
  {
    "titulo": "Empanada de Manzana",
    "precio": 3000,
    "imagen": "../assets/img/empanada.png"
  },
  {
    "titulo": "Tarta de Santiago",
    "precio": 6000,
    "imagen": ""
  },
  {
    "titulo": "Brownie Sin Gluten",
    "precio": 4000,
    "imagen": ""
  },
  {
    "titulo": "Pan Sin Gluten",
    "precio": 3500,
    "imagen": ""
  },
  {
    "titulo": "Torta Vegana de Chocolate",
    "precio": 50000,
    "imagen": ""
  },
  {
    "titulo": "Galletas Veganas de Avena",
    "precio": 4500,
    "imagen": ""
  },
  {
    "titulo": "Torta Especial de Cumpleaños",
    "precio": 55000,
    "imagen": ""
  },
  {
    "titulo": "Torta Especial de Bodas",
    "precio": 60000,
    "imagen":""
  }
];

// Función para mostrar los productos en la grilla
function mostrarProductos() {
  const grid = document.getElementById('productos-grid');
  if (!grid) return;

  productos.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto-container';
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-img">
      <h2 class="producto-titulo">${producto.titulo}</h2>
      <p class="producto-precio">$${producto.precio}</p>
      <button class="btn-añadir">Añadir</button>
    `;
    grid.appendChild(div);
  });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', mostrarProductos);