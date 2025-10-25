import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
  return (
    <header className="topbar">
      <Link to="/" className="logo">
        <img src="/img/logo.png" alt="Logo Mil Sabores" />
      </Link>
      
      <div className="brand-name">
        Tienda online - Mil Sabores
      </div>

      <nav className="navegacion" aria-label="Navegación principal">
        <Link to="/">Página Principal</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/blogs">Blog</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/productos" className="cart-button">
          Carrito <i className="bi bi-cart3"></i> (<span>0</span>)
        </Link>
      </nav>

      <div className="usuario">
        <span className="separar">|</span>
        <Link to="/iniciar-sesion">Iniciar sesión</Link>
        <span className="separar">|</span>
        <Link to="/registro">Registrarse</Link>
        <span className="separar">|</span>
      </div>
    </header>
  );
}