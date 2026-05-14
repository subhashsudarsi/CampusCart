import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MessageThread from '../components/MessageThread'
import useAuth from '../hooks/useAuth'
import {
  deleteConversationById,
  fetchConversationsByUserId,
  sendConversationMessage
} from '../services/messagingService'

function formatMessageTime(timestamp) {
  if (!timestamp) {
    return ''
  }

  const parsedDate = new Date(timestamp)
  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const now = new Date()
  const isSameDay = parsedDate.toDateString() === now.toDateString()
  if (isSameDay) {
    return parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return parsedDate.toLocaleDateString()
}

function mapConversationToThread(conversation, currentUserId) {
  return {
    id: conversation.id,
    otherUserId: conversation.otherUser?.id ?? null,
    name: conversation.otherUser?.name || 'Unknown User',
    product: conversation.product || 'General conversation',
    productId: conversation.productId ?? null,
    isDraft: false,
    online: false,
    messages: Array.isArray(conversation.messages)
      ? conversation.messages.map((message) => ({
          id: message.id,
          text: message.text,
          isSender: Number(message.senderId) === Number(currentUserId),
          timestamp: formatMessageTime(message.timestamp),
        }))
      : [],
  }
}

function createDraftThreadFromLocation(locationState, currentUserId) {
  const sellerId = Number(locationState?.sellerId)
  const productId = Number(locationState?.productId)

  if (!Number.isInteger(sellerId) || sellerId <= 0 || sellerId === Number(currentUserId)) {
    return null
  }

  return {
    id: `draft-${sellerId}-${Number.isInteger(productId) && productId > 0 ? productId : 'general'}`,
    otherUserId: sellerId,
    name: locationState?.sellerName || 'Seller',
    product: locationState?.productTitle || 'General conversation',
    productId: Number.isInteger(productId) && productId > 0 ? productId : null,
    isDraft: true,
    online: false,
    messages: [],
  }
}

export default function Messaging() {
  const { user } = useAuth()
  const location = useLocation()
  const [threads, setThreads] = useState([])
  const [selectedThreadId, setSelectedThreadId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedThread = useMemo(
    () => threads.find((thread) => String(thread.id) === String(selectedThreadId)) || null,
    [threads, selectedThreadId]
  )

  const filteredThreads = useMemo(
    () =>
      threads.filter(
        (thread) =>
          thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.product.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [threads, searchQuery]
  )

  useEffect(() => {
    if (!user?.id) {
      return
    }

    let isCancelled = false

    const loadConversations = async () => {
      setLoading(true)
      setError('')

      try {
        const conversations = await fetchConversationsByUserId(user.id)

        const mappedThreads = conversations.map((conversation) =>
          mapConversationToThread(conversation, user.id)
        )

        const draftThread = createDraftThreadFromLocation(location.state, user.id)
        const shouldAddDraft =
          draftThread &&
          !mappedThreads.some(
            (thread) =>
              Number(thread.otherUserId) === Number(draftThread.otherUserId) &&
              String(thread.product || '') === String(draftThread.product || '')
          )

        const nextThreads = shouldAddDraft ? [draftThread, ...mappedThreads] : mappedThreads

        if (!isCancelled) {
          setThreads(nextThreads)
          setSelectedThreadId((previousId) => {
            if (nextThreads.some((thread) => String(thread.id) === String(previousId))) {
              return previousId
            }
            return nextThreads[0]?.id || null
          })
        }
      } catch (loadError) {
        if (!isCancelled) {
          setThreads([])
          setSelectedThreadId(null)
          setError(loadError.message || 'Failed to load conversations')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadConversations()

    return () => {
      isCancelled = true
    }
  }, [location.state, user?.id])

  const handleSendMessage = async (threadId, messageText) => {
    const targetThread = threads.find((thread) => String(thread.id) === String(threadId))
    if (!targetThread || !targetThread.otherUserId) {
      setError('Could not send message for this conversation')
      return false
    }

    try {
      const numericConversationId = Number(threadId)
      const data = await sendConversationMessage({
        conversationId: Number.isInteger(numericConversationId) && numericConversationId > 0
          ? numericConversationId
          : undefined,
        senderId: user.id,
        receiverId: targetThread.otherUserId,
        productId: targetThread.productId,
        productTitle: targetThread.product,
        text: messageText,
      })

      const newMessage = {
        id: data.message?.id || Date.now(),
        text: messageText,
        isSender: true,
        timestamp: formatMessageTime(data.message?.timestamp || new Date().toISOString()),
      }

      setThreads((currentThreads) => {
        const serverConversationId = Number(data.conversationId)
        const effectiveThreadId =
          Number.isInteger(serverConversationId) && serverConversationId > 0 ? serverConversationId : threadId

        const updatedThreads = currentThreads.map((thread) =>
          String(thread.id) === String(threadId)
            ? {
                ...thread,
                id: effectiveThreadId,
                isDraft: false,
                messages: [...thread.messages, newMessage],
              }
            : thread
        )

        const updatedThread = updatedThreads.find(
          (thread) => String(thread.id) === String(effectiveThreadId)
        )
        const remainingThreads = updatedThreads.filter(
          (thread) => String(thread.id) !== String(effectiveThreadId)
        )

        setSelectedThreadId(effectiveThreadId)
        return updatedThread ? [updatedThread, ...remainingThreads] : updatedThreads
      })

      setError('')
      return true
    } catch (sendError) {
      setError(sendError.message || 'Failed to send message')
      return false
    }
  }

  const handleDeleteThread = async (threadId) => {
    try {
      const numericThreadId = Number(threadId)
      if (Number.isInteger(numericThreadId) && numericThreadId > 0) {
        await deleteConversationById(numericThreadId, user.id)
      }

      const remainingThreads = threads.filter((thread) => String(thread.id) !== String(threadId))
      setThreads(remainingThreads)

      if (String(selectedThreadId) === String(threadId)) {
        setSelectedThreadId(remainingThreads[0]?.id || null)
      }

      setError('')
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete conversation')
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view your messages</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[560px] lg:h-[calc(100vh-220px)]">
        {/* Threads List */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col min-h-0">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="message-scroll flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading conversations...</div>
            ) : filteredThreads.length > 0 ? (
              filteredThreads.map(thread => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-4 border-b cursor-pointer transition ${
                    selectedThreadId === thread.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{thread.name}</p>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        thread.online ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{thread.product}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(thread.messages[thread.messages.length - 1]?.text || 'No messages yet').substring(0, 30)}...
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedThread ? (
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <MessageThread
                thread={selectedThread}
                onSendMessage={handleSendMessage}
              />
            </div>
            <button
              onClick={() => handleDeleteThread(selectedThread.id)}
              className="mt-4 w-full shrink-0 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              Delete Conversation
            </button>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex items-center justify-center min-h-0">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
