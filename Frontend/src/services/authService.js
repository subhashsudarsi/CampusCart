import { apiRequest, apiRequestSafe } from './httpClient'

export async function checkApiHealth() {
  const payload = await apiRequestSafe('/health')
  return Boolean(payload?.success)
}

export async function loginUser({ email, password }) {
  return apiRequest('/login', {
    method: 'POST',
    body: { email, password },
  })
}

export async function submitStudentSignupRequest({ name, email, password }) {
  return apiRequest('/students/signup-request', {
    method: 'POST',
    body: { name, email, password },
  })
}
