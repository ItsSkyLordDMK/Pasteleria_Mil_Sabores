import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { getUsers, saveUsers } from '../../utils/auth';

export default function AdminUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    comuna: '',
    fecha: ''
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    const users = getUsers();
    setUsuarios(users);
  };

  const handleAgregar = () => {
    setUsuarioActual({
      nombre: '',
      correo: '',
      password: '',
      telefono: '',
      comuna: '',
      fecha: ''
    });
    setMostrandoFormulario(true);
  };

  const handleGuardar = () => {
    if (!usuarioActual.nombre || !usuarioActual.correo || !usuarioActual.password) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Verificar si el correo ya existe
    if (usuarios.some(u => u.correo === usuarioActual.correo)) {
      alert('Este correo ya está registrado');
      return;
    }

    const nuevoUsuario = {
      ...usuarioActual,
      run: `RUN${Date.now()}`
    };

    const actualizados = [...usuarios, nuevoUsuario];
    setUsuarios(actualizados);
    
    if (saveUsers(actualizados)) {
      alert('Usuario agregado exitosamente');
      setMostrandoFormulario(false);
      setUsuarioActual({
        nombre: '',
        correo: '',
        password: '',
        telefono: '',
        comuna: '',
        fecha: ''
      });
    } else {
      alert('Error al guardar usuario');
    }
  };

  const handleEliminar = (correo) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;
    
    const actualizados = usuarios.filter(u => u.correo !== correo);
    setUsuarios(actualizados);
    
    if (saveUsers(actualizados)) {
      alert('Usuario eliminado exitosamente');
    } else {
      alert('Error al eliminar usuario');
    }
  };

  return (
    <AdminLayout title="Gestión de Usuarios">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={handleAgregar}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#198754',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Agregar Usuario
        </button>
        <button
          onClick={cargarUsuarios}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#0d6efd',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🔄 Actualizar
        </button>
      </div>

      {mostrandoFormulario && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>Nuevo Usuario</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              placeholder="Nombre completo"
              value={usuarioActual.nombre}
              onChange={(e) => setUsuarioActual({ ...usuarioActual, nombre: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              placeholder="Correo electrónico"
              type="email"
              value={usuarioActual.correo}
              onChange={(e) => setUsuarioActual({ ...usuarioActual, correo: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              placeholder="Contraseña"
              type="password"
              value={usuarioActual.password}
              onChange={(e) => setUsuarioActual({ ...usuarioActual, password: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              placeholder="Teléfono"
              value={usuarioActual.telefono}
              onChange={(e) => setUsuarioActual({ ...usuarioActual, telefono: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              placeholder="Comuna"
              value={usuarioActual.comuna}
              onChange={(e) => setUsuarioActual({ ...usuarioActual, comuna: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              placeholder="Fecha de nacimiento"
              type="date"
              value={usuarioActual.fecha}
              onChange={(e) => setUsuarioActual({ ...usuarioActual, fecha: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleGuardar}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#8b4513',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Guardar
            </button>
            <button
              onClick={() => setMostrandoFormulario(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#6c757d',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3>Lista de Usuarios ({usuarios.length})</h3>
        {usuarios.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center' }}>No hay usuarios registrados</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Correo</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Teléfono</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Comuna</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, index) => (
                  <tr key={usuario.correo || index}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{usuario.nombre || '-'}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{usuario.correo}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{usuario.telefono || '-'}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{usuario.comuna || '-'}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => handleEliminar(usuario.correo)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
