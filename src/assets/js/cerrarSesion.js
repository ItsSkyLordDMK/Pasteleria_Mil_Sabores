// Cierra la sesión del usuario
function cerrarSesion() {
  localStorage.removeItem('sesionActiva');
  localStorage.removeItem('recordarSesion');
  sessionStorage.removeItem('sesionActiva');
  window.location.href = '../../index.html';
}
