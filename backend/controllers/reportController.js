const Product = require('../models/Product');

// Generate inventory report data
const getInventoryReport = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ name: 1 });

        const report = {
            generatedAt: new Date().toISOString(),
            totalProducts: products.length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            lowStockItems: products.filter(p => p.quantity <= p.reorderLevel).length,
            outOfStockItems: products.filter(p => p.quantity === 0).length,
            products: products.map(p => ({
                name: p.name,
                sku: p.sku,
                category: p.category,
                price: p.price,
                quantity: p.quantity,
                reorderLevel: p.reorderLevel,
                status: p.status,
                value: (p.price * p.quantity).toFixed(2)
            }))
        };

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to generate report',
            error: error.message
        });
    }
};

module.exports = {
    getInventoryReport
};