import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CarritoContext';
import { showToast } from '../utils/toast';
import '../styles/components/ProductCard.css';

export default function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const handleAgregar = (e) => {
    e.preventDefault();
    if (producto.stock === 0) {
      showToast('error', 'Producto agotado');
      return;
    }
    if (typeof producto.stock === 'number' && producto.stock < 1) {
      showToast('error', 'Producto agotado');
      return;
    }
    agregarAlCarrito({ ...producto, cantidad: 1 });
    showToast('success', 'Producto agregado al carrito!');
  };

  return (
    <div className="product-card">
      <img
        className="product-image"
        src={`/img/${producto.imagen_principal.split('/').pop()}`}
        alt={producto.nombre}
        onError={(e) => { e.target.src = producto.imagen_principal; }}
      />
      {typeof producto.stock === 'number' && producto.stock <= 5 && producto.stock > 0 && (
        <div className="stock-badge low">Últimas unidades</div>
      )}
      {typeof producto.stock === 'number' && producto.stock === 0 && (
        <div className="stock-badge out">Agotado</div>
      )}
      <h3 className="product-title">{producto.nombre}</h3>
      <p className="product-category">{producto.categoria}</p>
      <p className="product-price">
        {producto.oferta ? (
          <span>
            <span style={{ textDecoration: 'line-through', color: '#a0a0a0', marginRight: 8 }}>{"$" + producto.precio.toLocaleString()}</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>{"$" + (producto.precio - (producto.oferta.type === 'percentage' ? (producto.precio * (producto.oferta.value/100)) : (producto.oferta.value || 0))).toLocaleString()}</span>
          </span>
        ) : ('$' + producto.precio.toLocaleString())}
      </p>
      {producto.oferta && (
        <div style={{ position: 'absolute', top: 8, left: 8, background: '#ff7043', color: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>
          {producto.oferta.label || (producto.oferta.type === 'percentage' ? `-${producto.oferta.value}%` : ("$" + producto.oferta.value + " off"))}
        </div>
      )}
      <div className="product-actions">
        <Link to={`/productos/${producto.id}`} className="detail-btn">Ver detalle</Link>
        <button onClick={handleAgregar} className="add-btn">🛒</button>
      </div>
    </div>
  );
}