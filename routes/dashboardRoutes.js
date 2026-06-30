// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Cukup dengan 1 endpoint GET ini saja
router.get('/summary', dashboardController.getDashboardSummary);

module.exports = router;