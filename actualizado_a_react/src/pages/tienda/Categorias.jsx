import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHeaderCard from '../../components/cards/PageHeaderCard';
import ProductCard from '../../components/ProductCard';
import '../../styles/Productos.css';
import '../../styles/components/ProductsFilters.css';
import { getStoredCategories } from '../../utils/categories';
import { getMergedProducts } from '../../utils/products';
import { useNavigate } from 'react-router-dom';

export default function Categorias() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaFromUrl = searchParams.get('categoria');
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaFromUrl || 'Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMergedProducts()
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando productos:', err);
        setError(err.message);
        setLoading(false);
      });

    const onUpdate = () => {
      setLoading(true);
      getMergedProducts().then(data => { setProductos(data); setLoading(false); }).catch(() => setLoading(false));
    };
    window.addEventListener('productosUpdated', onUpdate);
    return () => window.removeEventListener('productosUpdated', onUpdate);
  }, []);

  // update selected category when URL param changes
  useEffect(() => {
    if (categoriaFromUrl) setCategoriaSeleccionada(categoriaFromUrl);
  }, [categoriaFromUrl]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando categorías...</div>;
  if (error) return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;

  const productosOrdenados = [...productos].sort((a, b) => {
    const aName = (a && a.nombre) ? String(a.nombre) : '';
    const bName = (b && b.nombre) ? String(b.nombre) : '';
    return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
  });

  const categoriasFromProducts = Array.from(new Set(productosOrdenados.map(p => p.categoria).filter(Boolean)));
  const stored = getStoredCategories();
  const categorias = ['Todas', ...(stored && stored.length > 0 ? stored : categoriasFromProducts)];

  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productosOrdenados
    : productosOrdenados.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <PageHeaderCard title="Categorías" subtitle="Explora por tipo de producto" />

          <section className="categorias-section" style={{ marginTop: 12 }}>
            <div className="categorias-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {categorias.map(categoria => (
                <button
                  key={categoria}
                  onClick={() => {
                    setCategoriaSeleccionada(categoria);
                    // keep URL in sync so dropdown links / back navigation works
                    if (categoria === 'Todas') setSearchParams({}); else setSearchParams({ categoria });
                  }}
                  className={`filtro-btn ${categoriaSeleccionada === categoria ? 'active' : ''}`}
                >
                  <i className={`bi ${categoria === 'Todas' ? 'bi-grid' : 'bi-tag'}`} style={{ marginRight: '6px' }}></i>
                  {categoria}
                </button>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 18 }}>
            <div className="productos-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
              alignItems: 'start'
            }}>
              {productosFiltrados.length === 0 ? (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '3rem',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(139, 69, 19, 0.08)'
                }}>
                  <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#8b4513', opacity: 0.5 }}></i>
                  <h3 style={{ color: '#8b4513', marginTop: '1rem' }}>No hay productos en esta categoría</h3>
                  <p style={{ color: '#666' }}>Intenta con otra categoría</p>
                </div>
              ) : (
                productosFiltrados.map(producto => (
                  <ProductCard key={producto.id} producto={producto} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
