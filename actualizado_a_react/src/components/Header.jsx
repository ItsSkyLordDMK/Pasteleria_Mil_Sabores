import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { getSession, logout } from '../utils/auth';
import { useCarrito } from '../contexts/CarritoContext';

export default function Header() {
  const { obtenerCantidadTotal } = useCarrito();
  const [categorias, setCategorias] = useState([]);
  const [showCategorias, setShowCategorias] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const toggleMobile = () => setMobileOpen(v => !v);

  return (
    <header className="topbar">
      <div className="brand-left">
        <Link to="/" className="logo">
          <img src="/img/logo.png" alt="Logo Mil Sabores" />
        </Link>

        <div className="brand-name">
          Tienda online - Mil Sabores
        </div>
      </div>

      <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={toggleMobile} aria-label="Abrir navegación">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`navegacion ${mobileOpen ? 'open' : ''}`} aria-label="Navegación principal">
        <Link to="/" onClick={() => setMobileOpen(false)}>Página Principal</Link>
        <Link to="/productos" onClick={() => setMobileOpen(false)}>Productos</Link>

        <div 
          className="categorias-dropdown"
          onMouseEnter={() => setShowCategorias(true)}
          onMouseLeave={() => setShowCategorias(false)}
        >
          <Link to="/categorias" onClick={() => setMobileOpen(false)}>Categorías</Link>
          {showCategorias && (
            <div className="dropdown-content">
              {categorias.map(categoria => (
                <Link 
                  key={categoria}
                  to={`/categorias?categoria=${encodeURIComponent(categoria)}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {categoria}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/nosotros" onClick={() => setMobileOpen(false)}>Nosotros</Link>
        <Link to="/blogs" onClick={() => setMobileOpen(false)}>Blog</Link>
        <Link to="/contacto" onClick={() => setMobileOpen(false)}>Contacto</Link>
        <Link to="/carrito" className="cart-button" onClick={() => setMobileOpen(false)}>
          <i className="bi bi-cart3"></i>
          <span className="cart-text">Carrito</span>
          <span className="cart-badge">{obtenerCantidadTotal()}</span>
        </Link>
      </nav>

      <div className="usuario">
        {session ? (
          <>
            <span style={{ marginRight: 8 }}>Hola, {session.nombre || session.correo}</span>
            {session.isAdmin && (
              <Link
                to="/admin"
                className="admin-nav-link"
                style={{
                  marginRight: 8,
                  padding: '6px 10px',
                  background: 'linear-gradient(90deg,#f6b8a1 0%, #ffd6c4 100%)',
                  borderRadius: 6,
                  color: '#6b3f2a',
                  textDecoration: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(139,69,19,0.06)'
                }}
              >
                <i className="bi bi-speedometer2" style={{ marginRight: 6 }}></i>
                Dashboard
              </Link>
            )}
            <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <Link to="/iniciar-sesion" className="login-link">Iniciar sesión</Link>
        )}
      </div>
    </header>
  );
}