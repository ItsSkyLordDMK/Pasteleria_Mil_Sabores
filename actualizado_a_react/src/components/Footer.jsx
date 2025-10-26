import React, { useState } from 'react';
import '../styles/Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para manejar la suscripción al newsletter
    console.log('Email suscrito:', email);
    setEmail('');
  };

  return (
    <footer className="footer" id="contacto">
      <nav aria-label="Redes">
        <a href="#">X</a>
        <span className="separator"> · </span>
        <a href="#">Instagram</a>
        <span className="separator"> · </span>
        <a href="#">WhatsApp</a>
      </nav>

      <form className="newsletter" onSubmit={handleSubmit}>
        <label htmlFor="email">
          Suscríbete a nuestro newsletter
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">
          Suscribirse
        </button>
      </form>
    </footer>
  );
}
