import React, { useEffect, useState } from 'react';
import { getOrders } from '../../../utils/orders';

export default function SalesMetrics() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = () => setOrders(getOrders() || []);
    load();
    const onOrd = () => load();
    window.addEventListener('ordenesUpdated', onOrd);
    return () => window.removeEventListener('ordenesUpdated', onOrd);
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + (typeof o.total === 'number' ? o.total : 0), 0);
  const avgOrder = totalOrders ? (totalRevenue / totalOrders) : 0;

  const recent = orders.slice().sort((a,b)=> new Date(b.fecha) - new Date(a.fecha)).slice(0,5);

  return (
    <section style={{ padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <h3>Ventas</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 160 }}><strong>Órdenes:</strong> {totalOrders}</div>
        <div style={{ minWidth: 160 }}><strong>Ingresos:</strong> ${totalRevenue.toLocaleString()}</div>
        <div style={{ minWidth: 160 }}><strong>Ticket promedio:</strong> ${avgOrder.toFixed(2)}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Órdenes recientes</strong>
        <ul>
          {recent.map(o => (
            <li key={o.id}>{o.id} — {o.usuario?.correo || 'anon'} — ${ (o.total || 0).toLocaleString()} — {new Date(o.fecha).toLocaleString()}</li>
          ))}
          {recent.length === 0 && <li>No hay órdenes registradas</li>}
        </ul>
      </div>
    </section>
  );
}
