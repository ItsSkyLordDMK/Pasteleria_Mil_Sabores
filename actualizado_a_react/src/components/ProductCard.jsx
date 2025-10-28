import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CarritoContext';

export default function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const handleAgregar = (e) => {
    e.preventDefault();
    agregarAlCarrito({ ...producto, cantidad: 1 });
    alert('Producto agregado al carrito!');
  };

  return (
    <div className="product-card" style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      width: '100%'
    }}>
      <img 
        src={`/img/${producto.imagen_principal.split('/').pop()}`}
        alt={producto.nombre}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '4px'
        }}
        onError={(e) => {
          e.target.src = producto.imagen_principal;
        }}
      />
      <h3 style={{ marginTop: '12px', color: '#8b4513', fontSize: '1.1rem' }}>{producto.nombre}</h3>
      <p style={{ color: '#666', fontSize: '0.9em', marginTop: '4px' }}>{producto.categoria}</p>
      <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c1810', marginTop: '8px' }}>
        ${producto.precio.toLocaleString()}
      </p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <Link 
          to={`/productos/${producto.id}`}
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: '#8b4513',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}
        >
          Ver detalle
        </Link>
        <button
          onClick={handleAgregar}
          style={{
            padding: '8px 12px',
            backgroundColor: '#ffc107',
            color: '#8b4513',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          🛒
        </button>
      </div>
    </div>
  );
}