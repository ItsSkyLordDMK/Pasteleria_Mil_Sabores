import React from 'react';
import Header from '../../components/Header';

export default function Nosotros(){
  return (
    <>
      <Header />
      <div className="container">
        <div className="hero">
          <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Nosotros</h1>
          <p className="muted">Conoce la historia de Mil Sabores.</p>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="card">
            <p>Somos una pastelería dedicada a crear momentos dulces.</p>
          </div>
        </div>
      </div>
    </>
  );
}
