const { User } = require('../models');

async function requireAdminUser(adminId) {
  if (!Number.isInteger(adminId) || adminId <= 0) {
    return null;
  }

  const adminUser = await User.findOne({ id: adminId, role: 'admin' }).lean();
  return adminUser || null;
}

module.exports = {
  requireAdminUser,
};
