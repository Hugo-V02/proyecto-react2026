import axios from 'axios'

const api = axios.create({
  baseURL: 'https://mascotas.pythonanywhere.com/api',
})

export default api
