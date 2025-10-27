import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCarrito } from '../../contexts/CarritoContext';

export default function Carrito() {
  const { carrito, actualizarCantidad, eliminarProducto, obtenerTotal, vaciarCarrito } = useCarrito();

  const handlePagar = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    alert('¡Compra realizada con éxito!');
    vaciarCarrito();
  };

  return (
    <>
      <Header />
      <main className="main-content">
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513', marginBottom: '2rem' }}>
          Mi Carrito de Compras
        </h1>

        {carrito.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>El carrito está vacío.</p>
            <Link 
              to="/productos" 
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#8b4513',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginTop: '1rem'
              }}
            >
              Ver Productos
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            {/* Lista de productos */}
            <div>
              {carrito.map(producto => (
                <div 
                  key={producto.id} 
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <img 
                    src={`/img/${producto.imagen_principal?.split('/').pop()}`} 
                    alt={producto.nombre}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                      e.target.src = producto.imagen_principal;
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, color: '#8b4513' }}>{producto.nombre}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '4px 0' }}>
                      {producto.descripcion || producto.categoria}
                    </p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '4px 0 0 0' }}>
                      ${(producto.precio * producto.cantidad).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => actualizarCantidad(producto.id, -1)}
                      style={{
                        width: 32,
                        height: 32,
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: 30, textAlign: 'center' }}>{producto.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(producto.id, 1)}
                      style={{
                        width: 32,
                        height: 32,
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div style={{ 
              height: 'fit-content',
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Resumen</h3>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <span>Subtotal:</span>
                  <span>${obtenerTotal().toLocaleString()}</span>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <span>Envío:</span>
                  <span>Gratis</span>
                </p>
                <hr />
                <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>
                  <span>Total:</span>
                  <span>${obtenerTotal().toLocaleString()}</span>
                </p>
              </div>
              <button
                onClick={handlePagar}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#8b4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Proceder al pago
              </button>
              <button
                onClick={vaciarCarrito}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </>
  );
}

