import React from 'react';

export default function IniciarSesion(){
  return (
    <div className="container">
      <div className="hero">
        <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Iniciar Sesión</h1>
        <p className="muted">Accede a tu cuenta.</p>
      </div>
      <div style={{ marginTop: 12 }}>
        <div className="form">
          <input placeholder="Correo" />
          <input placeholder="Contraseña" type="password" />
          <button className="btn primary">Entrar</button>
        </div>
      </div>
    </div>
  );
}
