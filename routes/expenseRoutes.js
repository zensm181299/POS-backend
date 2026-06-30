const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseDetail);
router.post('/', expenseController.createExpenseTransaction);

module.exports = router;