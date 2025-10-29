// Utilidades simples de autenticación y manejo de sesión (client-side, localStorage)
const USERS_KEY = 'usuariosRegistrados';
const SESSION_KEY = 'sessionCurrentUser';

function isHexLike(s) {
  const HEX_RE = /^[0-9a-f]+$/i;
  return typeof s === 'string' && s.length % 2 === 0 && HEX_RE.test(s);
}

function hexToString(hex) {
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return out;
}

function stringToHex(str) {
  return Array.from(str)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const json = isHexLike(raw) ? hexToString(raw) : raw;
    return JSON.parse(json || '[]');
  } catch (e) {
    return [];
  }
}

export function saveUsers(users) {
  try {
    // store as plain JSON for easier debugging
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (e) {
    return false;
  }
}

export function findUserByEmail(email) {
  const users = getUsers();
  return users.find((u) => u.correo === email) || null;
}

export function addUser(user) {
  const users = getUsers();
  if (users.some((u) => u.correo === user.correo)) {
    return { ok: false, message: 'El correo ya está registrado.' };
  }
  // marcar como admin si es profesor de duoc
  try {
    if (typeof user.correo === 'string' && user.correo.toLowerCase().endsWith('@profesor.duoc.cl')) {
      user.isAdmin = true;
    }
  } catch (e) {}
  users.push(user);
  const ok = saveUsers(users);
  return ok ? { ok: true } : { ok: false, message: 'No se pudo guardar el usuario.' };
}

export function login(email, password) {
  const user = findUserByEmail(email);
  if (!user) return { ok: false, message: 'Usuario no encontrado.' };
  if (user.password !== password) return { ok: false, message: 'Contraseña incorrecta.' };
  // create session; forzar isAdmin si el correo es profesor.duoc.cl
  const isAdmin = !!user.isAdmin || (typeof user.correo === 'string' && user.correo.toLowerCase().endsWith('@profesor.duoc.cl'));
  setSession({ correo: user.correo, nombre: user.nombre || '', isAdmin });
  return { ok: true, user };
}

export function setSession(sessionObj) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
    return true;
  } catch (e) {
    return false;
  }
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

// Dominios permitidos para usuarios "convencionales"
export const ALLOWED_DOMAINS = ['@gmail.com', '@duoc.cl', '@profesor.duoc.cl'];
export const PROFESSOR_DOMAIN = '@profesor.duoc.cl';

export function isAllowedDomain(email) {
  if (!email || typeof email !== 'string') return false;
  const lower = email.toLowerCase();
  return ALLOWED_DOMAINS.some((d) => lower.endsWith(d));
}

export function isProfessorDomain(email) {
  if (!email || typeof email !== 'string') return false;
  return email.toLowerCase().endsWith(PROFESSOR_DOMAIN);
}

export default {
  getUsers,
  saveUsers,
  findUserByEmail,
  addUser,
  login,
  setSession,
  getSession,
  logout,
  isAllowedDomain,
  isProfessorDomain,
};
