const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateRequest } = require('../middleware/validator');

const productValidation = ['name','status','price','category_id'];

router.get('/', productController.getAllProduct);
router.post('/', validateRequest(productValidation), productController.createNewProduct);
router.get('/:id', productController.detailProduct);
router.put('/:id', validateRequest(productValidation), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
// router.get('/search', productController.searchProduct);

module.exports = router;