import React from 'react';
import ProductMetrics from './ProductMetrics';
import SalesMetrics from './SalesMetrics';
import UsersMetrics from './UsersMetrics';

export default function ReportsOverview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <ProductMetrics />
        <SalesMetrics />
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <UsersMetrics />
        <section style={{ padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
          <h3>Notas</h3>
          <p style={{ color: '#666' }}>Aquí puedes añadir filtros, exportes o widgets adicionales según tus necesidades (por ejemplo, gráficos con librerías como Chart.js o Recharts).</p>
        </section>
      </div>
    </div>
  );
}
