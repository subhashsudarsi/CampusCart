const express = require('express');
const { Conversation, Message, User } = require('../models');
const { normalizeParticipantIds } = require('../utils/chat');
const { getNextSequence } = require('../utils/sequence');
const { toMessageResponse, toPublicUser } = require('../utils/serializers');

const router = express.Router();

router.get('/messages/conversations', async (req, res) => {
  const currentUserId = Number(req.query.userId);

  if (!Number.isInteger(currentUserId) || currentUserId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid userId query parameter is required' });
  }

  try {
    const currentUser = await User.findOne({ id: currentUserId }).lean();
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const conversations = await Conversation.find({ participantIds: currentUserId })
      .sort({ lastMessageAt: -1 })
      .lean();

    if (conversations.length === 0) {
      return res.status(200).json({ success: true, conversations: [] });
    }

    const conversationIds = conversations.map((conversation) => conversation.id);
    const conversationMessages = await Message.find({ conversationId: { $in: conversationIds } })
      .sort({ createdAt: 1 })
      .lean();

    const messagesByConversationId = new Map();
    for (const message of conversationMessages) {
      const existingMessages = messagesByConversationId.get(message.conversationId) || [];
      existingMessages.push(toMessageResponse(message));
      messagesByConversationId.set(message.conversationId, existingMessages);
    }

    const participantIds = Array.from(
      new Set(
        conversations
          .flatMap((conversation) => conversation.participantIds)
          .filter((participantId) => participantId !== currentUserId)
      )
    );

    const participants = await User.find({ id: { $in: participantIds } }).lean();
    const participantsById = new Map(participants.map((participant) => [participant.id, participant]));

    const response = conversations.map((conversation) => {
      const otherUserId = conversation.participantIds.find((participantId) => participantId !== currentUserId);
      const otherUser = participantsById.get(otherUserId);
      const messages = messagesByConversationId.get(conversation.id) || [];
      const lastMessage = messages[messages.length - 1] || null;

      return {
        id: conversation.id,
        product: conversation.productTitle || 'General conversation',
        updatedAt: conversation.lastMessageAt || conversation.updatedAt,
        otherUser: otherUser
          ? toPublicUser(otherUser)
          : { id: otherUserId, name: 'Unknown User', email: '', role: 'student' },
        lastMessage,
        messages,
      };
    });

    return res.status(200).json({ success: true, conversations: response });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Query error: ${error.message}` });
  }
});

router.post('/messages/send', async (req, res) => {
  const senderId = Number(req.body?.senderId);
  const receiverId = Number(req.body?.receiverId);
  const conversationId = req.body?.conversationId !== undefined ? Number(req.body.conversationId) : null;
  const productId = req.body?.productId !== undefined ? Number(req.body.productId) : null;
  const productTitle = typeof req.body?.productTitle === 'string' ? req.body.productTitle.trim() : '';
  const text = String(req.body?.text || '').trim();

  if (!Number.isInteger(senderId) || senderId <= 0 || !Number.isInteger(receiverId) || receiverId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid senderId and receiverId are required' });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ success: false, message: 'senderId and receiverId must be different' });
  }

  if (!text) {
    return res.status(400).json({ success: false, message: 'Message text is required' });
  }

  try {
    const [sender, receiver] = await Promise.all([
      User.findOne({ id: senderId }).lean(),
      User.findOne({ id: receiverId }).lean(),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: 'Sender or receiver not found' });
    }

    let conversation;

    if (Number.isInteger(conversationId) && conversationId > 0) {
      conversation = await Conversation.findOne({ id: conversationId });

      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }

      const hasSender = conversation.participantIds.includes(senderId);
      const hasReceiver = conversation.participantIds.includes(receiverId);
      if (!hasSender || !hasReceiver) {
        return res.status(403).json({ success: false, message: 'User is not part of this conversation' });
      }
    } else {
      const participantIds = normalizeParticipantIds(senderId, receiverId);
      const conversationFilter = {
        participantIds: { $all: participantIds, $size: 2 },
      };

      if (Number.isInteger(productId) && productId > 0) {
        conversationFilter.productId = productId;
      }

      conversation = await Conversation.findOne(conversationFilter);

      if (!conversation) {
        const nextConversationId = await getNextSequence('conversations');
        conversation = await Conversation.create({
          id: nextConversationId,
          participantIds,
          productId: Number.isInteger(productId) && productId > 0 ? productId : null,
          productTitle: productTitle || 'General conversation',
          lastMessageAt: new Date(),
        });
      }
    }

    const nextMessageId = await getNextSequence('messages');
    const newMessage = await Message.create({
      id: nextMessageId,
      conversationId: conversation.id,
      senderId,
      receiverId,
      text,
    });

    await Conversation.updateOne(
      { id: conversation.id },
      {
        $set: {
          lastMessageAt: newMessage.createdAt,
          productTitle: conversation.productTitle || productTitle || 'General conversation',
        },
      }
    );

    return res.status(201).json({
      success: true,
      conversationId: conversation.id,
      message: toMessageResponse(newMessage),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Send failed: ${error.message}` });
  }
});

router.delete('/messages/conversations/:conversationId', async (req, res) => {
  const conversationId = Number(req.params.conversationId);
  const userId = Number(req.query.userId);

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid conversationId is required' });
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid userId query parameter is required' });
  }

  try {
    const conversation = await Conversation.findOne({ id: conversationId }).lean();
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!conversation.participantIds.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this conversation' });
    }

    await Promise.all([
      Message.deleteMany({ conversationId }),
      Conversation.deleteOne({ id: conversationId }),
    ]);

    return res.status(200).json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Delete failed: ${error.message}` });
  }
});

module.exports = router;
