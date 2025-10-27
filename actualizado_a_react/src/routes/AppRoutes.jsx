import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/tienda/Home';
import Blogs from '../pages/tienda/Blogs';
import Productos from '../pages/tienda/Productos';
import Categorias from '../pages/tienda/Categorias';
import Contacto from '../pages/tienda/Contacto';
import Registro from '../pages/tienda/Registro';
import IniciarSesion from '../pages/tienda/IniciarSesion';
import Nosotros from '../pages/tienda/Nosotros';
import DetalleProducto from '../pages/tienda/DetalleProducto';
import Carrito from '../pages/tienda/Carrito';
import AdminHome from '../pages/admin/AdminHome';
import AdminProducto from '../pages/admin/AdminProducto';
import AdminUsuario from '../pages/admin/AdminUsuario';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/productos/:id" element={<DetalleProducto />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />

      {/* Rutas de administración */}
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/usuarios" element={<AdminUsuario />} />
      <Route path="/admin/productos" element={<AdminProducto />} />
      <Route path="/admin/ordenes" element={<AdminHome />} />
      <Route path="/admin/categorias" element={<AdminHome />} />
      <Route path="/admin/reportes" element={<AdminHome />} />
      <Route path="/admin/perfil" element={<AdminHome />} />
    </Routes>
  );
}