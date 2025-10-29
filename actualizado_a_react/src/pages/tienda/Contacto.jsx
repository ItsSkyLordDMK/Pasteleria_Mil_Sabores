import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHeaderCard from '../../components/cards/PageHeaderCard';
import '../../styles/Contacto.css';
import { showToast } from '../../utils/toast';

export default function Contacto(){
  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('success', '¡Mensaje enviado! Te responderemos pronto.');
  };
  return (
    <div className="contacto-page">
      <Header />
      <main className="contacto-main">
        <div className="container">
          <PageHeaderCard title="Contacto" subtitle="¡Nos encantaría saber de ti!" />
        </div>
        <div className="contacto-container">
          <h2>Envíanos un mensaje</h2>
          <form onSubmit={handleSubmit}>
            <div className="section">
              <label htmlFor="name">Nombre</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                placeholder="Ingrese nombre..."
              />
            </div>
            <div className="section">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="Ingrese correo electrónico..."
              />
            </div>
            <div className="section">
              <label htmlFor="message">Mensaje</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                required 
                placeholder="Ingrese su mensaje..."
              ></textarea>
            </div>
            <button type="submit">Enviar</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
