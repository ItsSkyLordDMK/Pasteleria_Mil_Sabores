
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

// Guarda la sesión activa
function guardarSesion(sesion, recordar) {
  if (recordar) {
    localStorage.setItem('sesionActiva', JSON.stringify(sesion));
    localStorage.setItem('recordarSesion', 'true');
  } else {
    sessionStorage.setItem('sesionActiva', JSON.stringify(sesion));
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('recordarSesion');
  }
}

// Inicia sesión con correo y contraseña
function iniciarSesion(correo, password, recordar) {
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(u => u.correo === correo && u.password === password);
  if (!usuario) return { exito: false, mensaje: 'Credenciales incorrectas.' };

  const sesion = {
    correo: usuario.correo,
    nombre: usuario.nombre,
    fechaLogin: new Date().toISOString(),
    descuento: usuario.descuento || 0,
    tortaGratis: !!usuario.tortaGratis
  };
  guardarSesion(sesion, recordar);
  return { exito: true, usuario: sesion };
}
