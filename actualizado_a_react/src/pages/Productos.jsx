import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import productosData from '../../public/data/productos.json';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  useEffect(() => {
    setProductos(productosData);
  }, []);

  const categorias = ['Todas', ...new Set(productosData.map(p => p.categoria))];

  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <>
      <Header />
      <div className="container">
      <div className="hero">
        <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Nuestros Productos</h1>
        <p className="muted">Descubre nuestra variedad de productos</p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {categorias.map(categoria => (
          <button
            key={categoria}
            onClick={() => setCategoriaSeleccionada(categoria)}
            style={{
              padding: '8px 16px',
              backgroundColor: categoriaSeleccionada === categoria ? '#8b4513' : 'white',
              color: categoriaSeleccionada === categoria ? 'white' : '#8b4513',
              border: '1px solid #8b4513',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="grid" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: '20px'
      }}>
        {productosFiltrados.map(producto => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
    </>
  );
}
