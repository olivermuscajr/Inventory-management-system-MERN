const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTOCK', 'LOW_STOCK_ALERT']
        },
        entityType: {
            type: String,
            required: true,
            enum: ['PRODUCT', 'CATEGORY']
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        entityName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        changes: {
            type: mongoose.Schema.Types.Mixed
        },
        user: {
            type: String,
            default: 'Admin'
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entityType: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;