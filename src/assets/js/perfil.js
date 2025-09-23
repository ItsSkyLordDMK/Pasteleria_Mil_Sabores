// Obtiene los usuarios registrados
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
}
// Guarda el array de usuarios en localStorage
function guardarUsuarios(usuarios) {
  localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
}
// Obtiene la sesión activa
function obtenerSesionActiva() {
  return JSON.parse(localStorage.getItem('sesionActiva') || 'null');
}
// Actualiza el perfil del usuario activo
function actualizarPerfil(nuevosDatos) {
  const sesion = obtenerSesionActiva();
  if (!sesion) return { exito: false, mensaje: 'No hay sesión activa.' };
  const usuarios = obtenerUsuarios();
  const idx = usuarios.findIndex(u => u.correo === sesion.correo);
  if (idx === -1) return { exito: false, mensaje: 'Usuario no encontrado.' };
  usuarios[idx] = { ...usuarios[idx], ...nuevosDatos };
  guardarUsuarios(usuarios);
  return { exito: true };
}
// Ejemplo de uso: actualizarPerfil({nombre: 'Nuevo Nombre', preferencias: {favoritos: ['Torta']}});
