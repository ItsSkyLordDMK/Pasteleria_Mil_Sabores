import React from 'react';
import ProfileForm from '../../components/ProfileForm';
import { getSession } from '../../utils/auth';
import '../../styles/Profile.css';

export default function Perfil() {
  const session = getSession();
  if (!session) return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Acceso requerido</h2>
        <p>Debes iniciar sesión para ver y editar tu perfil.</p>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 style={{ marginTop: 0 }}>Mi perfil</h2>
        <ProfileForm initialEmail={session.correo} readOnlyEmail={true} allowRole={false} />
      </div>
    </div>
  );
}
