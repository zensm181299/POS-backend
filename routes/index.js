const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const transactionRoutes = require('./transactionRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const walletRoutes = require('./walletRoutes');

const { verifyToken } = require('../middleware/authMiddleware');

router.use('/auth', authRoutes);

router.use('/sales-order', verifyToken, transactionRoutes);
router.use('/categories', verifyToken, categoryRoutes);
router.use('/products', verifyToken, productRoutes);
router.use('/dashboard', verifyToken, dashboardRoutes);
router.use('/wallet', verifyToken, walletRoutes);

module.exports = router;