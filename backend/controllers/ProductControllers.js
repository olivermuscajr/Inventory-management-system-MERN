const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find({}).sort({ createdAt: -1 });

        // Update status for all products based on current quantity
        products = products.map(product => {
            const correctStatus = product.quantity === 0 
                ? 'Out of Stock' 
                : product.quantity <= product.reorderLevel 
                    ? 'Low Stock' 
                    : 'In Stock';
            
            // Update in database if status is different
            if (product.status !== correctStatus) {
                Product.findByIdAndUpdate(product._id, { status: correctStatus }, { new: false }).catch(err => console.error(err));
            }
            
            // Set correct status for response
            product.status = correctStatus;
            return product;
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Ensure status is correct
        const correctStatus = product.quantity === 0 
            ? 'Out of Stock' 
            : product.quantity <= product.reorderLevel 
                ? 'Low Stock' 
                : 'In Stock';
        
        if (product.status !== correctStatus) {
            product.status = correctStatus;
            await Product.findByIdAndUpdate(product._id, { status: correctStatus });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
    try {
        const { name, sku, description, category, price, quantity, reorderLevel, supplier, barcode } = req.body;

        // Check if SKU already exists
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product with this SKU already exists'
            });
        }

        // Handle image upload
        let image = null;
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        const product = await Product.create({
            name,
            sku,
            description,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            reorderLevel: parseInt(reorderLevel),
            supplier,
            barcode,
            image
        });

        // Log activity
        await ActivityLog.create({
            action: 'CREATE',
            entityType: 'PRODUCT',
            entityId: product._id,
            entityName: product.name,
            description: `Product "${product.name}" was created`,
            changes: product
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // If updating SKU, check if new SKU already exists
        if (req.body.sku && req.body.sku !== product.sku) {
            const existingSKU = await Product.findOne({ sku: req.body.sku });
            if (existingSKU) {
                return res.status(400).json({
                    success: false,
                    message: 'Product with this SKU already exists'
                });
            }
        }

        // Handle image upload
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }

        // Convert numeric fields
        const updateData = { ...req.body };
        if (updateData.price) updateData.price = parseFloat(updateData.price);
        if (updateData.quantity) updateData.quantity = parseInt(updateData.quantity);
        if (updateData.reorderLevel) updateData.reorderLevel = parseInt(updateData.reorderLevel);

        const oldProduct = { ...product.toObject() };
        product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        // Log activity
        await ActivityLog.create({
            action: 'UPDATE',
            entityType: 'PRODUCT',
            entityId: product._id,
            entityName: product.name,
            description: `Product "${product.name}" was updated`,
            changes: req.body
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        // Log activity
        await ActivityLog.create({
            action: 'DELETE',
            entityType: 'PRODUCT',
            entityId: product._id,
            entityName: product.name,
            description: `Product "${product.name}" was deleted`
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
const searchProducts = async (req, res) => {
    try {
        const query = req.params.query;

        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { sku: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { barcode: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Public
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            $expr: { $lte: ['$quantity', '$reorderLevel'] }
        }).sort({ quantity: 1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch low stock products',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getLowStockProducts
};