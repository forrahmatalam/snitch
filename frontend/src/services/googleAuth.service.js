import { apiRequest } from './api'

export const exchangeGoogleCode = (code) => apiRequest('/auth/google', {
  method: 'POST',
  body: JSON.stringify({ code }),
})
