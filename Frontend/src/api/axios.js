import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://newsnow-express.vercel.app/api',
})

api.interceptors.request.use(
  (config) => {
    // Check primary key and standard fallback keys
    const token =
      localStorage.getItem('newsnow_token') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('newsnow_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api