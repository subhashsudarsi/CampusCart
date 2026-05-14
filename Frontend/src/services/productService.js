import { apiRequest } from './httpClient'

export async function fetchAvailableProducts() {
  const payload = await apiRequest('/products')
  return Array.isArray(payload.products) ? payload.products : []
}

export async function fetchProductById(productId) {
  const payload = await apiRequest(`/products/${productId}`)
  return payload.product || null
}

export async function createProductListing(payload) {
  return apiRequest('/products', {
    method: 'POST',
    body: payload,
  })
}

export async function deleteProductListing(productId, adminId) {
  return apiRequest(`/products/${productId}?adminId=${encodeURIComponent(adminId)}`, {
    method: 'DELETE',
  })
}

export async function submitProductReport(productId, payload) {
  return apiRequest(`/products/${productId}/report`, {
    method: 'POST',
    body: payload,
  })
}
