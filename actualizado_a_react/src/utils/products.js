const KEY = 'productos_overrides_v1';

export function getStoredProducts() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (err) {
    console.error('Error leyendo productos almacenados:', err);
    return [];
  }
}

export function saveStoredProducts(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    try { window.dispatchEvent(new Event('productosUpdated')); } catch(e){}
    return true;
  } catch (err) {
    console.error('Error guardando productos:', err);
    return false;
  }
}

export async function getMergedProducts() {
  try {
    const res = await fetch('/data/productos.json');
    const base = await res.json();
    const stored = getStoredProducts();
    if (!stored || stored.length === 0) return base;
    // merge: stored entries override base by id; also include new stored items
    const map = new Map();
    base.forEach(p => map.set(p.id, p));
    stored.forEach(p => {
      if (p && p.id) map.set(p.id, p);
    });
    // ensure stock field exists (default 10)
    return Array.from(map.values()).map(prod => ({ ...prod, stock: typeof prod.stock === 'number' ? prod.stock : 10 }));
  } catch (err) {
    console.error('Error al obtener productos merged:', err);
    return getStoredProducts();
  }
}

export default { getStoredProducts, saveStoredProducts, getMergedProducts };
