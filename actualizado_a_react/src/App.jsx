import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { CarritoProvider } from './contexts/CarritoContext';
import './index.css';
import ThemedToast from './components/ThemedToast';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CarritoProvider>
        <BrowserRouter>
          <AppRoutes />
          <ThemedToast />
        </BrowserRouter>
      </CarritoProvider>
    </div>
  );
}
