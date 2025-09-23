
const HEX_RE = /^[0-9a-f]+$/i;

// Convierte un string a hexadecimal
function stringToHex(str) {
  return Array.from(str)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}
// Convierte un string hexadecimal a texto
function hexToString(hex) {
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return out;
}
// Verifica si un string es hexadecimal
function isHexLike(s) {
  return typeof s === 'string' && s.length % 2 === 0 && HEX_RE.test(s);
}

// Obtiene los usuarios registrados
function obtenerUsuarios() {
  const raw = localStorage.getItem('usuariosRegistrados');
  if (!raw) return [];
  try {
    const json = isHexLike(raw) ? hexToString(raw) : raw;
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.warn('usuariosRegistrados ilegible, usando []:', e);
    return [];
  }
}

// Guarda el array de usuarios en localStorage
function guardarUsuarios(usuarios) {
  if (!Array.isArray(usuarios)) throw new Error('guardarUsuarios espera un array');
  const json = JSON.stringify(usuarios);
  localStorage.setItem('usuariosRegistrados', stringToHex(json));
}

// Calcula la edad a partir de la fecha de nacimiento
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

// Verifica si hoy es el cumpleaños
function esCumpleaniosHoy(fechaNacimiento) {
  const hoy = new Date();
  const n = new Date(fechaNacimiento);
  return hoy.getDate() === n.getDate() && hoy.getMonth() === n.getMonth();
}

// Registra un nuevo usuario
function registrarUsuario(usuario) {
  const usuarios = obtenerUsuarios();

  if (usuarios.some(u => u.correo === usuario.correo)) {
    return { exito: false, mensaje: 'El correo ya está registrado.' };
  }

  const nuevo = {
    run: usuario.run,
    nombre: usuario.nombre,
    correo: usuario.correo,
    password: usuario.password,
    fecha: usuario.fecha,
    telefono: usuario.telefono,
    comuna: usuario.comuna,
    preferencias: usuario.preferencias || {},
    codigo: usuario.codigo || '',
    codigoUsado: usuario.codigo || '',
    descuento: 0,
    tortaGratis: false
  };

  const edad = calcularEdad(nuevo.fecha);
  if (edad > 50) {
    nuevo.descuento = 50;
  } else if (nuevo.codigo.trim().toUpperCase() === 'FELICES50') {
    nuevo.descuento = 10;
  }
  if (nuevo.correo.endsWith('@duocuc.cl') && esCumpleaniosHoy(nuevo.fecha)) {
    nuevo.tortaGratis = true;
  }

  usuarios.push(nuevo);
  try {
    guardarUsuarios(usuarios);
    return { exito: true, usuario: nuevo };
  } catch (e) {
    console.error('Error guardando usuarios:', e);
    return { exito: false, mensaje: 'No se pudo guardar el usuario.' };
  }
}

// Permite actualizar el perfil de un usuario
function actualizarUsuario(correo, nuevosDatos) {
  const usuarios = obtenerUsuarios();
  const idx = usuarios.findIndex(u => u.correo === correo);
  if (idx === -1) return { exito: false, mensaje: 'Usuario no encontrado.' };
  usuarios[idx] = { ...usuarios[idx], ...nuevosDatos };
  guardarUsuarios(usuarios);
  return { exito: true };
}
