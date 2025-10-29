const KEY = 'ordenes_v1';

export function getOrders() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (err) {
    console.error('Error leyendo órdenes:', err);
    return [];
  }
}

export function saveOrders(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    try { window.dispatchEvent(new Event('ordenesUpdated')); } catch(e){}
    return true;
  } catch (err) {
    console.error('Error guardando órdenes:', err);
    return false;
  }
}

export function addOrder(order) {
  try {
    const existing = getOrders();
    existing.push(order);
    saveOrders(existing);
    return true;
  } catch (err) {
    console.error('Error agregando orden:', err);
    return false;
  }
}

export default { getOrders, saveOrders, addOrder };
