import React from 'react';
import Header from '../../components/Header';

export default function Blogs(){
  return (
    <>
      <Header />
      <div className="container">
        <div className="hero">
          <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Blog de Repostería</h1>
          <p className="muted">Descubre datos curiosos e historias dulces.</p>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="blog">
            <img className="blog-img" src="/assets/img/pastel mas largo del mundo.jpg" alt="Pastel largo" />
            <div className="blog-info">
              <div className="blog-title">¿Sabías que el pastel más largo del mundo fue hecho en India?</div>
              <div className="blog-date">15 de enero de 2020</div>
              <div className="blog-content">El pastel más largo mide 5300 m y fue logrado por la Bakers Association Kerala.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
