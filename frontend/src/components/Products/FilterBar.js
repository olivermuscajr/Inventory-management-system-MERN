import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';

const FilterBar = ({
    categoryFilter,
    statusFilter,
    onCategoryChange,
    onStatusChange,
    onClearFilters
}) => {
    const [categories, setCategories] = useState(['All']);
    const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getAllCategories();
            const categoryNames = response.data ? response.data.map(cat => cat.name) : [];
            setCategories(['All', ...categoryNames]);
        } catch (error) {
            console.error('Failed to load categories:', error);
            // Fallback to default categories
            setCategories(['All', 'Electronics', 'Clothing', 'Food', 'Furniture', 'Toys', 'Books', 'Other']);
        }
    };

    const hasActiveFilters = categoryFilter !== 'All' || statusFilter !== 'All';

    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    <span>Clear Filters</span>
                </button>
            )}
        </div>
    );
};

export default FilterBar;