import { apiUrl } from '../utils/api'

async function toPayload(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options

  const response = await fetch(apiUrl(path), {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const payload = await toPayload(response)

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`)
  }

  return payload
}

export async function apiRequestSafe(path, options = {}) {
  try {
    return await apiRequest(path, options)
  } catch {
    return null
  }
}
