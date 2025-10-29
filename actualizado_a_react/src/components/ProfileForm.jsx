import React, { useState, useEffect } from 'react';
import { getUsers, saveUsers, findUserByEmail, setSession, getSession } from '../utils/auth';
import showToast from '../utils/toast';
import '../styles/Profile.css';

export default function ProfileForm({ initialEmail, readOnlyEmail = true, allowRole = false }) {
  const session = getSession();
  const email = initialEmail || (session && session.correo) || '';
  const [user, setUser] = useState({ nombre: '', correo: '', telefono: '', direccion: '', role: '' });
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!email) return;
    const u = findUserByEmail(email);
    if (u) {
      const snapshot = { nombre: u.nombre || '', correo: u.correo || email, telefono: u.telefono || '', direccion: u.direccion || '', role: u.role || (u.isAdmin ? 'admin' : 'cliente') };
      setUser(snapshot);
      setOriginal(snapshot);
    }
  }, [email]);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    // restore to the original snapshot (the state when the component mounted or last saved)
    if (original) setUser(original);
  }

  function handleSave(e) {
    e && e.preventDefault();
    setSaving(true);
    try {
      const users = getUsers();
      const idx = users.findIndex((x) => x.correo === email);
      if (idx === -1) {
        showToast('error', 'Usuario no encontrado para guardar.');
        setSaving(false);
        return;
      }
      const updated = { ...users[idx], nombre: user.nombre, telefono: user.telefono, direccion: user.direccion };
      if (allowRole) updated.role = user.role;
      users[idx] = updated;
      const ok = saveUsers(users);
      if (ok) {
        // Update session display name
        try { setSession({ correo: updated.correo, nombre: updated.nombre || '', isAdmin: !!updated.isAdmin }); } catch(_){}
        showToast('success', 'Perfil guardado correctamente');
        // update original snapshot so Reset restores to latest saved values
        setOriginal({ nombre: updated.nombre || '', correo: updated.correo || email, telefono: updated.telefono || '', direccion: updated.direccion || '', role: updated.role || (updated.isAdmin ? 'admin' : 'cliente') });
      } else {
        showToast('error', 'No fue posible guardar el perfil');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Error guardando perfil');
    }
    setSaving(false);
  }

  if (!email) return <div>No hay usuario seleccionado.</div>;

  return (
    <form onSubmit={handleSave} className="profile-form">
      <div style={{ marginBottom: 12 }}>
        <label>Nombre</label>
        <input name="nombre" value={user.nombre} onChange={handleChange} className="input" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Correo</label>
        <input name="correo" value={user.correo} readOnly={readOnlyEmail} disabled={readOnlyEmail} className="input" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Teléfono</label>
        <input name="telefono" value={user.telefono} onChange={handleChange} className="input" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Dirección</label>
        <input name="direccion" value={user.direccion} onChange={handleChange} className="input" />
      </div>

      {allowRole && (
        <div style={{ marginBottom: 12 }}>
          <label>Rol</label>
          {/* Role is shown but not editable per request */}
          <input name="role" value={user.role} readOnly disabled className="input" />
        </div>
      )}

      <div className="profile-actions" style={{ justifyContent: 'flex-end' }}>
        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
          style={{ background: '#8b4513', color: '#fff', boxShadow: '0 6px 18px rgba(139,69,19,0.14)', border: 'none' }}
        >
          Guardar
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleReset}
          disabled={saving}
          style={{ background: '#fff', border: '1px solid rgba(139,69,19,0.12)' }}
        >
          Restablecer
        </button>
      </div>
    </form>
  );
}
