import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email suscrito:', email);
    setEmail('');
    alert('¡Gracias por suscribirte!');
  };
  return (
    <footer style={{
      backgroundColor: '#fff8f0',
      borderTop: '2px solid #ffe4ec',
      padding: '32px 0 18px 0',
      marginTop: '40px',
      position: 'relative',
      zIndex: 1,
      width: '100%'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <a href="#" style={{ color: '#8B4513', fontWeight: 600, fontSize: '1.1rem', margin: '0 8px' }}>X</a>
        <span style={{ color: '#8B4513' }}> · </span>
        <a href="#" style={{ color: '#8B4513', fontWeight: 600, fontSize: '1.1rem', margin: '0 8px' }}>Instagram</a>
        <span style={{ color: '#8B4513' }}> · </span>
        <a href="#" style={{ color: '#8B4513', fontWeight: 600, fontSize: '1.1rem', margin: '0 8px' }}>WhatsApp</a>
      </div>
      
      <form 
        onSubmit={handleSubmit}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '8px', 
          maxWidth: '340px', 
          margin: '0 auto' 
        }}
      >
        <label htmlFor="email" style={{ color: '#8B4513', fontWeight: 600, fontSize: '1rem' }}>
          Suscríbete a nuestro newsletter
        </label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            borderRadius: '8px',
            border: '1.5px solid #ffe4ec',
            padding: '8px 12px',
            background: '#fff8f0',
            fontSize: '1rem',
            width: '100%'
          }}
        />
        <button 
          type="submit"
          style={{
            background: 'linear-gradient(90deg, #FFC0CB 0%, #FFF5E1 100%)',
            color: '#8B4513',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            padding: '8px 18px',
            fontSize: '1rem',
            marginTop: '2px',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          Suscribirse
        </button>
      </form>
    </footer>
  );
}
