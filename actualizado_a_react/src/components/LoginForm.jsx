import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAllowedDomain, isProfessorDomain } from '../utils/auth';
import '../styles/LoginForm.css';

export default function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setIsLoading(true);

    if (!correo || !password) {
      setMensaje('Completa correo y contraseña.');
      setIsLoading(false);
      return;
    }

    if (!isAllowedDomain(correo)) {
      setMensaje('El correo debe ser @gmail.com o @duoc.cl');
      setIsLoading(false);
      return;
    }

    try {
      const res = login(correo, password);
      if (!res.ok) {
        setMensaje(res.message || 'Error al iniciar sesión.');
        setIsLoading(false);
        return;
      }

      // Redirect to admin if professor domain or user has admin flag
      const goAdmin = isProfessorDomain(correo) || (res.user && res.user.isAdmin);
      navigate(goAdmin ? '/admin' : '/');
    } catch (error) {
      setMensaje('Error al iniciar sesión. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-header">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <i className="bi bi-envelope-fill form-icon"></i>
          <input 
            type="email"
            placeholder="Correo electrónico" 
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)}
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <i className="bi bi-lock-fill form-icon"></i>
          <input 
            type="password"
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit"
          className="btn-login"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="bi bi-hourglass-split"></i> Cargando...
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-in-right"></i> Entrar
            </>
          )}
        </button>

        {mensaje && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle-fill"></i>
            {mensaje}
          </div>
        )}
      </form>

      <div className="login-footer">
        <p className="register-prompt">
          ¿No tienes una cuenta?
          <Link to="/registro" className="register-link">
            <i className="bi bi-person-plus-fill"></i> Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

