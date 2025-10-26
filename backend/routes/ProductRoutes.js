const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getLowStockProducts
} = require('../controllers/ProductControllers');

// Special routes (must come before /:id routes)
router.get('/low-stock', getLowStockProducts);
router.get('/search/:query', searchProducts);

// Standard CRUD routes
router.route('/')
    .get(getAllProducts)
    .post(upload.single('image'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(upload.single('image'), updateProduct)
    .delete(deleteProduct);

module.exports = router;