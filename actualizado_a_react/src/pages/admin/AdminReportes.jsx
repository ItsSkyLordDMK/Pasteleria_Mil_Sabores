import React from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import ReportsOverview from '../../components/admin/reports/ReportsOverview';

export default function AdminReportes() {
  return (
    <AdminLayout title="Reportes">
      <div style={{ padding: 12 }}>
        <h2>Reportes y métricas</h2>
        <p style={{ color: '#666' }}>Resumen rápido de información sobre productos, ventas y usuarios. Los módulos son componentes independientes para facilitar su extensión.</p>
        <ReportsOverview />
      </div>
    </AdminLayout>
  );
}
