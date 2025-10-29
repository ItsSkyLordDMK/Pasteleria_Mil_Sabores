const KEY = 'categorias_list_v1';

export function getStoredCategories() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (err) {
    console.error('Error leyendo categorías almacenadas:', err);
    return [];
  }
}

export function saveStoredCategories(list) {
  try {
    const unique = Array.from(new Set(list.filter(Boolean).map(s => String(s).trim())));
    localStorage.setItem(KEY, JSON.stringify(unique));
    // notify listeners in same window
    try { window.dispatchEvent(new Event('categoriasUpdated')); } catch(e){}
    return true;
  } catch (err) {
    console.error('Error guardando categorías:', err);
    return false;
  }
}

export function addCategory(cat) {
  if (!cat) return false;
  const name = String(cat).trim();
  if (!name) return false;
  const list = getStoredCategories();
  if (list.includes(name)) return false;
  list.push(name);
  return saveStoredCategories(list);
}

export function removeCategory(cat) {
  const name = String(cat).trim();
  const list = getStoredCategories();
  const filtered = list.filter(c => c !== name);
  return saveStoredCategories(filtered);
}

export default {
  getStoredCategories,
  saveStoredCategories,
  addCategory,
  removeCategory
};
