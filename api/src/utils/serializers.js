const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop';

function getPostedDaysAgo(createdAt) {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - createdTime) / 86400000));
}

function toPublicUser(userDoc) {
  return {
    id: userDoc.id,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    approvalStatus: userDoc.approvalStatus || 'approved',
  };
}

function getUserApprovalStatus(userDoc) {
  return userDoc?.approvalStatus || 'approved';
}

function toProductResponse(productDoc) {
  return {
    id: productDoc.id,
    title: productDoc.title,
    price: Number(productDoc.price),
    description: productDoc.description,
    image: productDoc.image || DEFAULT_IMAGE,
    sellerId: productDoc.sellerId,
    seller: productDoc.sellerName,
    location: productDoc.location,
    postedDaysAgo: getPostedDaysAgo(productDoc.createdAt),
    category: productDoc.category,
  };
}

function toMessageResponse(messageDoc) {
  return {
    id: messageDoc.id,
    conversationId: messageDoc.conversationId,
    senderId: messageDoc.senderId,
    receiverId: messageDoc.receiverId,
    text: messageDoc.text,
    timestamp: messageDoc.createdAt,
  };
}

module.exports = {
  DEFAULT_IMAGE,
  toPublicUser,
  getUserApprovalStatus,
  toProductResponse,
  toMessageResponse,
};
