import React from 'react';

export default function Productos(){
  return (
    <div className="container">
      <div className="hero">
        <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Productos</h1>
        <p className="muted">Nuestros productos destacados.</p>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <img src="/assets/img/torta_cuadrada_frutas.png" alt="Torta frutas" />
          <h3>Torta frutal</h3>
          <p className="muted">Fresca y colorida.</p>
        </div>
        <div className="card">
          <img src="/assets/img/torta_circular_vainilla.jpg" alt="Torta vainilla" />
          <h3>Torta vainilla</h3>
          <p className="muted">Suave y tradicional.</p>
        </div>
      </div>
    </div>
  );
}
