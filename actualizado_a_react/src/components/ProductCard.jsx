import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ producto }) {
  return (
    <div className="product-card" style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px',
      maxWidth: '300px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <img 
        src={producto.imagen_principal}
        alt={producto.nombre}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '4px'
        }}
      />
      <h3 style={{ marginTop: '12px', color: '#8b4513' }}>{producto.nombre}</h3>
      <p style={{ color: '#666', fontSize: '0.9em' }}>{producto.categoria}</p>
      <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c1810' }}>
        ${producto.precio.toLocaleString()}
      </p>
      <Link 
        to={`/productos/${producto.id}`}
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#8b4513',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '8px'
        }}
      >
        Ver detalle
      </Link>
    </div>
  );
}