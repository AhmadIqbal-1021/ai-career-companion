// client/src/services/authService.js

// What is this file?
// All API calls related to authentication.
// Components never call fetch() directly — they use these functions.
// If the API URL changes, we update only this file.

import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Send cookies with every request (for refreshToken cookie)
})

// Axios interceptor — runs before every request
// Attaches the access token to the Authorization header automatically
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete API.defaults.headers.common['Authorization']
  }
}

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  refresh: () => API.post('/auth/refresh'),
  getMe: () => API.get('/auth/me'),
}

export default API