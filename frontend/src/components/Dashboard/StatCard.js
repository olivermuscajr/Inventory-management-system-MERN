import React from 'react';

const StatCard = ({ title, value, icon, bgColor }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                </div>
                <div className={`${bgColor} text-white p-3 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;