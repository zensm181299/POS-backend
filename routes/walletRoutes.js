const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/', walletController.getAllWallet);
router.get('/:id', walletController.detailWallet);
router.post('/', walletController.createNewWallet);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);
router.get('/:id/transactions', walletController.detailTransactionWallet);
router.post('/:id/transactions', walletController.createNewTransactionWallet);

module.exports = router;