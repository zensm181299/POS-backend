// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.getAllTransactions);
// Endpoint untuk membuat transaksi baru
router.post('/', transactionController.createTransaction);

// Endpoint untuk melihat detail transaksi berdasarkan ID UUID
router.get('/:id', transactionController.getDetailTransaction);

// Endpoint untuk soft delete transaksi berdasarkan ID UUID
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;