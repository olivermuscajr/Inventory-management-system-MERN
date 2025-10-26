import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';
import ProductForm from '../components/Products/ProductForm';

const AddProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

    const handleSubmit = async (productData) => {
        try {
            // The API service handles FormData creation automatically
            await productAPI.createProduct(productData);
            setHasUnsavedChanges(false); // Reset flag after successful save
            toast.success('Product created successfully!');
            navigate('/products');
        } catch (error) {
            console.error('Error creating product:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to create product');
            }
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
                <p className="text-gray-600 mt-1">
                    Fill in the details below to add a new product to your inventory
                </p>
            </div>

            <ProductForm onSubmit={handleSubmit} isEditMode={false} onDataChange={setHasUnsavedChanges} />
        </div>
    );
};

export default AddProduct;