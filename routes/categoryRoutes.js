const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateRequest } = require('../middleware/validator');

const categoryValidation = ['name','status'];

router.get('/', categoryController.getAllCategory);
router.post('/', validateRequest(categoryValidation), categoryController.createNewCategory);
router.get('/:id', categoryController.detailCategory);
router.put('/:id',validateRequest(categoryValidation), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;