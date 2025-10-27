import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';

export default function AdminProducto() {
  const [productos, setProductos] = useState([]);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [productoActual, setProductoActual] = useState({
    id: '',
    nombre: '',
    categoria: '',
    descripcion: '',
    precio: '',
    imagen_principal: '',
    imagen1: '',
    imagen2: '',
    imagen3: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch('/data/productos.json');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleAgregar = () => {
    setProductoActual({
      id: '',
      nombre: '',
      categoria: '',
      descripcion: '',
      precio: '',
      imagen_principal: '',
      imagen1: '',
      imagen2: '',
      imagen3: ''
    });
    setMostrandoFormulario(true);
  };

  const handleGuardar = async () => {
    if (!productoActual.nombre || !productoActual.precio || !productoActual.categoria) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const nuevoProducto = {
      ...productoActual,
      precio: parseInt(productoActual.precio)
    };

    if (productoActual.id) {
      // Editar
      const actualizados = productos.map(p => p.id === productoActual.id ? nuevoProducto : p);
      setProductos(actualizados);
      alert('Producto actualizado exitosamente');
    } else {
      // Nuevo producto
      const nuevoId = `P${Date.now()}`;
      setProductos([...productos, { ...nuevoProducto, id: nuevoId }]);
      alert('Producto agregado exitosamente');
    }

    setMostrandoFormulario(false);
    setProductoActual({
      id: '',
      nombre: '',
      categoria: '',
      descripcion: '',
      precio: '',
      imagen_principal: '',
      imagen1: '',
      imagen2: '',
      imagen3: ''
    });
  };

  const handleEliminar = (id) => {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;
    const actualizados = productos.filter(p => p.id !== id);
    setProductos(actualizados);
    alert('Producto eliminado exitosamente');
  };

  const handleEditar = (producto) => {
    setProductoActual({
      ...producto,
      precio: producto.precio.toString()
    });
    setMostrandoFormulario(true);
  };

  const categorias = ['Tortas Cuadradas', 'Tortas Circulares', 'Postres Individuales', 'Productos Sin Azúcar', 'Pastelería Tradicional', 'Productos Sin Gluten', 'Productos Veganos', 'Tortas Especiales'];

  return (
    <AdminLayout title="Gestión de Productos">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={handleAgregar}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#198754',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Agregar Producto
        </button>
        <button
          onClick={cargarProductos}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#0d6efd',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🔄 Actualizar
        </button>
      </div>

      {mostrandoFormulario && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>{productoActual.id ? 'Editar' : 'Nuevo'} Producto</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              placeholder="Nombre del producto"
              value={productoActual.nombre}
              onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={productoActual.categoria}
              onChange={(e) => setProductoActual({ ...productoActual, categoria: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">Seleccione categoría</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Descripción"
            value={productoActual.descripcion}
            onChange={(e) => setProductoActual({ ...productoActual, descripcion: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem', minHeight: '80px' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              placeholder="Precio"
              type="number"
              value={productoActual.precio}
              onChange={(e) => setProductoActual({ ...productoActual, precio: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleGuardar}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#8b4513',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Guardar
            </button>
            <button
              onClick={() => setMostrandoFormulario(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#6c757d',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3>Lista de Productos ({productos.length})</h3>
        {productos.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center' }}>No hay productos registrados</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Categoría</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Precio</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(producto => (
                  <tr key={producto.id}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{producto.id}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{producto.nombre}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{producto.categoria}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>${producto.precio.toLocaleString()}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => handleEditar(producto)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          background: '#0d6efd',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          marginRight: '8px'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(producto.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
