import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { getSession, logout } from '../utils/auth';
import { getStoredCategories } from '../utils/categories';
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
        const categoriasFromProducts = Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)));
        const stored = getStoredCategories();
        // if admin has stored categories, use them as authoritative; otherwise fall back to product categories
        if (stored && stored.length > 0) {
          setCategorias(stored);
        } else {
          setCategorias(categoriasFromProducts);
        }
      })
      .catch(error => {
        console.error('Error cargando categorías:', error);
        const stored = getStoredCategories();
        setCategorias(stored);
      });
  }, []);

  // update categories when admin edits them
  useEffect(() => {
    const onUpdate = () => {
      const stored = getStoredCategories();
      if (stored && stored.length > 0) {
        setCategorias(stored);
      } else {
        // fallback to products
        fetch('/data/productos.json')
          .then(r => r.json())
          .then(productos => setCategorias(Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)))))
          .catch(() => setCategorias([]));
      }
    };

    window.addEventListener('categoriasUpdated', onUpdate);
    return () => window.removeEventListener('categoriasUpdated', onUpdate);
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
            {/* If user is admin, show Dashboard link; if not admin and logged, show small profile icon link */}
            {session.isAdmin ? (
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
            ) : (
              <Link to="/perfil" title="Mi perfil" style={{ marginRight: 8, color: '#6b3f2a' }}>
                <i className="bi bi-person-circle" style={{ fontSize: 20 }}></i>
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