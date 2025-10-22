import React from 'react';

export default function Contacto(){
  return (
    <div className="container">
      <div className="hero">
        <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Contacto</h1>
        <p className="muted">Escríbenos y te responderemos a la brevedad.</p>
      </div>
      <div style={{ marginTop: 16 }}>
        <div className="form">
          <input type="text" placeholder="Nombre" />
          <input type="email" placeholder="Correo" />
          <textarea placeholder="Mensaje" rows={6}></textarea>
          <button className="btn primary">Enviar</button>
        </div>
      </div>
    </div>
  );
}
