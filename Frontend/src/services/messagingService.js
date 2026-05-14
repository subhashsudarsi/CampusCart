import { apiRequest } from './httpClient'

export async function fetchConversationsByUserId(userId) {
  const payload = await apiRequest(`/messages/conversations?userId=${encodeURIComponent(userId)}`)
  return Array.isArray(payload.conversations) ? payload.conversations : []
}

export async function sendConversationMessage({
  conversationId,
  senderId,
  receiverId,
  productId,
  productTitle,
  text,
}) {
  return apiRequest('/messages/send', {
    method: 'POST',
    body: {
      conversationId,
      senderId,
      receiverId,
      productId,
      productTitle,
      text,
    },
  })
}

export async function deleteConversationById(conversationId, userId) {
  return apiRequest(`/messages/conversations/${conversationId}?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  })
}
