import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';
import ProductForm from '../components/Products/ProductForm';

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Prompt before leaving if there are unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Intercept navigation
    useEffect(() => {
        if (hasUnsavedChanges) {
            const handleClick = (e) => {
                const link = e.target.closest('a[href]');
                if (link && !link.hasAttribute('data-no-prompt')) {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('/') && href !== window.location.pathname) {
                        if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    }
                }
            };
            
            document.addEventListener('click', handleClick, true);
            return () => document.removeEventListener('click', handleClick, true);
        }
    }, [hasUnsavedChanges]);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productAPI.getProductById(id);
            setProduct(response.data);
        } catch (error) {
            toast.error('Failed to load product');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            // The API service handles FormData creation automatically
            await productAPI.updateProduct(id, formData);
            setHasUnsavedChanges(false); // Reset flag after successful save
            toast.success('Product updated successfully!');
            navigate('/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>
            <ProductForm
                initialData={product}
                onSubmit={handleUpdate}
                isEditMode={true}
                onDataChange={setHasUnsavedChanges}
            />
        </div>
    );
};

export default EditProduct;

