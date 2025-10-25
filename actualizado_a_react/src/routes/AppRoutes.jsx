import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Blogs from '../pages/Blogs';
import Productos from '../pages/Productos';
import Contacto from '../pages/Contacto';
import Registro from '../pages/Registro';
import IniciarSesion from '../pages/IniciarSesion';
import Nosotros from '../pages/Nosotros';
import DetalleProducto from '../pages/DetalleProducto';
import AdminHome from '../pages/AdminHome';
import AdminProducto from '../pages/AdminProducto';
import AdminUsuario from '../components/AdminUsuario';

export default function AppRoutes() {
  return (
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
  );
}