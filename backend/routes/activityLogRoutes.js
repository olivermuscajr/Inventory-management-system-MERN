const express = require('express');
const router = express.Router();
const {
    getAllLogs,
    getLogsByEntity
} = require('../controllers/activityLogController');

router.get('/', getAllLogs);
router.get('/entity/:entityId', getLogsByEntity);

module.exports = router;