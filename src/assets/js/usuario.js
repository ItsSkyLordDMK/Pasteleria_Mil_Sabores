// HTML para la casilla de gestión de usuarios
const gestionUsuariosHTML = `
  <div style="display: flex; gap: 12px; margin-bottom: 24px; align-items: center;">
    <button id="btnAgregarUsuario" style="padding: 8px 16px; border-radius: 8px; background: #8B4513; color: #fff; border: none; font-weight: 600;">Agregar usuario</button>
    <button id="btnEliminarUsuario" style="padding: 8px 16px; border-radius: 8px; background: #B71C1C; color: #fff; border: none; font-weight: 600;">Eliminar usuario</button>
  </div>
  <div id="modalAgregarUsuario" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); z-index:999; justify-content:center; align-items:center;">
    <div style="background:#fff; border-radius:16px; padding:32px; min-width:320px; max-width:90vw; box-shadow:0 4px 16px rgba(0,0,0,0.15); position:relative;">
      <button id="cerrarModalAgregar" style="position:absolute; top:12px; right:12px; background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
      <h2 style="margin-bottom:16px; color:#8B4513;">Agregar usuario</h2>
      <form id="formAgregarUsuario" autocomplete="off">
        <input type="text" name="run" placeholder="RUN" required style="width:100%; margin-bottom:8px; padding:8px; border-radius:8px; border:1px solid #ccc;">
        <input type="text" name="nombre" placeholder="Nombre" required style="width:100%; margin-bottom:8px; padding:8px; border-radius:8px; border:1px solid #ccc;">
        <input type="email" name="correo" placeholder="Correo" required style="width:100%; margin-bottom:8px; padding:8px; border-radius:8px; border:1px solid #ccc;">
        <input type="password" name="password" placeholder="Contraseña" required style="width:100%; margin-bottom:8px; padding:8px; border-radius:8px; border:1px solid #ccc;">
        <input type="date" name="fecha" placeholder="Fecha de nacimiento" required style="width:100%; margin-bottom:8px; padding:8px; border-radius:8px; border:1px solid #ccc;">
        <input type="text" name="telefono" placeholder="Teléfono" required style="width:100%; margin-bottom:8px; padding:8px; border-radius:8px; border:1px solid #ccc;">
        <input type="text" name="comuna" placeholder="Comuna" required style="width:100%; margin-bottom:8px; padding:8px; border-radius:8px; border:1px solid #ccc;">
        <input type="text" name="codigo" placeholder="Código de descuento (opcional)" style="width:100%; margin-bottom:8px; padding:8px; border-radius:8px; border:1px solid #ccc;">
        <button type="submit" style="width:100%; padding:10px; border-radius:8px; background:#8B4513; color:#fff; border:none; font-weight:600; margin-top:8px;">Registrar</button>
      </form>
      <div id="mensajeRegistroUsuario" style="margin-top:12px; color:#B71C1C;"></div>
    </div>
  </div>
`;

window.addEventListener("DOMContentLoaded", function () {
  document.body.insertAdjacentHTML("afterbegin", gestionUsuariosHTML);

  const btnAgregar = document.getElementById("btnAgregarUsuario");
  const btnEliminar = document.getElementById("btnEliminarUsuario");
  const modal = document.getElementById("modalAgregarUsuario");
  const cerrarModal = document.getElementById("cerrarModalAgregar");
  const form = document.getElementById("formAgregarUsuario");
  const mensaje = document.getElementById("mensajeRegistroUsuario");

  btnAgregar.addEventListener("click", () => {
    modal.style.display = "flex";
    mensaje.textContent = "";
  });
  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
    mensaje.textContent = "";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      form.reset();
      mensaje.textContent = "";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form));
    if (
      !datos.run ||
      !datos.nombre ||
      !datos.correo ||
      !datos.password ||
      !datos.fecha ||
      !datos.telefono ||
      !datos.comuna
    ) {
      mensaje.textContent = "Completa todos los campos obligatorios.";
      return;
    }
    let usuarios = [];
    try {
      const raw = localStorage.getItem("usuariosRegistrados");
      if (raw) {
        const HEX_RE = /^[0-9a-f]+$/i;
        function isHexLike(s) {
          return typeof s === "string" && s.length % 2 === 0 && HEX_RE.test(s);
        }
        function hexToString(hex) {
          let out = "";
          for (let i = 0; i < hex.length; i += 2) {
            out += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          }
          return out;
        }
        const json = isHexLike(raw) ? hexToString(raw) : raw;
        usuarios = JSON.parse(json);
      }
    } catch {}
    if (usuarios.some((u) => u.correo === datos.correo)) {
      mensaje.textContent = "El correo ya está registrado.";
      return;
    }
    const nuevo = {
      run: datos.run,
      nombre: datos.nombre,
      correo: datos.correo,
      password: datos.password,
      fecha: datos.fecha,
      telefono: datos.telefono,
      comuna: datos.comuna,
      preferencias: {},
      codigo: datos.codigo || "",
      codigoUsado: datos.codigo || "",
      descuento: 0,
      tortaGratis: false,
    };
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
    const edad = calcularEdad(nuevo.fecha);
    if (edad > 50) {
      nuevo.descuento = 50;
    } else if ((nuevo.codigo || "").trim().toUpperCase() === "FELICES50") {
      nuevo.descuento = 10;
    }
    if (nuevo.correo.endsWith("@duocuc.cl") && esCumpleaniosHoy(nuevo.fecha)) {
      nuevo.tortaGratis = true;
    }
    usuarios.push(nuevo);
    try {
      const json = JSON.stringify(usuarios);
      function stringToHex(str) {
        return Array.from(str)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("");
      }
      localStorage.setItem("usuariosRegistrados", stringToHex(json));
      mensaje.style.color = "#388E3C";
      mensaje.textContent = "Usuario registrado exitosamente.";
      form.reset();
      setTimeout(() => {
        modal.style.display = "none";
        mensaje.textContent = "";
      }, 1200);
    } catch (e) {
      mensaje.textContent = "No se pudo guardar el usuario.";
    }
  });

  btnEliminar.addEventListener("click", function () {
    const correo = prompt("Ingrese el correo del usuario a eliminar:");
    if (!correo) return;
    let usuarios = [];
    try {
      const raw = localStorage.getItem("usuariosRegistrados");
      if (raw) {
        const HEX_RE = /^[0-9a-f]+$/i;
        function isHexLike(s) {
          return typeof s === "string" && s.length % 2 === 0 && HEX_RE.test(s);
        }
        function hexToString(hex) {
          let out = "";
          for (let i = 0; i < hex.length; i += 2) {
            out += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          }
          return out;
        }
        const json = isHexLike(raw) ? hexToString(raw) : raw;
        usuarios = JSON.parse(json);
      }
    } catch {}
    const idx = usuarios.findIndex((u) => u.correo === correo);
    if (idx === -1) {
      alert("Usuario no encontrado.");
      return;
    }
    usuarios.splice(idx, 1);
    try {
      const json = JSON.stringify(usuarios);
      function stringToHex(str) {
        return Array.from(str)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("");
      }
      localStorage.setItem("usuariosRegistrados", stringToHex(json));
      alert("Usuario eliminado exitosamente.");
    } catch (e) {
      alert("No se pudo eliminar el usuario.");
    }
  });
});
