import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { getStoredCategories, saveStoredCategories } from '../../utils/categories';
import { showToast } from '../../utils/toast';
import { Link } from 'react-router-dom';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nueva, setNueva] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = () => {
    // merge product categories and stored categories so admin sees existing ones
    fetch('/data/productos.json')
      .then(res => res.json())
      .then(productos => {
        const categoriasFromProducts = Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)));
        const stored = getStoredCategories();
        const merged = Array.from(new Set([...categoriasFromProducts, ...stored]));
        setCategorias(merged);
      })
      .catch(err => {
        console.error('Error cargando productos para categorías:', err);
        setCategorias(getStoredCategories());
      });
  };

  const handleAgregar = () => {
    const name = (nueva || '').trim();
  if (!name) return showToast('warn', 'Ingrese un nombre de categoría válido');
  if (categorias.includes(name)) return showToast('warn', 'La categoría ya existe');
    const updated = Array.from(new Set([...categorias, name]));
    if (saveStoredCategories(updated)) {
      setCategorias(updated);
      setNueva('');
      showToast('success', 'Categoría agregada');
    } else {
      showToast('error', 'No fue posible guardar la categoría');
    }
  };

  const handleEliminar = (cat) => {
    if (!confirm(`¿Eliminar categoría "${cat}"?`)) return;
    const updated = categorias.filter(c => c !== cat);
    if (saveStoredCategories(updated)) {
      setCategorias(updated);
      showToast('success', 'Categoría eliminada');
    } else {
      showToast('error', 'No fue posible eliminar la categoría');
    }
  };

  return (
    <AdminLayout title="Categorías">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Gestión de Categorías</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin" style={{ padding: '8px 12px', borderRadius: 8, background: '#f8f9fa', textDecoration: 'none', color: '#333' }}>Volver</Link>
        </div>
      </div>

      <div style={{ background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            placeholder="Nueva categoría"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', flex: '1 1 auto' }}
          />
          <button onClick={handleAgregar} style={{ padding: '8px 14px', background: '#198754', color: '#fff', border: 'none', borderRadius: 6 }}>+ Agregar</button>
          <button onClick={() => { saveStoredCategories([]); cargar(); }} style={{ padding: '8px 14px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6 }}>Limpiar</button>
        </div>
      </div>

      <div style={{ background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h4 style={{ marginTop: 0 }}>Lista de Categorías ({categorias.length})</h4>
        {categorias.length === 0 ? (
          <p style={{ color: '#666' }}>No hay categorías registradas. Puedes agregarlas arriba.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ textAlign: 'left', padding: 12, border: '1px solid #eee' }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: 12, border: '1px solid #eee' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat, idx) => (
                <tr key={cat || idx}>
                  <td style={{ padding: 12, border: '1px solid #eee' }}>{cat}</td>
                  <td style={{ padding: 12, border: '1px solid #eee' }}>
                    <button onClick={() => handleEliminar(cat)} style={{ padding: '6px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6 }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
