import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { addUser, isAllowedDomain, setSession, isProfessorDomain } from '../../utils/auth';

export default function Registro(){
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('');
    if (!nombre || !correo || !password) {
      setMensaje('Completa todos los campos.');
      return;
    }
    if (!isAllowedDomain(correo)) {
      setMensaje('El correo debe ser @gmail.com o @duoc.cl');
      return;
    }
    const nuevo = {
      nombre,
      correo,
      password,
      fecha: '',
      telefono: '',
      comuna: '',
    };
    const res = addUser(nuevo);
    if (!res.ok) {
      setMensaje(res.message || 'Error al registrar.');
      return;
    }
  // iniciar sesión automáticamente
  const adminFlag = isProfessorDomain(nuevo.correo);
  setSession({ correo: nuevo.correo, nombre: nuevo.nombre, isAdmin: adminFlag });
  navigate(adminFlag ? '/admin' : '/');
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '70vh', padding: '3rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Registro
          </h1>
          <p style={{ color: '#666' }}>Crea tu cuenta y comienza a comprar</p>
        </div>
        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <input 
            placeholder="Nombre completo" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <input 
            placeholder="Correo electrónico" 
            type="email"
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <input 
            placeholder="Contraseña" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#8b4513',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}
          >
            Registrarse
          </button>
          {mensaje && (
            <div style={{ 
              marginTop: '1rem', 
              color: '#b71c1c', 
              padding: '12px',
              backgroundColor: '#ffebee',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              {mensaje}
            </div>
          )}
        </form>
  </div>
    </>
  );
}
