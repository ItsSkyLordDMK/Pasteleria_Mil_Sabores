import React from 'react';
import Sidebar from '../../components/Sidebar';

export default function AdminUsuario() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h1 style={{ margin: 0 }}>¡HOLA Administrador!</h1>
            <i className="bi bi-suit-spade-fill" style={{ fontSize: '1.8rem', color: '#8b4513' }}></i>
          </div>
        </div>

        <div className="admin-card" style={{ minHeight: 220, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 24, left: 28, display: 'flex', gap: 12 }}>
            <button id="btnAgregarUsuario" style={{ padding: '8px 16px', borderRadius: 8, background: '#8b4513', color: '#fff', border: 'none', fontWeight: 600 }}>
              Agregar usuario
            </button>
            <button id="btnEliminarUsuario" style={{ padding: '8px 16px', borderRadius: 8, background: '#b71c1c', color: '#fff', border: 'none', fontWeight: 600 }}>
              Eliminar usuario
            </button>
          </div>
          <div id="gestionUsuariosContainer"></div>

          {/* Modal placeholders will be added later when wiring JS */}
        </div>
      </main>
    </div>
  );
}