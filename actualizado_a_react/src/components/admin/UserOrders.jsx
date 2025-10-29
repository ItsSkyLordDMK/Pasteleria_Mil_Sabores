import React, { useEffect, useState } from 'react';
import { getOrders } from '../../utils/orders';

export default function UserOrders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const all = getOrders();
    if (!user) { setOrders([]); return; }
    // match by correo or run
    const filtered = all.filter(o => {
      if (!o.usuario) return false;
      const correo = (o.usuario.correo || '').toLowerCase();
      const run = (o.usuario.run || '').toString();
      return correo === (user.correo || '').toLowerCase() || (user.run && run === user.run.toString());
    });
    setOrders(filtered.reverse());
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <h4 style={{ marginTop: 0 }}>Historial de compras ({orders.length})</h4>
      {orders.length === 0 ? (
        <p style={{ color: '#666' }}>Este usuario no tiene compras registradas.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: 8, border: '1px solid #eee' }}>ID</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Fecha</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Items</th>
                <th style={{ padding: 8, border: '1px solid #eee', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{o.id}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{new Date(o.fecha).toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{o.items.map(it => `${it.nombre} x${it.cantidad}`).join(', ')}</td>
                  <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'right' }}>${o.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
