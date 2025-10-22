import React from 'react';

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Bienvenido a Mil Sabores</h1>
        <p className="muted">Tienda de repostería - versión visual en React.</p>
        <div style={{ marginTop: 12 }}>
          <a href="/productos" className="btn">Ver productos</a>
        </div>
      </div>

      <h2 style={{ marginTop: 18 }}>Productos destacados</h2>
      <div className="grid">
        <div className="card">
          <img src="/assets/img/torta_cumpleanos.png" alt="Torta" />
          <h3>Torta de cumpleaños</h3>
          <p className="muted">Deliciosa torta para tus celebraciones.</p>
          <div style={{ marginTop: 8 }}><button className="btn primary">Ver</button></div>
        </div>
        <div className="card">
          <img src="/assets/img/torta_cuadrada_chocolate.jpg" alt="Torta" />
          <h3>Torta de chocolate</h3>
          <p className="muted">Clásico sabor intenso.</p>
          <div style={{ marginTop: 8 }}><button className="btn primary">Ver</button></div>
        </div>
        <div className="card">
          <img src="/assets/img/alfajores.jpg" alt="Alfajores" />
          <h3>Alfajores</h3>
          <p className="muted">Dulces tradicionales.</p>
          <div style={{ marginTop: 8 }}><button className="btn primary">Ver</button></div>
        </div>
      </div>
    </div>
  );
}
