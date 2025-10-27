import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCarrito } from '../../contexts/CarritoContext';

export default function DetalleProducto() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenActualIndex, setImagenActualIndex] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/data/productos.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((productos) => {
        const encontrado = productos.find((p) => p.id === id);
        if (encontrado) setProducto(encontrado);
        else setProducto(null);
      })
      .catch((err) => {
        console.error('Error cargando productos:', err);
        setError(err.message || 'Error al cargar datos');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Cargando producto...</div>;
  if (error) return (
    <div style={{ padding: 20 }}>
      <h2>Error</h2>
      <p>{error}</p>
      <Link to="/productos">Volver a productos</Link>
    </div>
  );

  if (!producto) return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: '#dc3545' }}>Producto no encontrado</h2>
      <p>No se pudo encontrar el producto con ID: {id}</p>
      <Link to="/productos" style={{
        display: 'inline-block',
        padding: '8px 16px',
        backgroundColor: '#8b4513',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        marginTop: '1rem'
      }}>Volver a productos</Link>
    </div>
  );

  const todasLasImagenes = [
    producto.imagen_principal,
    producto.imagen1,
    producto.imagen2,
    producto.imagen3
  ].filter((u) => u && u.trim() !== '');

  const handlePrevImage = () => setImagenActualIndex((prev) => (prev - 1 + todasLasImagenes.length) % todasLasImagenes.length);
  const handleNextImage = () => setImagenActualIndex((prev) => (prev + 1) % todasLasImagenes.length);

  const handleCantidadChange = (e) => {
    let v = parseInt(e.target.value, 10);
    if (Number.isNaN(v) || v < 1) v = 1;
    if (v > 10) v = 10;
    setCantidad(v);
  };

  const handleAgregarAlCarrito = () => {
    try {
      agregarAlCarrito({ ...producto, cantidad });
      setMensaje('¡Producto agregado al carrito!');
      setTimeout(() => setMensaje(''), 2000);
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      setMensaje('No se pudo agregar al carrito');
      setTimeout(() => setMensaje(''), 2000);
    }
  };

  return (
    <>
      <Header />
      <main className="main-content">
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Imágenes */}
        <div>
          <div style={{ position: 'relative' }}>
            <img
              src={todasLasImagenes[imagenActualIndex]}
              alt={producto.nombre}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />

            {todasLasImagenes.length > 1 && (
              <>
                <button onClick={handlePrevImage} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer' }}>←</button>
                <button onClick={handleNextImage} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer' }}>→</button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: '1rem', justifyContent: 'center' }}>
            {todasLasImagenes.map((img, idx) => (
              <img key={idx} src={img} alt={`Mini ${idx+1}`} onClick={() => setImagenActualIndex(idx)} style={{ width: 60, height: 60, objectFit: 'cover', cursor: 'pointer', border: idx === imagenActualIndex ? '2px solid #8b4513' : '2px solid transparent', borderRadius: 4 }} />
            ))}
          </div>
        </div>

        {/* Información */}
        <div>
          <h1 style={{ color: '#8b4513', marginBottom: '1rem' }}>{producto.nombre}</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1rem' }}>{producto.descripcion}</p>
          <p style={{ fontSize: '2rem', color: '#8b4513', fontWeight: 'bold', marginBottom: '1rem' }}>${producto.precio.toLocaleString()}</p>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="cantidad" style={{ marginRight: '1rem' }}>Cantidad:</label>
            <input id="cantidad" type="number" min="1" max="10" value={cantidad} onChange={handleCantidadChange} style={{ width: 60, padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4 }} />
          </div>

          <button onClick={handleAgregarAlCarrito} style={{ backgroundColor: '#8b4513', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 4, fontSize: '1.1rem', cursor: 'pointer', width: '100%' }}>Agregar al carrito</button>

          {mensaje && (
            <div style={{ marginTop: '1rem', padding: 10, backgroundColor: '#4CAF50', color: 'white', borderRadius: 4, textAlign: 'center' }}>{mensaje}</div>
          )}
        </div>
      </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
