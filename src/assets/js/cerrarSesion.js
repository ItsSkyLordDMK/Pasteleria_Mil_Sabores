// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('sesionActiva');
  localStorage.removeItem('recordarSesion');
  sessionStorage.removeItem('sesionActiva');
  window.location.href = '../../index.html';
}
