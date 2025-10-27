import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito de localStorage al inicio
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (e) {
        console.error('Error cargando carrito:', e);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const productoExistente = prev.find(p => p.id === producto.id);
      if (productoExistente) {
        return prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + (producto.cantidad || 1) }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: producto.cantidad || 1 }];
    });
  };

  const actualizarCantidad = (productoId, cambio) => {
    setCarrito(prev => {
      const producto = prev.find(p => p.id === productoId);
      if (!producto) return prev;

      const nuevaCantidad = producto.cantidad + cambio;
      if (nuevaCantidad <= 0) {
        return prev.filter(p => p.id !== productoId);
      }

      return prev.map(p =>
        p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
      );
    });
  };

  const eliminarProducto = (productoId) => {
    setCarrito(prev => prev.filter(p => p.id !== productoId));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const obtenerTotal = () => {
    return carrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  };

  const obtenerCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  };

  const value = {
    carrito,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    obtenerTotal,
    obtenerCantidadTotal
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

export default CarritoContext;

