import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';
import ProductTable from '../components/Products/ProductTable';
import SearchBar from '../components/Products/SearchBar';
import FilterBar from '../components/Products/FilterBar';
import DeleteModal from '../components/Products/DeleteModal';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        product: null
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, categoryFilter, statusFilter]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productAPI.getAllProducts();
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (product.barcode && product.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Category filter
        if (categoryFilter !== 'All') {
            filtered = filtered.filter(
                (product) => product.category === categoryFilter
            );
        }

        // Status filter
        if (statusFilter !== 'All') {
            filtered = filtered.filter((product) => product.status === statusFilter);
        }

        setFilteredProducts(filtered);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleCategoryFilter = (category) => {
        setCategoryFilter(category);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
    };

    const handleDeleteClick = (product) => {
        setDeleteModal({
            isOpen: true,
            product: product
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            await productAPI.deleteProduct(deleteModal.product._id);
            toast.success('Product deleted successfully');
            setDeleteModal({ isOpen: false, product: null });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, product: null });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setCategoryFilter('All');
        setStatusFilter('All');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your inventory ({filteredProducts.length} of {products.length} products)
                    </p>
                </div>
                <Link
                    to="/products/add"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Product</span>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
                <FilterBar
                    categoryFilter={categoryFilter}
                    statusFilter={statusFilter}
                    onCategoryChange={handleCategoryFilter}
                    onStatusChange={handleStatusFilter}
                    onClearFilters={clearFilters}
                />
            </div>

            {/* Products Table */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No Products Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All'
                            ? 'Try adjusting your filters or search query'
                            : 'Get started by adding your first product'}
                    </p>
                    {(searchQuery || categoryFilter !== 'All' || statusFilter !== 'All') ? (
                        <button
                            onClick={clearFilters}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear Filters
                        </button>
                    ) : (
                        <Link
                            to="/products/add"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Your First Product
                        </Link>
                    )}
                </div>
            ) : (
                <ProductTable
                    products={filteredProducts}
                    onDeleteClick={handleDeleteClick}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                product={deleteModal.product}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

export default Products;