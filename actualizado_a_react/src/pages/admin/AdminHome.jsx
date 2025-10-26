import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/admin/StatCard';
import FeatureCard from '../../components/admin/FeatureCard';

export default function AdminHome() {
  const [stats, setStats] = useState({
    compras: 0,
    productos: 0,
    usuarios: 0
  });

  useEffect(() => {
    // Cargar productos para contar
    fetch('/data/productos.json')
      .then(res => res.json())
      .then(productos => {
        setStats(prev => ({ ...prev, productos: productos.length }));
      })
      .catch(err => console.error('Error cargando productos:', err));

    // Cargar usuarios para contar
    fetch('/data/usuarios.json')
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({ ...prev, usuarios: data.usuarios.length }));
      })
      .catch(err => console.error('Error cargando usuarios:', err));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f8f9fa' }}>
        <h1 style={{ marginBottom: '2rem', color: '#333' }}>Dashboard</h1>
        
        {/* Tarjetas de estadísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            title="Compras"
            value={stats.compras}
            subtitle="Probabilidad de aumento: 20%"
            backgroundColor="#0d6efd"
          />
          <StatCard
            title="Productos"
            value={stats.productos}
            subtitle={`Inventario actual: ${stats.productos}`}
            backgroundColor="#198754"
          />
          <StatCard
            title="Usuarios"
            value={stats.usuarios}
            subtitle={`Nuevos usuarios este mes: ${stats.usuarios}`}
            backgroundColor="#ffc107"
          />
        </div>

        {/* Grid de características */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <FeatureCard
              icon="📊"
              title="Dashboard"
              description="Visión general de todas las métricas y estadísticas clave del sistema."
            />
          </Link>
          <Link to="/admin/ordenes" style={{ textDecoration: 'none' }}>
            <FeatureCard
              icon="🛍️"
              title="Órdenes"
              description="Gestión y seguimiento de todas las órdenes de compra realizadas."
            />
          </Link>
          <Link to="/admin/productos" style={{ textDecoration: 'none' }}>
            <FeatureCard
              icon="📦"
              title="Productos"
              description="Administrar inventario y detalles de los productos disponibles."
            />
          </Link>
          <Link to="/admin/categorias" style={{ textDecoration: 'none' }}>
            <FeatureCard
              icon="🏷️"
              title="Categorías"
              description="Organizar productos en categorías para facilitar la navegación."
            />
          </Link>
          <Link to="/admin/usuarios" style={{ textDecoration: 'none' }}>
            <FeatureCard
              icon="👥"
              title="Usuarios"
              description="Gestión de cuentas de usuario y sus roles dentro del sistema."
            />
          </Link>
          <Link to="/admin/reportes" style={{ textDecoration: 'none' }}>
            <FeatureCard
              icon="📈"
              title="Reportes"
              description="Generación de informes detallados sobre las operaciones del sistema."
            />
          </Link>
          <Link to="/admin/perfil" style={{ textDecoration: 'none' }}>
            <FeatureCard
              icon="👤"
              title="Perfil"
              description="Administración de la información personal y configuraciones de cuenta."
            />
          </Link>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <FeatureCard
              icon="🏪"
              title="Tienda"
              description="Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios."
            />
          </Link>
        </div>
      </main>
    </div>
  );
}
