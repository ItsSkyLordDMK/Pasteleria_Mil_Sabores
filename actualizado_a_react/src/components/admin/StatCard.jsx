import React from 'react';

export default function StatCard({ title, value, subtitle, backgroundColor }) {
  return (
    <div style={{
      backgroundColor: backgroundColor || '#f8f9fa',
      borderRadius: '10px',
      padding: '20px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h3>
      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
      <p style={{ margin: 0, opacity: 0.8 }}>{subtitle}</p>
    </div>
  );
}