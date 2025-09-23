// Obtiene los productos almacenados en localStorage
function obtenerProductos() {
  let productos = [];
  try {
    const raw = localStorage.getItem('productosRegistrados');
    if (raw) {
      const HEX_RE = /^[0-9a-f]+$/i;
      function isHexLike(s) { return typeof s === 'string' && s.length % 2 === 0 && HEX_RE.test(s); }
      function hexToString(hex) { let out = ''; for (let i = 0; i < hex.length; i += 2) { out += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); } return out; }
      const json = isHexLike(raw) ? hexToString(raw) : raw;
      productos = JSON.parse(json);
    }
  } catch {}
  return productos;
}

// Renderiza la tabla de productos
function renderTablaProductos(productos, tablaDiv) {
  if (!productos.length) { tablaDiv.innerHTML = '<div style="color:#B71C1C;">No hay productos registrados.</div>'; return; }
  let html = '<table style="width:100%;border-collapse:collapse;background:#fff;"><thead><tr>';
  html += '<th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th></tr></thead><tbody>';
  productos.forEach(p => {
    html += `<tr><td>${p.id}</td><td>${p.nombre}</td><td>${p.precio}</td><td>${p.stock}</td><td>${p.categoria||''}</td></tr>`;
  });
  html += '</tbody></table>';
  tablaDiv.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  const btns = document.querySelectorAll('.product-action-btn');
  const [btnAgregar, btnEditar, btnMostrar] = btns;
  let tablaDiv = document.getElementById('tablaProductos');
  if (!tablaDiv) {
    tablaDiv = document.createElement('div');
    tablaDiv.id = 'tablaProductos';
    tablaDiv.style.marginTop = '32px';
    tablaDiv.style.display = 'none';
    document.body.appendChild(tablaDiv);
  }

  if (btnMostrar) {
    btnMostrar.addEventListener('click', function() {
      const productos = obtenerProductos();
      renderTablaProductos(productos, tablaDiv);
      tablaDiv.style.display = 'block';
    });
  }

  if (btnEditar) {
    btnEditar.addEventListener('click', function() {
      let id = prompt('Ingrese el ID del producto a editar:');
      if (!id) return;
      let productos = obtenerProductos();
      let producto = productos.find(p => p.id == id);
      if (!producto) { alert('Producto no encontrado.'); return; }
  // Aquí deberías mostrar un formulario/modal para editar el producto
      let nombre = prompt('Nuevo nombre:', producto.nombre);
      let precio = prompt('Nuevo precio:', producto.precio);
      let stock = prompt('Nuevo stock:', producto.stock);
      let categoria = prompt('Nueva categoría:', producto.categoria||'');
      if (!nombre || !precio || !stock) return;
      let idx = productos.findIndex(p => p.id == id);
      productos[idx] = { ...productos[idx], nombre, precio, stock, categoria };
      try {
        const json = JSON.stringify(productos);
  // Convierte un string a hexadecimal
  function stringToHex(str) { return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); }
        localStorage.setItem('productosRegistrados', stringToHex(json));
        alert('Producto editado exitosamente.');
        tablaDiv.style.display = 'none';
      } catch (e) { alert('No se pudo editar el producto.'); }
    });
  }

  if (btnAgregar) {
    btnAgregar.addEventListener('click', function() {
      let id = prompt('ID del producto:');
      let nombre = prompt('Nombre del producto:');
      let precio = prompt('Precio:');
      let stock = prompt('Stock:');
      let categoria = prompt('Categoría:');
      if (!id || !nombre || !precio || !stock) return;
      let productos = obtenerProductos();
      if (productos.find(p => p.id == id)) { alert('Ya existe un producto con ese ID.'); return; }
      productos.push({ id, nombre, precio, stock, categoria });
      try {
        const json = JSON.stringify(productos);
  // Convierte un string a hexadecimal
  function stringToHex(str) { return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); }
        localStorage.setItem('productosRegistrados', stringToHex(json));
        alert('Producto agregado exitosamente.');
        tablaDiv.style.display = 'none';
      } catch (e) { alert('No se pudo agregar el producto.'); }
    });
  }

  // Botón eliminar producto
  let btnEliminar = document.getElementById('btnEliminarProducto');
  if (!btnEliminar) {
    btnEliminar = document.createElement('button');
    btnEliminar.className = 'product-action-btn';
    btnEliminar.id = 'btnEliminarProducto';
    btnEliminar.innerHTML = '<i class="bi bi-trash"></i> Eliminar producto';
    document.querySelector('.product-actions').appendChild(btnEliminar);
  }
  btnEliminar.addEventListener('click', function() {
    let id = prompt('Ingrese el ID del producto a eliminar:');
    if (!id) return;
    let productos = obtenerProductos();
    let idx = productos.findIndex(p => p.id == id);
    if (idx === -1) { alert('Producto no encontrado.'); return; }
    if (!confirm('¿Está seguro de borrar este producto?')) return;
    productos.splice(idx, 1);
    try {
      const json = JSON.stringify(productos);
      function stringToHex(str) { return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); }
      localStorage.setItem('productosRegistrados', stringToHex(json));
      alert('Producto eliminado exitosamente.');
      tablaDiv.style.display = 'none';
    } catch (e) { alert('No se pudo eliminar el producto.'); }
  });
});
