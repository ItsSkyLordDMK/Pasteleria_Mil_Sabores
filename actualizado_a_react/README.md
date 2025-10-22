# Pastelería Mil Sabores - React (visual port)

Este directorio contiene una conversión visual del proyecto original a React.

Estructura básica:
- public/index.html
- src/index.jsx
- src/App.jsx (rutas)
- src/components (AdminUsuario, Sidebar)
- src/pages (Home, Blogs, Productos, Contacto, Registro, IniciarSesion, Nosotros, DetalleProducto, AdminHome, AdminProducto)
- src/index.css
- src/assets/img/logo.svg (placeholder)

Cómo ejecutar (Vite):
1. Desde PowerShell, situarse en `actualizado_a_react`.
2. Ejecutar:

```powershell
npm install
npm run dev
```

Comandos útiles:

```powershell
npm run dev     # desarrollo (Vite)
npm run build   # producción
npm run preview # previsualizar build
```

Notas:
- No he copiado las imágenes binarias originales; uso un placeholder `logo.svg`. Si quieres que copie las imágenes reales, puedo hacerlo.
- No migré aún la lógica JS (formularios, localStorage, modales). Lo haré en la siguiente fase si quieres.
