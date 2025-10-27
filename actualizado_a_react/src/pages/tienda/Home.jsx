import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => res.json())
      .then(data => setProductos(data.slice(0, 6))) // Primeros 6 productos destacados
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container" style={{ padding: '2rem' }}>
          <div className="hero" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513', fontSize: '3rem', marginBottom: '1rem' }}>
              Bienvenido a Mil Sabores
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Tienda de repostería artesanal</p>
            <div style={{ marginTop: '2rem' }}>
              <Link 
                to="/productos" 
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#8b4513',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                className="btn-home"
              >
                Ver Productos
              </Link>
            </div>
          </div>

          <h2 style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem', color: '#8b4513' }}>
            Productos Destacados
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '2rem',
            padding: '2rem 0'
          }}>
            {productos.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
