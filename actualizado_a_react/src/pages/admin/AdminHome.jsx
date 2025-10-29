import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';
import DashboardCard from '../../components/cards/DashboardCard';
import FeatureCard from '../../components/cards/FeatureCard';
import { getOrders } from '../../utils/orders';
import { getMergedProducts } from '../../utils/products';
import '../../styles/pages/AdminDashboard.css';

export default function AdminHome() {
  const [stats, setStats] = useState({
    compras: 0,
    productos: 0,
    usuarios: 0,
    totalStock: 0,
    lowStock: 0
  });

  useEffect(() => {
    // Cargar productos merged (incluye overrides guardados) para contar e inventario
    const cargarProductos = async () => {
      try {
        const productos = await getMergedProducts();
        const totalStock = productos.reduce((s, p) => s + (typeof p.stock === 'number' ? p.stock : 0), 0);
        const lowStock = productos.filter(p => typeof p.stock === 'number' && p.stock <= 3).length;
        setStats(prev => ({ ...prev, productos: productos.length, totalStock, lowStock }));
      } catch (err) {
        console.error('Error cargando productos:', err);
      }
    };
    cargarProductos();

    // Cargar usuarios para contar
    fetch('/data/usuarios.json')
      .then(res => res.json())
      .then(data => {
        // `usuarios.json` puede ser un array o un objeto { usuarios: [...] }
        let usuariosCount = 0;
        if (Array.isArray(data)) {
          usuariosCount = data.length;
        } else if (data && Array.isArray(data.usuarios)) {
          usuariosCount = data.usuarios.length;
        }
        setStats(prev => ({ ...prev, usuarios: usuariosCount }));
      })
      .catch(err => console.error('Error cargando usuarios:', err));

  // Cargar órdenes y calcular total de unidades compradas
    const calcularCompras = () => {
      try {
        const ordenes = getOrders();
        const totalUnidades = ordenes.reduce((acc, ord) => {
          if (Array.isArray(ord.items)) {
            return acc + ord.items.reduce((s, it) => s + (it.cantidad || 0), 0);
          }
          return acc;
        }, 0);
        setStats(prev => ({ ...prev, compras: totalUnidades }));
      } catch (err) {
        console.error('Error calculando compras:', err);
      }
    };

    calcularCompras();
    const onOrdenesUpdated = () => calcularCompras();
    const onProductosUpdated = () => cargarProductos();
    window.addEventListener('ordenesUpdated', onOrdenesUpdated);
    window.addEventListener('productosUpdated', onProductosUpdated);
    // cleanup listeners when component unmounts
    return () => {
      window.removeEventListener('ordenesUpdated', onOrdenesUpdated);
      window.removeEventListener('productosUpdated', onProductosUpdated);
    };
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <div className="admin-dashboard__stats">
          <DashboardCard
            title="Compras"
            value={stats.compras}
            subtitle="Probabilidad de aumento: 20%"
            backgroundColor="#0d6efd"
          />
          <DashboardCard
            title="Productos"
            // mostrar en grande el total de unidades en inventario
            value={stats.totalStock}
            /* subtítulo eliminado a petición del diseño: la cantidad se muestra en grande */
            backgroundColor="#198754"
          />
          <DashboardCard
            title="Usuarios"
            value={stats.usuarios}
            subtitle={`Nuevos usuarios este mes: ${stats.usuarios}`}
            backgroundColor="#ffc107"
          />
        </div>

        <div className="admin-dashboard__features">
          <Link to="/admin" className="admin-dashboard__feature-link">
            <FeatureCard
              icon="📊"
              title="Dashboard"
              description="Visión general de todas las métricas y estadísticas clave del sistema."
            />
          </Link>
          <Link to="/admin/ordenes" className="admin-dashboard__feature-link">
            <FeatureCard
              icon="🛍️"
              title="Órdenes"
              description="Gestión y seguimiento de todas las órdenes de compra realizadas."
            />
          </Link>
          <Link to="/admin/productos" className="admin-dashboard__feature-link">
            <FeatureCard
              icon="📦"
              title="Productos"
              description="Administrar inventario y detalles de los productos disponibles."
            />
          </Link>
          <Link to="/admin/categorias" className="admin-dashboard__feature-link">
            <FeatureCard
              icon="🏷️"
              title="Categorías"
              description="Organizar productos en categorías para facilitar la navegación."
            />
          </Link>
          <Link to="/admin/usuarios" className="admin-dashboard__feature-link">
            <FeatureCard
              icon="👥"
              title="Usuarios"
              description="Gestión de cuentas de usuario y sus roles dentro del sistema."
            />
          </Link>
          <Link to="/admin/reportes" className="admin-dashboard__feature-link">
            <FeatureCard
              icon="📈"
              title="Reportes"
              description="Generación de informes detallados sobre las operaciones del sistema."
            />
          </Link>
          <Link to="/admin/perfil" className="admin-dashboard__feature-link">
            <FeatureCard
              icon="👤"
              title="Perfil"
              description="Administración de la información personal y configuraciones de cuenta."
            />
          </Link>
          <Link to="/" className="admin-dashboard__feature-link">
            <FeatureCard
              icon="🏪"
              title="Tienda"
              description="Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios."
            />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
