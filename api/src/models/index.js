const mongoose = require('mongoose');
const { MONGO_COLL_CUSTOM_SEQUENCE } = require('../config/env');

const sequenceSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 },
  },
  {
    collection: MONGO_COLL_CUSTOM_SEQUENCE,
    versionKey: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    approvalRequestedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: Number, default: null },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    sellerId: { type: Number, required: true },
    sellerName: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
  },
  {
    timestamps: true,
    collection: 'products',
  }
);

const conversationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    participantIds: { type: [Number], required: true },
    productId: { type: Number, default: null },
    productTitle: { type: String, default: 'General conversation' },
    lastMessageAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'conversations',
  }
);

const messageSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    conversationId: { type: Number, required: true },
    senderId: { type: Number, required: true },
    receiverId: { type: Number, required: true },
    text: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: 'messages',
  }
);

const reportSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    productId: { type: Number, required: true },
    reporterId: { type: Number, required: true },
    reporterEmail: { type: String, required: true, trim: true, lowercase: true },
    reason: {
      type: String,
      enum: ['spam', 'fraud', 'prohibited', 'misleading', 'other'],
      required: true,
    },
    details: { type: String, default: '', trim: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  {
    timestamps: true,
    collection: 'reports',
  }
);

const Sequence = mongoose.models.Sequence || mongoose.model('Sequence', sequenceSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

module.exports = {
  Sequence,
  User,
  Product,
  Conversation,
  Message,
  Report,
};
