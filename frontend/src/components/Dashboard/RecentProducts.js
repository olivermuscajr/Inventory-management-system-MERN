import React from 'react';
import { Link } from 'react-router-dom';

const RecentProducts = ({ products }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'In Stock':
                return 'bg-green-100 text-green-800';
            case 'Low Stock':
                return 'bg-yellow-100 text-yellow-800';
            case 'Out of Stock':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Products</h2>
                <Link
                    to="/products"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    View All
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No products found</p>
                    <Link
                        to="/products/add"
                        className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                    >
                        Add your first product
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Product
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    SKU
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Category
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Price
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Quantity
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-xs">
                                                {product.description}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 text-sm">
                                        {product.sku}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 text-sm">
                                        {product.category}
                                    </td>
                                    <td className="py-3 px-4 text-gray-800 font-medium">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {product.quantity}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                product.status
                                            )}`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentProducts;