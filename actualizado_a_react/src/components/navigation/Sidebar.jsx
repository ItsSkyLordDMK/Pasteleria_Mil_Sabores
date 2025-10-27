import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/Sidebar.css';

const menuItems = [
  { path: '/admin', icon: 'bi-grid-1x2', text: 'Dashboard' },
  { path: '/admin/ordenes', icon: 'bi-bag', text: 'Órdenes' },
  { path: '/admin/productos', icon: 'bi-box', text: 'Productos' },
  { path: '/admin/categorias', icon: 'bi-tags', text: 'Categorías' },
  { path: '/admin/usuarios', icon: 'bi-people', text: 'Usuarios' },
  { path: '/admin/reportes', icon: 'bi-bar-chart', text: 'Reportes' },
  { path: '/admin/perfil', icon: 'bi-person', text: 'Perfil' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img
          src="/img/logo.png"
          alt="Logo"
          className="sidebar__logo-image"
        />
        <span className="sidebar__logo-text">Mil Sabores</span>
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar__link ${
              location.pathname === item.path ? 'sidebar__link--active' : ''
            }`}
          >
            <i className={`bi ${item.icon}`}></i>
            {item.text}
          </Link>
        ))}
      </nav>

      <Link to="/" className="sidebar__store-link">
        <i className="bi bi-shop"></i>
        Ver Tienda
      </Link>

      <div className="sidebar__profile">
        <i className="bi bi-person-circle"></i>
        <span>Administrador</span>
      </div>
    </aside>
  );
};

export default Sidebar;