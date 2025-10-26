import React from 'react';
import Header from '../../components/Header';

export default function Registro(){
  return (
    <>
      <Header />
      <div className="container">
        <div className="hero">
          <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Registro</h1>
          <p className="muted">Crea tu cuenta.</p>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="form">
            <input placeholder="Nombre" />
            <input placeholder="Correo" />
            <input placeholder="Contraseña" type="password" />
            <button className="btn primary">Registrarse</button>
          </div>
        </div>
      </div>
    </>
  );
}
