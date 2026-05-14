const bcrypt = require('bcryptjs');
const { SAMPLE_USERS, SAMPLE_PRODUCTS, SAMPLE_CONVERSATIONS } = require('../constants/demoData');
const { User, Product, Conversation, Message } = require('../models');
const { getNextSequence } = require('../utils/sequence');
const { normalizeParticipantIds } = require('../utils/chat');
const { DEFAULT_IMAGE } = require('../utils/serializers');

async function ensureDemoUsers() {
  let inserted = 0;

  for (const user of SAMPLE_USERS) {
    const normalizedEmail = user.email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).lean();

    if (existing) {
      continue;
    }

    const nextId = await getNextSequence('users');
    const passwordHash = await bcrypt.hash('password123', 10);

    await User.create({
      id: nextId,
      name: user.name,
      email: normalizedEmail,
      password: passwordHash,
      role: user.role,
      approvalStatus: 'approved',
      approvedAt: new Date(),
    });

    inserted += 1;
  }

  return inserted;
}

async function ensureDemoConversations() {
  const existingCount = await Conversation.countDocuments();
  if (existingCount > 0) {
    return { insertedConversations: 0, insertedMessages: 0 };
  }

  const users = await User.find().lean();
  const usersByEmail = new Map(users.map((user) => [user.email, user]));

  let insertedConversations = 0;
  let insertedMessages = 0;

  for (const sampleConversation of SAMPLE_CONVERSATIONS) {
    const firstUser = usersByEmail.get(sampleConversation.participantEmails[0]);
    const secondUser = usersByEmail.get(sampleConversation.participantEmails[1]);

    if (!firstUser || !secondUser) {
      continue;
    }

    const conversationId = await getNextSequence('conversations');
    const participantIds = normalizeParticipantIds(firstUser.id, secondUser.id);

    await Conversation.create({
      id: conversationId,
      participantIds,
      productTitle: sampleConversation.productTitle,
      lastMessageAt: new Date(),
    });

    insertedConversations += 1;
    let lastMessageAt = new Date();

    for (const sampleMessage of sampleConversation.messages) {
      const sender = usersByEmail.get(sampleMessage.senderEmail);
      if (!sender || !participantIds.includes(sender.id)) {
        continue;
      }

      const receiverId = participantIds.find((id) => id !== sender.id);
      const messageId = await getNextSequence('messages');

      const createdMessage = await Message.create({
        id: messageId,
        conversationId,
        senderId: sender.id,
        receiverId,
        text: sampleMessage.text,
      });

      lastMessageAt = createdMessage.createdAt;
      insertedMessages += 1;
    }

    await Conversation.updateOne({ id: conversationId }, { $set: { lastMessageAt } });
  }

  return { insertedConversations, insertedMessages };
}

async function insertSampleProducts(forceInsert) {
  if (!forceInsert) {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      return { inserted: 0, errors: [] };
    }
  }

  const users = await User.find().lean();
  const usersByEmail = new Map(users.map((user) => [user.email, user]));

  let inserted = 0;
  const errors = [];

  for (const product of SAMPLE_PRODUCTS) {
    const seller = usersByEmail.get(product.sellerEmail.toLowerCase());
    if (!seller) {
      errors.push(`Seller not found for ${product.title}`);
      continue;
    }

    try {
      const nextId = await getNextSequence('products');
      await Product.create({
        id: nextId,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        sellerId: seller.id,
        sellerName: seller.name,
        location: product.location,
        status: 'available',
        image: DEFAULT_IMAGE,
      });

      inserted += 1;
    } catch (error) {
      errors.push(`Insert error for '${product.title}': ${error.message}`);
    }
  }

  return { inserted, errors };
}

async function ensureDemoData() {
  const insertedUsers = await ensureDemoUsers();
  const productResult = await insertSampleProducts(false);
  const conversationResult = await ensureDemoConversations();

  return {
    insertedUsers,
    insertedProducts: productResult.inserted,
    insertedConversations: conversationResult.insertedConversations,
    insertedMessages: conversationResult.insertedMessages,
  };
}

module.exports = {
  ensureDemoUsers,
  insertSampleProducts,
  ensureDemoData,
};
