import React from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';

export default function AdminProducto() {
  return (
    <AdminLayout title="Gestión de Productos">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h2 style={{ margin: 0 }}>¡HOLA Administrador!</h2>
          <i className="bi bi-suit-spade-fill" style={{ fontSize: '1.8rem', color: '#8b4513' }}></i>
        </div>
      </div>

      <div className="admin-card" style={{ minHeight: 220, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, left: 28, display: 'flex', gap: 12 }}>
          <button id="btnAgregarProducto" style={{ padding: '8px 16px', borderRadius: 8, background: '#8b4513', color: '#fff', border: 'none', fontWeight: 600 }}>
            Agregar producto
          </button>
          <button id="btnEliminarProducto" style={{ padding: '8px 16px', borderRadius: 8, background: '#b71c1c', color: '#fff', border: 'none', fontWeight: 600 }}>
            Eliminar producto
          </button>
        </div>
        <div id="gestionProductosContainer"></div>

        {/* Modal placeholders will be added later when wiring JS */}
      </div>
    </AdminLayout>
  );
}
