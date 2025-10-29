import React, { useEffect, useState } from 'react';
import { getUsers } from '../../../utils/auth';

export default function UsersMetrics() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = () => setUsers(getUsers() || []);
    load();
    // no event for users currently, but we can poll or rely on saveUsers elsewhere
  }, []);

  const total = users.length;
  const admins = users.filter(u => !!u.isAdmin).length;
  const recent = users.slice().reverse().slice(0,5);

  return (
    <section style={{ padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <h3>Usuarios</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 160 }}><strong>Total:</strong> {total}</div>
        <div style={{ minWidth: 160 }}><strong>Administradores:</strong> {admins}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Últimos registros</strong>
        <ul>
          {recent.map(u => (
            <li key={u.correo}>{u.nombre || u.correo} — {u.correo} {u.isAdmin ? '(admin)' : ''}</li>
          ))}
          {recent.length === 0 && <li>No hay usuarios registrados</li>}
        </ul>
      </div>
    </section>
  );
}
