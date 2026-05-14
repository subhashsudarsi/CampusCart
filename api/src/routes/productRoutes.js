const express = require('express');
const { Product, Report, User } = require('../models');
const { getNextSequence } = require('../utils/sequence');
const { DEFAULT_IMAGE, toProductResponse } = require('../utils/serializers');
const { requireAdminUser } = require('../utils/admin');

const router = express.Router();

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ status: 'available' }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, products: products.map(toProductResponse) });
  } catch (error) {
    res.status(500).json({ success: false, message: `Query error: ${error.message}` });
  }
});

router.get('/products/:id', async (req, res) => {
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid product id is required' });
  }

  try {
    const product = await Product.findOne({ id: productId }).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, product: toProductResponse(product) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Query error: ${error.message}` });
  }
});

router.post('/products', async (req, res) => {
  const { title, description, category, price, location, sellerEmail, image } = req.body || {};

  if (!title || !description || !category || price === undefined || !location || !sellerEmail) {
    return res.status(400).json({
      success: false,
      message: 'title, description, category, price, location, and sellerEmail are required',
    });
  }

  const parsedPrice = Number(price);
  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ success: false, message: 'price must be a positive number' });
  }

  try {
    const normalizedEmail = String(sellerEmail).trim().toLowerCase();
    const seller = await User.findOne({ email: normalizedEmail }).lean();

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller account not found' });
    }

    const productId = await getNextSequence('products');

    const newProduct = await Product.create({
      id: productId,
      title: String(title).trim(),
      description: String(description).trim(),
      category: String(category).trim().toLowerCase(),
      price: parsedPrice,
      location: String(location).trim(),
      sellerId: seller.id,
      sellerName: seller.name,
      image: typeof image === 'string' && image.trim() ? image.trim() : DEFAULT_IMAGE,
      status: 'available',
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: toProductResponse(newProduct),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Create product failed: ${error.message}` });
  }
});

router.delete('/products/:id', async (req, res) => {
  const productId = Number(req.params.id);
  const adminId = Number(req.query.adminId);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid product id is required' });
  }

  if (!Number.isInteger(adminId) || adminId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid adminId query parameter is required' });
  }

  try {
    const adminUser = await requireAdminUser(adminId);
    if (!adminUser) {
      return res.status(403).json({ success: false, message: 'Only admin users can delete listings' });
    }

    const deletedProduct = await Product.findOneAndDelete({ id: productId }).lean();
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
      product: toProductResponse(deletedProduct),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Delete listing failed: ${error.message}` });
  }
});

router.post('/products/:id/report', async (req, res) => {
  const productId = Number(req.params.id);
  const reporterId = Number(req.body?.reporterId);
  const reason = String(req.body?.reason || '').trim().toLowerCase();
  const details = String(req.body?.details || '').trim();

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid product id is required' });
  }

  if (!Number.isInteger(reporterId) || reporterId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid reporterId is required' });
  }

  if (!['spam', 'fraud', 'prohibited', 'misleading', 'other'].includes(reason)) {
    return res.status(400).json({
      success: false,
      message: 'reason must be one of: spam, fraud, prohibited, misleading, other',
    });
  }

  try {
    const [product, reporter] = await Promise.all([
      Product.findOne({ id: productId }).lean(),
      User.findOne({ id: reporterId }).lean(),
    ]);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!reporter) {
      return res.status(404).json({ success: false, message: 'Reporter account not found' });
    }

    if (Number(product.sellerId) === Number(reporterId)) {
      return res.status(400).json({ success: false, message: 'You cannot report your own listing' });
    }

    const existingPendingReport = await Report.findOne({
      productId,
      reporterId,
      status: 'pending',
    }).lean();

    if (existingPendingReport) {
      return res.status(409).json({
        success: false,
        message: 'You already submitted a pending report for this listing',
      });
    }

    const reportId = await getNextSequence('reports');
    const report = await Report.create({
      id: reportId,
      productId,
      reporterId,
      reporterEmail: reporter.email,
      reason,
      details,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Admin will review it.',
      report: {
        id: report.id,
        productId: report.productId,
        reporterId: report.reporterId,
        reason: report.reason,
        status: report.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Report submission failed: ${error.message}` });
  }
});

module.exports = router;
