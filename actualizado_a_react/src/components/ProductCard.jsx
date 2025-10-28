import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CarritoContext';
import '../styles/components/ProductCard.css';

export default function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const handleAgregar = (e) => {
    e.preventDefault();
    agregarAlCarrito({ ...producto, cantidad: 1 });
    alert('Producto agregado al carrito!');
  };

  return (
    <div className="product-card">
      <img
        className="product-image"
        src={`/img/${producto.imagen_principal.split('/').pop()}`}
        alt={producto.nombre}
        onError={(e) => { e.target.src = producto.imagen_principal; }}
      />
      <h3 className="product-title">{producto.nombre}</h3>
      <p className="product-category">{producto.categoria}</p>
      <p className="product-price">${producto.precio.toLocaleString()}</p>
      <div className="product-actions">
        <Link to={`/productos/${producto.id}`} className="detail-btn">Ver detalle</Link>
        <button onClick={handleAgregar} className="add-btn">🛒</button>
      </div>
    </div>
  );
}