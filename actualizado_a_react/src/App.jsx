import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminUsuario from './components/AdminUsuario';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Productos from './pages/Productos';
import Contacto from './pages/Contacto';
import Registro from './pages/Registro';
import IniciarSesion from './pages/IniciarSesion';
import Nosotros from './pages/Nosotros';
import DetalleProducto from './pages/DetalleProducto';
import AdminHome from './pages/AdminHome';
import AdminProducto from './pages/AdminProducto';

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#8b4513', fontWeight: 700 }}>Mil Sabores</Link>
        <nav style={{ marginLeft: 12 }}>
          <Link to="/" style={{ marginRight: 8 }}>Home</Link>
          <Link to="/productos" style={{ marginRight: 8 }}>Productos</Link>
          <Link to="/blogs" style={{ marginRight: 8 }}>Blog</Link>
          <Link to="/contacto" style={{ marginRight: 8 }}>Contacto</Link>
        </nav>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/registro" style={{ marginRight: 8 }}>Registro</Link>
          <Link to="/iniciar-sesion">Iniciar sesión</Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/usuarios" element={<AdminUsuario />} />
        <Route path="/admin/productos" element={<AdminProducto />} />
      </Routes>
    </BrowserRouter>
  );
}
