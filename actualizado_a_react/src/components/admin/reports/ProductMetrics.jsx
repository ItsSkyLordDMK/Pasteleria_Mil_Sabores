import React, { useEffect, useState } from 'react';
import { getMergedProducts } from '../../../utils/products';

export default function ProductMetrics() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getMergedProducts();
        if (mounted) setProducts(list || []);
      } catch (e) {
        console.error('Error cargando productos en métricas:', e);
      }
    })();
    const onProd = () => getMergedProducts().then(list => mounted && setProducts(list || []));
    window.addEventListener('productosUpdated', onProd);
    return () => { mounted = false; window.removeEventListener('productosUpdated', onProd); };
  }, []);

  const total = products.length;
  const lowStock = products.filter(p => typeof p.stock === 'number' && p.stock <= 3).length;
  const outOfStock = products.filter(p => typeof p.stock === 'number' && p.stock <= 0).length;

  // top categories
  const topCategories = (() => {
    const map = new Map();
    for (const p of products) {
      if (!p.categoria) continue;
      map.set(p.categoria, (map.get(p.categoria) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  })();

  return (
    <section style={{ padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <h3>Productos</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 160 }}><strong>Total:</strong> {total}</div>
        <div style={{ minWidth: 160 }}><strong>Bajo stock (≤3):</strong> {lowStock}</div>
        <div style={{ minWidth: 160 }}><strong>Agotados:</strong> {outOfStock}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Categorías más frecuentes</strong>
        <ul>
          {topCategories.map(([cat, cnt]) => (
            <li key={cat}>{cat} — {cnt}</li>
          ))}
          {topCategories.length === 0 && <li>No hay categorías registradas</li>}
        </ul>
      </div>
    </section>
  );
}
