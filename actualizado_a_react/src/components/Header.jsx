import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { getSession, logout } from '../utils/auth';

export default function Header() {
  const [categorias, setCategorias] = useState([]);
  const [showCategorias, setShowCategorias] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/data/productos.json')
      .then(response => response.json())
      .then(productos => {
        const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
        setCategorias(categoriasUnicas);
      })
      .catch(error => console.error('Error cargando categorías:', error));
  }, []);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const handleLogout = () => {
    logout();
    setSession(null);
    navigate('/');
  };

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
        <div 
          className="productos-dropdown"
          onMouseEnter={() => setShowCategorias(true)}
          onMouseLeave={() => setShowCategorias(false)}
        >
          <Link to="/productos">Productos</Link>
          {showCategorias && (
            <div className="dropdown-content">
              <Link to="/categorias">Ver todas las categorías</Link>
              {categorias.map(categoria => (
                <Link 
                  key={categoria}
                  to={`/productos?categoria=${encodeURIComponent(categoria)}`}
                >
                  {categoria}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/blogs">Blog</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/productos" className="cart-button">
          Carrito <i className="bi bi-cart3"></i> (<span>0</span>)
        </Link>
      </nav>

      <div className="usuario">
        {session ? (
          <>
            <span style={{ marginRight: 8 }}>Hola, {session.nombre || session.correo}</span>
            <button className="btn small" onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <span className="separar">|</span>
            <Link to="/iniciar-sesion">Iniciar sesión</Link>
            <span className="separar">|</span>
            <Link to="/registro">Registrarse</Link>
            <span className="separar">|</span>
          </>
        )}
      </div>
    </header>
  );
}