import React from 'react';
import Header from '../../components/Header';
import LoginForm from '../../components/LoginForm';

export default function IniciarSesion() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '70vh', padding: '3rem 1rem' }}>
        <LoginForm />
  </main>
    </>
  );
}
