# MascotasApp Front-End

Aplicación Web SPA desarrollada con React + Vite que consume la API REST de MascotasApp mediante Axios. Permite administrar mascotas y sus comentarios utilizando operaciones CRUD y manejo de errores amigables para el usuario.

---

# Tecnologías utilizadas

- React
- Vite
- Axios
- JavaScript (ES6+)
- CSS
- ESLint
- Git y GitHub

---

# Requisitos

Antes de ejecutar el proyecto debes tener instalado:

- Node.js (v18 o superior)
- npm
- Git

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/USUARIO/REPOSITORIO.git
```

Entrar al proyecto:

```bash
cd mascotas-front
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` con la URL de la API:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Ejecutar el proyecto:

```bash
npm run dev
```

---

# Scripts disponibles

Ejecutar el proyecto:

```bash
npm run dev
```

Compilar producción:

```bash
npm run build
```

Ejecutar ESLint:

```bash
npm run lint
```

---

# Funcionalidades

# Gestión de mascotas

- Listar mascotas.
- Ver detalle de una mascota.
- Registrar una nueva mascota.
- Actualizar el estado de una mascota.
- Eliminar una mascota.

# Gestión de comentarios

- Agregar comentarios.
- Eliminar comentarios.

# Manejo de errores

La aplicación identifica distintos códigos HTTP utilizando:

```javascript
error.response?.status
error.response?.data
```

Se muestran mensajes amigables para el usuario en casos como:

- Error 400 (validaciones)
- Error 404 (recurso no encontrado)
- Error de conexión con el servidor

Nunca se muestran mensajes técnicos como:

```
AxiosError
Network Error
```

---

# 🤖 Uso de Inteligencia Artificial

Durante el desarrollo del proyecto se utilizaron herramientas de Inteligencia Artificial como apoyo en distintas etapas del desarrollo.

## Herramientas utilizadas

- ChatGPT
- Claude Code

# ¿En qué ayudaron?

- Explicación de conceptos de React.
- Implementación del consumo de la API con Axios.
- Manejo de errores mediante `error.response?.status`.
- Validación de formularios.
- Optimización del código.
- Corrección de advertencias de ESLint.
- Revisión de buenas prácticas.
- Refactorización de componentes.
- Generación de documentación.

# Validación de las sugerencias

Todas las sugerencias entregadas por las herramientas de IA fueron revisadas y probadas manualmente antes de incorporarlas al proyecto. Además, se verificó el correcto funcionamiento ejecutando:

```bash
npm run lint
```

```bash
npm run build
```

y realizando pruebas funcionales de cada operación CRUD.

---

#  Estructura del proyecto

```
src/
│
├── components/
├── services/
│   └── api.js
├── assets/
├── App.jsx
└── main.jsx
```

---

# Integrantes

- Bruno Miranda
- Hugo Varas
- Leander Gonzalez

---

# Funcionalidades desarrolladas

✔ Listado de mascotas (GET)

✔ Detalle de mascota (GET)

✔ Crear mascota (POST)

✔ Editar estado de mascota (PATCH)

✔ Eliminar mascota (DELETE)

✔ Agregar comentario (POST)

✔ Eliminar comentario (DELETE)

✔ Manejo de errores HTTP

✔ Validaciones de formularios

✔ Consumo de API mediante Axios

---

# Distribución de tareas

# Evaluación IV: Front-End React + API MascotasApp

# Paso 1 (Trabajo en equipo)

Los tres integrantes participaron en la inicialización del proyecto utilizando Vite + React, configuración inicial del entorno de desarrollo y comprensión de la estructura base de la aplicación.

---

# Developer Leander — Módulo de Listado, Detalle y Comentarios

Responsabilidades:

- **Paso 4:** Listar mascotas (`GET /api/mascotas/`)
- **Paso 5:** Ver detalle de mascota y comentarios (`GET /api/mascotas/{id}/`)
- **Paso 9:** Agregar comentario (`POST /api/mascotas/{id}/comentar/`)
- **Paso 10:** Eliminar comentario (`DELETE /api/comentarios/{id}/`)
- **Paso 11:** Implementación del manejo de errores en sus componentes.
- **Paso 15:** Respuesta de las preguntas conceptuales:
  - ¿Qué es destructuring?
  - ¿Qué hace `async/await`?

---

# Developer Bruno — Módulo de Creación, Edición y Eliminación

Responsabilidades:

- **Paso 3:** Obtener catálogos desde la API (`GET /api/choices/`)
- **Paso 6:** Crear mascota utilizando **FormData** (`POST /api/mascotas/`)
- **Paso 7:** Editar estado de una mascota (`PATCH /api/mascotas/{id}/`)
- **Paso 8:** Eliminar mascota (`DELETE /api/mascotas/{id}/`)
- **Paso 11:** Implementación del manejo de errores en sus componentes.
- **Paso 15:** Respuesta de las preguntas conceptuales:
  - ¿Cómo funciona FormData?
  - ¿Por qué no mostrar errores técnicos al usuario?
  - Diferencia entre **PATCH** y **PUT**.

---

# 👨‍💻 Developer Hugo — Infraestructura, Integración y Documentación

Responsabilidades:

- **Pasos 1 y 2:** Configuración inicial del proyecto y de Axios (con apoyo del equipo).
- **Paso 11:** Integración del manejo global de errores.
- **Paso 12:** Elaboración del README del proyecto.
- **Paso 13:** Organización del repositorio y revisión de commits.
- **Paso 14:** Coordinación del video explicativo.
- **Paso 15:** Respuesta de las preguntas conceptuales:
  - ¿Qué son las props?
  - ¿Qué son los componentes en React?

---

# Trabajo colaborativo

Las siguientes actividades fueron desarrolladas en conjunto por los tres integrantes:

- Inicialización del proyecto con React y Vite.
- Revisión y pruebas de integración.
- Validación del funcionamiento de la aplicación.
- Corrección de errores detectados durante el desarrollo.
- Participación en el video explicativo y revisión final antes de la entrega.

---

# Video

El proyecto incluye un video demostrativo donde se explica:

- Funcionamiento completo de la aplicación.
- Explicación de los componentes principales.
- Consumo de la API.
- Manejo de errores.
- Uso de herramientas de Inteligencia Artificial durante el desarrollo.

---

# 📄 Licencia

Proyecto desarrollado con fines académicos para la asignatura **Desarrollo de Aplicaciones Web SPA con React e Integración de Inteligencia Artificial**.
