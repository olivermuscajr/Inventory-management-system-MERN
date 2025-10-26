import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                    <Sidebar />
                </div>
                <main className="flex-1 p-4 md:p-6 mt-16 md:ml-64 transition-all">
                    <div className="max-w-7xl mx-auto">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden fixed top-20 left-4 z-40 bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {children}
                    </div>
                </main>
                {sidebarOpen && (
                    <div 
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 mt-16"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Layout;