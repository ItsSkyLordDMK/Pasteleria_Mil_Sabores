import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { login, isAllowedDomain, isProfessorDomain } from '../../utils/auth';

export default function IniciarSesion(){
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('');
    if (!correo || !password) {
      setMensaje('Completa correo y contraseña.');
      return;
    }
    if (!isAllowedDomain(correo)) {
      setMensaje('El correo debe ser @gmail.com o @duoc.cl');
      return;
    }
    const res = login(correo, password);
    if (!res.ok) {
      setMensaje(res.message || 'Error al iniciar sesión.');
      return;
    }
  // redirect to admin if professor domain or user has admin flag
  const goAdmin = isProfessorDomain(correo) || (res.user && res.user.isAdmin);
  navigate(goAdmin ? '/admin' : '/');
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="hero">
          <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Iniciar Sesión</h1>
          <p className="muted">Accede a tu cuenta.</p>
        </div>
        <div style={{ marginTop: 12 }}>
          <form className="form" onSubmit={handleSubmit}>
            <input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn primary" type="submit">Entrar</button>
            {mensaje && <div style={{ marginTop: 8, color: '#b71c1c' }}>{mensaje}</div>}
          </form>
        </div>
      </div>
    </>
  );
}
