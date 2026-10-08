const API = '/api'

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem('accessToken')
  const headers = { ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${API}${path}`, { ...options, headers, credentials: 'include' })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed')
    error.details = data.errors?.map((item) => item.msg).join(', ')
    throw error
  }
  return data
}

export const getTokenRole = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)).role || 'user'
  } catch {
    return 'user'
  }
}
