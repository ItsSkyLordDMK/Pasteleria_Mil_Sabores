// Script para registro de usuario con descuentos, torta gratis y encriptación (HEX)

const HEX_RE = /^[0-9a-f]+$/i;

function stringToHex(str) {
  return Array.from(str)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}
function hexToString(hex) {
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return out;
}
function isHexLike(s) {
  return typeof s === 'string' && s.length % 2 === 0 && HEX_RE.test(s);
}

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

function guardarUsuarios(usuarios) {
  if (!Array.isArray(usuarios)) throw new Error('guardarUsuarios espera un array');
  const json = JSON.stringify(usuarios);
  localStorage.setItem('usuariosRegistrados', stringToHex(json)); // siempre HEX
}

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

function esCumpleaniosHoy(fechaNacimiento) {
  const hoy = new Date();
  const n = new Date(fechaNacimiento);
  return hoy.getDate() === n.getDate() && hoy.getMonth() === n.getMonth();
}

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
    fecha: usuario.fecha,        // yyyy-mm-dd
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

// Permitir actualizar perfil
function actualizarUsuario(correo, nuevosDatos) {
  const usuarios = obtenerUsuarios();
  const idx = usuarios.findIndex(u => u.correo === correo);
  if (idx === -1) return { exito: false, mensaje: 'Usuario no encontrado.' };
  usuarios[idx] = { ...usuarios[idx], ...nuevosDatos };
  guardarUsuarios(usuarios);
  return { exito: true };
}

// Ejemplo de uso:
// const r = registrarUsuario({run, nombre, correo, password, fecha, telefono, comuna});
// if (r.exito) { ... } else { alert(r.mensaje); }
