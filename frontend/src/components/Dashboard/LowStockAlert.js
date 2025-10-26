import React from 'react';
import { Link } from 'react-router-dom';
//
const LowStockAlert = ({ products }) => {
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-8">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg
                        className="w-6 h-6 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Low Stock Alert
                    </h3>
                    <p className="text-sm text-yellow-700 mb-4">
                        The following products are running low on stock and need attention:
                    </p>
                    <div className="space-y-2">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-lg p-3 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{product.name}</p>
                                    <p className="text-xs text-gray-500">
                                        SKU: {product.sku} • Current: {product.quantity} units • Reorder
                                        Level: {product.reorderLevel} units
                                    </p>
                                </div>
                                <Link
                                    to={`/products/edit/${product._id}`}
                                    className="ml-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                                >
                                    Restock
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LowStockAlert;