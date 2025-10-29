import React, { useEffect, useState } from 'react';
import UserOrders from './UserOrders';
import showToast from '../../utils/toast';

export default function UserModal({ user, open, onClose, onSave, initialTab = 'details', allowEdit = true, startEditing = false }) {
  const [tab, setTab] = useState(initialTab);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user || {});

  useEffect(() => {
    setForm(user || {});
    setEditing(false);
    setTab(initialTab);
  }, [user, initialTab]);

  useEffect(() => {
    if (open && startEditing) setEditing(true);
  }, [open, startEditing]);

  if (!open || !user) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function startEdit() {
    if (!allowEdit) return;
    setEditing(true);
    setTab('details');
  }

  function cancelEdit() {
    setForm(user || {});
    setEditing(false);
  }

  function save() {
    if (!form.nombre || !form.correo) {
      showToast('warn', 'Nombre y correo son obligatorios');
      return;
    }
    onSave && onSave(form);
    setEditing(false);
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 820, maxWidth: '96%', background: '#fff', borderRadius: 8, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: '#fff',
            padding: 18,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0 }}>{editing ? 'Editar usuario' : 'Datos del usuario'}</h3>
          <div>
            {!editing && allowEdit && (
              <button
                onClick={startEdit}
                style={{ marginRight: 8, padding: '6px 10px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                Editar
              </button>
            )}
            <button onClick={onClose} style={{ padding: '6px 10px', background: '#ddd', color: '#222', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Cerrar
            </button>
          </div>
        </div>

        <div style={{ padding: 18, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: '1 1 60%' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button onClick={() => setTab('details')} style={{ padding: '6px 10px', borderRadius: 6, background: tab === 'details' ? '#f0f0f0' : '#fff' }}>
                  Detalles
                </button>
                <button onClick={() => setTab('orders')} style={{ padding: '6px 10px', borderRadius: 6, background: tab === 'orders' ? '#f0f0f0' : '#fff' }}>
                  Historial
                </button>
              </div>

              {tab === 'details' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>Nombre</label>
                      {editing ? (
                        <input name="nombre" value={form.nombre || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                      ) : (
                        <div style={{ padding: 8 }}>{user.nombre || '-'}</div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>Correo</label>
                      {editing ? (
                        <input name="correo" value={form.correo || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                      ) : (
                        <div style={{ padding: 8 }}>{user.correo || '-'}</div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>Teléfono</label>
                      {editing ? (
                        <input name="telefono" value={form.telefono || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                      ) : (
                        <div style={{ padding: 8 }}>{user.telefono || '-'}</div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>Comuna</label>
                      {editing ? (
                        <input name="comuna" value={form.comuna || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                      ) : (
                        <div style={{ padding: 8 }}>{user.comuna || '-'}</div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', marginBottom: 6 }}>Fecha de nacimiento</label>
                    {editing ? (
                      <input name="fecha" type="date" value={form.fecha || ''} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                    ) : (
                      <div style={{ padding: 8 }}>{user.fecha || '-'}</div>
                    )}
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    {editing && (
                      <>
                        <button onClick={save} style={{ padding: '8px 12px', background: '#8b4513', color: 'white', border: 'none', borderRadius: 6 }}>
                          Guardar
                        </button>
                        <button onClick={cancelEdit} style={{ padding: '8px 12px', background: '#ddd', border: 'none', borderRadius: 6 }}>
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {tab === 'orders' && <UserOrders user={user} />}
            </div>

            <div style={{ flex: '0 0 260px' }}>
              <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 6 }}>
                <h4 style={{ marginTop: 0 }}>Resumen</h4>
                <div style={{ color: '#666' }}><strong>Nombre:</strong> {user.nombre || '-'}</div>
                <div style={{ color: '#666' }}><strong>Correo:</strong> {user.correo || '-'}</div>
                <div style={{ color: '#666' }}><strong>Tel:</strong> {user.telefono || '-'}</div>
                <div style={{ color: '#666' }}><strong>Comuna:</strong> {user.comuna || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
