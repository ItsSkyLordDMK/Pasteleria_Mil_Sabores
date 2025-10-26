import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: 'bi-grid-1x2', text: 'Dashboard' },
    { path: '/admin/ordenes', icon: 'bi-bag', text: 'Órdenes' },
    { path: '/admin/productos', icon: 'bi-box', text: 'Productos' },
    { path: '/admin/categorias', icon: 'bi-tags', text: 'Categorías' },
    { path: '/admin/usuarios', icon: 'bi-people', text: 'Usuarios' },
    { path: '/admin/reportes', icon: 'bi-bar-chart', text: 'Reportes' },
    { path: '/admin/perfil', icon: 'bi-person', text: 'Perfil' },
  ];

  return (
    <aside style={{
      width: '250px',
      backgroundColor: 'white',
      borderRight: '1px solid #e9ecef',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem'
    }}>
      <div className="logo" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '2rem'
      }}>
        <img
          src="/img/logo.png"
          alt="Logo"
          style={{ height: 40, width: 40 }}
        />
        <span style={{ fontWeight: 'bold', color: '#8b4513' }}>Mil Sabores</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: 'none',
              color: location.pathname === item.path ? '#0d6efd' : '#6c757d',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: location.pathname === item.path ? '#f8f9fa' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <i className={`bi ${item.icon}`}></i>
            {item.text}
          </Link>
        ))}
      </nav>

      <Link
        to="/"
        style={{
          marginTop: 'auto',
          textDecoration: 'none',
          color: '#6c757d',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <i className="bi bi-shop"></i>
        Ver Tienda
      </Link>

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <i className="bi bi-person-circle"></i>
        <span>Administrador</span>
      </div>
    </aside>
  );
}
