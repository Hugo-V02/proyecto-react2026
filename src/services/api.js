import axios from 'axios'

// Vite expone las variables de entorno que empiecen por VITE_
// en import.meta.env. Si no existe, usamos el valor por defecto.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://mascotas.pythonanywhere.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  // No fijamos Content-Type aquí: Axios detecta FormData y aplica
  // 'multipart/form-data' con el boundary correcto automáticamente.
  headers: {
    Accept: 'application/json',
  },
})

export default api