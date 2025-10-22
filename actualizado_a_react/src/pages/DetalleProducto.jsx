import React from 'react';

export default function DetalleProducto(){
  return (
    <div className="container">
      <div className="hero">
        <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Detalle del Producto</h1>
      </div>
      <div style={{ marginTop: 12 }}>
        <div className="card">
          <img src="/assets/img/tv_mini_1.jpg" alt="Producto" />
          <h3>Nombre del producto</h3>
          <p className="muted">Descripción breve del producto.</p>
        </div>
      </div>
    </div>
  );
}
