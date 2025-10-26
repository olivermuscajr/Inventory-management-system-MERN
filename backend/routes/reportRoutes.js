const express = require('express');
const router = express.Router();
const { getInventoryReport } = require('../controllers/reportController');

router.get('/inventory', getInventoryReport);

module.exports = router;