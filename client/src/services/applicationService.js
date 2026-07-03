// client/src/services/applicationService.js

import API from './authService'

export const applicationService = {
  getAll: () => API.get('/applications'),
  getOne: (id) => API.get(`/applications/${id}`),
  create: (data) => API.post('/applications', data),
  update: (id, data) => API.put(`/applications/${id}`, data),
  delete: (id) => API.delete(`/applications/${id}`),
  getStats: () => API.get('/applications/stats'),
}