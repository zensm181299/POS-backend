const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/', walletController.getAllWallet);
router.get('/:id', walletController.detailWallet);
router.post('/', walletController.createNewWallet);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);

module.exports = router;