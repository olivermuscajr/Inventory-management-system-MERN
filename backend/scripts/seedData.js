const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const sampleProducts = [
    {
        name: 'Wireless Mouse',
        sku: 'WM001',
        description: 'Ergonomic wireless mouse with USB receiver',
        category: 'Electronics',
        price: 25.99,
        quantity: 50,
        reorderLevel: 10,
        supplier: 'Tech Supplies Inc'
    },
    {
        name: 'Mechanical Keyboard',
        sku: 'KB001',
        description: 'RGB mechanical keyboard with blue switches',
        category: 'Electronics',
        price: 89.99,
        quantity: 30,
        reorderLevel: 15,
        supplier: 'Tech Supplies Inc'
    },
    {
        name: 'Office Chair',
        sku: 'OC001',
        description: 'Ergonomic office chair with lumbar support',
        category: 'Furniture',
        price: 199.99,
        quantity: 15,
        reorderLevel: 5,
        supplier: 'Furniture World'
    },
    {
        name: 'USB-C Cable',
        sku: 'UC001',
        description: '6ft braided USB-C charging cable',
        category: 'Electronics',
        price: 12.99,
        quantity: 8,
        reorderLevel: 20,
        supplier: 'Tech Supplies Inc'
    },
    {
        name: 'Notebook Set',
        sku: 'NB001',
        description: 'Set of 5 lined notebooks',
        category: 'Books',
        price: 15.99,
        quantity: 100,
        reorderLevel: 25,
        supplier: 'Office Depot'
    },
    {
        name: 'Desk Lamp',
        sku: 'DL001',
        description: 'LED desk lamp with adjustable brightness',
        category: 'Electronics',
        price: 34.99,
        quantity: 0,
        reorderLevel: 10,
        supplier: 'Lighting Co'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Existing products cleared');

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log('Sample products added successfully');

        console.log('\nSeeded Products:');
        sampleProducts.forEach(product => {
            console.log(`- ${product.name} (${product.sku})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();