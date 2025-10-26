const ActivityLog = require('../models/ActivityLog');

// Get all activity logs
const getAllLogs = async (req, res) => {
    try {
        const { limit = 50, entityType } = req.query;

        let query = {};
        if (entityType) {
            query.entityType = entityType;
        }

        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get logs by entity
const getLogsByEntity = async (req, res) => {
    try {
        const { entityId } = req.params;

        const logs = await ActivityLog.find({ entityId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getAllLogs,
    getLogsByEntity
};