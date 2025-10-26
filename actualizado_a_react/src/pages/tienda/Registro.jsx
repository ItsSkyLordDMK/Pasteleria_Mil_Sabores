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
      <div className="container">
        <div className="hero">
          <h1 style={{ fontFamily: 'Pacifico, cursive', color: '#8b4513' }}>Registro</h1>
          <p className="muted">Crea tu cuenta.</p>
        </div>
        <div style={{ marginTop: 12 }}>
          <form className="form" onSubmit={handleSubmit}>
            <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn primary" type="submit">Registrarse</button>
            {mensaje && <div style={{ marginTop: 8, color: '#b71c1c' }}>{mensaje}</div>}
          </form>
        </div>
      </div>
    </>
  );
}
