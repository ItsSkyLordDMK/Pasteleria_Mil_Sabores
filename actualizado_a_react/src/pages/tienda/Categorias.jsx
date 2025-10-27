import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/productos.json')
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar los productos');
        return response.json();
      })
      .then(productos => {
        // Agrupar productos por categoría
        const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
        const categoriasData = categoriasUnicas.map(cat => ({
          nombre: cat,
          productos: productos.filter(p => p.categoria === cat),
          imagen: productos.find(p => p.categoria === cat)?.imagen_principal
        }));
        setCategorias(categoriasData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando categorías...</div>;
  if (error) return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="categorias-container">
          <h1>Nuestras Categorías</h1>
          <div className="categorias-grid">
            {categorias.map((categoria) => (
              <Link
                key={categoria.nombre}
                to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}`}
                className="categoria-card"
              >
                <img src={categoria.imagen} alt={categoria.nombre} />
                <h2>{categoria.nombre}</h2>
                <p>{categoria.productos.length} productos</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}