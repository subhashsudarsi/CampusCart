import { useEffect, useState } from 'react'

export default function MessageThread({ thread, onSendMessage }) {
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    setMessageText('')
  }, [thread?.id])

  const handleSend = async () => {
    const trimmedMessage = messageText.trim()
    if (!trimmedMessage || isSending) {
      return
    }

    setIsSending(true)
    const wasSent = await onSendMessage(thread.id, trimmedMessage)
    setIsSending(false)

    if (wasSent) {
      setMessageText('')
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{thread.name}</h3>
          <p className="text-xs text-gray-500">{thread.product}</p>
        </div>
        <div className="text-sm text-gray-500">
          {thread.online ? (
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          ) : null}
          {thread.online ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Messages */}
      <div className="message-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4">
        {thread.messages?.length ? (
          thread.messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs px-4 py-2 rounded-lg ${
                  msg.isSender
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No messages yet. Start the conversation.</p>
        )}
      </div>

      {/* Message Input */}
      <div className="shrink-0 border-t bg-white p-4 flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          disabled={isSending}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={isSending || !messageText.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
