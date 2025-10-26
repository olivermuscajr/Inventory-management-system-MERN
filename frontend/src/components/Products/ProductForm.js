import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../../services/api';

const ProductForm = ({ initialData, onSubmit, isEditMode = false, onDataChange }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        initialData || {
            name: '',
            sku: '',
            description: '',
            category: '',
            price: '',
            quantity: '',
            reorderLevel: '',
            supplier: '',
            barcode: ''
        }
    );
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(initialData?.image || null);
    const [imagePreview, setImagePreview] = useState(initialData?.image || null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getAllCategories();
            setCategories(response.data || []);
            // If no initial category is set and we have categories, set the first one as default
            if (!formData.category && response.data?.length > 0) {
                setFormData(prev => ({ ...prev, category: response.data[0].name }));
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
            // Fallback to default categories
            setCategories([
                'Electronics',
                'Clothing',
                'Food',
                'Furniture',
                'Toys',
                'Books',
                'Other'
            ]);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Product name must be less than 100 characters';
        }

        // SKU validation
        if (!formData.sku.trim()) {
            newErrors.sku = 'SKU is required';
        } else if (formData.sku.length > 20) {
            newErrors.sku = 'SKU must be less than 20 characters';
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
            newErrors.price = 'Price must be a positive number';
        }

        // Quantity validation
        if (formData.quantity === '') {
            newErrors.quantity = 'Quantity is required';
        } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
            newErrors.quantity = 'Quantity must be a positive number';
        }

        // Reorder level validation
        if (formData.reorderLevel === '') {
            newErrors.reorderLevel = 'Reorder level is required';
        } else if (isNaN(formData.reorderLevel) || parseInt(formData.reorderLevel) < 0) {
            newErrors.reorderLevel = 'Reorder level must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'image' && files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            
            reader.readAsDataURL(file);
            setSelectedImage(file);
            
            // Notify parent of unsaved changes
            if (onDataChange) onDataChange(true);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
            
            // Notify parent of unsaved changes
            if (onDataChange) onDataChange(true);
        }
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Convert numeric fields to proper types
        const dataToSubmit = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            reorderLevel: parseInt(formData.reorderLevel)
        };

        // Add image file if selected
        if (selectedImage) {
            dataToSubmit.image = selectedImage;
        }

        await onSubmit(dataToSubmit);
        setIsSubmitting(false);
    };

    const handleScanBarcode = () => {
        // Simple barcode generator - in production, use actual barcode scanner
        const barcode = Math.random().toString(36).substring(2, 15).toUpperCase();
        setFormData(prev => ({
            ...prev,
            barcode
        }));
    };

    const handleCancel = () => {
        // Check if there are unsaved changes
        if (onDataChange) {
            const hasChanges = JSON.stringify(initialData || {}) !== JSON.stringify({
                ...formData,
                image: null
            });
            
            if (hasChanges && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                return;
            }
        }
        navigate('/products');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter product name"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                </div>

                {/* SKU */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        disabled={isEditMode}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                            } ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter SKU (e.g., PROD001)"
                    />
                    {errors.sku && (
                        <p className="mt-1 text-sm text-red-500">{errors.sku}</p>
                    )}
                    {isEditMode && (
                        <p className="mt-1 text-xs text-gray-500">SKU cannot be changed</p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={typeof category === 'string' ? category : category._id} value={typeof category === 'string' ? category : category.name}>
                                {typeof category === 'string' ? category : category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.price ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="0.00"
                    />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                    )}
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.quantity ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="0"
                    />
                    {errors.quantity && (
                        <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                    )}
                </div>

                {/* Reorder Level */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reorder Level <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="reorderLevel"
                        value={formData.reorderLevel}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.reorderLevel ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="10"
                    />
                    {errors.reorderLevel && (
                        <p className="mt-1 text-sm text-red-500">{errors.reorderLevel}</p>
                    )}
                </div>

                {/* Supplier */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier
                    </label>
                    <input
                        type="text"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter supplier name (optional)"
                    />
                </div>

                {/* Barcode */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Barcode
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Enter barcode or scan"
                        />
                        <button
                            type="button"
                            onClick={handleScanBarcode}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Image
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {imagePreview && (
                        <div className="mt-4">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                            />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter product description"
                    ></textarea>
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        {formData.description.length}/500 characters
                    </p>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-lg text-white transition-colors ${isSubmitting
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            {isEditMode ? 'Updating...' : 'Creating...'}
                        </span>
                    ) : (
                        <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;