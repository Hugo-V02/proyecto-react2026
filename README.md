# MascotasApp (Frontend React)

Aplicación frontend en **React + Vite + Axios** que consume la API REST de mascotas
hospedada en `https://mascotas.pythonanywhere.com/api`.

Funcionalidades cubiertas:

- Listado de mascotas (`GET /api/mascotas/`).
- Detalle de mascota (`GET /api/mascotas/{id}/`).
- Creación de mascota (`POST /api/mascotas/` con subida de imagen).
- Edición de estado (`PATCH /api/mascotas/{id}/`).
- Eliminación de mascota (`DELETE /api/mascotas/{id}/`).
- Comentarios: listar, agregar (`POST /api/mascotas/{id}/comentar/`)
  y eliminar (`DELETE /api/comentarios/{id}/`).
- Manejo de errores con mensajes amigables diferenciados por código HTTP
  (400, 404, 500).

---

## Requisitos

- Node.js ≥ 18
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz:

```
VITE_API_BASE_URL=https://mascotas.pythonanywhere.com/api
```

Si no se define, la app usa esa misma URL por defecto.

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo (Vite)
npm run build     # Compila para producción en dist/
npm run preview   # Sirve la build localmente
npm run lint      # Ejecuta ESLint sobre src/
```

## Estructura del proyecto

```
src/
├── App.jsx
├── FormularioNuevaMascota.jsx
├── MascotasApp.jsx
├── main.jsx
└── services/
    ├── api.js
    └── errores.js
```

- `services/api.js`: instancia de Axios con `baseURL` configurable.
- `services/errores.js`: traduce errores de Axios en mensajes amigables
  según `error.response?.status` (400 / 404 / 500).
- `MascotasApp.jsx`: vista principal (listado + detalle + comentarios + errores).
- `FormularioNuevaMascota.jsx`: formulario de creación (delegando la petición
  en el padre).

---

## Uso de IA durante el desarrollo

Este proyecto fue desarrollado con apoyo de un asistente de IA
(Claude / Anthropic) que colaboró en las siguientes tareas:

1. **Diseño e implementación inicial** del cliente Axios y la capa de servicios.
2. **Componentes React** (`MascotasApp`, `FormularioNuevaMascota`)
   siguiendo la arquitectura existente del proyecto.
3. **Capa de manejo de errores** (`services/errores.js`) para traducir
   respuestas del backend (400 / 404 / 500) en mensajes amigables
   en español, tal como exige la rúbrica del proyecto.
4. **Auditoría de cumplimiento** de la rúbrica: revisión de cada criterio,
   listado de hallazgos, refactorización del componente principal y
   documentación en este README.
5. **Configuración de ESLint** con el plugin oficial de React para cumplir
   el criterio de "sin advertencias de ESLint".
6. **Limpieza de comentarios** del código fuente manteniendo intacta la
   lógica de negocio.

El código fue revisado y validado por el autor antes de cada commit.
La IA actuó como copiloto: aceleró la escritura y sugirió patrones, pero
las decisiones de arquitectura, los nombres de las props y los mensajes
finales para el usuario fueron definidos por el autor.

### Consideraciones éticas

- Ningún dato sensible fue enviado a la IA.
- No se incorporó código con licencias incompatibles.
- Todo código generado fue revisado manualmente antes de integrarse.

---

## Manejo de errores

Todos los `try/catch` consumen `obtenerMensajeError(err, fallback)` definido
en `src/services/errores.js`. Esa función:

- Si el backend devuelve **400**, expone los errores por campo
  (ej. `nombre: "Este campo es obligatorio."`).
- Si el backend devuelve **404**, muestra "La mascota no fue encontrada."
- Si el backend devuelve **500**, muestra "No fue posible cargar la información."
- Si no hay respuesta del servidor, muestra "No fue posible conectar con el servidor."

En ningún caso se expone al usuario información técnica
(`AxiosError`, `Request failed`, `Network Error`, etc.).
