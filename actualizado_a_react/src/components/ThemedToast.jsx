import React, { useEffect, useState } from 'react';

const TYPE_COLORS = {
  success: '#2d8a3d',
  info: '#2b7cff',
  warn: '#e07a00',
  error: '#d93025'
};

function ToastItem({ id, type, message, onClose }) {
  return (
    <div style={{
      background: 'white',
      borderLeft: `6px solid ${TYPE_COLORS[type] || TYPE_COLORS.info}`,
      padding: '12px 14px',
      marginBottom: 10,
      borderRadius: 8,
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
      minWidth: 260,
      color: '#222',
      fontSize: 14
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ fontWeight: 600 }}>{message}</div>
        <button onClick={() => onClose(id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888' }}>✕</button>
      </div>
    </div>
  );
}

export default function ThemedToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handler(e) {
      const { type, message, opts } = e.detail || {};
      const id = Date.now() + Math.random();
      setToasts(prev => [{ id, type, message, opts }, ...prev]);
      const duration = (opts && opts.duration) || 4200;
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    window.addEventListener('showToast', handler);
    return () => window.removeEventListener('showToast', handler);
  }, []);

  function remove(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  if (!toasts.length) return null;

  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999, display: 'flex', flexDirection: 'column-reverse' }}>
      {toasts.map(t => (
        <ToastItem key={t.id} id={t.id} type={t.type} message={t.message} onClose={remove} />
      ))}
    </div>
  );
}
