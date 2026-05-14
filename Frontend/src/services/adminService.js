import { apiRequest } from './httpClient'

export async function fetchAdminDashboardData() {
  const [productsPayload, userCountPayload, usersPayload] = await Promise.all([
    apiRequest('/products'),
    apiRequest('/users/count'),
    apiRequest('/users')
  ])

  return {
    products: Array.isArray(productsPayload.products) ? productsPayload.products : [],
    userCount: Number(userCountPayload.count || 0),
    users: Array.isArray(usersPayload.users) ? usersPayload.users : []
  }
}

export async function fetchPendingStudentRequests(adminId) {
  const payload = await apiRequest(`/admin/pending-student-requests?adminId=${adminId}`)
  return Array.isArray(payload.pendingRequests) ? payload.pendingRequests : []
}

export async function approveStudentRequest(studentId, adminId) {
  return apiRequest(`/admin/pending-student-requests/${studentId}/approve`, {
    method: 'POST',
    body: { adminId },
  })
}

export async function rejectStudentRequest(studentId, adminId) {
  return apiRequest(`/admin/pending-student-requests/${studentId}/reject`, {
    method: 'POST',
    body: { adminId },
  })
}
