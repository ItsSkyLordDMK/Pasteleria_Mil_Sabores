import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCarrito } from '../../contexts/CarritoContext';
import { getMergedProducts, saveStoredProducts, getStoredProducts } from '../../utils/products';
import { addOrder } from '../../utils/orders';
import { getSession } from '../../utils/auth';
import { showToast } from '../../utils/toast';
import { calculateItemPricing } from '../../utils/offers';

export default function Carrito() {
  const navigate = useNavigate();
  const { carrito, actualizarCantidad, eliminarProducto, obtenerTotal, vaciarCarrito } = useCarrito();
  const handleIncrement = async (producto) => {
    try {
      const productos = await getMergedProducts();
      const prod = productos.find(p => p.id === producto.id);
      if (prod && typeof prod.stock === 'number') {
        const disponible = prod.stock;
        if (producto.cantidad + 1 > disponible) {
          showToast('error', `No hay más stock disponible de ${producto.nombre}. Disponible: ${disponible}`);
          return;
        }
      }
      actualizarCantidad(producto.id, 1);
    } catch (err) {
      console.error('Error comprobando stock:', err);
      actualizarCantidad(producto.id, 1);
    }
  };

  const handlePagar = () => {
    if (carrito.length === 0) {
      showToast('info', 'El carrito está vacío');
      return;
    }
    // validate stock availability
    (async () => {
      try {
        const productos = await getMergedProducts();
        const map = new Map(productos.map(p => [p.id, p]));

        for (const item of carrito) {
          const prod = map.get(item.id);
          if (!prod) {
            showToast('error', `El producto ${item.nombre} ya no está disponible`);
            return;
          }
          if (typeof prod.stock === 'number' && item.cantidad > prod.stock) {
            showToast('error', `No hay suficiente stock de ${item.nombre}. Disponible: ${prod.stock}`);
            return;
          }
        }

        // decrement stock and save overrides
        const merged = productos.map(p => ({ ...p }));
        const updated = merged.map(p => {
          const cartItem = carrito.find(c => c.id === p.id);
          if (cartItem) {
            const newStock = (typeof p.stock === 'number' ? p.stock : 0) - cartItem.cantidad;
            return { ...p, stock: Math.max(0, newStock) };
          }
          return p;
        });

        // Save overrides in stored products (we only save the overridden list)
        saveStoredProducts(updated);
        // create order — include pricing breakdown (offers applied)
        const session = getSession();
        const itemsWithPricing = carrito.map(i => {
          // keep original fields but compute final unit price using offers util
          const prod = productos.find(p => p.id === i.id) || i;
          const pricing = calculateItemPricing(prod);
          const precio_original = Number(i.precio || pricing.unitPrice || 0);
          const descuento_unitario = pricing.discountPerUnit || 0;
          const precio_unitario_final = pricing.finalUnitPrice || precio_original;
          const subtotal = precio_unitario_final * i.cantidad;
          return {
            id: i.id,
            nombre: i.nombre,
            cantidad: i.cantidad,
            precio_original,
            descuento_unitario,
            precio_unitario_final,
            subtotal,
            oferta: prod.oferta || null
          };
        });

        const total = itemsWithPricing.reduce((s, it) => s + (it.subtotal || 0), 0);

        const orden = {
          id: `O${Date.now()}`,
          fecha: new Date().toISOString(),
          usuario: session ? { correo: session.correo, nombre: session.nombre, run: session.run, telefono: session.telefono, direccion: session.direccion } : null,
          items: itemsWithPricing,
          total
        };
        addOrder(orden);

        showToast('success', '¡Compra realizada con éxito!');
        vaciarCarrito();
        // notify other components
        try { window.dispatchEvent(new Event('productosUpdated')); } catch(e){}
        // redirect to thank-you page with order id
        try {
          navigate('/gracias', { state: { ordenId: orden.id } });
        } catch (e) {
          // ignore navigation errors
        }
      } catch (err) {
        console.error('Error procesando pago:', err);
  showToast('error', 'Ocurrió un error procesando la compra');
      }
    })();
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
                      {(() => {
                        try {
                          const pricing = calculateItemPricing(producto);
                          return `$${(pricing.finalUnitPrice * producto.cantidad).toLocaleString()}`;
                        } catch (e) {
                          return `$${(producto.precio * producto.cantidad).toLocaleString()}`;
                        }
                      })()}
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
                      onClick={() => handleIncrement(producto)}
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

