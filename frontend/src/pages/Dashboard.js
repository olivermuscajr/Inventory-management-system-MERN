import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { exportToCSV, exportToExcel, printReport } from '../services/reportService';
import toast from 'react-hot-toast';
import StatCard from '../components/Dashboard/StatCard';
import RecentProducts from '../components/Dashboard/RecentProducts';
import LowStockAlert from '../components/Dashboard/LowStockAlert';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleExport = async (type) => {
        try {
            setShowExportMenu(false);
            if (type === 'csv') {
                await exportToCSV();
                toast.success('Report exported to CSV');
            } else if (type === 'excel') {
                await exportToExcel();
                toast.success('Report exported to Excel');
            } else if (type === 'pdf') {
                await printReport();
                toast.success('Opening print preview');
            }
        } catch (error) {
            toast.error('Export failed');
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all products
            const productsResponse = await productAPI.getAllProducts();
            const products = productsResponse.data;

            // Fetch low stock products
            const lowStockResponse = await productAPI.getLowStockProducts();
            const lowStock = lowStockResponse.data;

            // Calculate statistics
            const totalProducts = products.length;
            const lowStockCount = lowStock.length;
            const outOfStockCount = products.filter(p => p.quantity === 0).length;
            const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

            setStats({
                totalProducts,
                lowStock: lowStockCount,
                outOfStock: outOfStockCount,
                totalValue: totalValue.toFixed(2)
            });

            // Get 5 most recent products
            setRecentProducts(products.slice(0, 5));

            // Get low stock products (max 5)
            setLowStockProducts(lowStock.slice(0, 5));

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
            setLoading(false);
        }
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
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden md:inline">Export</span>
                        </button>
                        {showExportMenu && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setShowExportMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Export to CSV</span>
                                    </button>
                                    <button
                                        onClick={() => handleExport('excel')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Export to Excel</span>
                                    </button>
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        <span>Print Report</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    <Link
                        to="/products/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden md:inline">Add Product</span>
                        <span className="md:hidden">Add</span>
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                    bgColor="bg-blue-500"
                />
                <StatCard
                    title="Low Stock"
                    value={stats.lowStock}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                    bgColor="bg-yellow-500"
                />
                <StatCard
                    title="Out of Stock"
                    value={stats.outOfStock}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    }
                    bgColor="bg-red-500"
                />
                <StatCard
                    title="Total Value"
                    value={`${stats.totalValue}`}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    bgColor="bg-green-500"
                />
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <LowStockAlert products={lowStockProducts} />
            )}

            {/* Recent Products */}
            <RecentProducts products={recentProducts} />
        </div>
    );
};

export default Dashboard;