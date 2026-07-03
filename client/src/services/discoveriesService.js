// client/src/services/discoveriesService.js

import API from './authService'

export const discoveriesService = {
  getAll: () => API.get('/discoveries'),
  create: (data) => API.post('/discoveries', data),
  update: (id, data) => API.put(`/discoveries/${id}`, data),
  delete: (id) => API.delete(`/discoveries/${id}`),
}