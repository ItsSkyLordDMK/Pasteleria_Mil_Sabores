import React from 'react';

export default function FeatureCard({ icon, title, description }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      height: '100%',
      transition: 'transform 0.2s ease-in-out',
      cursor: 'pointer',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ fontSize: '2rem', color: '#0d6efd' }}>{icon}</div>
      <h3 style={{ margin: 0, color: '#333' }}>{title}</h3>
      <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>{description}</p>
    </div>
  );
}