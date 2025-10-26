const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters']
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            uppercase: true,
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative'],
            default: 0
        },
        reorderLevel: {
            type: Number,
            default: 10,
            min: [0, 'Reorder level cannot be negative']
        },
        supplier: {
            type: String,
            trim: true
        },
        image: {
            type: String,
            default: null
        },
        barcode: {
            type: String,
            trim: true,
            sparse: true
        },
        status: {
            type: String,
            enum: ['In Stock', 'Low Stock', 'Out of Stock'],
            default: 'In Stock'
        }
    },
    {
        timestamps: true
    }
);

// Virtual to calculate status based on quantity
productSchema.methods.calculateStatus = function() {
    if (this.quantity === 0) {
        return 'Out of Stock';
    } else if (this.quantity <= this.reorderLevel) {
        return 'Low Stock';
    } else {
        return 'In Stock';
    }
};

// Middleware to automatically update status based on quantity
productSchema.pre('save', function (next) {
    this.status = this.calculateStatus();
    next();
});

// Create index for faster searches
productSchema.index({ name: 'text', sku: 'text', description: 'text', barcode: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;