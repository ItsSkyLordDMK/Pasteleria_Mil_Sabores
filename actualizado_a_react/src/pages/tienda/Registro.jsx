import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { addUser, isAllowedDomain, setSession, isProfessorDomain } from '../../utils/auth';

export default function Registro(){
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [pais, setPais] = useState('Chile');
  const [comuna, setComuna] = useState('Santiago');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('');
    // basic validation
    if (!rut || !nombre || !correo || !password || !password2) {
      setMensaje('Completa todos los campos requeridos.');
      return;
    }
    // email pattern validation (simple)
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(correo)) {
      setMensaje('Ingresa un correo válido (ej: usuario@dominio.com).');
      return;
    }

    if (password !== password2) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }
    const nuevo = {
      run: rut,
      nombre,
      correo,
      password,
      fecha: fecha || '',
      telefono: telefono || '',
      comuna: comuna || '',
      pais: pais || 'Chile',
      descuento: 0,
      tortaGratis: false,
      codigoUsado: '',
      preferencias: {}
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
            placeholder="RUT (sin puntos, con guion)" 
            value={rut} 
            onChange={(e) => setRut(e.target.value)}
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
          <input 
            placeholder="Confirmar contraseña" 
            type="password" 
            value={password2} 
            onChange={(e) => setPassword2(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />

          <label style={{ display: 'block', marginBottom: '6px', color: '#666' }}>Fecha de nacimiento</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }} />

          <input 
            placeholder="Teléfono" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <select value={pais} onChange={(e) => setPais(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <option>Chile</option>
              <option>Argentina</option>
              <option>Perú</option>
              <option>Otro</option>
            </select>

            <select value={comuna} onChange={(e) => setComuna(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <option>Santiago</option>
              <option>Providencia</option>
              <option>Ñuñoa</option>
              <option>Maipú</option>
              <option>Otra</option>
            </select>
          </div>
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
