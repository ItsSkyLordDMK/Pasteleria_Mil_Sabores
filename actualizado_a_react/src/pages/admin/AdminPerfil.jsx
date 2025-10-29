import React from 'react';
import ProfileForm from '../../components/ProfileForm';
import { getSession } from '../../utils/auth';
import AdminLayout from '../../components/layouts/AdminLayout';
import '../../styles/Profile.css';

export default function AdminPerfil() {
  const session = getSession();
  if (!session || !session.isAdmin) return (
    <AdminLayout title="Perfil">
      <div className="profile-page">
        <div className="profile-card admin-full">
          <h2>Acceso denegado</h2>
          <p>No tienes permisos para ver esta página.</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Perfil">
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <div>
              <h2 style={{ margin: 0 }}>Perfil del administrador</h2>
              <p style={{ color: '#666', marginTop: 6 }}>En esta sección puedes editar la información del administrador visible en la tienda.</p>
            </div>
            {/* Volver button removed as requested */}
          </div>

          <div className="profile-grid">
            <div>
              <ProfileForm initialEmail={session.correo} readOnlyEmail={true} allowRole={true} />
            </div>

            <aside className="profile-sidebar">
              <h4>Información</h4>
              <p style={{ color: '#666' }}>Los cambios se reflejarán en la sesión y en las áreas públicas de la tienda.</p>
              <div style={{ marginTop: 12 }}>
                <strong>Correo:</strong>
                <div style={{ marginTop: 6 }}>{session.correo}</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
